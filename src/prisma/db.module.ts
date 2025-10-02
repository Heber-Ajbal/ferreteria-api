import { Module } from '@nestjs/common';
import { DbProvider } from './db.provider';

@Module({
  providers: [DbProvider],
  exports: [DbProvider], // 👈 para que otros módulos puedan inyectarlo
})
export class DbModule {}
