import { Resolver, Query, Mutation, Args, ID, ResolveField, Parent } from '@nestjs/graphql';
import { ProductsService } from './products.service';
import { Product, Category, CategoryCount } from './entities/product.entity';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { CreateCategoryInput } from './dto/create-category.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Mutation(() => Product)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  createProduct(@Args('createProductInput') createProductInput: CreateProductInput) {
    return this.productsService.createProduct(createProductInput);
  }

  @Query(() => [Product], { name: 'products' })
  findAllProducts(
    @Args('categoryId', { type: () => ID, nullable: true }) categoryId?: string,
    @Args('featured', { nullable: true }) featured?: boolean,
    @Args('active', { nullable: true }) active?: boolean,
    @Args('search', { nullable: true }) search?: string,
  ) {
    return this.productsService.findAllProducts(categoryId, featured, active, search);
  }

  @Query(() => Product, { name: 'product' })
  findOneProduct(@Args('id', { type: () => ID }) id: string) {
    return this.productsService.findOneProduct(id);
  }

  @Mutation(() => Product)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  updateProduct(@Args('updateProductInput') updateProductInput: UpdateProductInput) {
    return this.productsService.updateProduct(updateProductInput.id, updateProductInput);
  }

  @Mutation(() => Product)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  removeProduct(@Args('id', { type: () => ID }) id: string) {
    return this.productsService.removeProduct(id);
  }

  @Mutation(() => Product)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  updateStock(
    @Args('id', { type: () => ID }) id: string,
    @Args('quantity') quantity: number,
  ) {
    return this.productsService.updateStock(id, quantity);
  }
}

@Resolver(() => Category)
export class CategoriesResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Mutation(() => Category)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  createCategory(@Args('createCategoryInput') createCategoryInput: CreateCategoryInput) {
    return this.productsService.createCategory(createCategoryInput);
  }

  @Query(() => [Category], { name: 'categories' })
  findAllCategories() {
    return this.productsService.findAllCategories();
  }

  @Query(() => Category, { name: 'category' })
  findOneCategory(@Args('id', { type: () => ID }) id: string) {
    return this.productsService.findOneCategory(id);
  }

  @Mutation(() => Category)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  removeCategory(@Args('id', { type: () => ID }) id: string) {
    return this.productsService.removeCategory(id);
  }

  @ResolveField('_count', () => CategoryCount)
  async getCount(@Parent() category: Category) {
    return this.productsService.getCategoryProductCount(category.id);
  }
}
