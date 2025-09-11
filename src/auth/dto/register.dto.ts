import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;
}