import React, { useState } from 'react';
import { Search, Filter, Eye, Truck, Package, CheckCircle, XCircle, Clock, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';
import Card from '../shared/Card';
import Button from '../shared/Button';
import Input from '../shared/Input';
import Badge from '../shared/Badge';

export default function Orders() {
  const { state, dispatch } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = state.orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { orderId, status } });
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

  const orderStats = {
    total: state.orders.length,
    pending: state.orders.filter(o => o.status === 'pending').length,
    processing: state.orders.filter(o => o.status === 'processing').length,
    shipped: state.orders.filter(o => o.status === 'shipped').length,
    delivered: state.orders.filter(o => o.status === 'delivered').length
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Orders</h1>
        <p className="text-slate-600">Track and manage customer orders</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card padding="sm" className="text-center">
          <div className="text-2xl font-bold text-slate-900">{orderStats.total}</div>
          <div className="text-sm text-slate-600">Total Orders</div>
        </Card>
        <Card padding="sm" className="text-center">
          <div className="text-2xl font-bold text-amber-600">{orderStats.pending}</div>
          <div className="text-sm text-slate-600">Pending</div>
        </Card>
        <Card padding="sm" className="text-center">
          <div className="text-2xl font-bold text-blue-600">{orderStats.processing}</div>
          <div className="text-sm text-slate-600">Processing</div>
        </Card>
        <Card padding="sm" className="text-center">
          <div className="text-2xl font-bold text-slate-600">{orderStats.shipped}</div>
          <div className="text-sm text-slate-600">Shipped</div>
        </Card>
        <Card padding="sm" className="text-center">
          <div className="text-2xl font-bold text-green-600">{orderStats.delivered}</div>
          <div className="text-sm text-slate-600">Delivered</div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="search"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Orders List */}
      <Card padding="none" className="animate-slideUp">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-3 px-6 text-sm font-medium text-slate-700">Order ID</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-slate-700">Customer</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-slate-700">Items</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-slate-700">Total</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-slate-700">Status</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-slate-700">Date</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredOrders.map((order, index) => {
                const StatusIcon = getStatusIcon(order.status);
                return (
                  <tr 
                    key={order.id} 
                    className="hover:bg-slate-50 transition-colors duration-200 animate-fadeIn"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <td className="py-4 px-6">
                      <span className="font-medium text-slate-900">{order.id}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-medium text-slate-900">{order.customerName}</div>
                        <div className="text-sm text-slate-500">{order.customerEmail}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-slate-600">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-medium text-slate-900">${order.total.toFixed(2)}</span>
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant={getStatusVariant(order.status)}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {order.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-slate-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                          className="text-xs border border-slate-300 rounded px-2 py-1"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn shadow-xl">
            <div className="p-6 border-b border-slate-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 dark:text-gray-100">Order Details</h2>
                <Button variant="ghost" onClick={() => setSelectedOrder(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-6 animate-slideUp">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-gray-100 mb-2">Order Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-slate-600 dark:text-gray-400">Order ID:</span> <span className="font-medium">{selectedOrder.id}</span></div>
                    <div><span className="text-slate-600 dark:text-gray-400">Date:</span> {new Date(selectedOrder.createdAt).toLocaleDateString()}</div>
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-600 dark:text-gray-400">Status:</span>
                      <Badge variant={getStatusVariant(selectedOrder.status)}>
                        {React.createElement(getStatusIcon(selectedOrder.status), { className: "h-3 w-3 mr-1" })}
                        {selectedOrder.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-gray-100 mb-2">Customer Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-slate-600 dark:text-gray-400">Name:</span> {selectedOrder.customerName}</div>
                    <div><span className="text-slate-600 dark:text-gray-400">Email:</span> {selectedOrder.customerEmail}</div>
                    <div><span className="text-slate-600 dark:text-gray-400">Address:</span> {selectedOrder.shippingAddress}</div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="animate-slideUp">
                <h3 className="font-semibold text-slate-900 dark:text-gray-100 mb-4">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div 
                      key={index} 
                      className="flex items-center space-x-4 p-3 bg-slate-50 dark:bg-gray-800 rounded-lg animate-fadeIn"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-900 dark:text-gray-100">{item.product.name}</h4>
                        <p className="text-sm text-slate-600 dark:text-gray-400">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-slate-900 dark:text-gray-100">${(item.product.price * item.quantity).toFixed(2)}</p>
                        <p className="text-sm text-slate-600 dark:text-gray-400">${item.product.price} each</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-slate-200 dark:border-gray-800 mt-4 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-slate-900 dark:text-gray-100">Total</span>
                    <span className="text-lg font-bold text-slate-900 dark:text-gray-100">${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}