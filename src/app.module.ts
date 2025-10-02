// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { CatalogModule } from './catalog/catalog.module';
import { HealthController } from './health/health.controller';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SalesModule } from './sales/sales.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { DashboardModule } from './dashboard/dashboard.module';
import { PurchasesModule } from './purchases/purchases.module';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // 👇👇 ¡Esto sirve los archivos!
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    PrismaModule,
    HealthModule,
    CatalogModule,
    UsersModule,
    AuthModule,
    SalesModule,
    DashboardModule,
    PurchasesModule
  ],
  controllers: [HealthController],
})
export class AppModule {}
