import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { AddItemDto } from './dto/add-item.dto';
import { SetItemDto } from './dto/set-item.dto';
import { CheckoutDto } from './dto/checkout.dto';

function round2(n: number) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

@Injectable()
export class SalesService {
  constructor(private readonly prisma: PrismaService) {}

  // Busca el carrito abierto o lo crea
  async createOrGetCart(userId: number, dto: CreateCartDto) {
    let cart = await this.prisma.sales.findFirst({
      where: { created_by: userId, status: 'CART' },
    });

    if (!cart) {
      cart = await this.prisma.sales.create({
        data: {
          created_by: userId,
          status: 'CART',
          channel: 'WEB', // ajusta si tu enum usa otro valor
          tax_rate: dto.taxRate ?? 12,
          subtotal: 0,
          tax_amount: 0,
          discount_total: 0,
        },
      });
    }

    return this.getCartById(cart.sale_id, userId);
  }

  async getMyCart(userId: number) {
    const cart = await this.prisma.sales.findFirst({
      where: { created_by: userId, status: 'CART' },
    });

    if (!cart) {
      return { saleId: null, status: 'EMPTY', items: [], subtotal: 0, taxAmount: 0, total: 0 };
    }
    return this.getCartById(cart.sale_id, userId);
  }

  // Agrega (o suma) un ítem
  async addItem(userId: number, dto: AddItemDto) {
    const cart = await this.ensureCart(userId);

    const product = await this.prisma.products.findUnique({
      where: { product_id: dto.productId },
    });
    if (!product) throw new NotFoundException('Producto no existe');

    const existing = await this.prisma.sale_items.findFirst({
      where: { sale_id: cart.sale_id, product_id: dto.productId },
    });

    if (existing) {
      await this.prisma.sale_items.update({
        where: { sale_item_id: existing.sale_item_id },
        data: { qty: Number(existing.qty) + dto.qty },
      });
    } else {
      await this.prisma.sale_items.create({
        data: {
          sale_id: cart.sale_id,
          product_id: dto.productId,
          qty: dto.qty,
          unit_price: product.sale_price, // usa el precio actual del producto
          discount_amt: 0,
        },
      });
    }

    await this.recalcTotals(cart.sale_id);
    return this.getCartById(cart.sale_id, userId);
  }

  // Fija cantidad (qty=0 elimina)
  async setItem(userId: number, dto: SetItemDto) {
    const cart = await this.ensureCart(userId);

    const item = await this.prisma.sale_items.findFirst({
      where: { sale_id: cart.sale_id, product_id: dto.productId },
    });
    if (!item) throw new NotFoundException('El producto no está en el carrito');

    if (dto.qty === 0) {
      await this.prisma.sale_items.delete({ where: { sale_item_id: item.sale_item_id } });
    } else {
      await this.prisma.sale_items.update({
        where: { sale_item_id: item.sale_item_id },
        data: { qty: dto.qty },
      });
    }

    await this.recalcTotals(cart.sale_id);
    return this.getCartById(cart.sale_id, userId);
  }

  async removeItem(userId: number, productId: number) {
    const cart = await this.ensureCart(userId);

    await this.prisma.sale_items.deleteMany({
      where: { sale_id: cart.sale_id, product_id: productId },
    });

    await this.recalcTotals(cart.sale_id);
    return this.getCartById(cart.sale_id, userId);
  }

  // Confirma compra (MVP: solo cambia status y recalcula)
  async checkout(userId: number, _dto: CheckoutDto) {
    const cart = await this.ensureCart(userId);

    const items = await this.prisma.sale_items.findMany({
      where: { sale_id: cart.sale_id },
    });
    if (items.length === 0) throw new BadRequestException('El carrito está vacío');

    await this.recalcTotals(cart.sale_id);

    const updated = await this.prisma.sales.update({
      where: { sale_id: cart.sale_id },
      data: { status: 'PAID', updated_at: new Date() },
    });

    // (Opcional) aquí podrías crear un Payment y descontar stock con movimientos
    return { saleId: updated.sale_id, status: updated.status, total: Number(updated.total) };
  }

  // ====================== Helpers ======================

  private async ensureCart(userId: number) {
    const cart = await this.prisma.sales.findFirst({
      where: { created_by: userId, status: 'CART' },
    });
    if (!cart) throw new NotFoundException('No hay carrito activo');
    return cart;
  }

  private async getCartById(saleId: number, userId: number) {
    const sale = await this.prisma.sales.findFirst({
      where: { sale_id: saleId, created_by: userId },
      include: {
        // Si tu relación se llama 'sale_items' tal cual en schema.prisma, esto está OK.
        // Si se llama distinto (p. ej. 'items'), cámbialo aquí y más abajo.
        sale_items: {
          // Asegúrate del nombre de la relación hacia productos.
          // Si en tu modelo sale_items la relación es 'products', deja 'products'.
          // Si es 'product', cámbialo a { product: true } y usa si.product?.name.
          include: { products: true },
        },
      },
    });
    if (!sale) throw new NotFoundException('Carrito no encontrado');

    const items = sale.sale_items.map((si) => ({
      productId: si.product_id,
      name: si.products?.name ?? '',
      qty: Number(si.qty),
      unitPrice: Number(si.unit_price),
      discountAmt: Number(si.discount_amt ?? 0),
      lineTotal: round2(Number(si.qty) * Number(si.unit_price) - Number(si.discount_amt ?? 0)),
    }));

    return {
      saleId: sale.sale_id,
      status: sale.status,
      taxRate: Number(sale.tax_rate ?? 0),
      items,
      subtotal: Number(sale.subtotal),
      taxAmount: Number(sale.tax_amount),
      discountTotal: Number(sale.discount_total ?? 0)
    };
  }

  private async recalcTotals(saleId: number) {
    const sale = await this.prisma.sales.findUnique({ where: { sale_id: saleId } });
    if (!sale) return;

    const rows = await this.prisma.sale_items.findMany({ where: { sale_id: saleId } });

    const subtotal = rows.reduce(
      (acc, r) => acc + Number(r.qty) * Number(r.unit_price) - Number(r.discount_amt ?? 0),
      0,
    );

    const taxRate = Number(sale.tax_rate ?? 0);
    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount;

    await this.prisma.sales.update({
      where: { sale_id: saleId },
      data: {
        subtotal: round2(subtotal),
        tax_amount: round2(taxAmount),
        discount_total: round2(0),
        updated_at: new Date(),
      },
    });
  }
}
