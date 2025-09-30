import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { CreateCategoryInput } from './dto/create-category.input';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async createProduct(createProductInput: CreateProductInput) {
    return this.prisma.product.create({
      data: createProductInput,
      include: {
        category: true,
      },
    });
  }

  async findAllProducts(
    categoryId?: string,
    featured?: boolean,
    active?: boolean,
    search?: string,
  ) {
    const where: any = {};

    if (categoryId) where.categoryId = categoryId;
    if (featured !== undefined) where.featured = featured;
    if (active !== undefined) where.active = active;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { nameEn: { contains: search, mode: 'insensitive' } },
        { nameAr: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.product.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneProduct(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async updateProduct(id: string, updateProductInput: UpdateProductInput) {
    await this.findOneProduct(id);

    const updateData: any = { ...updateProductInput };
    delete updateData.id;

    return this.prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
      },
    });
  }

  async removeProduct(id: string) {
    await this.findOneProduct(id);

    return this.prisma.product.delete({
      where: { id },
      include: {
        category: true,
      },
    });
  }

  async updateStock(id: string, quantity: number) {
    const product = await this.findOneProduct(id);
    
    return this.prisma.product.update({
      where: { id },
      data: {
        stock: product.stock + quantity,
      },
      include: {
        category: true,
      },
    });
  }

  // Categories
  async createCategory(createCategoryInput: CreateCategoryInput) {
    return this.prisma.category.create({
      data: createCategoryInput,
    });
  }

  async findAllCategories() {
    return this.prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOneCategory(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async removeCategory(id: string) {
    await this.findOneCategory(id);

    // First, set all products in this category to null (uncategorized)
    await this.prisma.product.updateMany({
      where: { categoryId: id },
      data: { categoryId: null },
    });

    // Then delete the category
    return this.prisma.category.delete({
      where: { id },
    });
  }

  async getCategoryProductCount(categoryId: string) {
    const count = await this.prisma.product.count({
      where: { categoryId },
    });
    return { products: count };
  }
}
