import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsPositive,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GroceryCategory } from '../entities/grocery-item.entity';
import { Type } from 'class-transformer';

export class CreateGroceryItemDto {
  @ApiProperty({ example: 'Organic Apples' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Fresh organic apples from local farms' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 4.99 })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  price: number;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  stock: number;

  @ApiPropertyOptional({ example: 'https://example.com/apple.jpg' })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({ enum: GroceryCategory, example: GroceryCategory.FRUITS })
  @IsEnum(GroceryCategory)
  category: GroceryCategory;

  @ApiPropertyOptional({ example: 'kg' })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiPropertyOptional({ example: 3.99 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  discountPrice?: number;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}
