import { PrismaService } from '../prisma/prisma.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { DbProvider } from '../prisma/db.provider';
export declare class PurchasesService {
    private prisma;
    private db;
    constructor(prisma: PrismaService, db: DbProvider);
    create(dto: CreatePurchaseDto, createdBy: number): Promise<{
        purchaseId: number;
        status: string;
    }>;
    receive(purchaseId: number, userId: number): Promise<{
        purchaseId: number;
        status: import("@prisma/client").$Enums.purchases_status | undefined;
        subtotal: number;
        tax: number;
    }>;
    stockList(): Promise<{
        productId: any;
        name: any;
        stock: number;
    }[]>;
}
