import { DbProvider } from '../prisma/db.provider';
export declare class DashboardService {
    private readonly db;
    constructor(db: DbProvider);
    getDashboard(from: Date, to: Date): Promise<{
        summary: import("mysql2").OkPacket | import("mysql2").ResultSetHeader | import("mysql2").RowDataPacket | import("mysql2").RowDataPacket[];
        daily: import("mysql2").ResultSetHeader[] | import("mysql2").RowDataPacket[] | import("mysql2").RowDataPacket[][] | import("mysql2").OkPacket[] | [import("mysql2").RowDataPacket[], import("mysql2").ResultSetHeader];
        topProducts: import("mysql2").ResultSetHeader[] | import("mysql2").RowDataPacket[] | import("mysql2").RowDataPacket[][] | import("mysql2").OkPacket[] | [import("mysql2").RowDataPacket[], import("mysql2").ResultSetHeader];
        byCategory: import("mysql2").ResultSetHeader[] | import("mysql2").RowDataPacket[] | import("mysql2").RowDataPacket[][] | import("mysql2").OkPacket[] | [import("mysql2").RowDataPacket[], import("mysql2").ResultSetHeader];
        byPayment: import("mysql2").ResultSetHeader[] | import("mysql2").RowDataPacket[] | import("mysql2").RowDataPacket[][] | import("mysql2").OkPacket[] | [import("mysql2").RowDataPacket[], import("mysql2").ResultSetHeader];
        byChannel: import("mysql2").ResultSetHeader[] | import("mysql2").RowDataPacket[] | import("mysql2").RowDataPacket[][] | import("mysql2").OkPacket[] | [import("mysql2").RowDataPacket[], import("mysql2").ResultSetHeader];
        byHour: import("mysql2").ResultSetHeader[] | import("mysql2").RowDataPacket[] | import("mysql2").RowDataPacket[][] | import("mysql2").OkPacket[] | [import("mysql2").RowDataPacket[], import("mysql2").ResultSetHeader];
    }>;
}
