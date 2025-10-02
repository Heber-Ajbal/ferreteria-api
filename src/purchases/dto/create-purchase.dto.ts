import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsDateString, IsInt, IsNumber, IsOptional, IsPositive, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class PurchaseItemDto {
  @ApiProperty() @IsInt() productId: number;
  @ApiProperty() @IsNumber() @IsPositive() qty: number;
  @ApiProperty() @IsNumber() @Min(0) unitCost: number;
  @ApiPropertyOptional({ example: 12 }) @IsNumber() @Min(0) @IsOptional() taxRate?: number;
}

export class CreatePurchaseDto {
  @ApiProperty() @IsInt() supplierId: number;
  @ApiPropertyOptional() @IsString() @IsOptional() invoiceNumber?: string;
  @ApiPropertyOptional() @IsDateString() @IsOptional() purchaseDate?: string; // YYYY-MM-DD
  @ApiProperty({ type: [PurchaseItemDto] }) @IsArray() @ValidateNested({ each: true }) @Type(() => PurchaseItemDto)
  items: PurchaseItemDto[];
}
