import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SalesService } from './sales.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { AddItemDto } from './dto/add-item.dto';
import { SetItemDto } from './dto/set-item.dto';
import { CheckoutDto } from './dto/checkout.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('sales')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('sales')
export class SalesController {
  constructor(private readonly sales: SalesService) {}

  // Crea o devuelve el carrito del usuario autenticado
  @Roles('CLIENT', 'ADMIN') // permite que admin pruebe también
  @Post('cart')
  createOrGetCart(@Req() req: any, @Body() dto: CreateCartDto) {
    return this.sales.createOrGetCart(req.user.userId, dto);
  }

  // Obtiene el carrito vigente
  @Roles('CLIENT', 'ADMIN')
  @Get('cart')
  getMyCart(@Req() req: any) {
    return this.sales.getMyCart(req.user.userId);
  }

  // Agrega o suma un ítem
  @Roles('CLIENT', 'ADMIN')
  @Post('cart/items')
  addItem(@Req() req: any, @Body() dto: AddItemDto) {
    return this.sales.addItem(req.user.userId, dto);
  }

  // Fija cantidad (0 elimina)
  @Roles('CLIENT', 'ADMIN')
  @Put('cart/items')
  setItem(@Req() req: any, @Body() dto: SetItemDto) {
    return this.sales.setItem(req.user.userId, dto);
  }

  // Elimina ítem
  @Roles('CLIENT', 'ADMIN')
  @Delete('cart/items/:productId')
  removeItem(@Req() req: any, @Param('productId', ParseIntPipe) productId: number) {
    return this.sales.removeItem(req.user.userId, productId);
  }

  // Checkout
  @Roles('CLIENT', 'ADMIN')
  @Post('cart/checkout')
  checkout(@Req() req: any, @Body() dto: CheckoutDto) {
    return this.sales.checkout(req.user.userId, dto);
  }
}
