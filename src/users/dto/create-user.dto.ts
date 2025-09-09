import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty() @IsString() @IsNotEmpty()
  fullName!: string;

  @ApiProperty() @IsEmail()
  email!: string;

  @ApiProperty() @IsString() @MinLength(6)
  password!: string;

  @ApiPropertyOptional({ default: true }) @IsBoolean() @IsOptional()
  isActive?: boolean = true;

  @ApiProperty({ example: ['ADMIN'] }) @IsArray()
  roles!: string[];
}
