import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { DbModule } from '../prisma/db.module'; // 👈

@Module({
  imports: [PrismaModule,DbModule],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule {}

