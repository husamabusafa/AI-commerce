import { PrismaClient, Role, OrderStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clean existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleaned existing data');

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Electronics',
        nameEn: 'Electronics',
        nameAr: 'إلكترونيات',
        description: 'Latest technology and electronic devices',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Furniture',
        nameEn: 'Furniture',
        nameAr: 'أثاث',
        description: 'Home and office furniture',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Kitchen',
        nameEn: 'Kitchen',
        nameAr: 'مطبخ',
        description: 'Kitchen appliances and accessories',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Fashion',
        nameEn: 'Fashion',
        nameAr: 'أزياء',
        description: 'Clothing and fashion accessories',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Sports',
        nameEn: 'Sports',
        nameAr: 'رياضة',
        description: 'Sports and fitness equipment',
      },
    }),
  ]);

  console.log('📁 Created categories');

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 12);
  
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@ecommerce.com',
      password: hashedPassword,
      name: 'Admin User',
      role: Role.ADMIN,
      avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
  });

  const clientUser1 = await prisma.user.create({
    data: {
      email: 'john@example.com',
      password: hashedPassword,
      name: 'John Smith',
      role: Role.CLIENT,
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
  });

  const clientUser2 = await prisma.user.create({
    data: {
      email: 'ahmed@example.com',
      password: hashedPassword,
      name: 'أحمد محمد العلي',
      nameEn: 'Ahmed Mohammed Al-Ali',
      role: Role.CLIENT,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format',
    },
  });

  console.log('👥 Created users');

  // Create products
  const products = await Promise.all([
    // Electronics
    prisma.product.create({
      data: {
        name: 'Premium Wireless Headphones',
        nameEn: 'Premium Wireless Headphones',
        nameAr: 'سماعات لاسلكية متميزة',
        price: 199.99,
        description: 'High-quality wireless headphones with noise cancellation and premium sound quality.',
        descriptionEn: 'High-quality wireless headphones with noise cancellation and premium sound quality.',
        descriptionAr: 'سماعات لاسلكية عالية الجودة مع إلغاء الضوضاء وجودة صوت متميزة.',
        image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
        images: [
          'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
          'https://images.pexels.com/photos/205926/pexels-photo-205926.jpeg?auto=compress&cs=tinysrgb&w=400'
        ],
        stock: 15,
        featured: true,
        categoryId: categories[0].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Smart Fitness Watch',
        nameEn: 'Smart Fitness Watch',
        nameAr: 'ساعة ذكية للياقة البدنية',
        price: 299.99,
        description: 'Advanced fitness tracking with heart rate monitoring and GPS functionality.',
        descriptionEn: 'Advanced fitness tracking with heart rate monitoring and GPS functionality.',
        descriptionAr: 'تتبع متقدم للياقة البدنية مع مراقبة معدل ضربات القلب ووظائف GPS.',
        image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400',
        images: ['https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400'],
        stock: 22,
        featured: true,
        categoryId: categories[0].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Smartphone 256GB',
        nameEn: 'Smartphone 256GB',
        nameAr: 'هاتف ذكي 256 جيجابايت',
        price: 899.99,
        description: 'Latest smartphone with advanced camera system and high-performance processor.',
        descriptionEn: 'Latest smartphone with advanced camera system and high-performance processor.',
        descriptionAr: 'أحدث هاتف ذكي مع نظام كاميرا متقدم ومعالج عالي الأداء.',
        image: 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=400',
        images: ['https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=400'],
        stock: 8,
        featured: false,
        categoryId: categories[0].id,
      },
    }),
    
    // Furniture
    prisma.product.create({
      data: {
        name: 'Ergonomic Office Chair',
        nameEn: 'Ergonomic Office Chair',
        nameAr: 'كرسي مكتب مريح',
        price: 349.99,
        description: 'Comfortable and supportive office chair designed for long working hours.',
        descriptionEn: 'Comfortable and supportive office chair designed for long working hours.',
        descriptionAr: 'كرسي مكتب مريح وداعم مصمم لساعات العمل الطويلة.',
        image: 'https://images.pexels.com/photos/586020/pexels-photo-586020.jpeg?auto=compress&cs=tinysrgb&w=400',
        images: ['https://images.pexels.com/photos/586020/pexels-photo-586020.jpeg?auto=compress&cs=tinysrgb&w=400'],
        stock: 8,
        featured: false,
        categoryId: categories[1].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Modern Sofa Set',
        nameEn: 'Modern Sofa Set',
        nameAr: 'طقم أريكة عصري',
        price: 1299.99,
        description: 'Luxurious 3-piece sofa set with premium fabric and contemporary design.',
        descriptionEn: 'Luxurious 3-piece sofa set with premium fabric and contemporary design.',
        descriptionAr: 'طقم أريكة فاخر من 3 قطع بقماش متميز وتصميم عصري.',
        image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400',
        images: ['https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400'],
        stock: 3,
        featured: true,
        categoryId: categories[1].id,
      },
    }),
    
    // Kitchen
    prisma.product.create({
      data: {
        name: 'Premium Coffee Maker',
        nameEn: 'Premium Coffee Maker',
        nameAr: 'صانعة قهوة متميزة',
        price: 189.99,
        description: 'Professional-grade coffee maker with multiple brewing options and programmable settings.',
        descriptionEn: 'Professional-grade coffee maker with multiple brewing options and programmable settings.',
        descriptionAr: 'صانعة قهوة احترافية مع خيارات تحضير متعددة وإعدادات قابلة للبرمجة.',
        image: 'https://images.pexels.com/photos/324028/pexels-photo-324028.jpeg?auto=compress&cs=tinysrgb&w=400',
        images: ['https://images.pexels.com/photos/324028/pexels-photo-324028.jpeg?auto=compress&cs=tinysrgb&w=400'],
        stock: 12,
        featured: false,
        categoryId: categories[2].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Stainless Steel Cookware Set',
        nameEn: 'Stainless Steel Cookware Set',
        nameAr: 'طقم أواني طبخ من الستانلس ستيل',
        price: 249.99,
        description: '12-piece professional cookware set with non-stick coating and heat-resistant handles.',
        descriptionEn: '12-piece professional cookware set with non-stick coating and heat-resistant handles.',
        descriptionAr: 'طقم أواني طبخ احترافي من 12 قطعة مع طلاء غير لاصق ومقابض مقاومة للحرارة.',
        image: 'https://images.pexels.com/photos/4226771/pexels-photo-4226771.jpeg?auto=compress&cs=tinysrgb&w=400',
        images: ['https://images.pexels.com/photos/4226771/pexels-photo-4226771.jpeg?auto=compress&cs=tinysrgb&w=400'],
        stock: 6,
        featured: true,
        categoryId: categories[2].id,
      },
    }),
    
    // Fashion
    prisma.product.create({
      data: {
        name: 'Luxury Leather Jacket',
        nameEn: 'Luxury Leather Jacket',
        nameAr: 'سترة جلدية فاخرة',
        price: 449.99,
        description: 'Premium genuine leather jacket with modern cut and exceptional craftsmanship.',
        descriptionEn: 'Premium genuine leather jacket with modern cut and exceptional craftsmanship.',
        descriptionAr: 'سترة جلدية أصلية فاخرة بقصة عصرية وحرفية استثنائية.',
        image: 'https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?auto=compress&cs=tinysrgb&w=400',
        images: ['https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?auto=compress&cs=tinysrgb&w=400'],
        stock: 10,
        featured: false,
        categoryId: categories[3].id,
      },
    }),
    
    // Sports
    prisma.product.create({
      data: {
        name: 'Professional Yoga Mat',
        nameEn: 'Professional Yoga Mat',
        nameAr: 'حصيرة يوغا احترافية',
        price: 89.99,
        description: 'Eco-friendly yoga mat with superior grip and cushioning for all yoga practices.',
        descriptionEn: 'Eco-friendly yoga mat with superior grip and cushioning for all yoga practices.',
        descriptionAr: 'حصيرة يوغا صديقة للبيئة مع قبضة فائقة وتوسيد لجميع ممارسات اليوغا.',
        image: 'https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=400',
        images: ['https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=400'],
        stock: 25,
        featured: false,
        categoryId: categories[4].id,
      },
    }),
  ]);

  console.log('📦 Created products');

  // Create some orders
  const order1 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-001',
      customerName: 'John Smith',
      customerEmail: 'john@example.com',
      shippingAddress: '123 Main St, New York, NY 10001',
      phoneNumber: '+1234567890',
      total: 199.99,
      status: OrderStatus.PROCESSING,
      userId: clientUser1.id,
      items: {
        create: [
          {
            productId: products[0].id, // Premium Wireless Headphones
            quantity: 1,
            price: 199.99,
          },
        ],
      },
    },
  });

  const order2 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-002',
      customerName: 'أحمد محمد العلي',
      customerEmail: 'ahmed@example.com',
      shippingAddress: 'الرياض، المملكة العربية السعودية',
      phoneNumber: '+966512345678',
      total: 599.98,
      status: OrderStatus.SHIPPED,
      userId: clientUser2.id,
      items: {
        create: [
          {
            productId: products[1].id, // Smart Fitness Watch
            quantity: 2,
            price: 299.99,
          },
        ],
      },
    },
  });

  const order3 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-003',
      customerName: 'Guest Customer',
      customerEmail: 'guest@example.com',
      shippingAddress: '456 Oak Ave, Los Angeles, CA 90210',
      total: 1549.98,
      status: OrderStatus.DELIVERED,
      items: {
        create: [
          {
            productId: products[4].id, // Modern Sofa Set
            quantity: 1,
            price: 1299.99,
          },
          {
            productId: products[6].id, // Stainless Steel Cookware Set
            quantity: 1,
            price: 249.99,
          },
        ],
      },
    },
  });

  console.log('🛍️ Created orders');

  // Add some items to user carts
  await prisma.cartItem.create({
    data: {
      userId: clientUser1.id,
      productId: products[2].id, // Smartphone 256GB
      quantity: 1,
    },
  });

  await prisma.cartItem.create({
    data: {
      userId: clientUser2.id,
      productId: products[5].id, // Premium Coffee Maker
      quantity: 2,
    },
  });

  console.log('🛒 Created cart items');

  console.log('✅ Database seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`- ${categories.length} categories created`);
  console.log(`- 3 users created (1 admin, 2 clients)`);
  console.log(`- ${products.length} products created`);
  console.log(`- 3 orders created`);
  console.log(`- 2 cart items created`);
  console.log('\n🔐 Login credentials:');
  console.log('Admin: admin@ecommerce.com / password123');
  console.log('Client 1: john@example.com / password123');
  console.log('Client 2: ahmed@example.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
