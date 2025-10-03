import { useState } from 'react';
import { Package, Truck, CheckCircle, Clock, Eye } from 'lucide-react';
import { useOrders } from '../../hooks/useOrders';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Order } from '../../types';
import Button from '../shared/Button';
import Badge from '../shared/Badge';

export default function ClientOrders() {
  const { myOrders, myOrdersLoading } = useOrders();
  const { t, formatNumber } = useLanguage();
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const orders = myOrders || [];

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return Clock;
      case 'processing': return Package;
      case 'shipped': return Truck;
      case 'delivered': return CheckCircle;
      default: return Package;
    }
  };

  const getStatusVariant = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'warning' as const;
      case 'processing': return 'primary' as const;
      case 'shipped': return 'secondary' as const;
      case 'delivered': return 'success' as const;
      case 'cancelled': return 'danger' as const;
      default: return 'secondary' as const;
    }
  };

  if (myOrdersLoading) {
    return (
      <div className="min-h-screen bg-luxury-light dark:bg-luxury-dark p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-luxury-gold-primary border-r-transparent"></div>
          <p className="mt-4 text-luxury-gray-600 dark:text-luxury-gray-400 arabic-text">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-luxury-light dark:bg-luxury-dark p-6">
        <div className="max-w-2xl mx-auto">
          <div className="glass rounded-3xl p-12 text-center border border-luxury-gray-200 dark:border-luxury-gray-700 animate-fadeIn">
            <Package className="h-20 w-20 text-luxury-gray-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-luxury-text-light dark:text-luxury-text-dark mb-3 arabic-heading">
              {t('orders.noOrders') || 'No orders yet'}
            </h2>
            <p className="text-luxury-gray-600 dark:text-luxury-gray-400 mb-8 arabic-text">
              {t('orders.noOrdersDesc') || 'You haven\'t placed any orders yet.'}
            </p>
            <Button onClick={() => navigate('/')} className="px-8 py-3">
              {t('orders.startShopping') || 'Start Shopping'}
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
            {t('orders.myOrders') || 'My Orders'}
          </h1>
          <p className="text-luxury-gray-600 dark:text-luxury-gray-400 arabic-text">
            {t('orders.trackOrders') || 'Track and manage your orders'}
          </p>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.map((order: Order) => {
            const StatusIcon = getStatusIcon(order.status);
            
            return (
              <div 
                key={order.id}
                className="glass rounded-2xl p-6 border border-luxury-gray-200 dark:border-luxury-gray-700 hover:shadow-luxury transition-all duration-300 animate-slideUp"
              >
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-14 h-14 bg-luxury-gold-primary/10 rounded-xl flex items-center justify-center">
                      <StatusIcon className="h-7 w-7 text-luxury-gold-primary" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="font-semibold text-luxury-text-light dark:text-luxury-text-dark arabic-heading">
                          #{order.orderNumber || order.id.slice(0, 8)}
                        </h3>
                        <Badge variant={getStatusVariant(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-luxury-gray-600 dark:text-luxury-gray-400 mb-3 arabic-text">
                        {t('orders.orderedOn') || 'Ordered on'} {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-luxury-gray-600 dark:text-luxury-gray-400 flex-wrap">
                        <span className="arabic-text">
                          {order.items.length} {order.items.length === 1 ? t('orders.item') || 'item' : t('orders.items') || 'items'}
                        </span>
                        <span>•</span>
                        <span className="font-medium text-luxury-text-light dark:text-luxury-text-dark">
                          ${formatNumber(order.total.toFixed(2))}
                        </span>
                      </div>
                      
                      {/* Order Items Preview */}
                      <div className="flex items-center gap-2 mt-4">
                        {order.items.slice(0, 4).map((item: any, index: number) => (
                          <img
                            key={index}
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-10 h-10 rounded-lg object-cover border-2 border-white dark:border-luxury-gray-800"
                          />
                        ))}
                        {order.items.length > 4 && (
                          <div className="w-10 h-10 bg-luxury-gray-100 dark:bg-luxury-gray-800 rounded-lg flex items-center justify-center text-xs font-medium text-luxury-gray-600 dark:text-luxury-gray-400">
                            +{order.items.length - 4}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedOrder(order)}
                      className="whitespace-nowrap"
                    >
                      <Eye className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                      <span className="arabic-text">{t('orders.viewDetails') || 'View Details'}</span>
                    </Button>
                    
                    {order.status === 'delivered' && (
                      <Button variant="ghost" size="sm" className="whitespace-nowrap arabic-text">
                        {t('orders.reorder') || 'Reorder'}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Order Progress */}
                <div className="mt-6 pt-6 border-t border-luxury-gray-200 dark:border-luxury-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-luxury-text-light dark:text-luxury-text-dark arabic-text">
                      {t('orders.orderProgress') || 'Order Progress'}
                    </span>
                    <span className="text-sm text-luxury-gray-600 dark:text-luxury-gray-400 arabic-text">
                      {order.status === 'delivered' ? t('orders.delivered') || 'Delivered' :
                       order.status === 'shipped' ? t('orders.inTransit') || 'In Transit' :
                       order.status === 'processing' ? t('orders.processing') || 'Processing' : 
                       t('orders.orderPlaced') || 'Order Placed'}
                    </span>
                  </div>
                  
                  <div className="w-full bg-luxury-gray-200 dark:bg-luxury-gray-700 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full transition-all duration-500 ${
                        order.status === 'delivered' ? 'bg-green-500 w-full' :
                        order.status === 'shipped' ? 'bg-blue-500 w-3/4' :
                        order.status === 'processing' ? 'bg-yellow-500 w-1/2' :
                        'bg-luxury-gray-400 w-1/4'
                      }`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <OrderDetailsModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
          />
        )}
      </div>
    </div>
  );
}

function OrderDetailsModal({ order, onClose }: { order: Order; onClose: () => void }) {
  const { t, formatNumber } = useLanguage();
  const StatusIcon = order.status === 'pending' ? Clock :
                     order.status === 'processing' ? Package :
                     order.status === 'shipped' ? Truck :
                     CheckCircle;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="glass rounded-3xl border border-luxury-gray-200 dark:border-luxury-gray-700 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-luxury animate-scaleIn">
        <div className="p-6 border-b border-luxury-gray-200 dark:border-luxury-gray-700 sticky top-0 bg-white/80 dark:bg-luxury-dark/80 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-luxury-text-light dark:text-luxury-text-dark arabic-heading">
              {t('orders.orderDetails') || 'Order Details'}
            </h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-luxury-gray-100 dark:hover:bg-luxury-gray-800 rounded-xl transition-colors"
            >
              <span className="text-2xl text-luxury-gray-600 dark:text-luxury-gray-400">×</span>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Status */}
          <div className="flex items-center justify-center gap-4 p-6 bg-luxury-gray-50 dark:bg-luxury-gray-800 rounded-2xl">
            <StatusIcon className={`h-10 w-10 ${
              order.status === 'delivered' ? 'text-green-600' :
              order.status === 'shipped' ? 'text-blue-600' :
              order.status === 'processing' ? 'text-yellow-600' :
              'text-luxury-gray-600'
            }`} />
            <div className="text-center">
              <div className="font-semibold text-lg text-luxury-text-light dark:text-luxury-text-dark arabic-heading">
                #{order.orderNumber || order.id.slice(0, 8)}
              </div>
              <div className="text-sm text-luxury-gray-600 dark:text-luxury-gray-400 arabic-text">
                {order.status === 'delivered' ? t('orders.orderDelivered') || 'Order has been delivered' :
                 order.status === 'shipped' ? t('orders.orderShipped') || 'Order is on the way' :
                 order.status === 'processing' ? t('orders.orderProcessing') || 'Order is being processed' :
                 t('orders.orderPlaced') || 'Order has been placed'}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="font-semibold text-lg text-luxury-text-light dark:text-luxury-text-dark mb-4 arabic-heading">
              {t('orders.itemsOrdered') || 'Items Ordered'}
            </h3>
            <div className="space-y-3">
              {order.items.map((item: any, index: number) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-luxury-gray-50 dark:bg-luxury-gray-800 rounded-xl">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-luxury-text-light dark:text-luxury-text-dark mb-1 arabic-heading">
                      {item.product.name}
                    </h4>
                    <p className="text-sm text-luxury-gray-600 dark:text-luxury-gray-400 arabic-text">
                      {t('orders.quantity')}: {item.quantity}
                    </p>
                    <p className="text-sm text-luxury-gray-600 dark:text-luxury-gray-400">
                      ${formatNumber(item.product.price)} {t('orders.each') || 'each'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-lg text-luxury-text-light dark:text-luxury-text-dark">
                      ${formatNumber((item.product.price * item.quantity).toFixed(2))}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-luxury-gray-200 dark:border-luxury-gray-700 mt-4 pt-4">
              <div className="flex justify-between items-center text-2xl font-bold text-luxury-text-light dark:text-luxury-text-dark">
                <span className="arabic-text">{t('orders.total') || 'Total'}</span>
                <span>${formatNumber(order.total.toFixed(2))}</span>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div>
            <h3 className="font-semibold text-lg text-luxury-text-light dark:text-luxury-text-dark mb-3 arabic-heading">
              {t('orders.shippingInfo') || 'Shipping Information'}
            </h3>
            <div className="text-sm text-luxury-gray-600 dark:text-luxury-gray-400 space-y-2 arabic-text">
              <div><strong>{t('orders.name') || 'Name'}:</strong> {order.customerName}</div>
              <div><strong>{t('orders.email') || 'Email'}:</strong> {order.customerEmail}</div>
              <div><strong>{t('orders.address') || 'Address'}:</strong> {order.shippingAddress}</div>
              {order.phoneNumber && <div><strong>{t('orders.phone') || 'Phone'}:</strong> {order.phoneNumber}</div>}
              <div><strong>{t('orders.orderDate') || 'Order Date'}:</strong> {new Date(order.createdAt).toLocaleDateString()}</div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1 arabic-text">
              {t('common.close') || 'Close'}
            </Button>
            {order.status === 'delivered' && (
              <Button className="flex-1 arabic-text">
                {t('orders.reorderItems') || 'Reorder Items'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
