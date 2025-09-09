import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class AddItemDto {
  @ApiProperty() @Type(() => Number) @IsInt() @Min(1)
  productId!: number;

  @ApiProperty({ default: 1 }) @Type(() => Number) @IsNumber() @Min(0.001)
  qty!: number;
}
