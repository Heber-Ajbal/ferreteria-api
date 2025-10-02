import { Injectable, OnModuleDestroy } from "@nestjs/common";
import mysql from "mysql2/promise";

@Injectable()
export class DbProvider implements OnModuleDestroy {
  private pool: mysql.Pool;

  constructor() {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL no está definido");
    this.pool = mysql.createPool(url);
  }

  async callDashboardSP(from: Date, to: Date) {
    const conn = await this.pool.getConnection();
    try {
      const [rows] = await conn.query("CALL sp_AdminSalesDashboard(?, ?)", [
        from,
        to,
      ]);
      // mysql2 retorna [ [rs1], [rs2], ..., OkPacket ]
      return (rows as any[]).filter(Array.isArray);
    } finally {
      conn.release();
    }
  }

  async onModuleDestroy() {
    await this.pool.end();
  }

  async callCheckoutSP(
    saleId: number,
    paymentMethodId: number,
    amount: number,
    refNumber: string | null,
    receivedBy: number,
    allowNegativeStock: boolean
  ) {
    const conn = await this.pool.getConnection();
    try {
      await conn.query("CALL sp_Checkout(?,?,?,?,?,?)", [
        saleId,
        paymentMethodId,
        amount,
        refNumber,
        receivedBy,
        allowNegativeStock ? 1 : 0,
      ]);
    } finally {
      conn.release();
    }
  }

  async callReceivePurchaseSP(purchaseId: number, userId: number) {
  const conn = await this.pool.getConnection();
  try {
    await conn.query('CALL sp_ReceivePurchase(?, ?)', [purchaseId, userId]);
  } finally {
    conn.release();
  }
}

}
