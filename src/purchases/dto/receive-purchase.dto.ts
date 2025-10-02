// src/purchases/dto/receive-purchase.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class ReceivePurchaseDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)   // 👈 convierte "1" => 1
  @IsInt()
  userId?: number;
}
