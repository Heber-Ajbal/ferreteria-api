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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const sales_service_1 = require("./sales.service");
const create_cart_dto_1 = require("./dto/create-cart.dto");
const add_item_dto_1 = require("./dto/add-item.dto");
const set_item_dto_1 = require("./dto/set-item.dto");
const checkout_dto_1 = require("./dto/checkout.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
let SalesController = class SalesController {
    sales;
    constructor(sales) {
        this.sales = sales;
    }
    createOrGetCart(req, dto) {
        return this.sales.createOrGetCart(req.user.userId, dto);
    }
    getMyCart(req) {
        return this.sales.getMyCart(req.user.userId);
    }
    addItem(req, dto) {
        return this.sales.addItem(req.user.userId, dto);
    }
    setItem(req, dto) {
        return this.sales.setItem(req.user.userId, dto);
    }
    removeItem(req, productId) {
        return this.sales.removeItem(req.user.userId, productId);
    }
    checkout(req, dto) {
        return this.sales.checkout(req.user.userId, dto);
    }
};
exports.SalesController = SalesController;
__decorate([
    (0, roles_decorator_1.Roles)('CLIENT', 'ADMIN'),
    (0, common_1.Post)('cart'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_cart_dto_1.CreateCartDto]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "createOrGetCart", null);
__decorate([
    (0, roles_decorator_1.Roles)('CLIENT', 'ADMIN'),
    (0, common_1.Get)('cart'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "getMyCart", null);
__decorate([
    (0, roles_decorator_1.Roles)('CLIENT', 'ADMIN'),
    (0, common_1.Post)('cart/items'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, add_item_dto_1.AddItemDto]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "addItem", null);
__decorate([
    (0, roles_decorator_1.Roles)('CLIENT', 'ADMIN'),
    (0, common_1.Put)('cart/items'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, set_item_dto_1.SetItemDto]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "setItem", null);
__decorate([
    (0, roles_decorator_1.Roles)('CLIENT', 'ADMIN'),
    (0, common_1.Delete)('cart/items/:productId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('productId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "removeItem", null);
__decorate([
    (0, roles_decorator_1.Roles)('CLIENT', 'ADMIN'),
    (0, common_1.Post)('cart/checkout'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, checkout_dto_1.CheckoutDto]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "checkout", null);
exports.SalesController = SalesController = __decorate([
    (0, swagger_1.ApiTags)('sales'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('sales'),
    __metadata("design:paramtypes", [sales_service_1.SalesService])
], SalesController);
//# sourceMappingURL=sales.controller.js.map