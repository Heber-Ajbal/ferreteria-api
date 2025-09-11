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
exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const catalog_service_1 = require("./catalog.service");
const pagination_dto_1 = require("./dto/pagination.dto");
const product_dto_1 = require("./dto/product.dto");
let ProductsController = class ProductsController {
    service;
    constructor(service) {
        this.service = service;
    }
    list(q) {
        return this.service.listProducts(q);
    }
    get(id) {
        return this.service.getProduct(id);
    }
    create(dto) {
        return this.service.createProduct({
            sku: dto.sku,
            name: dto.name,
            category_id: dto.categoryId ?? null,
            brand_id: dto.brandId ?? null,
            unit_id: dto.unitId,
            barcode: dto.barcode ?? null,
            description: dto.description ?? null,
            cost_price: dto.costPrice,
            sale_price: dto.salePrice,
            is_taxable: dto.isTaxable ? 1 : 0,
            min_stock: dto.minStock,
        });
    }
    update(id, dto) {
        return this.service.updateProduct(id, {
            sku: dto.sku,
            name: dto.name,
            category_id: dto.categoryId,
            brand_id: dto.brandId,
            unit_id: dto.unitId,
            barcode: dto.barcode,
            description: dto.description,
            cost_price: dto.costPrice,
            sale_price: dto.salePrice,
            is_taxable: dto.isTaxable,
            min_stock: dto.minStock,
        });
    }
    remove(id) {
        return this.service.deleteProduct(id);
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'pageSize', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'categoryId', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'brandId', required: false, type: Number }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "get", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [product_dto_1.CreateProductDto]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, product_dto_1.UpdateProductDto]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "remove", null);
exports.ProductsController = ProductsController = __decorate([
    (0, swagger_1.ApiTags)('catalog/products'),
    (0, common_1.Controller)('catalog/products'),
    __metadata("design:paramtypes", [catalog_service_1.CatalogService])
], ProductsController);
//# sourceMappingURL=products.controller.js.map