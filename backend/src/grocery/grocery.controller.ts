import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Put,
} from '@nestjs/common';
import { GroceryService } from './grocery.service';
import { CreateGroceryItemDto } from './dto/create-grocery-item.dto';
import { UpdateGroceryItemDto } from './dto/update-grocery-item.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { GroceryQueryDto } from './dto/grocery-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('grocery')
export class GroceryController {
  constructor(private readonly groceryService: GroceryService) {}

  @Get()
  findAll(@Query() query: GroceryQueryDto) {
    return this.groceryService.findAll(query);
  }

  @Get('featured')
  getFeatured() {
    return this.groceryService.getFeatured();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groceryService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createDto: CreateGroceryItemDto) {
    return this.groceryService.create(createDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateDto: UpdateGroceryItemDto) {
    return this.groceryService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.groceryService.remove(id);
  }

  @Put(':id/inventory')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  updateInventory(@Param('id') id: string, @Body() dto: UpdateInventoryDto) {
    return this.groceryService.updateInventory(id, dto);
  }

  @Get('admin/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  getStats() {
    return this.groceryService.getStats();
  }
}
