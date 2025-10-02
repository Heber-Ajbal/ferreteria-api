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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const db_provider_1 = require("../prisma/db.provider");
let DashboardService = class DashboardService {
    db;
    constructor(db) {
        this.db = db;
    }
    async getDashboard(from, to) {
        const sets = await this.db.callDashboardSP(from, to);
        const [summary = [], daily = [], topProducts = [], byCategory = [], byPayment = [], byChannel = [], byHour = [],] = sets;
        return {
            summary: summary[0] ?? {
                orders: 0,
                revenue: 0,
                gross_sales: 0,
                discounts: 0,
                taxes: 0,
                avg_order_value: 0,
            },
            daily,
            topProducts,
            byCategory,
            byPayment,
            byChannel,
            byHour,
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [db_provider_1.DbProvider])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map