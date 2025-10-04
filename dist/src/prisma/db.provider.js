"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc : Object.getOwnPropertyDescriptor(target, key) : null, d;
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
    // Ej: mysql://USER:PASS@gateway01.us-east-1.prod.tidbcloud.com:4000/DBNAME
    const u = new URL(urlStr);
    return {
        host: u.hostname,
        port: Number(u.port || 4000),
        user: decodeURIComponent(u.username),
        password: decodeURIComponent(u.password),
        database: u.pathname.replace(/^\//, "")
    };
}

let DbProvider = class DbProvider {
    pool;
    constructor() {
        const url = process.env.DATABASE_URL;
        if (!url) throw new Error("DATABASE_URL no está definido");

        const cfg = fromDatabaseUrl(url);

        // ✅ Pool con TLS (requerido por TiDB Serverless)
        this.pool = promise_1.default.createPool({
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
                // ca: fs.readFileSync('./certs/isrgrootx1.pem','utf8'), // solo si tu runtime no trae CAs
            },
        });
    }

    async callDashboardSP(from, to) {
        const conn = await this.pool.getConnection();
        try {
            const [rows] = await conn.query("CALL sp_AdminSalesDashboard(?, ?)", [from, to]);
            return rows.filter(Array.isArray);
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
        try {
            await conn.query("CALL sp_Checkout(?,?,?,?,?,?)", [
                saleId,
                paymentMethodId,
                amount,
                refNumber,
                receivedBy,
                allowNegativeStock ? 1 : 0,
            ]);
        }
        finally {
            conn.release();
        }
    }

    async callReceivePurchaseSP(purchaseId, userId) {
        const conn = await this.pool.getConnection();
        try {
            await conn.query('CALL sp_ReceivePurchase(?, ?)', [purchaseId, userId]);
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
