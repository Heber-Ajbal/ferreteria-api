import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBrandDto {
  @ApiProperty() @IsString() @IsNotEmpty()
  name!: string;
}

export class UpdateBrandDto {
  @ApiPropertyOptional() @IsString() @IsOptional()
  name?: string;
}
