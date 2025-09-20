import React from 'react';
import { TrendingUp, Package, ShoppingCart, Users, DollarSign } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Card from '../shared/Card';

export default function Dashboard() {
  const { state } = useApp();

  const totalProducts = state.products.length;
  const totalOrders = state.orders.length;
  const totalUsers = state.users.length;
  const totalRevenue = state.orders.reduce((sum, order) => sum + order.total, 0);
  const lowStockProducts = state.products.filter(p => p.stock < 10).length;

  const stats = [
    {
      label: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      label: 'Total Orders',
      value: totalOrders.toString(),
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      label: 'Products',
      value: totalProducts.toString(),
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      label: 'Users',
      value: totalUsers.toString(),
      icon: Users,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    }
  ];

  const recentOrders = state.orders.slice(0, 5);
  const topProducts = state.products
    .sort((a, b) => b.stock - a.stock)
    .slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-gray-100 mb-2">Dashboard</h1>
        <p className="text-slate-600 dark:text-gray-400">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="transform hover:scale-105 transition-all duration-200">
              <div className="flex items-center">
                <div className={`p-2 ${stat.bgColor} dark:bg-opacity-20 rounded-lg`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600 dark:text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-gray-100">{stat.value}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {lowStockProducts > 0 && (
        <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
          <div className="flex items-center">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <TrendingUp className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-amber-800 dark:text-amber-300">Low Stock Alert</h3>
              <p className="text-sm text-amber-700 dark:text-amber-400">
                {lowStockProducts} product{lowStockProducts !== 1 ? 's' : ''} running low on stock
              </p>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-gray-100 mb-4">Recent Orders</h3>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-gray-700 last:border-0">
                <div className="flex-1">
                  <p className="font-medium text-slate-900 dark:text-gray-100">{order.id}</p>
                  <p className="text-sm text-slate-600 dark:text-gray-400">{order.customerName}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-slate-900 dark:text-gray-100">${order.total.toFixed(2)}</p>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    order.status === 'delivered' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                    order.status === 'shipped' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' :
                    order.status === 'processing' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' :
                    'bg-slate-100 dark:bg-gray-700 text-slate-800 dark:text-gray-300'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Products */}
        <Card>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-gray-100 mb-4">Inventory Status</h3>
          <div className="space-y-4">
            {topProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-gray-700 last:border-0">
                <div className="flex items-center space-x-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-gray-100 truncate max-w-[150px]">{product.name}</p>
                    <p className="text-sm text-slate-600 dark:text-gray-400">${product.price}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-slate-900 dark:text-gray-100">{product.stock} units</p>
                  <p className={`text-sm ${product.stock < 10 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                    {product.stock < 10 ? 'Low Stock' : 'In Stock'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}