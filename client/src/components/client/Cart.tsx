import React from 'react';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Button from '../shared/Button';
import Card from '../shared/Card';

export default function Cart() {
  const { state, dispatch } = useApp();

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { productId, quantity } });
  };

  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const subtotal = state.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax
  const shipping = subtotal > 50 ? 0 : 9.99; // Free shipping over $50
  const total = subtotal + tax + shipping;

  const proceedToCheckout = () => {
    dispatch({ type: 'SET_CLIENT_VIEW', payload: 'checkout' });
  };

  if (state.cart.length === 0) {
    return (
      <div className="p-6">
        <Card className="text-center py-12 animate-fadeIn">
          <ShoppingBag className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-gray-100 mb-2">Your cart is empty</h2>
          <p className="text-slate-600 dark:text-gray-400 mb-6">Looks like you haven't added any items to your cart yet.</p>
          <Button onClick={() => dispatch({ type: 'SET_CLIENT_VIEW', payload: 'shop' })}>
            Continue Shopping
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-gray-100 mb-2">Shopping Cart</h1>
        <p className="text-slate-600 dark:text-gray-400">{state.cart.length} item{state.cart.length !== 1 ? 's' : ''} in your cart</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4 animate-slideIn">
          {state.cart.map((item, index) => (
            <Card 
              key={item.product.id} 
              className="animate-slideUp"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center space-x-4">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 dark:text-gray-100">{item.product.name}</h3>
                  <p className="text-sm text-slate-600 dark:text-gray-400 mt-1">{item.product.category?.name || 'No Category'}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-lg font-bold text-slate-900 dark:text-gray-100">
                      ${item.product.price}
                    </span>
                    <span className="text-sm text-slate-500 dark:text-gray-400">each</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="p-1 border border-slate-300 dark:border-gray-600 rounded hover:bg-slate-50 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-110 text-slate-700 dark:text-gray-300"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center font-medium text-slate-900 dark:text-gray-100">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="p-1 border border-slate-300 dark:border-gray-600 rounded hover:bg-slate-50 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-110 text-slate-700 dark:text-gray-300"
                    disabled={item.quantity >= item.product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <div className="text-right">
                  <div className="text-lg font-bold text-slate-900 dark:text-gray-100">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-all duration-200 hover:scale-110 mt-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="space-y-4 animate-slideIn">
          <Card className="animate-scaleIn">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-gray-100 mb-4">Order Summary</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between text-slate-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-slate-600 dark:text-gray-400">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-slate-600 dark:text-gray-400">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>
              
              {shipping === 0 && (
                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-2 rounded-lg animate-pulse">
                  <Tag className="h-4 w-4" />
                  Free shipping applied!
                </div>
              )}
              
              <div className="border-t border-slate-200 dark:border-gray-700 pt-3">
                <div className="flex justify-between text-lg font-bold text-slate-900 dark:text-gray-100">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <Button className="w-full mt-6" onClick={proceedToCheckout}>
              Proceed to Checkout
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Card>

          {/* Promo Code */}
          <Card className="animate-scaleIn">
            <h4 className="font-medium text-slate-900 dark:text-gray-100 mb-3">Promo Code</h4>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Enter code"
                className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-slate-900 dark:text-gray-100 placeholder-slate-400 dark:placeholder-gray-500"
              />
              <Button variant="outline" size="sm">
                Apply
              </Button>
            </div>
          </Card>

          {/* Continue Shopping */}
          <Button
            variant="outline"
            className="w-full"
            onClick={() => dispatch({ type: 'SET_CLIENT_VIEW', payload: 'shop' })}
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
}