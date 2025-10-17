import { PrismaClient } from '@prisma/client';
export declare class ReportsService {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    movements(params: {
        from: string;
        to: string;
        productId?: number;
    }): Promise<{
        movement_id: number;
        product_id: number;
        movement_type: string;
        reference_type: string;
        reference_id: number;
        qty_signed: number;
        unit_cost: number | null;
        unit_price: number | null;
        notes: string | null;
        created_at: Date;
    }[]>;
}
