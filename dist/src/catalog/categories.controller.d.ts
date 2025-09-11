import { CatalogService } from './catalog.service';
import { PaginationDto } from './dto/pagination.dto';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
export declare class CategoriesController {
    private readonly service;
    constructor(service: CatalogService);
    list(q: PaginationDto): Promise<{
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
    get(id: number): import("@prisma/client").Prisma.Prisma__categoriesClient<{
        name: string;
        description: string | null;
        category_id: number;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    create(dto: CreateCategoryDto): import("@prisma/client").Prisma.Prisma__categoriesClient<{
        name: string;
        description: string | null;
        category_id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, dto: UpdateCategoryDto): import("@prisma/client").Prisma.Prisma__categoriesClient<{
        name: string;
        description: string | null;
        category_id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: number): import("@prisma/client").Prisma.Prisma__categoriesClient<{
        name: string;
        description: string | null;
        category_id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
