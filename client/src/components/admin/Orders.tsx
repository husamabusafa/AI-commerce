import React, { useState } from 'react';
import { Search, Package, Truck, CheckCircle, XCircle, Clock, Eye, X, Calendar, User, MapPin, Phone, Mail } from 'lucide-react';
import { useOrders } from '../../hooks/useOrders';
import { Order } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import CustomSelect from '../shared/CustomSelect';

export default function Orders() {
  const { t } = useLanguage();
  const { allOrders, updateOrderStatus } = useOrders();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const filteredOrders = (allOrders || []).filter((order: Order) => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
    setIsUpdating(true);
    await updateOrderStatus(orderId, status);
    setIsUpdating(false);
    
    // Update selected order if it's the one being updated
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status });
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return Clock;
      case 'processing': return Package;
      case 'shipped': return Truck;
      case 'delivered': return CheckCircle;
      case 'cancelled': return XCircle;
      default: return Package;
    }
  };

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

  const orderStats = {
    total: (allOrders || []).length,
    pending: (allOrders || []).filter((o: Order) => o.status === 'pending').length,
    processing: (allOrders || []).filter((o: Order) => o.status === 'processing').length,
    shipped: (allOrders || []).filter((o: Order) => o.status === 'shipped').length,
    delivered: (allOrders || []).filter((o: Order) => o.status === 'delivered').length,
    revenue: (allOrders || []).reduce((sum: number, o: Order) => sum + o.total, 0)
  };

  const statusOptions = [
    { id: 'pending', name: t('orders.status.pending') },
    { id: 'processing', name: t('orders.status.processing') },
    { id: 'shipped', name: t('orders.status.shipped') },
    { id: 'delivered', name: t('orders.status.delivered') },
    { id: 'cancelled', name: t('orders.status.cancelled') }
  ];

  return (
    <div className="min-h-screen bg-luxury-light dark:bg-luxury-dark p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-luxury-text-light dark:text-luxury-text-dark mb-2 arabic-heading">{t('orders.title')}</h1>
          <p className="text-luxury-gray-600 dark:text-luxury-gray-400 arabic-text">{t('orders.subtitle')}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="glass rounded-2xl p-4 border border-luxury-gray-200 dark:border-luxury-gray-700 hover:shadow-luxury transition-all">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-luxury-gold-primary/10 rounded-xl">
                <Package className="h-5 w-5 text-luxury-gold-primary" />
              </div>
            </div>
            <div className="text-2xl font-bold text-luxury-text-light dark:text-luxury-text-dark">{orderStats.total}</div>
            <div className="text-sm text-luxury-gray-600 dark:text-luxury-gray-400 arabic-text">{t('orders.stats.total')}</div>
          </div>

          <div className="glass rounded-2xl p-4 border border-luxury-gray-200 dark:border-luxury-gray-700 hover:shadow-luxury transition-all">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/20 rounded-xl">
                <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{orderStats.pending}</div>
            <div className="text-sm text-luxury-gray-600 dark:text-luxury-gray-400 arabic-text">{t('orders.status.pending')}</div>
          </div>

          <div className="glass rounded-2xl p-4 border border-luxury-gray-200 dark:border-luxury-gray-700 hover:shadow-luxury transition-all">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
                <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{orderStats.processing}</div>
            <div className="text-sm text-luxury-gray-600 dark:text-luxury-gray-400 arabic-text">{t('orders.status.processing')}</div>
          </div>

          <div className="glass rounded-2xl p-4 border border-luxury-gray-200 dark:border-luxury-gray-700 hover:shadow-luxury transition-all">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-xl">
                <Truck className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{orderStats.shipped}</div>
            <div className="text-sm text-luxury-gray-600 dark:text-luxury-gray-400 arabic-text">{t('orders.status.shipped')}</div>
          </div>

          <div className="glass rounded-2xl p-4 border border-luxury-gray-200 dark:border-luxury-gray-700 hover:shadow-luxury transition-all">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-xl">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{orderStats.delivered}</div>
            <div className="text-sm text-luxury-gray-600 dark:text-luxury-gray-400 arabic-text">{t('orders.status.delivered')}</div>
          </div>

          <div className="glass rounded-2xl p-4 border border-luxury-gray-200 dark:border-luxury-gray-700 hover:shadow-luxury transition-all">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-xl">
                <svg className="h-5 w-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">${orderStats.revenue.toFixed(0)}</div>
            <div className="text-sm text-luxury-gray-600 dark:text-luxury-gray-400 arabic-text">Revenue</div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="glass rounded-2xl p-4 border border-luxury-gray-200 dark:border-luxury-gray-700">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-luxury-gray-400" />
              <input
                type="search"
                placeholder={t('orders.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-transparent text-luxury-text-light dark:text-luxury-text-dark placeholder-luxury-gray-400 focus:outline-none arabic-text"
              />
            </div>
            <div className="w-full sm:w-64">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-luxury-dark border border-luxury-gray-300 dark:border-luxury-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-luxury-gold-primary text-luxury-text-light dark:text-luxury-text-dark arabic-text"
              >
                <option value="all">{t('orders.filter.all')}</option>
                <option value="pending">{t('orders.status.pending')}</option>
                <option value="processing">{t('orders.status.processing')}</option>
                <option value="shipped">{t('orders.status.shipped')}</option>
                <option value="delivered">{t('orders.status.delivered')}</option>
                <option value="cancelled">{t('orders.status.cancelled')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 gap-4">
          {filteredOrders.length === 0 ? (
            <div className="glass rounded-3xl p-12 text-center border border-luxury-gray-200 dark:border-luxury-gray-700">
              <div className="p-4 bg-luxury-gray-100 dark:bg-luxury-gray-800 rounded-2xl w-fit mx-auto mb-4">
                <Package className="h-12 w-12 text-luxury-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-luxury-text-light dark:text-luxury-text-dark mb-2 arabic-heading">No Orders Found</h3>
              <p className="text-luxury-gray-600 dark:text-luxury-gray-400 arabic-text">
                {searchQuery ? 'No orders match your search criteria.' : 'No orders yet.'}
              </p>
            </div>
          ) : (
            filteredOrders.map((order: Order) => {
              const StatusIcon = getStatusIcon(order.status);
              return (
                <div
                  key={order.id}
                  className="glass rounded-2xl p-6 border border-luxury-gray-200 dark:border-luxury-gray-700 hover:shadow-luxury transition-all animate-fadeIn"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Order Info */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <div className="text-sm text-luxury-gray-500 dark:text-luxury-gray-400 mb-1 arabic-text">{t('orders.table.orderId')}</div>
                        <div className="font-semibold text-luxury-text-light dark:text-luxury-text-dark">{order.orderNumber || order.id}</div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-luxury-gray-500 dark:text-luxury-gray-400 mb-1 arabic-text">{t('orders.table.customer')}</div>
                        <div className="font-medium text-luxury-text-light dark:text-luxury-text-dark">{order.customerName}</div>
                        <div className="text-sm text-luxury-gray-500 dark:text-luxury-gray-400">{order.customerEmail}</div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-luxury-gray-500 dark:text-luxury-gray-400 mb-1 arabic-text">{t('orders.table.total')}</div>
                        <div className="text-xl font-bold text-luxury-gold-primary">${order.total.toFixed(2)}</div>
                        <div className="text-sm text-luxury-gray-500 dark:text-luxury-gray-400">
                          {order.items.length} {order.items.length !== 1 ? t('orders.itemPlural') : t('orders.itemSingular')}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-luxury-gray-500 dark:text-luxury-gray-400 mb-1 arabic-text">{t('orders.table.date')}</div>
                        <div className="text-luxury-text-light dark:text-luxury-text-dark">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                        <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium mt-2 ${getStatusColor(order.status)}`}>
                          <StatusIcon className="h-4 w-4" />
                          <span className="capitalize">{order.status}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-3 hover:bg-luxury-gray-100 dark:hover:bg-luxury-gray-800 rounded-xl transition-all"
                        title="View Details"
                      >
                        <Eye className="h-5 w-5 text-luxury-gray-600 dark:text-luxury-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="glass rounded-3xl border border-luxury-gray-200 dark:border-luxury-gray-700 max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn shadow-luxury">
            {/* Modal Header */}
            <div className="p-6 border-b border-luxury-gray-200 dark:border-luxury-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-luxury-text-light dark:text-luxury-text-dark arabic-heading">{t('orders.details.title')}</h2>
                  <p className="text-luxury-gray-600 dark:text-luxury-gray-400 mt-1">{selectedOrder.orderNumber || selectedOrder.id}</p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 hover:bg-luxury-gray-100 dark:hover:bg-luxury-gray-800 rounded-xl transition-all"
                >
                  <X className="h-6 w-6 text-luxury-gray-600 dark:text-luxury-gray-400" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Status with Update */}
              <div className="glass rounded-2xl p-4 border border-luxury-gray-200 dark:border-luxury-gray-700">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-sm text-luxury-gray-500 dark:text-luxury-gray-400 mb-2">Order Status</div>
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                      {React.createElement(getStatusIcon(selectedOrder.status), { className: "h-5 w-5" })}
                      <span className="capitalize">{selectedOrder.status}</span>
                    </div>
                  </div>
                  <div className="w-full sm:w-64">
                    <CustomSelect
                      label="Update Status"
                      value={selectedOrder.status}
                      onChange={(value) => handleUpdateOrderStatus(selectedOrder.id, value as Order['status'])}
                      options={statusOptions}
                      placeholder="Select status"
                    />
                  </div>
                </div>
              </div>

              {/* Customer & Order Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass rounded-2xl p-4 border border-luxury-gray-200 dark:border-luxury-gray-700">
                  <h3 className="font-semibold text-luxury-text-light dark:text-luxury-text-dark mb-4 flex items-center gap-2">
                    <User className="h-5 w-5 text-luxury-gold-primary" />
                    {t('orders.details.customerInfo')}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <User className="h-4 w-4 text-luxury-gray-400 mt-1" />
                      <div>
                        <div className="text-sm text-luxury-gray-500 dark:text-luxury-gray-400">Name</div>
                        <div className="text-luxury-text-light dark:text-luxury-text-dark font-medium">{selectedOrder.customerName}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="h-4 w-4 text-luxury-gray-400 mt-1" />
                      <div>
                        <div className="text-sm text-luxury-gray-500 dark:text-luxury-gray-400">Email</div>
                        <div className="text-luxury-text-light dark:text-luxury-text-dark">{selectedOrder.customerEmail}</div>
                      </div>
                    </div>
                    {selectedOrder.phoneNumber && (
                      <div className="flex items-start gap-3">
                        <Phone className="h-4 w-4 text-luxury-gray-400 mt-1" />
                        <div>
                          <div className="text-sm text-luxury-gray-500 dark:text-luxury-gray-400">Phone</div>
                          <div className="text-luxury-text-light dark:text-luxury-text-dark">{selectedOrder.phoneNumber}</div>
                        </div>
                      </div>
                    )}
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-luxury-gray-400 mt-1" />
                      <div>
                        <div className="text-sm text-luxury-gray-500 dark:text-luxury-gray-400">Address</div>
                        <div className="text-luxury-text-light dark:text-luxury-text-dark">{selectedOrder.shippingAddress}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass rounded-2xl p-4 border border-luxury-gray-200 dark:border-luxury-gray-700">
                  <h3 className="font-semibold text-luxury-text-light dark:text-luxury-text-dark mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-luxury-gold-primary" />
                    Order Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-luxury-gray-500 dark:text-luxury-gray-400">Order Date</div>
                      <div className="text-luxury-text-light dark:text-luxury-text-dark font-medium">
                        {new Date(selectedOrder.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-luxury-gray-500 dark:text-luxury-gray-400">Total Items</div>
                      <div className="text-luxury-text-light dark:text-luxury-text-dark font-medium">
                        {selectedOrder.items.length} {selectedOrder.items.length !== 1 ? 'items' : 'item'}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-luxury-gray-500 dark:text-luxury-gray-400">Order Total</div>
                      <div className="text-2xl font-bold text-luxury-gold-primary">${selectedOrder.total.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="glass rounded-2xl p-4 border border-luxury-gray-200 dark:border-luxury-gray-700">
                <h3 className="font-semibold text-luxury-text-light dark:text-luxury-text-dark mb-4 flex items-center gap-2">
                  <Package className="h-5 w-5 text-luxury-gold-primary" />
                  Order Items
                </h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-3 bg-luxury-gray-50 dark:bg-luxury-gray-800 rounded-xl"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-luxury-text-light dark:text-luxury-text-dark">{item.product.name}</h4>
                        <p className="text-sm text-luxury-gray-500 dark:text-luxury-gray-400">
                          Quantity: {item.quantity} × ${item.product.price}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-luxury-text-light dark:text-luxury-text-dark">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
