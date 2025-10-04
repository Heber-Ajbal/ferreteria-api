import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { PrismaClient } from '@prisma/client';
// Si ya tienes PrismaModule con PrismaService exportado, importa ese módulo en vez de proveer PrismaClient.

@Module({
  controllers: [ReportsController],
  providers: [ReportsService, PrismaClient],
})
export class ReportsModule {}
