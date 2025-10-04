import { Injectable, OnModuleDestroy } from "@nestjs/common";
import mysql from "mysql2/promise";

function fromDatabaseUrl(urlStr: string) {
  // Formato esperado:
  // mysql://USER:PASS@gateway01.us-east-1.prod.aws.tidbcloud.com:4000/ferreteria_db
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
      // TLS para mysql2 (SslOptions): sin 'servername' (no existe en el tipo)
      ssl: {
        minVersion: "TLSv1.2",
        rejectUnauthorized: true,
        // Si el runtime no trae CAs y falla por certificado, descomenta y agrega el root:
        // ca: fs.readFileSync('./certs/isrgrootx1.pem', 'utf8'),
      },
    });
  }

  async callDashboardSP(from: Date, to: Date) {
    const conn = await this.pool.getConnection();
    try {
      const [rows] = await conn.query("CALL sp_AdminSalesDashboard(?, ?)", [from, to]);
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
      await conn.query("CALL sp_ReceivePurchase(?, ?)", [purchaseId, userId]);
    } finally {
      conn.release();
    }
  }
}
