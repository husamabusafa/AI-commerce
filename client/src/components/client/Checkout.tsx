import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Shield, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';
import Button from '../shared/Button';
import Card from '../shared/Card';
import Input from '../shared/Input';

export default function Checkout() {
  const { state, dispatch } = useApp();
  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping');
  const [formData, setFormData] = useState({
    // Shipping
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    country: 'United States',
    // Payment
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });

  const subtotal = state.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + tax + shipping;

  const goBack = () => {
    dispatch({ type: 'SET_CLIENT_VIEW', payload: 'cart' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 'shipping') {
      setStep('payment');
    } else if (step === 'payment') {
      // Create order
      const order: Order = {
        id: `ORD-${Date.now().toString().slice(-6)}`,
        items: state.cart,
        total,
        status: 'pending',
        customerName: `${formData.firstName} ${formData.lastName}`,
        customerEmail: formData.email,
        shippingAddress: `${formData.address}, ${formData.city}, ${formData.zipCode}`,
        createdAt: new Date().toISOString().split('T')[0]
      };

      dispatch({ type: 'ADD_ORDER', payload: order });
      dispatch({ type: 'CLEAR_CART' });
      setStep('confirmation');
    }
  };

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (step === 'confirmation') {
    return (
      <div className="p-6">
        <Card className="max-w-md mx-auto text-center py-12">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Order Confirmed!</h2>
          <p className="text-slate-600 mb-6">
            Thank you for your order. We'll send you a confirmation email shortly.
          </p>
          <div className="space-y-3">
            <Button onClick={() => dispatch({ type: 'SET_CLIENT_VIEW', payload: 'orders' })}>
              View Order
            </Button>
            <Button
              variant="outline"
              onClick={() => dispatch({ type: 'SET_CLIENT_VIEW', payload: 'shop' })}
            >
              Continue Shopping
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={goBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Cart
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Checkout</h1>
          <p className="text-slate-600">Complete your order</p>
        </div>
      </div>

      {/* Progress Steps */}
      <Card>
        <div className="flex items-center justify-between">
          <div className={`flex items-center space-x-2 ${step === 'shipping' ? 'text-blue-600' : 'text-green-600'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step === 'shipping' ? 'bg-blue-100' : 'bg-green-100'
            }`}>
              {step === 'shipping' ? '1' : <CheckCircle className="h-5 w-5" />}
            </div>
            <span className="font-medium">Shipping</span>
          </div>
          
          <div className={`w-12 h-0.5 ${step === 'payment' ? 'bg-blue-200' : 'bg-slate-200'}`} />
          
          <div className={`flex items-center space-x-2 ${
            step === 'shipping' ? 'text-slate-400' : step === 'payment' ? 'text-blue-600' : 'text-green-600'
          }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step === 'shipping' ? 'bg-slate-100' :
              step === 'payment' ? 'bg-blue-100' : 'bg-green-100'
            }`}>
              {step === 'confirmation' ? <CheckCircle className="h-5 w-5" /> : '2'}
            </div>
            <span className="font-medium">Payment</span>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 'shipping' && (
              <Card>
                <h3 className="text-lg font-semibold text-slate-900 mb-6">Shipping Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Input
                    label="First Name"
                    value={formData.firstName}
                    onChange={(value) => updateField('firstName', value)}
                    required
                  />
                  <Input
                    label="Last Name"
                    value={formData.lastName}
                    onChange={(value) => updateField('lastName', value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Input
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(value) => updateField('email', value)}
                    required
                  />
                  <Input
                    label="Phone"
                    value={formData.phone}
                    onChange={(value) => updateField('phone', value)}
                    required
                  />
                </div>

                <Input
                  label="Address"
                  value={formData.address}
                  onChange={(value) => updateField('address', value)}
                  required
                  className="mb-4"
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="City"
                    value={formData.city}
                    onChange={(value) => updateField('city', value)}
                    required
                  />
                  <Input
                    label="ZIP Code"
                    value={formData.zipCode}
                    onChange={(value) => updateField('zipCode', value)}
                    required
                  />
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-slate-700">Country</label>
                    <select
                      value={formData.country}
                      onChange={(e) => updateField('country', e.target.value)}
                      className="block w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                    </select>
                  </div>
                </div>

                <Button type="submit" className="w-full mt-6">
                  Continue to Payment
                </Button>
              </Card>
            )}

            {step === 'payment' && (
              <Card>
                <h3 className="text-lg font-semibold text-slate-900 mb-6">Payment Information</h3>
                
                <div className="flex items-center space-x-2 mb-4 p-3 bg-blue-50 rounded-lg">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span className="text-sm text-blue-700">Your payment information is secure and encrypted</span>
                </div>

                <Input
                  label="Card Number"
                  value={formData.cardNumber}
                  onChange={(value) => updateField('cardNumber', value)}
                  placeholder="1234 5678 9012 3456"
                  required
                  className="mb-4"
                />

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <Input
                    label="Expiry Date"
                    value={formData.expiryDate}
                    onChange={(value) => updateField('expiryDate', value)}
                    placeholder="MM/YY"
                    required
                  />
                  <Input
                    label="CVV"
                    value={formData.cvv}
                    onChange={(value) => updateField('cvv', value)}
                    placeholder="123"
                    required
                  />
                </div>

                <Input
                  label="Name on Card"
                  value={formData.cardName}
                  onChange={(value) => updateField('cardName', value)}
                  required
                  className="mb-6"
                />

                <div className="flex space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep('shipping')}
                  >
                    Back
                  </Button>
                  <Button type="submit" className="flex-1">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Complete Order
                  </Button>
                </div>
              </Card>
            )}
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Order Summary</h3>
            
            <div className="space-y-3 mb-4">
              {state.cart.map((item) => (
                <div key={item.product.id} className="flex items-center space-x-3">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{item.product.name}</p>
                    <p className="text-sm text-slate-600">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-medium text-slate-900">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200 pt-4 space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}