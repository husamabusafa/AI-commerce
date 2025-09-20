import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, X, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import Card from '../shared/Card';
import Button from '../shared/Button';
import Input from '../shared/Input';

export default function EditProduct() {
  const { state, dispatch } = useApp();
  const product = state.editingProduct;
  
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    description: '',
    image: '',
    category: 'Electronics',
    stock: 0,
    featured: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price,
        description: product.description,
        image: product.image,
        category: product.category,
        stock: product.stock,
        featured: product.featured
      });
    }
  }, [product]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.image.trim()) newErrors.image = 'Image URL is required';
    if (formData.stock < 0) newErrors.stock = 'Stock cannot be negative';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !product) return;

    const updatedProduct: Product = {
      ...product,
      ...formData
    };

    dispatch({ type: 'UPDATE_PRODUCT', payload: updatedProduct });
    dispatch({ type: 'SET_EDITING_PRODUCT', payload: null });
    dispatch({ type: 'SET_ADMIN_VIEW', payload: 'products' });
  };

  const handleDelete = () => {
    if (!product) return;
    
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      dispatch({ type: 'DELETE_PRODUCT', payload: product.id });
      dispatch({ type: 'SET_EDITING_PRODUCT', payload: null });
      dispatch({ type: 'SET_ADMIN_VIEW', payload: 'products' });
    }
  };

  const goBack = () => {
    dispatch({ type: 'SET_EDITING_PRODUCT', payload: null });
    dispatch({ type: 'SET_ADMIN_VIEW', payload: 'products' });
  };

  if (!product) {
    return (
      <div className="p-6">
        <Card className="text-center py-12">
          <h2 className="text-lg font-medium text-slate-900 mb-2">Product not found</h2>
          <p className="text-slate-600 mb-4">The product you're trying to edit doesn't exist.</p>
          <Button onClick={goBack}>Back to Products</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-slideIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={goBack} className="animate-fadeIn">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Edit Product</h1>
            <p className="text-slate-600">Update product information</p>
          </div>
        </div>
        
        <Button variant="danger" onClick={handleDelete} className="animate-fadeIn">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Product
        </Button>
      </div>

      <div className="max-w-2xl">
        <Card className="animate-scaleIn">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Input
                  label="Product Name"
                  value={formData.name}
                  onChange={(value) => setFormData({ ...formData, name: value })}
                  error={errors.name}
                  required
                  className="animate-slideUp"
                />
              </div>

              <Input
                label="Price"
                type="number"
                value={formData.price.toString()}
                onChange={(value) => setFormData({ ...formData, price: parseFloat(value) || 0 })}
                error={errors.price}
                required
                className="animate-slideUp"
              />

              <Input
                label="Stock Quantity"
                type="number"
                value={formData.stock.toString()}
                onChange={(value) => setFormData({ ...formData, stock: parseInt(value) || 0 })}
                error={errors.stock}
                required
                className="animate-slideUp"
              />

              <div className="md:col-span-2 animate-slideUp">
                <Input
                  label="Image URL"
                  value={formData.image}
                  onChange={(value) => setFormData({ ...formData, image: value })}
                  error={errors.image}
                  required
                />
              </div>

              <div className="animate-slideUp">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="block w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Kitchen">Kitchen</option>
                  <option value="Sports">Sports</option>
                  <option value="Fashion">Fashion</option>
                </select>
              </div>

              <div className="flex items-center space-x-3 animate-slideUp">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded transition-all duration-200"
                />
                <label htmlFor="featured" className="text-sm font-medium text-slate-700">
                  Featured Product
                </label>
              </div>

              <div className="md:col-span-2 animate-slideUp">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className={`block w-full px-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                    errors.description ? 'border-red-300' : 'border-slate-300'
                  }`}
                  placeholder="Enter product description..."
                />
                {errors.description && (
                  <p className="text-sm text-red-600 mt-1 animate-fadeIn">{errors.description}</p>
                )}
              </div>
            </div>

            {/* Image Preview */}
            {formData.image && (
              <div className="animate-fadeIn">
                <label className="block text-sm font-medium text-slate-700 mb-2">Preview</label>
                <div className="w-32 h-32 rounded-lg overflow-hidden border border-slate-200">
                  <img
                    src={formData.image}
                    alt="Product preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/128x128?text=Invalid+URL';
                    }}
                  />
                </div>
              </div>
            )}

            <div className="flex space-x-4 pt-6 border-t border-slate-200">
              <Button type="submit" className="flex-1 animate-slideUp">
                <Save className="h-4 w-4 mr-2" />
                Update Product
              </Button>
              <Button variant="outline" onClick={goBack} className="animate-slideUp">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}