import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty() @IsString() @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional() @IsString() @IsOptional()
  description?: string;
}

export class UpdateCategoryDto {
  @ApiPropertyOptional() @IsString() @IsOptional()
  name?: string;

  @ApiPropertyOptional() @IsString() @IsOptional()
  description?: string;
}
