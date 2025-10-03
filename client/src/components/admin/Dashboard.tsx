import { TrendingUp, Package, ShoppingCart, DollarSign, AlertCircle, ArrowUpRight, ArrowDownRight, Clock, CheckCircle, Truck } from 'lucide-react';
import { useQuery } from '@apollo/client';
import { useApp } from '../../context/AppContext';
import { useProducts } from '../../hooks/useProducts';
import { useOrders } from '../../hooks/useOrders';
import { useLanguage } from '../../context/LanguageContext';
import { GET_USERS } from '../../graphql/queries';
import { Product, Order } from '../../types/index';

export default function Dashboard() {
  const { state } = useApp();
  const { t, formatNumber } = useLanguage();
  const { products } = useProducts();
  const { allOrders } = useOrders();
  const { data: usersData } = useQuery(GET_USERS, {
    skip: !state.currentUser || state.currentUser.role !== 'ADMIN',
  });

  const users = usersData?.users || [];
  const orders = allOrders || [];
  const productList = products || [];

  // Calculate stats
  const totalProducts = productList.length;
  const totalOrders = orders.length;
  const totalUsers = users.length;
  const totalRevenue = orders.reduce((sum: number, order: Order) => sum + order.total, 0);
  const lowStockProducts = productList.filter((p: Product) => p.stock < 10);
  
  // Order status counts
  const pendingOrders = orders.filter((o: Order) => o.status === 'pending').length;
  const processingOrders = orders.filter((o: Order) => o.status === 'processing').length;
  const deliveredOrders = orders.filter((o: Order) => o.status === 'delivered').length;

  // Recent orders (last 5)
  const recentOrders = [...orders]
    .sort((a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Top products by stock
  const topProducts = [...productList]
    .sort((a: Product, b: Product) => b.stock - a.stock)
    .slice(0, 5);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400';
      case 'processing': return 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400';
      case 'shipped': return 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400';
      case 'delivered': return 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400';
      case 'cancelled': return 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400';
      default: return 'bg-gray-100 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return Clock;
      case 'processing': return Package;
      case 'shipped': return Truck;
      case 'delivered': return CheckCircle;
      default: return Package;
    }
  };

  return (
    <div className="min-h-screen bg-luxury-light dark:bg-luxury-dark p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="animate-slideUp">
          <h1 className="text-3xl font-bold text-luxury-text-light dark:text-luxury-text-dark mb-2 arabic-heading">
            {t('dashboard.title')}
          </h1>
          <p className="text-luxury-gray-600 dark:text-luxury-gray-400 arabic-text">
            {t('dashboard.welcome')}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
          {/* Revenue */}
          <div className="glass rounded-2xl p-6 border border-luxury-gray-200 dark:border-luxury-gray-700 hover:shadow-luxury transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/20 rounded-xl">
                <DollarSign className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <ArrowUpRight className="h-4 w-4" />
                <span className="text-sm font-medium">12%</span>
              </div>
            </div>
            <p className="text-sm text-luxury-gray-600 dark:text-luxury-gray-400 mb-1 arabic-text">
              {t('dashboard.totalRevenue')}
            </p>
            <p className="text-2xl font-bold text-luxury-text-light dark:text-luxury-text-dark">
              ${formatNumber(totalRevenue.toFixed(0))}
            </p>
          </div>

          {/* Orders */}
          <div className="glass rounded-2xl p-6 border border-luxury-gray-200 dark:border-luxury-gray-700 hover:shadow-luxury transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
                <ShoppingCart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                <ArrowUpRight className="h-4 w-4" />
                <span className="text-sm font-medium">8%</span>
              </div>
            </div>
            <p className="text-sm text-luxury-gray-600 dark:text-luxury-gray-400 mb-1 arabic-text">
              {t('dashboard.totalOrders')}
            </p>
            <p className="text-2xl font-bold text-luxury-text-light dark:text-luxury-text-dark">
              {formatNumber(totalOrders)}
            </p>
          </div>

          {/* Products */}
          <div className="glass rounded-2xl p-6 border border-luxury-gray-200 dark:border-luxury-gray-700 hover:shadow-luxury transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-xl">
                <Package className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex items-center gap-1 text-luxury-gray-500 dark:text-luxury-gray-400">
                <span className="text-sm font-medium">{lowStockProducts.length} low</span>
              </div>
            </div>
            <p className="text-sm text-luxury-gray-600 dark:text-luxury-gray-400 mb-1 arabic-text">
              {t('dashboard.products')}
            </p>
            <p className="text-2xl font-bold text-luxury-text-light dark:text-luxury-text-dark">
              {formatNumber(totalProducts)}
            </p>
          </div>

          {/* Pending Orders */}
          <div className="glass rounded-2xl p-6 border border-luxury-gray-200 dark:border-luxury-gray-700 hover:shadow-luxury transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-100 dark:bg-amber-900/20 rounded-xl">
                <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                <AlertCircle className="h-4 w-4" />
              </div>
            </div>
            <p className="text-sm text-luxury-gray-600 dark:text-luxury-gray-400 mb-1 arabic-text">
              Pending Orders
            </p>
            <p className="text-2xl font-bold text-luxury-text-light dark:text-luxury-text-dark">
              {formatNumber(pendingOrders)}
            </p>
          </div>
        </div>

        {/* Low Stock Alert */}
        {lowStockProducts.length > 0 && (
          <div className="glass rounded-2xl p-4 border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10 animate-slideUp">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1 arabic-heading">
                  {t('dashboard.lowStockAlert')}
                </h3>
                <p className="text-sm text-amber-700 dark:text-amber-400 arabic-text">
                  {lowStockProducts.length} {lowStockProducts.length === 1 ? t('dashboard.lowStockMessage') : t('dashboard.lowStockMessagePlural')}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {lowStockProducts.slice(0, 3).map((product: Product) => (
                    <span 
                      key={product.id}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-white dark:bg-luxury-dark rounded-lg text-xs"
                    >
                      <span className="font-medium text-luxury-text-light dark:text-luxury-text-dark">{product.name}</span>
                      <span className="text-amber-600 dark:text-amber-400">({product.stock} left)</span>
                    </span>
                  ))}
                  {lowStockProducts.length > 3 && (
                    <span className="inline-flex items-center px-3 py-1 bg-white dark:bg-luxury-dark rounded-lg text-xs text-luxury-gray-600 dark:text-luxury-gray-400">
                      +{lowStockProducts.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Orders & Inventory */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="glass rounded-2xl p-6 border border-luxury-gray-200 dark:border-luxury-gray-700 animate-slideUp">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-luxury-text-light dark:text-luxury-text-dark arabic-heading">
                {t('dashboard.recentOrders')}
              </h3>
              <ShoppingCart className="h-5 w-5 text-luxury-gold-primary" />
            </div>
            <div className="space-y-4">
              {recentOrders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-luxury-gray-400 mx-auto mb-2" />
                  <p className="text-luxury-gray-500 dark:text-luxury-gray-400 arabic-text">No orders yet</p>
                </div>
              ) : (
                recentOrders.map((order: Order, index: number) => {
                  const StatusIcon = getStatusIcon(order.status);
                  return (
                    <div 
                      key={order.id} 
                      className="flex items-center justify-between py-3 border-b border-luxury-gray-200 dark:border-luxury-gray-700 last:border-0 animate-fadeIn"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex-1 ltr:mr-4 rtl:ml-4">
                        <p className="font-medium text-luxury-text-light dark:text-luxury-text-dark mb-1">
                          {order.orderNumber || `#${order.id.slice(0, 8)}`}
                        </p>
                        <p className="text-sm text-luxury-gray-600 dark:text-luxury-gray-400 arabic-text">
                          {order.customerName}
                        </p>
                      </div>
                      <div className="ltr:text-right rtl:text-left">
                        <p className="font-semibold text-luxury-text-light dark:text-luxury-text-dark mb-1">
                          ${formatNumber(order.total.toFixed(2))}
                        </p>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-lg font-medium ${getStatusColor(order.status)}`}>
                          <StatusIcon className="h-3 w-3" />
                          <span className="capitalize">{order.status}</span>
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Inventory Status */}
          <div className="glass rounded-2xl p-6 border border-luxury-gray-200 dark:border-luxury-gray-700 animate-slideUp">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-luxury-text-light dark:text-luxury-text-dark arabic-heading">
                {t('dashboard.inventoryStatus')}
              </h3>
              <Package className="h-5 w-5 text-luxury-gold-primary" />
            </div>
            <div className="space-y-4">
              {topProducts.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-luxury-gray-400 mx-auto mb-2" />
                  <p className="text-luxury-gray-500 dark:text-luxury-gray-400 arabic-text">No products yet</p>
                </div>
              ) : (
                topProducts.map((product: Product, index: number) => (
                  <div 
                    key={product.id} 
                    className="flex items-center justify-between py-3 border-b border-luxury-gray-200 dark:border-luxury-gray-700 last:border-0 animate-fadeIn"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center gap-3 flex-1 ltr:mr-4 rtl:ml-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-luxury-text-light dark:text-luxury-text-dark truncate mb-1 arabic-text">
                          {product.name}
                        </p>
                        <p className="text-sm text-luxury-gray-600 dark:text-luxury-gray-400">
                          ${formatNumber(product.price.toFixed(2))}
                        </p>
                      </div>
                    </div>
                    <div className="ltr:text-right rtl:text-left">
                      <p className="font-semibold text-luxury-text-light dark:text-luxury-text-dark mb-1">
                        {formatNumber(product.stock)} {t('dashboard.units')}
                      </p>
                      <p className={`text-xs font-medium ${product.stock < 10 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                        {product.stock < 10 ? t('dashboard.lowStock') : t('dashboard.inStock')}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Order Status Summary */}
        <div className="glass rounded-2xl p-6 border border-luxury-gray-200 dark:border-luxury-gray-700 animate-slideUp">
          <h3 className="text-lg font-semibold text-luxury-text-light dark:text-luxury-text-dark mb-6 arabic-heading">
            Order Status Overview
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="p-3 bg-amber-100 dark:bg-amber-900/20 rounded-xl w-fit mx-auto mb-2">
                <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <p className="text-2xl font-bold text-luxury-text-light dark:text-luxury-text-dark mb-1">
                {formatNumber(pendingOrders)}
              </p>
              <p className="text-sm text-luxury-gray-600 dark:text-luxury-gray-400 arabic-text">Pending</p>
            </div>
            
            <div className="text-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl w-fit mx-auto mb-2">
                <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-2xl font-bold text-luxury-text-light dark:text-luxury-text-dark mb-1">
                {formatNumber(processingOrders)}
              </p>
              <p className="text-sm text-luxury-gray-600 dark:text-luxury-gray-400 arabic-text">Processing</p>
            </div>
            
            <div className="text-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-xl w-fit mx-auto mb-2">
                <Truck className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="text-2xl font-bold text-luxury-text-light dark:text-luxury-text-dark mb-1">
                {formatNumber(orders.filter((o: Order) => o.status === 'shipped').length)}
              </p>
              <p className="text-sm text-luxury-gray-600 dark:text-luxury-gray-400 arabic-text">Shipped</p>
            </div>
            
            <div className="text-center">
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-xl w-fit mx-auto mb-2">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-2xl font-bold text-luxury-text-light dark:text-luxury-text-dark mb-1">
                {formatNumber(deliveredOrders)}
              </p>
              <p className="text-sm text-luxury-gray-600 dark:text-luxury-gray-400 arabic-text">Delivered</p>
            </div>
            
            <div className="text-center">
              <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-xl w-fit mx-auto mb-2">
                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <p className="text-2xl font-bold text-luxury-text-light dark:text-luxury-text-dark mb-1">
                {formatNumber(orders.filter((o: Order) => o.status === 'cancelled').length)}
              </p>
              <p className="text-sm text-luxury-gray-600 dark:text-luxury-gray-400 arabic-text">Cancelled</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
