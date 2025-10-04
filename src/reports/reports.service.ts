import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaClient) {}

  async movements(params: { from: string; to: string; productId?: number }) {
    const { from, to, productId } = params;

    // Rango inclusivo de día: [from 00:00:00, to 23:59:59]
    const fromDT = `${from} 00:00:00`;
    const toDT   = `${to} 23:59:59`;

    const whereProduct = productId
      ? Prisma.sql` AND im.product_id = ${productId} `
      : Prisma.empty;

    const sql = Prisma.sql`
      SELECT
        im.movement_id,
        im.product_id,
        im.movement_type,
        im.reference_type,
        im.reference_id,
        CASE
          WHEN im.movement_type LIKE 'OUT_%' THEN -ABS(im.qty)
          ELSE ABS(im.qty)
        END AS qty_signed,
        im.unit_cost,
        im.unit_price,
        im.notes,
        im.created_at
      FROM inventory_movements im
      WHERE im.created_at BETWEEN ${fromDT} AND ${toDT}
      ${whereProduct}
      ORDER BY im.created_at ASC, im.movement_id ASC
    `;

    // Tipar el resultado mínimamente
    return this.prisma.$queryRaw<Array<{
      movement_id:number; product_id:number; movement_type:string;
      reference_type:string; reference_id:number; qty_signed:number;
      unit_cost: number|null; unit_price: number|null; notes: string|null;
      created_at: Date;
    }>>(sql);
  }
}
