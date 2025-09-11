import { CatalogService } from './catalog.service';
import { PaginationDto } from './dto/pagination.dto';
import { CreateBrandDto, UpdateBrandDto } from './dto/brand.dto';
export declare class BrandsController {
    private readonly service;
    constructor(service: CatalogService);
    list(q: PaginationDto): Promise<{
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
    get(id: number): import("@prisma/client").Prisma.Prisma__brandsClient<{
        name: string;
        brand_id: number;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    create(dto: CreateBrandDto): import("@prisma/client").Prisma.Prisma__brandsClient<{
        name: string;
        brand_id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, dto: UpdateBrandDto): import("@prisma/client").Prisma.Prisma__brandsClient<{
        name: string;
        brand_id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: number): import("@prisma/client").Prisma.Prisma__brandsClient<{
        name: string;
        brand_id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
