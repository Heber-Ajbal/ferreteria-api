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

// Reemplaza TODO el método por esto:
async callDashboardSP(from: Date, to: Date) {
  const conn = await this.pool.getConnection();
  // TiDB usa DATETIME sin zona. Formateo 'YYYY-MM-DD HH:MM:SS' (UTC por simplicidad).
  const fmt = (d: Date) => new Date(d).toISOString().replace('T', ' ').slice(0, 19);
  const p = [fmt(from), fmt(to)];

  try {
    // 1) KPIs resumen
    const [summary] = await conn.query(
      `
      SELECT
        COUNT(*)            AS orders,
        SUM(total)          AS revenue,
        SUM(subtotal)       AS gross_sales,
        SUM(discount_total) AS discounts,
        SUM(tax_amount)     AS taxes,
        AVG(total)          AS avg_order_value
      FROM vw_paid_sales
      WHERE paid_at >= ? AND paid_at < ?
      `,
      p
    );

    // 2) Serie diaria
    const [daily] = await conn.query(
      `
      SELECT
        DATE(paid_at) AS day,
        COUNT(*)      AS orders,
        SUM(total)    AS revenue
      FROM vw_paid_sales
      WHERE paid_at >= ? AND paid_at < ?
      GROUP BY DATE(paid_at)
      ORDER BY day
      `,
      p
    );

    // 3) Top productos (TOP 10)
    const [topProducts] = await conn.query(
      `
      SELECT
        i.product_id, i.product_name,
        SUM(i.qty)        AS units,
        SUM(i.line_total) AS revenue
      FROM vw_paid_sale_items i
      JOIN vw_paid_sales s ON s.sale_id = i.sale_id
      WHERE s.paid_at >= ? AND s.paid_at < ?
      GROUP BY i.product_id, i.product_name
      ORDER BY revenue DESC
      LIMIT 10
      `,
      p
    );

    // 4) Categorías
    const [byCategory] = await conn.query(
      `
      SELECT
        i.category_id, i.category_name,
        SUM(i.line_total) AS revenue
      FROM vw_paid_sale_items i
      JOIN vw_paid_sales s ON s.sale_id = i.sale_id
      WHERE s.paid_at >= ? AND s.paid_at < ?
      GROUP BY i.category_id, i.category_name
      ORDER BY revenue DESC
      `,
      p
    );

    // 5) Métodos de pago
    const [byPayment] = await conn.query(
      `
      SELECT
        payment_method_id,
        payment_method_code,
        payment_method_name,
        COUNT(*)   AS orders,
        SUM(total) AS revenue
      FROM vw_paid_sales
      WHERE paid_at >= ? AND paid_at < ?
      GROUP BY payment_method_id, payment_method_code, payment_method_name
      ORDER BY revenue DESC
      `,
      p
    );

    // 6) Canal
    const [byChannel] = await conn.query(
      `
      SELECT
        channel,
        COUNT(*)   AS orders,
        SUM(total) AS revenue
      FROM vw_paid_sales
      WHERE paid_at >= ? AND paid_at < ?
      GROUP BY channel
      `,
      p
    );

    // 7) Heatmap por hora
    const [byHour] = await conn.query(
      `
      SELECT
        HOUR(paid_at) AS hour_of_day,
        COUNT(*)      AS orders,
        SUM(total)    AS revenue
      FROM vw_paid_sales
      WHERE paid_at >= ? AND paid_at < ?
      GROUP BY HOUR(paid_at)
      ORDER BY hour_of_day
      `,
      p
    );

    // Mantengo el contrato: arreglo de 7 resultsets como antes
    return [
      Array.isArray(summary) ? summary : [],
      Array.isArray(daily) ? daily : [],
      Array.isArray(topProducts) ? topProducts : [],
      Array.isArray(byCategory) ? byCategory : [],
      Array.isArray(byPayment) ? byPayment : [],
      Array.isArray(byChannel) ? byChannel : [],
      Array.isArray(byHour) ? byHour : [],
    ];
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
