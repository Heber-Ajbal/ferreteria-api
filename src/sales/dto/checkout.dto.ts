import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CheckoutDto {
  @ApiPropertyOptional({ example: 'CASH' })
  @IsString()
  @IsOptional()
  paymentMethodCode?: string;
}
