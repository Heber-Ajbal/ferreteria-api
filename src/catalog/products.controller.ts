import { Controller, Get, Post, Put, Delete, Param, Body, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { CatalogService } from './catalog.service';
import { PaginationDto } from './dto/pagination.dto';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@ApiTags('catalog/products')
@Controller('catalog/products')
export class ProductsController {
  constructor(private readonly service: CatalogService) {}

  @Get()
  @ApiQuery({ name: 'categoryId', required: false, type: Number })
  @ApiQuery({ name: 'brandId', required: false, type: Number })
  list(@Query() q: PaginationDto & { categoryId?: number; brandId?: number }) {
    return this.service.listProducts(q);
  }

  @Get(':id')
  get(@Param('id', ParseIntPipe) id: number) {
    return this.service.getProduct(id);
  }

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.service.createProduct({
      sku: dto.sku,
      name: dto.name,
      category_id: dto.categoryId ?? null,
      brand_id: dto.brandId ?? null,
      unit_id: dto.unitId,
      barcode: dto.barcode ?? null,
      description: dto.description ?? null,
      cost_price: dto.costPrice,
      sale_price: dto.salePrice,
      is_taxable: dto.isTaxable ? 1 : 0,
      min_stock: dto.minStock,
    });
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
    return this.service.updateProduct(id, {
      sku: dto.sku,
      name: dto.name,
      category_id: dto.categoryId,
      brand_id: dto.brandId,
      unit_id: dto.unitId,
      barcode: dto.barcode,
      description: dto.description,
      cost_price: dto.costPrice,
      sale_price: dto.salePrice,
      is_taxable: dto.isTaxable,
      min_stock: dto.minStock,
    });
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.deleteProduct(id);
  }
}
