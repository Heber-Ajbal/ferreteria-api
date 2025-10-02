import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PurchasesService } from './purchases.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { ReceivePurchaseDto } from './dto/receive-purchase.dto';

// Usa tus guards reales
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('purchases')
@ApiBearerAuth()
@Controller('purchases')
export class PurchasesController {
  constructor(private service: PurchasesService) {}

  // Solo ADMIN o INVENTORY
  @Post()
  create(@Req() req: any, @Body() dto: CreatePurchaseDto) {
    return this.service.create(dto, 1);
  }

  @Post(':id/receive')
  receive(@Req() req: any, @Param('id', ParseIntPipe) id: number, @Body() dto: ReceivePurchaseDto) {
    const uid = dto.userId ?? req.user.userId;
    return this.service.receive(id, uid);
  }

  // Consultar stock
  @Get('stock')
  stock() {
    return this.service.stockList();
  }
}
