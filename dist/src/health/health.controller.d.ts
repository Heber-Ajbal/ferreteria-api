import { PrismaService } from '../prisma/prisma.service';
export declare class HealthController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    get(): Promise<{
        status: string;
        db: string;
        error?: undefined;
    } | {
        status: string;
        db: string;
        error: any;
    }>;
}
