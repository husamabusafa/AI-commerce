import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartItem } from './entities/cart.entity';
import { AddToCartInput } from './dto/add-to-cart.input';
import { UpdateCartItemInput } from './dto/update-cart-item.input';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Resolver(() => CartItem)
@UseGuards(JwtAuthGuard)
export class CartResolver {
  constructor(private readonly cartService: CartService) {}

  @Mutation(() => CartItem)
  addToCart(
    @CurrentUser() user: User,
    @Args('addToCartInput') addToCartInput: AddToCartInput,
  ) {
    return this.cartService.addToCart(user.id, addToCartInput);
  }

  @Query(() => [CartItem], { name: 'cart' })
  getCart(@CurrentUser() user: User) {
    return this.cartService.getCart(user.id);
  }

  @Mutation(() => CartItem)
  updateCartItem(
    @CurrentUser() user: User,
    @Args('updateCartItemInput') updateCartItemInput: UpdateCartItemInput,
  ) {
    return this.cartService.updateCartItem(user.id, updateCartItemInput);
  }

  @Mutation(() => CartItem)
  removeFromCart(
    @CurrentUser() user: User,
    @Args('cartItemId', { type: () => ID }) cartItemId: string,
  ) {
    return this.cartService.removeFromCart(user.id, cartItemId);
  }

  @Mutation(() => Boolean)
  clearCart(@CurrentUser() user: User) {
    return this.cartService.clearCart(user.id).then(() => true);
  }
}
