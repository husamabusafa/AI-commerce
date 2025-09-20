import React, { useState } from 'react';
import { Package, Truck, CheckCircle, Clock, Eye } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';
import Card from '../shared/Card';
import Button from '../shared/Button';
import Badge from '../shared/Badge';

export default function ClientOrders() {
  const { state, dispatch } = useApp();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Filter orders for current user (in a real app, this would be based on user ID)
  const userOrders = state.orders.slice(0, 3); // Mock user orders

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

  if (userOrders.length === 0) {
    return (
      <div className="p-6">
        <Card className="text-center py-12">
          <Package className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">No orders yet</h2>
          <p className="text-slate-600 mb-6">You haven't placed any orders yet.</p>
          <Button onClick={() => dispatch({ type: 'SET_CLIENT_VIEW', payload: 'shop' })}>
            Start Shopping
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">My Orders</h1>
        <p className="text-slate-600">Track and manage your orders</p>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {userOrders.map((order) => {
          const StatusIcon = getStatusIcon(order.status);
          
          return (
            <Card key={order.id} hover>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                    <StatusIcon className="h-6 w-6 text-slate-600" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-1">
                      <h3 className="font-semibold text-slate-900">{order.id}</h3>
                      <Badge variant={getStatusVariant(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-slate-600 mb-2">
                      Ordered on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-slate-600">
                      <span>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                      <span>•</span>
                      <span className="font-medium text-slate-900">${order.total.toFixed(2)}</span>
                    </div>
                    
                    {/* Order Items Preview */}
                    <div className="flex items-center space-x-2 mt-3">
                      {order.items.slice(0, 3).map((item, index) => (
                        <img
                          key={index}
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-8 h-8 rounded object-cover"
                        />
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center text-xs text-slate-600">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  
                  {order.status === 'delivered' && (
                    <Button variant="ghost" size="sm">
                      Reorder
                    </Button>
                  )}
                </div>
              </div>

              {/* Order Progress */}
              <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-900">Order Progress</span>
                  <span className="text-sm text-slate-600">
                    {order.status === 'delivered' ? 'Delivered' :
                     order.status === 'shipped' ? 'In Transit' :
                     order.status === 'processing' ? 'Processing' : 'Order Placed'}
                  </span>
                </div>
                
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      order.status === 'delivered' ? 'bg-green-500 w-full' :
                      order.status === 'shipped' ? 'bg-blue-500 w-3/4' :
                      order.status === 'processing' ? 'bg-yellow-500 w-1/2' :
                      'bg-slate-400 w-1/4'
                    }`}
                  />
                </div>
              </div>
            </Card>
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
  );
}

function OrderDetailsModal({ order, onClose }: { order: Order; onClose: () => void }) {
  const StatusIcon = order.status === 'pending' ? Clock :
                     order.status === 'processing' ? Package :
                     order.status === 'shipped' ? Truck :
                     CheckCircle;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="p-6 border-b border-slate-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-gray-100">Order Details</h2>
            <Button variant="ghost" onClick={onClose}>×</Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Status */}
          <div className="flex items-center justify-center space-x-3 p-4 bg-slate-50 dark:bg-gray-800 rounded-lg">
            <StatusIcon className={`h-8 w-8 ${
              order.status === 'delivered' ? 'text-green-600' :
              order.status === 'shipped' ? 'text-blue-600' :
              order.status === 'processing' ? 'text-yellow-600' :
              'text-slate-600'
            }`} />
            <div className="text-center">
              <div className="font-semibold text-slate-900 dark:text-gray-100">{order.id}</div>
              <div className="text-sm text-slate-600 dark:text-gray-400">
                {order.status === 'delivered' ? 'Order has been delivered' :
                 order.status === 'shipped' ? 'Order is on the way' :
                 order.status === 'processing' ? 'Order is being processed' :
                 'Order has been placed'}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-gray-100 mb-4">Items Ordered</h3>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 bg-slate-50 dark:bg-gray-800 rounded-lg">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-900 dark:text-gray-100">{item.product.name}</h4>
                    <p className="text-sm text-slate-600 dark:text-gray-400">Quantity: {item.quantity}</p>
                    <p className="text-sm text-slate-600 dark:text-gray-400">${item.product.price} each</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-slate-900 dark:text-gray-100">${(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-slate-200 dark:border-gray-800 mt-4 pt-4">
              <div className="flex justify-between items-center text-lg font-bold text-slate-900 dark:text-gray-100">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-gray-100 mb-2">Shipping Information</h3>
            <div className="text-sm text-slate-600 dark:text-gray-400 space-y-1">
              <div><strong>Name:</strong> {order.customerName}</div>
              <div><strong>Email:</strong> {order.customerEmail}</div>
              <div><strong>Address:</strong> {order.shippingAddress}</div>
              <div><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</div>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Close
            </Button>
            {order.status === 'delivered' && (
              <Button className="flex-1">
                Reorder Items
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}