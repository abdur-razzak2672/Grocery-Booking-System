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
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { GroceryService } from './grocery.service';
import { CreateGroceryItemDto } from './dto/create-grocery-item.dto';
import { UpdateGroceryItemDto } from './dto/update-grocery-item.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { GroceryQueryDto } from './dto/grocery-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('Grocery Items')
@Controller('grocery')
export class GroceryController {
  constructor(private readonly groceryService: GroceryService) {}

  // Public routes
  @Get()
  @ApiOperation({ summary: 'Get all grocery items (public)' })
  findAll(@Query() query: GroceryQueryDto) {
    return this.groceryService.findAll(query);
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured grocery items' })
  getFeatured() {
    return this.groceryService.getFeatured();
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all categories' })
  getCategories() {
    return this.groceryService.getCategories();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get grocery item by ID' })
  findOne(@Param('id') id: string) {
    return this.groceryService.findOne(id);
  }

  // Admin routes
  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create grocery item (Admin only)' })
  create(@Body() createDto: CreateGroceryItemDto) {
    return this.groceryService.create(createDto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update grocery item (Admin only)' })
  update(@Param('id') id: string, @Body() updateDto: UpdateGroceryItemDto) {
    return this.groceryService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete grocery item (Admin only)' })
  remove(@Param('id') id: string) {
    return this.groceryService.remove(id);
  }

  @Put(':id/inventory')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update inventory level (Admin only)' })
  updateInventory(@Param('id') id: string, @Body() dto: UpdateInventoryDto) {
    return this.groceryService.updateInventory(id, dto);
  }

  @Get('admin/stats')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get grocery statistics (Admin only)' })
  getStats() {
    return this.groceryService.getStats();
  }
}
