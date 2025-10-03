import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import Button from '../shared/Button';

export default function Cart() {
  const { cartItems, updateCartItem, removeFromCart, loading } = useCart();
  const { t, formatNumber, translateProduct } = useLanguage();
  const navigate = useNavigate();

  const items = cartItems || [];
  const subtotal = items.reduce((sum: number, item: any) => sum + (item.product.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax
  const shipping = subtotal > 50 ? 0 : 9.99; // Free shipping over $50
  const total = subtotal + tax + shipping;

  const handleUpdateQuantity = async (cartItemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    await updateCartItem(cartItemId, newQuantity);
  };

  const handleRemove = async (cartItemId: string) => {
    await removeFromCart(cartItemId);
  };

  const proceedToCheckout = () => {
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-luxury-light dark:bg-luxury-dark p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-luxury-gold-primary border-r-transparent"></div>
          <p className="mt-4 text-luxury-gray-600 dark:text-luxury-gray-400 arabic-text">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-luxury-light dark:bg-luxury-dark p-6">
        <div className="max-w-2xl mx-auto">
          <div className="glass rounded-3xl p-12 text-center border border-luxury-gray-200 dark:border-luxury-gray-700 animate-fadeIn">
            <ShoppingBag className="h-20 w-20 text-luxury-gray-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-luxury-text-light dark:text-luxury-text-dark mb-3 arabic-heading">
              {t('cart.empty') || 'Your cart is empty'}
            </h2>
            <p className="text-luxury-gray-600 dark:text-luxury-gray-400 mb-8 arabic-text">
              {t('cart.emptyDesc') || 'Looks like you haven\'t added any items to your cart yet.'}
            </p>
            <Button onClick={() => navigate('/')} className="px-8 py-3">
              {t('cart.continueShopping') || 'Continue Shopping'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-light dark:bg-luxury-dark p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="animate-slideUp">
          <h1 className="text-3xl font-bold text-luxury-text-light dark:text-luxury-text-dark mb-2 arabic-heading">
            {t('cart.title') || 'Shopping Cart'}
          </h1>
          <p className="text-luxury-gray-600 dark:text-luxury-gray-400 arabic-text">
            {items.length} {items.length === 1 ? 'item' : 'items'} {t('cart.inCart') || 'in your cart'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item: any, index: number) => {
              const translatedProduct = translateProduct(item.product);
              return (
                <div 
                  key={item.id} 
                  className="glass rounded-2xl p-6 border border-luxury-gray-200 dark:border-luxury-gray-700 animate-slideUp"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-4 ltr:space-x-4 rtl:space-x-reverse">
                    <img
                      src={item.product.image}
                      alt={translatedProduct.name}
                      className="w-24 h-24 rounded-xl object-cover"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-luxury-text-light dark:text-luxury-text-dark mb-1 arabic-heading">
                        {translatedProduct.name}
                      </h3>
                      <p className="text-sm text-luxury-gray-600 dark:text-luxury-gray-400 mb-2 arabic-text">
                        {item.product.category?.name || 'No Category'}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-luxury-text-light dark:text-luxury-text-dark">
                          ${formatNumber(item.product.price)}
                        </span>
                        <span className="text-sm text-luxury-gray-500 dark:text-luxury-gray-400 arabic-text">each</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        className="p-2 border border-luxury-gray-300 dark:border-luxury-gray-600 rounded-xl hover:bg-luxury-gray-100 dark:hover:bg-luxury-gray-800 transition-all hover:scale-110"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4 text-luxury-gray-700 dark:text-luxury-gray-300" />
                      </button>
                      <span className="w-12 text-center font-medium text-luxury-text-light dark:text-luxury-text-dark">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        className="p-2 border border-luxury-gray-300 dark:border-luxury-gray-600 rounded-xl hover:bg-luxury-gray-100 dark:hover:bg-luxury-gray-800 transition-all hover:scale-110"
                        disabled={item.quantity >= item.product.stock}
                      >
                        <Plus className="h-4 w-4 text-luxury-gray-700 dark:text-luxury-gray-300" />
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-bold text-luxury-text-light dark:text-luxury-text-dark mb-2">
                        ${formatNumber((item.product.price * item.quantity).toFixed(2))}
                      </div>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all hover:scale-110"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            <div className="glass rounded-2xl p-6 border border-luxury-gray-200 dark:border-luxury-gray-700 animate-scaleIn sticky top-6">
              <h3 className="text-xl font-semibold text-luxury-text-light dark:text-luxury-text-dark mb-6 arabic-heading">
                {t('cart.orderSummary') || 'Order Summary'}
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between text-luxury-gray-600 dark:text-luxury-gray-400">
                  <span className="arabic-text">{t('cart.subtotal') || 'Subtotal'}</span>
                  <span>${formatNumber(subtotal.toFixed(2))}</span>
                </div>
                
                <div className="flex justify-between text-luxury-gray-600 dark:text-luxury-gray-400">
                  <span className="arabic-text">{t('cart.tax') || 'Tax'}</span>
                  <span>${formatNumber(tax.toFixed(2))}</span>
                </div>
                
                <div className="flex justify-between text-luxury-gray-600 dark:text-luxury-gray-400">
                  <span className="arabic-text">{t('cart.shipping') || 'Shipping'}</span>
                  <span>{shipping === 0 ? t('cart.free') || 'Free' : `$${formatNumber(shipping.toFixed(2))}`}</span>
                </div>
                
                {shipping === 0 && (
                  <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-3 rounded-xl animate-pulse">
                    <Tag className="h-4 w-4" />
                    <span className="arabic-text">{t('cart.freeShippingApplied') || 'Free shipping applied!'}</span>
                  </div>
                )}
                
                <div className="border-t border-luxury-gray-200 dark:border-luxury-gray-700 pt-4">
                  <div className="flex justify-between text-2xl font-bold text-luxury-text-light dark:text-luxury-text-dark">
                    <span className="arabic-text">{t('cart.total') || 'Total'}</span>
                    <span>${formatNumber(total.toFixed(2))}</span>
                  </div>
                </div>
              </div>

              <Button className="w-full mt-6 py-4" onClick={proceedToCheckout}>
                <span className="arabic-text">{t('cart.proceedToCheckout') || 'Proceed to Checkout'}</span>
                <ArrowRight className="h-5 w-5 ltr:ml-2 rtl:mr-2" />
              </Button>

              <Button
                variant="outline"
                className="w-full mt-3"
                onClick={() => navigate('/')}
              >
                <span className="arabic-text">{t('cart.continueShopping') || 'Continue Shopping'}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
