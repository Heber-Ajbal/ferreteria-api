import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from './dto/pagination.dto';
export declare class CatalogService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private pageQuery;
    listCategories(q: PaginationDto): Promise<{
        data: {
            name: string;
            description: string | null;
            category_id: number;
        }[];
        meta: {
            page: number;
            pageSize: number;
            total: number;
        };
    }>;
    getCategory(id: number): Prisma.Prisma__categoriesClient<{
        name: string;
        description: string | null;
        category_id: number;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    createCategory(data: {
        name: string;
        description?: string;
    }): Prisma.Prisma__categoriesClient<{
        name: string;
        description: string | null;
        category_id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    updateCategory(id: number, data: Partial<{
        name: string;
        description?: string;
    }>): Prisma.Prisma__categoriesClient<{
        name: string;
        description: string | null;
        category_id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    deleteCategory(id: number): Prisma.Prisma__categoriesClient<{
        name: string;
        description: string | null;
        category_id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    listBrands(q: PaginationDto): Promise<{
        data: {
            name: string;
            brand_id: number;
        }[];
        meta: {
            page: number;
            pageSize: number;
            total: number;
        };
    }>;
    getBrand(id: number): Prisma.Prisma__brandsClient<{
        name: string;
        brand_id: number;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    createBrand(data: {
        name: string;
    }): Prisma.Prisma__brandsClient<{
        name: string;
        brand_id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    updateBrand(id: number, data: Partial<{
        name: string;
    }>): Prisma.Prisma__brandsClient<{
        name: string;
        brand_id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    deleteBrand(id: number): Prisma.Prisma__brandsClient<{
        name: string;
        brand_id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    listUnits(q: PaginationDto): Promise<{
        data: {
            name: string;
            code: string;
            unit_id: number;
        }[];
        meta: {
            page: number;
            pageSize: number;
            total: number;
        };
    }>;
    getUnit(id: number): Prisma.Prisma__unitsClient<{
        name: string;
        code: string;
        unit_id: number;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    createUnit(data: {
        code: string;
        name: string;
    }): Prisma.Prisma__unitsClient<{
        name: string;
        code: string;
        unit_id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    updateUnit(id: number, data: Partial<{
        code: string;
        name: string;
    }>): Prisma.Prisma__unitsClient<{
        name: string;
        code: string;
        unit_id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    deleteUnit(id: number): Prisma.Prisma__unitsClient<{
        name: string;
        code: string;
        unit_id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    listProducts(q: PaginationDto & {
        categoryId?: number;
        brandId?: number;
    }): Promise<{
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
            cost_price: Prisma.Decimal;
            sale_price: Prisma.Decimal;
            is_taxable: boolean;
            min_stock: Prisma.Decimal;
        })[];
        meta: {
            page: number;
            pageSize: number;
            total: number;
        };
    }>;
    getProduct(id: number): Prisma.Prisma__productsClient<({
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
        cost_price: Prisma.Decimal;
        sale_price: Prisma.Decimal;
        is_taxable: boolean;
        min_stock: Prisma.Decimal;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    createProduct(data: any): Prisma.Prisma__productsClient<{
        name: string;
        description: string | null;
        created_at: Date;
        category_id: number | null;
        brand_id: number | null;
        unit_id: number;
        barcode: string | null;
        sku: string;
        product_id: number;
        cost_price: Prisma.Decimal;
        sale_price: Prisma.Decimal;
        is_taxable: boolean;
        min_stock: Prisma.Decimal;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    updateProduct(id: number, data: any): Prisma.Prisma__productsClient<{
        name: string;
        description: string | null;
        created_at: Date;
        category_id: number | null;
        brand_id: number | null;
        unit_id: number;
        barcode: string | null;
        sku: string;
        product_id: number;
        cost_price: Prisma.Decimal;
        sale_price: Prisma.Decimal;
        is_taxable: boolean;
        min_stock: Prisma.Decimal;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    deleteProduct(id: number): Prisma.Prisma__productsClient<{
        name: string;
        description: string | null;
        created_at: Date;
        category_id: number | null;
        brand_id: number | null;
        unit_id: number;
        barcode: string | null;
        sku: string;
        product_id: number;
        cost_price: Prisma.Decimal;
        sale_price: Prisma.Decimal;
        is_taxable: boolean;
        min_stock: Prisma.Decimal;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
}
