import { DbProvider } from '../prisma/db.provider';
export declare class DashboardService {
    private readonly db;
    constructor(db: DbProvider);
    getDashboard(from: Date, to: Date): Promise<{
        summary: any;
        daily: any[];
        topProducts: any[];
        byCategory: any[];
        byPayment: any[];
        byChannel: any[];
        byHour: any[];
    }>;
}
