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
exports.CatalogService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CatalogService = class CatalogService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    pageQuery(q) {
        const page = Math.max(1, Number(q.page ?? 1));
        const pageSize = Math.max(1, Math.min(Number(q.pageSize ?? 20), 500));
        const skip = (page - 1) * pageSize;
        const take = pageSize;
        return { page, pageSize, skip, take };
    }
    async listCategories(q) {
        const { skip, take } = this.pageQuery(q);
        const where = q.search
            ? { OR: [{ name: { contains: q.search } }, { description: { contains: q.search } }] }
            : undefined;
        const [data, total] = await Promise.all([
            this.prisma.categories.findMany({ where, skip, take, orderBy: { name: 'asc' } }),
            this.prisma.categories.count({ where }),
        ]);
        return { data, meta: { page: q.page ?? 1, pageSize: q.pageSize ?? 20, total } };
    }
    getCategory(id) {
        return this.prisma.categories.findUnique({ where: { category_id: id } });
    }
    createCategory(data) {
        return this.prisma.categories.create({ data: { name: data.name, description: data.description ?? null } });
    }
    updateCategory(id, data) {
        return this.prisma.categories.update({ where: { category_id: id }, data });
    }
    deleteCategory(id) {
        return this.prisma.categories.delete({ where: { category_id: id } });
    }
    async listBrands(q) {
        const { skip, take } = this.pageQuery(q);
        const where = q.search ? { name: { contains: q.search } } : undefined;
        const [data, total] = await Promise.all([
            this.prisma.brands.findMany({ where, skip, take, orderBy: { name: 'asc' } }),
            this.prisma.brands.count({ where }),
        ]);
        return { data, meta: { page: q.page ?? 1, pageSize: q.pageSize ?? 20, total } };
    }
    getBrand(id) {
        return this.prisma.brands.findUnique({ where: { brand_id: id } });
    }
    createBrand(data) {
        return this.prisma.brands.create({ data });
    }
    updateBrand(id, data) {
        return this.prisma.brands.update({ where: { brand_id: id }, data });
    }
    deleteBrand(id) {
        return this.prisma.brands.delete({ where: { brand_id: id } });
    }
    async listUnits(q) {
        const { skip, take } = this.pageQuery(q);
        const where = q.search ? { OR: [{ code: { contains: q.search } }, { name: { contains: q.search } }] } : undefined;
        const [data, total] = await Promise.all([
            this.prisma.units.findMany({ where, skip, take, orderBy: { code: 'asc' } }),
            this.prisma.units.count({ where }),
        ]);
        return { data, meta: { page: q.page ?? 1, pageSize: q.pageSize ?? 20, total } };
    }
    getUnit(id) {
        return this.prisma.units.findUnique({ where: { unit_id: id } });
    }
    createUnit(data) {
        return this.prisma.units.create({ data });
    }
    updateUnit(id, data) {
        return this.prisma.units.update({ where: { unit_id: id }, data });
    }
    deleteUnit(id) {
        return this.prisma.units.delete({ where: { unit_id: id } });
    }
    async listProducts(q) {
        const page = Math.max(1, Number(q.page ?? 1));
        const pageSize = Math.max(1, Number(q.pageSize ?? 20));
        const skip = (page - 1) * pageSize;
        const take = pageSize;
        const where = {
            ...(q.search?.trim()
                ? {
                    OR: [
                        { name: { contains: q.search } },
                        { sku: { contains: q.search } },
                        { barcode: { contains: q.search } },
                    ],
                }
                : undefined),
            ...(q.categoryId ? { category_id: Number(q.categoryId) } : undefined),
            ...(q.brandId ? { brand_id: Number(q.brandId) } : undefined),
        };
        const [data, total] = await Promise.all([
            this.prisma.products.findMany({
                where,
                skip,
                take,
                orderBy: { product_id: 'desc' },
                include: { categories: true, brands: true, units: true },
            }),
            this.prisma.products.count({ where }),
        ]);
        return { data, meta: { page, pageSize, total } };
    }
    getProduct(id) {
        return this.prisma.products.findUnique({
            where: { product_id: id },
            include: { categories: true, brands: true, units: true },
        });
    }
    createProduct(data) {
        return this.prisma.products.create({ data });
    }
    updateProduct(id, data) {
        return this.prisma.products.update({ where: { product_id: id }, data });
    }
    deleteProduct(id) {
        return this.prisma.products.delete({ where: { product_id: id } });
    }
};
exports.CatalogService = CatalogService;
exports.CatalogService = CatalogService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CatalogService);
//# sourceMappingURL=catalog.service.js.map