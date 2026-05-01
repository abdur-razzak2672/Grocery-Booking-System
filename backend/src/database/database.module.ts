import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { GroceryItem } from '../grocery/entities/grocery-item.entity';
import { Order } from '../orders/entities/order.entity';
import { OrderItem } from '../orders/entities/order-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, GroceryItem, Order, OrderItem]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
