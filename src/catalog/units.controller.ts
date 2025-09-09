import { Controller, Get, Post, Put, Delete, Param, Body, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CatalogService } from './catalog.service';
import { PaginationDto } from './dto/pagination.dto';
import { CreateUnitDto, UpdateUnitDto } from './dto/unit.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('catalog/units')
@Controller('catalog/units')
export class UnitsController {
  constructor(private readonly service: CatalogService) {}

  @Get()
  list(@Query() q: PaginationDto) {
    return this.service.listUnits(q);
  }

  @Get(':id')
  get(@Param('id', ParseIntPipe) id: number) {
    return this.service.getUnit(id);
  }

  @Post()
  create(@Body() dto: CreateUnitDto) {
    return this.service.createUnit(dto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUnitDto) {
    return this.service.updateUnit(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.deleteUnit(id);
  }
}
