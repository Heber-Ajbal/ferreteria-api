import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { GetMovementsDto } from './dto/get-movements.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly service: ReportsService) {}

  @Get('movements')
  movements(@Query() q: GetMovementsDto) {
    return this.service.movements(q);
  }
}
