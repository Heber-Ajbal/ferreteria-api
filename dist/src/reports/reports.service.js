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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let ReportsService = class ReportsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async movements(params) {
        const { from, to, productId } = params;
        const fromDT = `${from} 00:00:00`;
        const toDT = `${to} 23:59:59`;
        const whereProduct = productId
            ? client_1.Prisma.sql ` AND im.product_id = ${productId} `
            : client_1.Prisma.empty;
        const sql = client_1.Prisma.sql `
      SELECT
        im.movement_id,
        im.product_id,
        im.movement_type,
        im.reference_type,
        im.reference_id,
        CASE
          WHEN im.movement_type LIKE 'OUT_%' THEN -ABS(im.qty)
          ELSE ABS(im.qty)
        END AS qty_signed,
        im.unit_cost,
        im.unit_price,
        im.notes,
        im.created_at
      FROM inventory_movements im
      WHERE im.created_at BETWEEN ${fromDT} AND ${toDT}
      ${whereProduct}
      ORDER BY im.created_at ASC, im.movement_id ASC
    `;
        return this.prisma.$queryRaw(sql);
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [client_1.PrismaClient])
], ReportsService);
//# sourceMappingURL=reports.service.js.map