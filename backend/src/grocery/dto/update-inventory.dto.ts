import { IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdateInventoryDto {
  @ApiProperty({ example: 150, description: 'New stock quantity' })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  quantity: number;
}
