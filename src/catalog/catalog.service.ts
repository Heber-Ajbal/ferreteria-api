import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service'; 
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService) {}
  

  // ---- helpers
  private pageQuery({ page = 1, pageSize = 20 }: PaginationDto) {
    const take = pageSize;
    const skip = (page - 1) * pageSize;
    return { take, skip };
  }

  // ========================= CATEGORIES =========================
  async listCategories(q: PaginationDto) {
    const { skip, take } = this.pageQuery(q);
    const where = q.search
      ? { OR: [{ name: { contains: q.search } }, { description: { contains: q.search } }] }
      : undefined;
    const [data, total] = await Promise.all([
      this.prisma.categories.findMany({ where, skip, take, orderBy: { name: 'asc' } }),
      this.prisma.categories.count({ where }),
    ]);
    return { data, meta: { page: q.page ?? 1, pageSize: q.pageSize ?? 20, total } };
  }
  getCategory(id: number) {
    return this.prisma.categories.findUnique({ where: { category_id: id } });
  }
  createCategory(data: { name: string; description?: string }) {
    return this.prisma.categories.create({ data: { name: data.name, description: data.description ?? null } });
  }
  updateCategory(id: number, data: Partial<{ name: string; description?: string }>) {
    return this.prisma.categories.update({ where: { category_id: id }, data });
  }
  deleteCategory(id: number) {
    return this.prisma.categories.delete({ where: { category_id: id } });
  }

  // ========================= BRANDS =========================
  async listBrands(q: PaginationDto) {
    const { skip, take } = this.pageQuery(q);
    const where = q.search ? { name: { contains: q.search } } : undefined;
    const [data, total] = await Promise.all([
      this.prisma.brands.findMany({ where, skip, take, orderBy: { name: 'asc' } }),
      this.prisma.brands.count({ where }),
    ]);
    return { data, meta: { page: q.page ?? 1, pageSize: q.pageSize ?? 20, total } };
  }
  getBrand(id: number) {
    return this.prisma.brands.findUnique({ where: { brand_id: id } });
  }
  createBrand(data: { name: string }) {
    return this.prisma.brands.create({ data });
  }
  updateBrand(id: number, data: Partial<{ name: string }>) {
    return this.prisma.brands.update({ where: { brand_id: id }, data });
  }
  deleteBrand(id: number) {
    return this.prisma.brands.delete({ where: { brand_id: id } });
  }

  // ========================= UNITS =========================
  async listUnits(q: PaginationDto) {
    const { skip, take } = this.pageQuery(q);
    const where = q.search ? { OR: [{ code: { contains: q.search } }, { name: { contains: q.search } }] } : undefined;
    const [data, total] = await Promise.all([
      this.prisma.units.findMany({ where, skip, take, orderBy: { code: 'asc' } }),
      this.prisma.units.count({ where }),
    ]);
    return { data, meta: { page: q.page ?? 1, pageSize: q.pageSize ?? 20, total } };
  }
  getUnit(id: number) {
    return this.prisma.units.findUnique({ where: { unit_id: id } });
  }
  createUnit(data: { code: string; name: string }) {
    return this.prisma.units.create({ data });
  }
  updateUnit(id: number, data: Partial<{ code: string; name: string }>) {
    return this.prisma.units.update({ where: { unit_id: id }, data });
  }
  deleteUnit(id: number) {
    return this.prisma.units.delete({ where: { unit_id: id } });
  }

  // ========================= PRODUCTS =========================
   async listProducts(q: PaginationDto & { categoryId?: number; brandId?: number }) {
    const { skip, take } = this.pageQuery(q);


    const where = {
      AND: [
        q.search
          ? {
              OR: [
                { name: { contains: q.search } },
                { sku: { contains: q.search } },
                { barcode: { contains: q.search } },
              ],
            }
          : {},
        q.categoryId ? { category_id: q.categoryId } : {},
        q.brandId ? { brand_id: q.brandId } : {},
      ],
    } as any;

    const [data, total] = await Promise.all([
      this.prisma.products.findMany({
        where,
        skip,
        take,
        orderBy: { product_id: 'desc' },
        include: { categories: true, brands: true, units: true },
      }),
      this.prisma.products.count({ where }),
    ]);

    return { data, meta: { page: q.page ?? 1, pageSize: q.pageSize ?? 20, total } };
  }

  getProduct(id: number) {
    return this.prisma.products.findUnique({
      where: { product_id: id },
      include: { categories: true, brands: true, units: true },
    });
  }

  createProduct(data: any) {
    return this.prisma.products.create({ data });
  }

  updateProduct(id: number, data: any) {
    return this.prisma.products.update({ where: { product_id: id }, data });
  }

  deleteProduct(id: number) {
    return this.prisma.products.delete({ where: { product_id: id } });
  }
}
