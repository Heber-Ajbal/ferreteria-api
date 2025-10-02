import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

// Reemplaza estos por tus guards/decorators reales
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('admin/dashboard')
@ApiBearerAuth()
export class DashboardController {
  constructor(private readonly dashboard: DashboardService) {}

  @Get()
  async getDashboard(@Query('from') from?: string, @Query('to') to?: string) {
    const dTo = to ? new Date(to) : new Date();
    const dFrom = from ? new Date(from) : new Date(dTo.getTime() - 30 * 24 * 3600 * 1000);
    return this.dashboard.getDashboard(dFrom, dTo);
  }
}
