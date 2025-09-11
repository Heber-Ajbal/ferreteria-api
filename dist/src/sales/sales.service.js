"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
function round2(n) {
    return Math.round((n + Number.EPSILON) * 100) / 100;
}
let SalesService = class SalesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createOrGetCart(userId, dto) {
        let cart = await this.prisma.sales.findFirst({
            where: { created_by: userId, status: 'CART' },
        });
        if (!cart) {
            cart = await this.prisma.sales.create({
                data: {
                    created_by: userId,
                    status: 'CART',
                    channel: 'WEB',
                    tax_rate: dto.taxRate ?? 12,
                    subtotal: 0,
                    tax_amount: 0,
                    discount_total: 0,
                },
            });
        }
        return this.getCartById(cart.sale_id, userId);
    }
    async getMyCart(userId) {
        const cart = await this.prisma.sales.findFirst({
            where: { created_by: userId, status: 'CART' },
        });
        if (!cart) {
            return { saleId: null, status: 'EMPTY', items: [], subtotal: 0, taxAmount: 0, total: 0 };
        }
        return this.getCartById(cart.sale_id, userId);
    }
    async addItem(userId, dto) {
        const cart = await this.ensureCart(userId);
        const product = await this.prisma.products.findUnique({
            where: { product_id: dto.productId },
        });
        if (!product)
            throw new common_1.NotFoundException('Producto no existe');
        const existing = await this.prisma.sale_items.findFirst({
            where: { sale_id: cart.sale_id, product_id: dto.productId },
        });
        if (existing) {
            await this.prisma.sale_items.update({
                where: { sale_item_id: existing.sale_item_id },
                data: { qty: Number(existing.qty) + dto.qty },
            });
        }
        else {
            await this.prisma.sale_items.create({
                data: {
                    sale_id: cart.sale_id,
                    product_id: dto.productId,
                    qty: dto.qty,
                    unit_price: product.sale_price,
                    discount_amt: 0,
                },
            });
        }
        await this.recalcTotals(cart.sale_id);
        return this.getCartById(cart.sale_id, userId);
    }
    async setItem(userId, dto) {
        const cart = await this.ensureCart(userId);
        const item = await this.prisma.sale_items.findFirst({
            where: { sale_id: cart.sale_id, product_id: dto.productId },
        });
        if (!item)
            throw new common_1.NotFoundException('El producto no está en el carrito');
        if (dto.qty === 0) {
            await this.prisma.sale_items.delete({ where: { sale_item_id: item.sale_item_id } });
        }
        else {
            await this.prisma.sale_items.update({
                where: { sale_item_id: item.sale_item_id },
                data: { qty: dto.qty },
            });
        }
        await this.recalcTotals(cart.sale_id);
        return this.getCartById(cart.sale_id, userId);
    }
    async removeItem(userId, productId) {
        const cart = await this.ensureCart(userId);
        await this.prisma.sale_items.deleteMany({
            where: { sale_id: cart.sale_id, product_id: productId },
        });
        await this.recalcTotals(cart.sale_id);
        return this.getCartById(cart.sale_id, userId);
    }
    async checkout(userId, _dto) {
        const cart = await this.ensureCart(userId);
        const items = await this.prisma.sale_items.findMany({
            where: { sale_id: cart.sale_id },
        });
        if (items.length === 0)
            throw new common_1.BadRequestException('El carrito está vacío');
        await this.recalcTotals(cart.sale_id);
        const updated = await this.prisma.sales.update({
            where: { sale_id: cart.sale_id },
            data: { status: 'PAID', updated_at: new Date() },
        });
        return { saleId: updated.sale_id, status: updated.status, total: Number(updated.total) };
    }
    async ensureCart(userId) {
        const cart = await this.prisma.sales.findFirst({
            where: { created_by: userId, status: 'CART' },
        });
        if (!cart)
            throw new common_1.NotFoundException('No hay carrito activo');
        return cart;
    }
    async getCartById(saleId, userId) {
        const sale = await this.prisma.sales.findFirst({
            where: { sale_id: saleId, created_by: userId },
            include: {
                sale_items: {
                    include: { products: true },
                },
            },
        });
        if (!sale)
            throw new common_1.NotFoundException('Carrito no encontrado');
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
    async recalcTotals(saleId) {
        const sale = await this.prisma.sales.findUnique({ where: { sale_id: saleId } });
        if (!sale)
            return;
        const rows = await this.prisma.sale_items.findMany({ where: { sale_id: saleId } });
        const subtotal = rows.reduce((acc, r) => acc + Number(r.qty) * Number(r.unit_price) - Number(r.discount_amt ?? 0), 0);
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
};
exports.SalesService = SalesService;
exports.SalesService = SalesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SalesService);
//# sourceMappingURL=sales.service.js.map