import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { DbProvider } from '../prisma/db.provider';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService, DbProvider],
  exports: [DashboardService],
})
export class DashboardModule {}
