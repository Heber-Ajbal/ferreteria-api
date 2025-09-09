import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional() @IsString() @IsOptional()
  fullName?: string;

  @ApiPropertyOptional() @IsEmail() @IsOptional()
  email?: string;

  @ApiPropertyOptional() @IsString() @MinLength(6) @IsOptional()
  password?: string;

  @ApiPropertyOptional() @IsBoolean() @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ example: ['ADMIN','CASHIER'] }) @IsArray() @IsOptional()
  roles?: string[];
}
