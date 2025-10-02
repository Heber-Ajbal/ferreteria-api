import { OnModuleDestroy } from "@nestjs/common";
export declare class DbProvider implements OnModuleDestroy {
    private pool;
    constructor();
    callDashboardSP(from: Date, to: Date): Promise<any[][]>;
    onModuleDestroy(): Promise<void>;
    callCheckoutSP(saleId: number, paymentMethodId: number, amount: number, refNumber: string | null, receivedBy: number, allowNegativeStock: boolean): Promise<void>;
    callReceivePurchaseSP(purchaseId: number, userId: number): Promise<void>;
}
