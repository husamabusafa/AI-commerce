import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsResolver, CategoriesResolver } from './products.resolver';

@Module({
  providers: [ProductsResolver, CategoriesResolver, ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
