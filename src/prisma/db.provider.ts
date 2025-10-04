import { Injectable, OnModuleDestroy } from "@nestjs/common";
import mysql from "mysql2/promise";

function fromDatabaseUrl(urlStr: string) {
  // Ej: mysql://USER:PASS@gateway01.us-east-1.prod.tidbcloud.com:4000/ferreteria_db
  const u = new URL(urlStr);
  return {
    host: u.hostname,
    port: Number(u.port || 4000),
    user: decodeURIComponent(u.username),
    password: decodeURIComponent(u.password),
    database: u.pathname.replace(/^\//, ""),
  };
}

@Injectable()
export class DbProvider implements OnModuleDestroy {
  private pool: mysql.Pool;

  constructor() {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL no está definido");

    const cfg = fromDatabaseUrl(url);

    // ✅ Pool con TLS (requerido por TiDB Serverless)
    this.pool = mysql.createPool({
      host: cfg.host,
      port: cfg.port,
      user: cfg.user,
      password: cfg.password,
      database: cfg.database,
      waitForConnections: true,
      connectionLimit: 10,
      ssl: {
        minVersion: "TLSv1.2",
        rejectUnauthorized: true,
        servername: cfg.host, // SNI
        // ca: fs.readFileSync('./certs/isrgrootx1.pem','utf8'), // si tu runtime no trae CAs (normalmente no hace falta)
      },
    });
  }

  async callDashboardSP(from: Date, to: Date) {
    const conn = await this.pool.getConnection();
    try {
      const [rows] = await conn.query("CALL sp_AdminSalesDashboard(?, ?)", [from, to]);
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
      await conn.query("CALL sp_ReceivePurchase(?, ?)", [purchaseId, userId]);
    } finally {
      conn.release();
    }
  }
}
