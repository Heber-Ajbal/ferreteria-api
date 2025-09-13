import { CatalogService } from './catalog.service';
import { PaginationDto } from './dto/pagination.dto';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import type { Request as ExpressRequest } from 'express';
export declare class ProductsController {
    private readonly service;
    constructor(service: CatalogService);
    list(q: PaginationDto): Promise<{
        data: ({
            brands: {
                name: string;
                brand_id: number;
            } | null;
            categories: {
                name: string;
                category_id: number;
                description: string | null;
            } | null;
            units: {
                name: string;
                unit_id: number;
                code: string;
            };
        } & {
            product_id: number;
            sku: string;
            name: string;
            category_id: number | null;
            brand_id: number | null;
            unit_id: number;
            barcode: string | null;
            description: string | null;
            cost_price: import("@prisma/client/runtime/library").Decimal;
            sale_price: import("@prisma/client/runtime/library").Decimal;
            is_taxable: boolean;
            min_stock: import("@prisma/client/runtime/library").Decimal;
            created_at: Date;
            image_url: string | null;
        })[];
        meta: {
            page: number;
            pageSize: number;
            total: number;
        };
    }>;
    get(id: number): import("@prisma/client").Prisma.Prisma__productsClient<({
        brands: {
            name: string;
            brand_id: number;
        } | null;
        categories: {
            name: string;
            category_id: number;
            description: string | null;
        } | null;
        units: {
            name: string;
            unit_id: number;
            code: string;
        };
    } & {
        product_id: number;
        sku: string;
        name: string;
        category_id: number | null;
        brand_id: number | null;
        unit_id: number;
        barcode: string | null;
        description: string | null;
        cost_price: import("@prisma/client/runtime/library").Decimal;
        sale_price: import("@prisma/client/runtime/library").Decimal;
        is_taxable: boolean;
        min_stock: import("@prisma/client/runtime/library").Decimal;
        created_at: Date;
        image_url: string | null;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    create(dto: CreateProductDto): import("@prisma/client").Prisma.Prisma__productsClient<{
        product_id: number;
        sku: string;
        name: string;
        category_id: number | null;
        brand_id: number | null;
        unit_id: number;
        barcode: string | null;
        description: string | null;
        cost_price: import("@prisma/client/runtime/library").Decimal;
        sale_price: import("@prisma/client/runtime/library").Decimal;
        is_taxable: boolean;
        min_stock: import("@prisma/client/runtime/library").Decimal;
        created_at: Date;
        image_url: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, dto: UpdateProductDto): import("@prisma/client").Prisma.Prisma__productsClient<{
        product_id: number;
        sku: string;
        name: string;
        category_id: number | null;
        brand_id: number | null;
        unit_id: number;
        barcode: string | null;
        description: string | null;
        cost_price: import("@prisma/client/runtime/library").Decimal;
        sale_price: import("@prisma/client/runtime/library").Decimal;
        is_taxable: boolean;
        min_stock: import("@prisma/client/runtime/library").Decimal;
        created_at: Date;
        image_url: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: number): import("@prisma/client").Prisma.Prisma__productsClient<{
        product_id: number;
        sku: string;
        name: string;
        category_id: number | null;
        brand_id: number | null;
        unit_id: number;
        barcode: string | null;
        description: string | null;
        cost_price: import("@prisma/client/runtime/library").Decimal;
        sale_price: import("@prisma/client/runtime/library").Decimal;
        is_taxable: boolean;
        min_stock: import("@prisma/client/runtime/library").Decimal;
        created_at: Date;
        image_url: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    uploadImage(id: number, file: Express.Multer.File, req: ExpressRequest): Promise<{
        image_url: string | null;
    }>;
    clearImage(id: number): Promise<{
        ok: boolean;
    }>;
}
