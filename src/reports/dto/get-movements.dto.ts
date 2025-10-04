import { Transform } from 'class-transformer';
import { IsOptional, IsInt, Min, IsDateString, Matches } from 'class-validator';

export class GetMovementsDto {
  /** YYYY-MM-DD */
  @Matches(/^\d{4}-\d{2}-\d{2}$/,{ message:'from debe ser YYYY-MM-DD' })
  from!: string;

  /** YYYY-MM-DD */
  @Matches(/^\d{4}-\d{2}-\d{2}$/,{ message:'to debe ser YYYY-MM-DD' })
  to!: string;

  @IsOptional()
  @Transform(({value}) => value === '' || value == null ? undefined : Number(value))
  @IsInt()
  @Min(1)
  productId?: number;
}
