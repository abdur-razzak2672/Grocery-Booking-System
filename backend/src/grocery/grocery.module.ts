import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroceryController } from './grocery.controller';
import { GroceryService } from './grocery.service';
import { GroceryItem } from './entities/grocery-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GroceryItem])],
  controllers: [GroceryController],
  providers: [GroceryService],
  exports: [GroceryService],
})
export class GroceryModule {}
