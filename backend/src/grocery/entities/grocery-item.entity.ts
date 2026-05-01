import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { OrderItem } from '../../orders/entities/order-item.entity';

export enum GroceryCategory {
  FRUITS = 'Fruits & Vegetables',
  DAIRY = 'Dairy & Eggs',
  MEAT = 'Meat & Seafood',
  BAKERY = 'Bakery',
  BEVERAGES = 'Beverages',
  SNACKS = 'Snacks & Sweets',
  GRAINS = 'Grains & Cereals',
  FROZEN = 'Frozen Foods',
  HOUSEHOLD = 'Household',
  PERSONAL = 'Personal Care',
  ORGANIC = 'Organic',
}

@Entity('grocery_items')
export class GroceryItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ nullable: true })
  image: string;

  @Column({
    type: 'enum',
    enum: GroceryCategory,
    default: GroceryCategory.FRUITS,
  })
  category: GroceryCategory;

  @Column({ default: true })
  isAvailable: boolean;

  @Column({ nullable: true })
  unit: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  discountPrice: number;

  @Column({ default: false })
  isFeatured: boolean;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.groceryItem)
  orderItems: OrderItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
