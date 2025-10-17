import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboard;
    constructor(dashboard: DashboardService);
    getDashboard(from?: string, to?: string): Promise<{
        summary: import("mysql2").OkPacket | import("mysql2").ResultSetHeader | import("mysql2").RowDataPacket | import("mysql2").RowDataPacket[];
        daily: import("mysql2").ResultSetHeader[] | import("mysql2").RowDataPacket[] | import("mysql2").RowDataPacket[][] | import("mysql2").OkPacket[] | [import("mysql2").RowDataPacket[], import("mysql2").ResultSetHeader];
        topProducts: import("mysql2").ResultSetHeader[] | import("mysql2").RowDataPacket[] | import("mysql2").RowDataPacket[][] | import("mysql2").OkPacket[] | [import("mysql2").RowDataPacket[], import("mysql2").ResultSetHeader];
        byCategory: import("mysql2").ResultSetHeader[] | import("mysql2").RowDataPacket[] | import("mysql2").RowDataPacket[][] | import("mysql2").OkPacket[] | [import("mysql2").RowDataPacket[], import("mysql2").ResultSetHeader];
        byPayment: import("mysql2").ResultSetHeader[] | import("mysql2").RowDataPacket[] | import("mysql2").RowDataPacket[][] | import("mysql2").OkPacket[] | [import("mysql2").RowDataPacket[], import("mysql2").ResultSetHeader];
        byChannel: import("mysql2").ResultSetHeader[] | import("mysql2").RowDataPacket[] | import("mysql2").RowDataPacket[][] | import("mysql2").OkPacket[] | [import("mysql2").RowDataPacket[], import("mysql2").ResultSetHeader];
        byHour: import("mysql2").ResultSetHeader[] | import("mysql2").RowDataPacket[] | import("mysql2").RowDataPacket[][] | import("mysql2").OkPacket[] | [import("mysql2").RowDataPacket[], import("mysql2").ResultSetHeader];
    }>;
}
