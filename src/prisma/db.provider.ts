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
        SUM(i.unit_price) AS revenue
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
  // util para redondeo monetario
  const round2 = (n: any) => Math.round(Number(n ?? 0) * 100) / 100;

  try {
    // 🔒 Transacción
    await conn.beginTransaction();

    // 1) Validaciones básicas (+ lock del row de la venta)
    const [saleRows] = await conn.query(
      `SELECT sale_id, status, total, subtotal, discount_total, tax_amount
         FROM sales
        WHERE sale_id = ?
        FOR UPDATE`,
      [saleId]
    );
    if (!Array.isArray(saleRows) || saleRows.length === 0) {
      throw new Error('Venta no existe');
    }
    const sale = saleRows[0] as any;

    if (!['CART', 'PLACED'].includes(sale.status)) {
      throw new Error('La venta no está en estado válido para checkout');
    }

    const [itemsCountRows] = await conn.query(
      `SELECT COUNT(*) AS c FROM sale_items WHERE sale_id = ?`,
      [saleId]
    );
    const itemsCount = (itemsCountRows as any[])[0]?.c ?? 0;
    if (itemsCount === 0) {
      throw new Error('El carrito está vacío');
    }

    // 2) Recalcular totales (equivalente a sp_UpdateSaleTotals)
    //    Ajusta a tu esquema real si usas otros campos (promos, impuestos a nivel item, etc.)
    
    const [totRows] = await conn.query(
      `
      SELECT
        COALESCE(SUM(si.qty * si.unit_price), 0)                      AS subtotal_calc,
        COALESCE(SUM(si.discount_amt), 0)                          AS discount_calc,
        -- Si manejas impuestos por item, suma aquí; si no, usa el de la tabla sales
        0                                                             AS tax_items
      FROM sale_items si
      WHERE si.sale_id = ?
      `,
      [saleId]
    );
    const t = (totRows as any[])[0] || {};
    // si tienes impuestos a nivel venta ya precalculados, úsalos
    const taxAmount = round2(sale.tax_amount ?? t.tax_items ?? 0);
    const subtotal = round2(t.subtotal_calc);
    const discounts = round2(t.discount_calc);
    const totalCalc = round2(subtotal - discounts + taxAmount);

    await conn.query(
      `
      UPDATE sales
         SET subtotal = ?,
             discount_total = ?,
             tax_amount = ?,
             total = ?,
             updated_at = CURRENT_TIMESTAMP
       WHERE sale_id = ?`,
      [subtotal, discounts, taxAmount, totalCalc, saleId]
    );

    // 3) Validar monto de pago
    if (amount == null || round2(amount) !== round2(totalCalc)) {
      throw new Error('El monto de pago no coincide con el total');
    }

    // 4) Validar stock (si no se permite negativo)
    if (!allowNegativeStock) {
      const [shortagesRows] = await conn.query(
        `
        SELECT COUNT(*) AS shortages
        FROM (
          SELECT
            si.product_id,
            SUM(si.qty) AS sale_qty,
            COALESCE((
              SELECT SUM(im.qty)
              FROM inventory_movements im
              WHERE im.product_id = si.product_id
            ), 0) AS stock_qty
          FROM sale_items si
          WHERE si.sale_id = ?
          GROUP BY si.product_id
        ) t
        WHERE t.stock_qty < t.sale_qty
        `,
        [saleId]
      );
      const shortages = (shortagesRows as any[])[0]?.shortages ?? 0;
      if (shortages > 0) {
        throw new Error('Stock insuficiente para uno o más productos');
      }
    }

    // 5) Generar movimientos de inventario (salida)
    await conn.query(
      `
      INSERT INTO inventory_movements
        (product_id, movement_type, reference_type, reference_id, qty, unit_cost, unit_price, notes, created_at)
      SELECT
        si.product_id,
        'OUT_SALE',
        'SALE',
        ?,
        -si.qty,
        NULL,
        si.unit_price,
        NULL,
        CURRENT_TIMESTAMP
      FROM sale_items si
      WHERE si.sale_id = ?
      `,
      [saleId, saleId]
    );

    // 6) Registrar pago
    await conn.query(
      `
      INSERT INTO payments
        (sale_id, payment_method_id, amount, ref_number, received_by, paid_at)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `,
      [saleId, paymentMethodId, totalCalc, refNumber, receivedBy]
    );

    // 7) Actualizar estado de venta → PAID
    await conn.query(
      `
      UPDATE sales
         SET status = 'PAID',
             updated_at = CURRENT_TIMESTAMP
       WHERE sale_id = ?
      `,
      [saleId]
    );

    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}


 async callReceivePurchaseSP(purchaseId: number, userId: number) {
  const conn = await this.pool.getConnection();
  try {
    await conn.beginTransaction();

    // 1) Validar compra y bloquear fila
    const [purchaseRows] = await conn.query(
      `SELECT purchase_id, status, created_by, created_at
         FROM purchases
        WHERE purchase_id = ?
        FOR UPDATE`,
      [purchaseId]
    );
    if (!Array.isArray(purchaseRows) || purchaseRows.length === 0) {
      throw new Error('Compra no existe');
    }
    const purchase = purchaseRows[0] as any;

    if (purchase.status === 'CANCELLED') {
      throw new Error('Compra cancelada');
    }

    // 2) Evitar doble recepción (ya hay movimientos para esta compra)
    const [movCountRows] = await conn.query(
      `SELECT COUNT(*) AS c
         FROM inventory_movements
        WHERE reference_type = 'PURCHASE'
          AND reference_id = ?`,
      [purchaseId]
    );
    const movCount = (movCountRows as any[])[0]?.c ?? 0;
    if (movCount > 0) {
      throw new Error('La compra ya fue recibida');
    }

    // 3) Insertar movimientos de ENTRADA desde los renglones de compra
    await conn.query(
      `
      INSERT INTO inventory_movements
        (product_id, movement_type, reference_type, reference_id, qty, unit_cost, unit_price, notes, created_at)
      SELECT
        pi.product_id,
        'IN_PURCHASE',
        'PURCHASE',
        ?,
        pi.qty,
        pi.unit_cost,
        NULL,
        NULL,
        CURRENT_TIMESTAMP
      FROM purchase_items pi
      WHERE pi.purchase_id = ?
      `,
      [purchaseId, purchaseId]
    );

    // 4) Recalcular totales de la compra (subtotales e impuestos de los renglones)
    const [totalsRows] = await conn.query(
      `
      SELECT
        COALESCE(SUM(line_subtotal), 0) AS v_subtot,
        COALESCE(SUM(line_tax), 0)      AS v_tax
      FROM purchase_items
      WHERE purchase_id = ?
      `,
      [purchaseId]
    );
    const totals = (totalsRows as any[])[0] || { v_subtot: 0, v_tax: 0 };

    // 5) Actualizar compra → RECEIVED
    //    (mantengo tu lógica: si created_by es NULL, lo seteo a userId;
    //     created_at queda "sin cambios")
    await conn.query(
      `
      UPDATE purchases
         SET subtotal   = ?,
             tax_amount = ?,
             status     = 'RECEIVED',
             created_by = IFNULL(created_by, ?)
       WHERE purchase_id = ?
      `,
      [totals.v_subtot, totals.v_tax, userId, purchaseId]
    );

    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

}
