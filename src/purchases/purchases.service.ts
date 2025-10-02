import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { ReceivePurchaseDto } from './dto/receive-purchase.dto';
import { DbProvider } from '../prisma/db.provider';

@Injectable()
export class PurchasesService {
  constructor(private prisma: PrismaService, private db: DbProvider) {}

  async create(dto: CreatePurchaseDto, createdBy: number) {
    if (!dto.items?.length) throw new BadRequestException('Agrega al menos un ítem');

    // Validar proveedor
    const supplier = await this.prisma.suppliers.findUnique({ where: { supplier_id: dto.supplierId } });
    if (!supplier) throw new NotFoundException('Proveedor no existe');

    // Validar productos
    const ids = dto.items.map(i => i.productId);
    const products = await this.prisma.products.findMany({ where: { product_id: { in: ids } }, select: { product_id: true } });
    const found = new Set(products.map(p => p.product_id));
    const missing = ids.filter(id => !found.has(id));
    if (missing.length) throw new BadRequestException(`Productos inexistentes: ${missing.join(',')}`);

    // Transacción: compra + items (status DRAFT)
    const result = await this.prisma.$transaction(async (tx) => {
      const purchase = await tx.purchases.create({
        data: {
          supplier_id: dto.supplierId,
          invoice_number: dto.invoiceNumber ?? null,
          purchase_date: dto.purchaseDate ? new Date(dto.purchaseDate) : (undefined as any),
          status: 'DRAFT',
          subtotal: 0,
          tax_amount: 0,
          created_by: 1,
        },
      });

      await tx.purchase_items.createMany({
        data: dto.items.map(i => ({
          purchase_id: purchase.purchase_id,
          product_id: i.productId,
          qty: i.qty,
          unit_cost: i.unitCost,
          tax_rate: i.taxRate ?? 12.0,
        })),
      });

      return purchase;
    });

    return { purchaseId: result.purchase_id, status: 'DRAFT' };
  }

  async receive(purchaseId: number, userId: number) {
    // Verificar que exista y tenga items
    const data = await this.prisma.purchases.findUnique({ where: { purchase_id: purchaseId } });
    if (!data) throw new NotFoundException('Compra no existe');

    const hasItems = await this.prisma.purchase_items.count({ where: { purchase_id: purchaseId } });
    if (!hasItems) throw new BadRequestException('La compra no tiene ítems');

    // sp_ReceivePurchase: crea IN_PURCHASE y recalcula totales y status=RECEIVED
    await this.db.callReceivePurchaseSP(purchaseId, userId);

    const updated = await this.prisma.purchases.findUnique({ where: { purchase_id: purchaseId } });
    return { purchaseId, status: updated?.status, subtotal: Number(updated?.subtotal), tax: Number(updated?.tax_amount) };
  }

  // Stock actual (vista)
  async stockList() {
    // puedes mapear a través de una view con Prisma usando $queryRaw
    const rows = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT p.product_id, p.name, IFNULL(v.stock_qty,0) AS stock
      FROM products p
      LEFT JOIN vw_current_stock v ON v.product_id = p.product_id
      ORDER BY p.product_id
    `);
    return rows.map(r => ({ productId: r.product_id, name: r.name, stock: Number(r.stock) }));
  }
}
