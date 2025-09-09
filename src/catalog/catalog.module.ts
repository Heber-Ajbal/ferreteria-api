import { Module } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CategoriesController } from './categories.controller';
import { BrandsController } from './brands.controller';
import { UnitsController } from './units.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ProductsController } from './products.controller';

@Module({
  imports: [PrismaModule], 
  providers: [CatalogService],
  controllers: [CategoriesController, BrandsController, UnitsController, ProductsController]
})
export class CatalogModule {}
