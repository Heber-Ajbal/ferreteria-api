import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class SetItemDto {
  @ApiProperty() @Type(() => Number) @IsInt() @Min(1)
  productId!: number;

  // nota: qty = 0 elimina el ítem
  @ApiProperty({ default: 1 }) @Type(() => Number) @IsNumber() @Min(0)
  qty!: number;
}
