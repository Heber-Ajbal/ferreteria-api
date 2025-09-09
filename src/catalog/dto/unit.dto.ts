import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateUnitDto {
  @ApiProperty() @IsString() @MaxLength(10)
  code!: string;

  @ApiProperty() @IsString() @IsNotEmpty()
  name!: string;
}

export class UpdateUnitDto {
  @ApiPropertyOptional() @IsString() @MaxLength(10)
  code?: string;

  @ApiPropertyOptional() @IsString()
  name?: string;
}
