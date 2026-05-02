import { IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateInventoryDto {
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  quantity: number;
}
