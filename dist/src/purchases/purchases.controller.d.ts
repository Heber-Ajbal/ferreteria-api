import { PurchasesService } from './purchases.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { ReceivePurchaseDto } from './dto/receive-purchase.dto';
export declare class PurchasesController {
    private service;
    constructor(service: PurchasesService);
    create(req: any, dto: CreatePurchaseDto): Promise<{
        purchaseId: number;
        status: string;
    }>;
    receive(req: any, id: number, dto: ReceivePurchaseDto): Promise<{
        purchaseId: number;
        status: import("@prisma/client").$Enums.purchases_status | undefined;
        subtotal: number;
        tax: number;
    }>;
    stock(): Promise<{
        productId: any;
        name: any;
        stock: number;
    }[]>;
}
