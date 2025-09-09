import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCartDto {
  @ApiPropertyOptional({ default: 12 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  taxRate?: number = 12;
}
