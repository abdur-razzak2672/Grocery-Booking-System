import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindManyOptions } from 'typeorm';
import { GroceryItem } from './entities/grocery-item.entity';
import { CreateGroceryItemDto } from './dto/create-grocery-item.dto';
import { UpdateGroceryItemDto } from './dto/update-grocery-item.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { GroceryQueryDto } from './dto/grocery-query.dto';

@Injectable()
export class GroceryService {
  constructor(
    @InjectRepository(GroceryItem)
    private groceryRepository: Repository<GroceryItem>,
  ) {}

  async findAll(query: GroceryQueryDto) {
    const {
      search,
      minPrice,
      maxPrice,
      isAvailable,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = query;

    const qb = this.groceryRepository.createQueryBuilder('item');

    if (search) {
      qb.andWhere(
        '(item.name ILIKE :search OR item.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }
    if (minPrice !== undefined)
      qb.andWhere('item.price >= :minPrice', { minPrice });
    if (maxPrice !== undefined)
      qb.andWhere('item.price <= :maxPrice', { maxPrice });
    if (isAvailable !== undefined)
      qb.andWhere('item.isAvailable = :isAvailable', { isAvailable });

    const validSortFields = ['name', 'price', 'stock', 'createdAt'];
    const safeSortBy = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    qb.orderBy(`item.${safeSortBy}`, sortOrder as 'ASC' | 'DESC');

    const skip = (page - 1) * limit;
    qb.skip(skip).take(limit);

    const [items, total] = await qb.getManyAndCount();

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<GroceryItem> {
    const item = await this.groceryRepository.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Grocery item not found');
    return item;
  }

  async create(createDto: CreateGroceryItemDto): Promise<GroceryItem> {
    const item = this.groceryRepository.create(createDto);
    return this.groceryRepository.save(item);
  }

  async update(
    id: string,
    updateDto: UpdateGroceryItemDto,
  ): Promise<GroceryItem> {
    const item = await this.findOne(id);
    Object.assign(item, updateDto);
    return this.groceryRepository.save(item);
  }

  async remove(id: string): Promise<{ message: string }> {
    const item = await this.findOne(id);
    await this.groceryRepository.remove(item);
    return { message: 'Grocery item removed successfully' };
  }

  async updateInventory(
    id: string,
    dto: UpdateInventoryDto,
  ): Promise<GroceryItem> {
    const item = await this.findOne(id);
    if (dto.quantity < 0)
      throw new BadRequestException('Stock cannot be negative');
    item.stock = dto.quantity;
    item.isAvailable = item.stock > 0;
    return this.groceryRepository.save(item);
  }

  async adjustInventory(
    id: string,
    adjustment: number,
  ): Promise<GroceryItem> {
    const item = await this.findOne(id);
    const newStock = item.stock + adjustment;
    if (newStock < 0)
      throw new BadRequestException('Insufficient stock');
    item.stock = newStock;
    item.isAvailable = item.stock > 0;
    return this.groceryRepository.save(item);
  }

  async getStats() {
    const total = await this.groceryRepository.count();
    const available = await this.groceryRepository.count({
      where: { isAvailable: true },
    });
    const lowStock = await this.groceryRepository
      .createQueryBuilder('item')
      .where('item.stock > 0 AND item.stock <= 10')
      .getCount();
    const outOfStock = await this.groceryRepository.count({
      where: { stock: 0 },
    });

    return { total, available, lowStock, outOfStock };
  }

  async getFeatured(): Promise<GroceryItem[]> {
    return this.groceryRepository.find({
      where: { isFeatured: true, isAvailable: true },
      take: 8,
    });
  }
}
