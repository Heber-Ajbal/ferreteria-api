import { CatalogService } from './catalog.service';
import { PaginationDto } from './dto/pagination.dto';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
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
                description: string | null;
                category_id: number;
            } | null;
            units: {
                name: string;
                code: string;
                unit_id: number;
            };
        } & {
            name: string;
            description: string | null;
            created_at: Date;
            category_id: number | null;
            brand_id: number | null;
            unit_id: number;
            barcode: string | null;
            sku: string;
            product_id: number;
            cost_price: import("@prisma/client/runtime/library").Decimal;
            sale_price: import("@prisma/client/runtime/library").Decimal;
            is_taxable: boolean;
            min_stock: import("@prisma/client/runtime/library").Decimal;
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
            description: string | null;
            category_id: number;
        } | null;
        units: {
            name: string;
            code: string;
            unit_id: number;
        };
    } & {
        name: string;
        description: string | null;
        created_at: Date;
        category_id: number | null;
        brand_id: number | null;
        unit_id: number;
        barcode: string | null;
        sku: string;
        product_id: number;
        cost_price: import("@prisma/client/runtime/library").Decimal;
        sale_price: import("@prisma/client/runtime/library").Decimal;
        is_taxable: boolean;
        min_stock: import("@prisma/client/runtime/library").Decimal;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    create(dto: CreateProductDto): import("@prisma/client").Prisma.Prisma__productsClient<{
        name: string;
        description: string | null;
        created_at: Date;
        category_id: number | null;
        brand_id: number | null;
        unit_id: number;
        barcode: string | null;
        sku: string;
        product_id: number;
        cost_price: import("@prisma/client/runtime/library").Decimal;
        sale_price: import("@prisma/client/runtime/library").Decimal;
        is_taxable: boolean;
        min_stock: import("@prisma/client/runtime/library").Decimal;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, dto: UpdateProductDto): import("@prisma/client").Prisma.Prisma__productsClient<{
        name: string;
        description: string | null;
        created_at: Date;
        category_id: number | null;
        brand_id: number | null;
        unit_id: number;
        barcode: string | null;
        sku: string;
        product_id: number;
        cost_price: import("@prisma/client/runtime/library").Decimal;
        sale_price: import("@prisma/client/runtime/library").Decimal;
        is_taxable: boolean;
        min_stock: import("@prisma/client/runtime/library").Decimal;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: number): import("@prisma/client").Prisma.Prisma__productsClient<{
        name: string;
        description: string | null;
        created_at: Date;
        category_id: number | null;
        brand_id: number | null;
        unit_id: number;
        barcode: string | null;
        sku: string;
        product_id: number;
        cost_price: import("@prisma/client/runtime/library").Decimal;
        sale_price: import("@prisma/client/runtime/library").Decimal;
        is_taxable: boolean;
        min_stock: import("@prisma/client/runtime/library").Decimal;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
