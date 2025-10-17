import { OnModuleDestroy } from "@nestjs/common";
import mysql from "mysql2/promise";
export declare class DbProvider implements OnModuleDestroy {
    private pool;
    constructor();
    callDashboardSP(from: Date, to: Date): Promise<(mysql.ResultSetHeader[] | mysql.RowDataPacket[] | mysql.RowDataPacket[][] | mysql.OkPacket[] | [mysql.RowDataPacket[], mysql.ResultSetHeader])[]>;
    onModuleDestroy(): Promise<void>;
    callCheckoutSP(saleId: number, paymentMethodId: number, amount: number, refNumber: string | null, receivedBy: number, allowNegativeStock: boolean): Promise<void>;
    callReceivePurchaseSP(purchaseId: number, userId: number): Promise<void>;
}
