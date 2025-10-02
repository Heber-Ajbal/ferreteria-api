import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboard;
    constructor(dashboard: DashboardService);
    getDashboard(from?: string, to?: string): Promise<{
        summary: any;
        daily: any[];
        topProducts: any[];
        byCategory: any[];
        byPayment: any[];
        byChannel: any[];
        byHour: any[];
    }>;
}
