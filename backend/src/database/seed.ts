import { DataSource } from 'typeorm';
import { User, UserRole } from '../users/entities/user.entity';
import { GroceryItem, GroceryCategory } from '../grocery/entities/grocery-item.entity';
import { Order } from '../orders/entities/order.entity';
import { OrderItem } from '../orders/entities/order-item.entity';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

const seed = async () => {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'razzak72',
    database: process.env.DB_NAME || 'grocery_management',
    entities: [User, GroceryItem, Order, OrderItem],
    synchronize: true,
  });

  await dataSource.initialize();

  const userRepository = dataSource.getRepository(User);
  const groceryRepository = dataSource.getRepository(GroceryItem);

  // Seed Admin
  const adminEmail = 'razzak172758@gmail.com';
  const existingAdmin = await userRepository.findOne({ where: { email: adminEmail } });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('Admin1234', 10);
    const admin = userRepository.create({
      email: adminEmail,
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      isActive: true,
    });
    await userRepository.save(admin);
    console.log('✅ Admin user created');
  } else {
    console.log('ℹ️ Admin user already exists');
  }

  // Seed Grocery Items
  const itemsCount = await groceryRepository.count();
  if (itemsCount === 0) {
    const items = [
      {
        name: 'Organic Milk',
        description: 'Fresh organic whole milk from local dairy farms',
        price: 5.50,
        stock: 50,
        category: GroceryCategory.DAIRY,
        unit: '1L',
        isFeatured: true,
      },
      {
        name: 'Fresh Apples',
        description: 'Crisp and sweet gala apples',
        price: 2.99,
        stock: 100,
        category: GroceryCategory.FRUITS,
        unit: '1kg',
        isFeatured: true,
      },
      {
        name: 'Brown Bread',
        description: 'Whole wheat freshly baked brown bread',
        price: 3.20,
        stock: 30,
        category: GroceryCategory.BAKERY,
        unit: '400g',
      },
      {
        name: 'Orange Juice',
        description: '100% pure squeezed orange juice',
        price: 4.50,
        stock: 40,
        category: GroceryCategory.BEVERAGES,
        unit: '500ml',
      },
      {
        name: 'Basmati Rice',
        description: 'Premium quality long grain basmati rice',
        price: 15.00,
        stock: 20,
        category: GroceryCategory.GRAINS,
        unit: '5kg',
      },
    ];

    await groceryRepository.save(items);
    console.log('✅ Grocery items seeded');
  } else {
    console.log('ℹ️ Grocery items already seeded');
  }

  await dataSource.destroy();
};

seed().catch((err) => {
  console.error('❌ Error seeding database:', err);
  process.exit(1);
});
