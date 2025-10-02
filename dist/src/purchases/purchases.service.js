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
exports.PurchasesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const db_provider_1 = require("../prisma/db.provider");
let PurchasesService = class PurchasesService {
    prisma;
    db;
    constructor(prisma, db) {
        this.prisma = prisma;
        this.db = db;
    }
    async create(dto, createdBy) {
        if (!dto.items?.length)
            throw new common_1.BadRequestException('Agrega al menos un ítem');
        const supplier = await this.prisma.suppliers.findUnique({ where: { supplier_id: dto.supplierId } });
        if (!supplier)
            throw new common_1.NotFoundException('Proveedor no existe');
        const ids = dto.items.map(i => i.productId);
        const products = await this.prisma.products.findMany({ where: { product_id: { in: ids } }, select: { product_id: true } });
        const found = new Set(products.map(p => p.product_id));
        const missing = ids.filter(id => !found.has(id));
        if (missing.length)
            throw new common_1.BadRequestException(`Productos inexistentes: ${missing.join(',')}`);
        const result = await this.prisma.$transaction(async (tx) => {
            const purchase = await tx.purchases.create({
                data: {
                    supplier_id: dto.supplierId,
                    invoice_number: dto.invoiceNumber ?? null,
                    purchase_date: dto.purchaseDate ? new Date(dto.purchaseDate) : undefined,
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
    async receive(purchaseId, userId) {
        const data = await this.prisma.purchases.findUnique({ where: { purchase_id: purchaseId } });
        if (!data)
            throw new common_1.NotFoundException('Compra no existe');
        const hasItems = await this.prisma.purchase_items.count({ where: { purchase_id: purchaseId } });
        if (!hasItems)
            throw new common_1.BadRequestException('La compra no tiene ítems');
        await this.db.callReceivePurchaseSP(purchaseId, userId);
        const updated = await this.prisma.purchases.findUnique({ where: { purchase_id: purchaseId } });
        return { purchaseId, status: updated?.status, subtotal: Number(updated?.subtotal), tax: Number(updated?.tax_amount) };
    }
    async stockList() {
        const rows = await this.prisma.$queryRawUnsafe(`
      SELECT p.product_id, p.name, IFNULL(v.stock_qty,0) AS stock
      FROM products p
      LEFT JOIN vw_current_stock v ON v.product_id = p.product_id
      ORDER BY p.product_id
    `);
        return rows.map(r => ({ productId: r.product_id, name: r.name, stock: Number(r.stock) }));
    }
};
exports.PurchasesService = PurchasesService;
exports.PurchasesService = PurchasesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, db_provider_1.DbProvider])
], PurchasesService);
//# sourceMappingURL=purchases.service.js.map