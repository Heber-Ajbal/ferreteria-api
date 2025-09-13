// src/catalog/products.controller.ts
import {
  Controller, Get, Post, Put, Delete, Param, Body, Query, ParseIntPipe,
  UseInterceptors, UploadedFile, BadRequestException, Req
} from '@nestjs/common';
import { ApiTags, ApiQuery, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CatalogService } from './catalog.service';
import { PaginationDto } from './dto/pagination.dto';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { productImageStorage, imageFileFilter } from '../files/product-image.storage';
import type { Request as ExpressRequest } from 'express'; // 👈 type-only import

@ApiTags('catalog/products')
@Controller('catalog/products')
export class ProductsController {
  constructor(private readonly service: CatalogService) {}

  @Get()
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'categoryId', required: false, type: Number })
  @ApiQuery({ name: 'brandId', required: false, type: Number })
  list(@Query() q: PaginationDto) {
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
      image_url: dto.image_url ?? null,
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
      image_url: dto.image_url ?? null,
    });
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.deleteProduct(id);
  }

  // ===== Subir imagen y setear image_url =====
  @Post(':id/image')
  @UseInterceptors(FileInterceptor('file', {
    storage: productImageStorage,
    fileFilter: imageFileFilter,
    limits: { fileSize: 2 * 1024 * 1024 },
  }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  async uploadImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: ExpressRequest, // 👈 ahora válido con isolatedModules
  ) {
    if (!file) throw new BadRequestException('Archivo requerido');

    // Construye base sin req.get()/protocol (evita errores de tipos)
    const xfProto = req.headers['x-forwarded-proto'];
    const proto =
      (Array.isArray(xfProto) ? xfProto[0] : xfProto) ||
      (req.secure ? 'https' : 'http');

    const xfHost = req.headers['x-forwarded-host'];
    const host =
      (Array.isArray(xfHost) ? xfHost[0] : xfHost) ||
      req.headers.host ||
      'localhost:3000';

    const base = `${proto}://${host}`;
    const url = `${base}/uploads/products/${file.filename}`;

    const updated = await this.service.updateProduct(id, { image_url: url });
    return { image_url: updated.image_url };
  }

  // ===== Quitar imagen (deja image_url=null) =====
  @Delete(':id/image')
  async clearImage(@Param('id', ParseIntPipe) id: number) {
    await this.service.updateProduct(id, { image_url: null });
    return { ok: true };
  }
}
