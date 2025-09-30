import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Edit3, Save, X, Shield, Bell, CreditCard } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Card from '../shared/Card';
import Button from '../shared/Button';
import Input from '../shared/Input';

export default function Account() {
  const { state, dispatch } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: state.currentUser?.name || '',
    email: state.currentUser?.email || '',
    phone: '(555) 123-4567',
    address: '123 Main Street, New York, NY 10001',
    notifications: true,
    newsletter: false
  });

  const handleSave = () => {
    // In a real app, this would update the user profile
    setIsEditing(false);
    // You could dispatch an action to update the user
    // dispatch({ type: 'UPDATE_USER_PROFILE', payload: formData });
  };

  const accountStats = {
    totalOrders: state.orders.length,
    totalSpent: state.orders.reduce((sum, order) => sum + order.total, 0),
    memberSince: state.currentUser?.joinedAt || '2024-01-01'
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Account Settings</h1>
        <p className="text-slate-600">Manage your profile and preferences</p>
      </div>

      {/* Profile Section */}
      <Card>
        <div className="flex items-start justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900">Profile Information</h3>
          <Button
            variant={isEditing ? "ghost" : "outline"}
            size="sm"
            onClick={() => isEditing ? setIsEditing(false) : setIsEditing(true)}
          >
            {isEditing ? <X className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
        </div>

        <div className="flex items-center space-x-6 mb-6">
          <img
            src={state.currentUser?.avatar}
            alt={state.currentUser?.name}
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <h3 className="text-xl font-semibold text-slate-900">{state.currentUser?.name}</h3>
            <p className="text-slate-600">{state.currentUser?.email}</p>
            <p className="text-sm text-slate-500">
              Member since {new Date(accountStats.memberSince).toLocaleDateString()}
            </p>
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={formData.name}
                onChange={(value) => setFormData({ ...formData, name: value })}
              />
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(value) => setFormData({ ...formData, email: value })}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Phone"
                value={formData.phone}
                onChange={(value) => setFormData({ ...formData, phone: value })}
              />
              <Input
                label="Address"
                value={formData.address}
                onChange={(value) => setFormData({ ...formData, address: value })}
              />
            </div>

            <Button onClick={handleSave} className="w-full md:w-auto">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-600">Full Name</p>
                  <p className="font-medium text-slate-900">{formData.name}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-600">Email</p>
                  <p className="font-medium text-slate-900">{formData.email}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-600">Phone</p>
                  <p className="font-medium text-slate-900">{formData.phone}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-600">Address</p>
                  <p className="font-medium text-slate-900">{formData.address}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Account Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-center">
          <div className="text-2xl font-bold text-blue-600">{accountStats.totalOrders}</div>
          <div className="text-sm text-slate-600">Total Orders</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-green-600">${accountStats.totalSpent.toFixed(2)}</div>
          <div className="text-sm text-slate-600">Total Spent</div>
        </Card>
        <Card className="text-center">
          <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
          <div className="text-sm text-slate-600">Member Since</div>
          <div className="font-medium text-slate-900">
            {new Date(accountStats.memberSince).getFullYear()}
          </div>
        </Card>
      </div>

      {/* Preferences */}
      <Card>
        <h3 className="text-lg font-semibold text-slate-900 mb-6">Preferences</h3>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="h-5 w-5 text-slate-400" />
              <div>
                <p className="font-medium text-slate-900">Order Notifications</p>
                <p className="text-sm text-slate-600">Get notified about order updates</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.notifications}
                onChange={(e) => setFormData({ ...formData, notifications: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-slate-400" />
              <div>
                <p className="font-medium text-slate-900">Newsletter</p>
                <p className="text-sm text-slate-600">Receive our weekly newsletter</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.newsletter}
                onChange={(e) => setFormData({ ...formData, newsletter: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card hover className="cursor-pointer">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-slate-900">Security Settings</h4>
              <p className="text-sm text-slate-600">Change password and security preferences</p>
            </div>
          </div>
        </Card>

        <Card hover className="cursor-pointer">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CreditCard className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium text-slate-900">Payment Methods</h4>
              <p className="text-sm text-slate-600">Manage your saved payment methods</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}