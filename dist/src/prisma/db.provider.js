"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbProvider = void 0;
const common_1 = require("@nestjs/common");
const promise_1 = __importDefault(require("mysql2/promise"));
function fromDatabaseUrl(urlStr) {
    const u = new URL(urlStr);
    return {
        host: u.hostname,
        port: Number(u.port || 4000),
        user: decodeURIComponent(u.username),
        password: decodeURIComponent(u.password),
        database: u.pathname.replace(/^\//, ""),
    };
}
let DbProvider = class DbProvider {
    pool;
    constructor() {
        const url = process.env.DATABASE_URL;
        if (!url)
            throw new Error("DATABASE_URL no está definido");
        const cfg = fromDatabaseUrl(url);
        this.pool = promise_1.default.createPool({
            host: cfg.host,
            port: cfg.port,
            user: cfg.user,
            password: cfg.password,
            database: cfg.database,
            waitForConnections: true,
            connectionLimit: 10,
        });
    }
    async callDashboardSP(from, to) {
        const conn = await this.pool.getConnection();
        const fmt = (d) => new Date(d).toISOString().replace('T', ' ').slice(0, 19);
        const p = [fmt(from), fmt(to)];
        try {
            const [summary] = await conn.query(`
      SELECT
        COUNT(*)            AS orders,
        SUM(total)          AS revenue,
        SUM(subtotal)       AS gross_sales,
        SUM(discount_total) AS discounts,
        SUM(tax_amount)     AS taxes,
        AVG(total)          AS avg_order_value
      FROM vw_paid_sales
      WHERE paid_at >= ? AND paid_at < ?
      `, p);
            const [daily] = await conn.query(`
      SELECT
        DATE(paid_at) AS day,
        COUNT(*)      AS orders,
        SUM(total)    AS revenue
      FROM vw_paid_sales
      WHERE paid_at >= ? AND paid_at < ?
      GROUP BY DATE(paid_at)
      ORDER BY day
      `, p);
            const [topProducts] = await conn.query(`
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
      `, p);
            const [byCategory] = await conn.query(`
      SELECT
        i.category_id, i.category_name,
        SUM(i.line_total) AS revenue
      FROM vw_paid_sale_items i
      JOIN vw_paid_sales s ON s.sale_id = i.sale_id
      WHERE s.paid_at >= ? AND s.paid_at < ?
      GROUP BY i.category_id, i.category_name
      ORDER BY revenue DESC
      `, p);
            const [byPayment] = await conn.query(`
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
      `, p);
            const [byChannel] = await conn.query(`
      SELECT
        channel,
        COUNT(*)   AS orders,
        SUM(total) AS revenue
      FROM vw_paid_sales
      WHERE paid_at >= ? AND paid_at < ?
      GROUP BY channel
      `, p);
            const [byHour] = await conn.query(`
      SELECT
        HOUR(paid_at) AS hour_of_day,
        COUNT(*)      AS orders,
        SUM(total)    AS revenue
      FROM vw_paid_sales
      WHERE paid_at >= ? AND paid_at < ?
      GROUP BY HOUR(paid_at)
      ORDER BY hour_of_day
      `, p);
            return [
                Array.isArray(summary) ? summary : [],
                Array.isArray(daily) ? daily : [],
                Array.isArray(topProducts) ? topProducts : [],
                Array.isArray(byCategory) ? byCategory : [],
                Array.isArray(byPayment) ? byPayment : [],
                Array.isArray(byChannel) ? byChannel : [],
                Array.isArray(byHour) ? byHour : [],
            ];
        }
        finally {
            conn.release();
        }
    }
    async onModuleDestroy() {
        await this.pool.end();
    }
    async callCheckoutSP(saleId, paymentMethodId, amount, refNumber, receivedBy, allowNegativeStock) {
        const conn = await this.pool.getConnection();
        const round2 = (n) => Math.round(Number(n ?? 0) * 100) / 100;
        try {
            await conn.beginTransaction();
            const [saleRows] = await conn.query(`SELECT sale_id, status, total, subtotal, discount_total, tax_amount
         FROM sales
        WHERE sale_id = ?
        FOR UPDATE`, [saleId]);
            if (!Array.isArray(saleRows) || saleRows.length === 0) {
                throw new Error('Venta no existe');
            }
            const sale = saleRows[0];
            if (!['CART', 'PLACED'].includes(sale.status)) {
                throw new Error('La venta no está en estado válido para checkout');
            }
            const [itemsCountRows] = await conn.query(`SELECT COUNT(*) AS c FROM sale_items WHERE sale_id = ?`, [saleId]);
            const itemsCount = itemsCountRows[0]?.c ?? 0;
            if (itemsCount === 0) {
                throw new Error('El carrito está vacío');
            }
            const [totRows] = await conn.query(`
      SELECT
        COALESCE(SUM(si.qty * si.unit_price), 0)                      AS subtotal_calc,
        COALESCE(SUM(si.discount_amt), 0)                          AS discount_calc,
        -- Si manejas impuestos por item, suma aquí; si no, usa el de la tabla sales
        0                                                             AS tax_items
      FROM sale_items si
      WHERE si.sale_id = ?
      `, [saleId]);
            const t = totRows[0] || {};
            const taxAmount = round2(sale.tax_amount ?? t.tax_items ?? 0);
            const subtotal = round2(t.subtotal_calc);
            const discounts = round2(t.discount_calc);
            const totalCalc = round2(subtotal - discounts + taxAmount);
            await conn.query(`
      UPDATE sales
         SET subtotal = ?,
             discount_total = ?,
             tax_amount = ?,
             total = ?,
             updated_at = CURRENT_TIMESTAMP
       WHERE sale_id = ?`, [subtotal, discounts, taxAmount, totalCalc, saleId]);
            if (amount == null || round2(amount) !== round2(totalCalc)) {
                throw new Error('El monto de pago no coincide con el total');
            }
            if (!allowNegativeStock) {
                const [shortagesRows] = await conn.query(`
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
        `, [saleId]);
                const shortages = shortagesRows[0]?.shortages ?? 0;
                if (shortages > 0) {
                    throw new Error('Stock insuficiente para uno o más productos');
                }
            }
            await conn.query(`
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
      `, [saleId, saleId]);
            await conn.query(`
      INSERT INTO payments
        (sale_id, payment_method_id, amount, ref_number, received_by, paid_at)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `, [saleId, paymentMethodId, totalCalc, refNumber, receivedBy]);
            await conn.query(`
      UPDATE sales
         SET status = 'PAID',
             updated_at = CURRENT_TIMESTAMP
       WHERE sale_id = ?
      `, [saleId]);
            await conn.commit();
        }
        catch (err) {
            await conn.rollback();
            throw err;
        }
        finally {
            conn.release();
        }
    }
    async callReceivePurchaseSP(purchaseId, userId) {
        const conn = await this.pool.getConnection();
        try {
            await conn.beginTransaction();
            const [purchaseRows] = await conn.query(`SELECT purchase_id, status, created_by, created_at
         FROM purchases
        WHERE purchase_id = ?
        FOR UPDATE`, [purchaseId]);
            if (!Array.isArray(purchaseRows) || purchaseRows.length === 0) {
                throw new Error('Compra no existe');
            }
            const purchase = purchaseRows[0];
            if (purchase.status === 'CANCELLED') {
                throw new Error('Compra cancelada');
            }
            const [movCountRows] = await conn.query(`SELECT COUNT(*) AS c
         FROM inventory_movements
        WHERE reference_type = 'PURCHASE'
          AND reference_id = ?`, [purchaseId]);
            const movCount = movCountRows[0]?.c ?? 0;
            if (movCount > 0) {
                throw new Error('La compra ya fue recibida');
            }
            await conn.query(`
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
      `, [purchaseId, purchaseId]);
            const [totalsRows] = await conn.query(`
      SELECT
        COALESCE(SUM(line_subtotal), 0) AS v_subtot,
        COALESCE(SUM(line_tax), 0)      AS v_tax
      FROM purchase_items
      WHERE purchase_id = ?
      `, [purchaseId]);
            const totals = totalsRows[0] || { v_subtot: 0, v_tax: 0 };
            await conn.query(`
      UPDATE purchases
         SET subtotal   = ?,
             tax_amount = ?,
             status     = 'RECEIVED',
             created_by = IFNULL(created_by, ?)
       WHERE purchase_id = ?
      `, [totals.v_subtot, totals.v_tax, userId, purchaseId]);
            await conn.commit();
        }
        catch (err) {
            await conn.rollback();
            throw err;
        }
        finally {
            conn.release();
        }
    }
};
exports.DbProvider = DbProvider;
exports.DbProvider = DbProvider = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], DbProvider);
//# sourceMappingURL=db.provider.js.map