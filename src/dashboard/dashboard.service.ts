import { Injectable } from '@nestjs/common';
import { DbProvider } from '../prisma/db.provider';

@Injectable()
export class DashboardService {
  constructor(private readonly db: DbProvider) {}

  async getDashboard(from: Date, to: Date) {
    const sets = await this.db.callDashboardSP(from, to);
    const [
      summary = [],
      daily = [],
      topProducts = [],
      byCategory = [],
      byPayment = [],
      byChannel = [],
      byHour = [],
    ] = sets;

    return {
      summary: summary[0] ?? {
        orders: 0,
        revenue: 0,
        gross_sales: 0,
        discounts: 0,
        taxes: 0,
        avg_order_value: 0,
      },
      daily,
      topProducts,
      byCategory,
      byPayment,
      byChannel,
      byHour,
    };
  }
}
