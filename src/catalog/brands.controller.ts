import { Controller, Get, Post, Put, Delete, Param, Body, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CatalogService } from './catalog.service';
import { PaginationDto } from './dto/pagination.dto';
import { CreateBrandDto, UpdateBrandDto } from './dto/brand.dto';

@ApiTags('catalog/brands')
@Controller('catalog/brands')
export class BrandsController {
  constructor(private readonly service: CatalogService) {}

  @Get()
  list(@Query() q: PaginationDto) {
    return this.service.listBrands(q);
  }

  @Get(':id')
  get(@Param('id', ParseIntPipe) id: number) {
    return this.service.getBrand(id);
  }

  @Post()
  create(@Body() dto: CreateBrandDto) {
    return this.service.createBrand(dto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBrandDto) {
    return this.service.updateBrand(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.deleteBrand(id);
  }
}
