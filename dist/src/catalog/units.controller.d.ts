import { CatalogService } from './catalog.service';
import { PaginationDto } from './dto/pagination.dto';
import { CreateUnitDto, UpdateUnitDto } from './dto/unit.dto';
export declare class UnitsController {
    private readonly service;
    constructor(service: CatalogService);
    list(q: PaginationDto): Promise<{
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
    get(id: number): import("@prisma/client").Prisma.Prisma__unitsClient<{
        name: string;
        code: string;
        unit_id: number;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    create(dto: CreateUnitDto): import("@prisma/client").Prisma.Prisma__unitsClient<{
        name: string;
        code: string;
        unit_id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, dto: UpdateUnitDto): import("@prisma/client").Prisma.Prisma__unitsClient<{
        name: string;
        code: string;
        unit_id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: number): import("@prisma/client").Prisma.Prisma__unitsClient<{
        name: string;
        code: string;
        unit_id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
