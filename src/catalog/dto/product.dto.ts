import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty() @IsString() @MaxLength(40)
  sku!: string;

  @ApiProperty() @IsString() @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional() @Type(() => Number) @IsInt() @IsOptional()
  categoryId?: number;

  @ApiPropertyOptional() @Type(() => Number) @IsInt() @IsOptional()
  brandId?: number;

  @ApiProperty() @Type(() => Number) @IsInt()
  unitId!: number;

  @ApiPropertyOptional() @IsString() @MaxLength(60) @IsOptional()
  barcode?: string;

  @ApiPropertyOptional() @IsString() @IsOptional()
  description?: string;

  @ApiProperty({ default: 0 }) @Type(() => Number) @IsNumber() @Min(0)
  costPrice!: number;

  @ApiProperty({ default: 0 }) @Type(() => Number) @IsNumber() @Min(0)
  salePrice!: number;

  @ApiProperty({ default: true }) @IsBoolean()
  isTaxable!: boolean;

  @ApiProperty({ default: 0 }) @Type(() => Number) @IsNumber() @Min(0)
  minStock!: number;
  
  @ApiPropertyOptional({ description: 'URL pública de la imagen principal' })
  @IsOptional()
  @IsString()
  image_url?: string;
}

export class UpdateProductDto {
  @ApiPropertyOptional() @IsString() @MaxLength(40) @IsOptional()
  sku?: string;

  @ApiPropertyOptional() @IsString() @IsOptional()
  name?: string;

  @ApiPropertyOptional() @Type(() => Number) @IsInt() @IsOptional()
  categoryId?: number;

  @ApiPropertyOptional() @Type(() => Number) @IsInt() @IsOptional()
  brandId?: number;

  @ApiPropertyOptional() @Type(() => Number) @IsInt() @IsOptional()
  unitId?: number;

  @ApiPropertyOptional() @IsString() @MaxLength(60) @IsOptional()
  barcode?: string;

  @ApiPropertyOptional() @IsString() @IsOptional()
  description?: string;

  @ApiPropertyOptional() @Type(() => Number) @IsNumber() @Min(0) @IsOptional()
  costPrice?: number;

  @ApiPropertyOptional() @Type(() => Number) @IsNumber() @Min(0) @IsOptional()
  salePrice?: number;

  @ApiPropertyOptional() @IsBoolean() @IsOptional()
  isTaxable?: boolean;

  @ApiPropertyOptional() @Type(() => Number) @IsNumber() @Min(0) @IsOptional()
  minStock?: number;

  @ApiPropertyOptional({ description: 'URL pública de la imagen principal' })
  @IsOptional()
  @IsString()
  image_url?: string;
}
