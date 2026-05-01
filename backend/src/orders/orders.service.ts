import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { GroceryService } from '../grocery/grocery.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    private groceryService: GroceryService,
    private dataSource: DataSource,
  ) {}

  async create(user: User, createOrderDto: CreateOrderDto): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let totalAmount = 0;
      const orderItems: OrderItem[] = [];

      for (const itemDto of createOrderDto.items) {
        const groceryItem = await this.groceryService.findOne(itemDto.groceryItemId);

        if (groceryItem.stock < itemDto.quantity) {
          throw new BadRequestException(`Insufficient stock for ${groceryItem.name}`);
        }

        // Deduct stock within transaction
        groceryItem.stock -= itemDto.quantity;
        groceryItem.isAvailable = groceryItem.stock > 0;
        await queryRunner.manager.save(groceryItem);

        const unitPrice = groceryItem.discountPrice || groceryItem.price;
        const totalPrice = unitPrice * itemDto.quantity;
        totalAmount += totalPrice;

        const orderItem = this.orderItemsRepository.create({
          groceryItemId: groceryItem.id,
          quantity: itemDto.quantity,
          unitPrice,
          totalPrice,
        });
        orderItems.push(orderItem);
      }

      const order = this.ordersRepository.create({
        orderNumber: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        userId: user.id,
        items: orderItems,
        totalAmount,
        finalAmount: totalAmount, // Simplification: assuming no extra taxes/discounts for now
        deliveryAddress: createOrderDto.deliveryAddress,
        notes: createOrderDto.notes,
        status: OrderStatus.PENDING,
      });

      const savedOrder = await queryRunner.manager.save(order);
      await queryRunner.commitTransaction();
      return savedOrder;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Order[]> {
    return this.ordersRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findByUser(userId: string): Promise<Order[]> {
    return this.ordersRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['items', 'items.groceryItem', 'user'],
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    const order = await this.findOne(id);
    order.status = status;
    return this.ordersRepository.save(order);
  }
}
