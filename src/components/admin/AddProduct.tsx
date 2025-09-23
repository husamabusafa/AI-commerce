import React, { useState } from 'react';
import { ArrowLeft, Save, X, Upload, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import Card from '../shared/Card';
import Button from '../shared/Button';
import Input from '../shared/Input';

export default function AddProduct() {
  const { dispatch } = useApp();
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
  const [imagePreview, setImagePreview] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);

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
    
    if (!validateForm()) return;

    const newProduct: Product = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString().split('T')[0]
    };

    dispatch({ type: 'ADD_PRODUCT', payload: newProduct });
    dispatch({ type: 'SET_ADMIN_VIEW', payload: 'products' });
  };

  const goBack = () => {
    dispatch({ type: 'SET_ADMIN_VIEW', payload: 'products' });
  };

  const handleImageUrlChange = (value: string) => {
    setFormData({ ...formData, image: value });
    setImagePreview(value);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    // In a real app, you would handle file upload here
    // For demo purposes, we'll show a placeholder
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      // This would typically upload to a server and return a URL
      const demoUrl = 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=400';
      handleImageUrlChange(demoUrl);
    }
  };

  const sampleImages = [
    'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1667088/pexels-photo-1667088.jpeg?auto=compress&cs=tinysrgb&w=400'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-950 dark:to-gray-900 p-6 animate-slideIn">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="ghost" onClick={goBack} className="animate-fadeIn hover:scale-105">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Products
          </Button>
        </div>
        
        <div className="text-center animate-slideUp">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-gray-100 mb-3">
            Create New Product
          </h1>
          <p className="text-lg text-slate-600 dark:text-gray-400">
            Add a new product to your store inventory
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card className="animate-scaleIn hover:shadow-xl transition-all duration-300">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <ImageIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-gray-100">
                    Basic Information
                  </h3>
                </div>

                <div className="space-y-6">
                  <Input
                    label="Product Name"
                    value={formData.name}
                    onChange={(value) => setFormData({ ...formData, name: value })}
                    error={errors.name}
                    required
                    placeholder="Enter product name..."
                    className="animate-slideUp"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Price"
                      type="number"
                      value={formData.price.toString()}
                      onChange={(value) => setFormData({ ...formData, price: parseFloat(value) || 0 })}
                      error={errors.price}
                      required
                      placeholder="0.00"
                      className="animate-slideUp"
                    />

                    <Input
                      label="Stock Quantity"
                      type="number"
                      value={formData.stock.toString()}
                      onChange={(value) => setFormData({ ...formData, stock: parseInt(value) || 0 })}
                      error={errors.stock}
                      required
                      placeholder="0"
                      className="animate-slideUp"
                    />
                  </div>

                  <div className="animate-slideUp">
                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="block w-full px-4 py-3 text-sm border border-slate-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-slate-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-slate-400 dark:hover:border-gray-500"
                    >
                      <option value="Electronics">Electronics</option>
                      <option value="Furniture">Furniture</option>
                      <option value="Kitchen">Kitchen</option>
                      <option value="Sports">Sports</option>
                      <option value="Fashion">Fashion</option>
                      <option value="Books">Books</option>
                      <option value="Home & Garden">Home & Garden</option>
                    </select>
                  </div>

                  <div className="animate-slideUp">
                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className={`block w-full px-4 py-3 text-sm border rounded-xl bg-white dark:bg-gray-900 text-slate-900 dark:text-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                        errors.description ? 'border-red-300 dark:border-red-600' : 'border-slate-300 dark:border-gray-600 hover:border-slate-400 dark:hover:border-gray-500'
                      }`}
                      placeholder="Describe your product in detail..."
                    />
                    {errors.description && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-2 animate-fadeIn flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-slate-50 dark:bg-gray-800 rounded-xl animate-slideUp">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-gray-600 rounded transition-all duration-200"
                    />
                    <label htmlFor="featured" className="text-sm font-medium text-slate-700 dark:text-gray-300">
                      Mark as Featured Product
                    </label>
                  </div>
                </div>
              </Card>
            </div>

            {/* Image Upload Section */}
            <div className="space-y-6">
              <Card className="animate-scaleIn hover:shadow-xl transition-all duration-300">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Upload className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-gray-100">
                    Product Image
                  </h3>
                </div>

                {/* Image URL Input */}
                <div className="mb-6">
                  <Input
                    label="Image URL"
                    value={formData.image}
                    onChange={handleImageUrlChange}
                    error={errors.image}
                    required
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                {/* Drag & Drop Area */}
                <div
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                    dragActive
                      ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-slate-300 dark:border-gray-600 hover:border-slate-400 dark:hover:border-gray-500'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="h-12 w-12 text-slate-400 dark:text-gray-500 mx-auto mb-4" />
                  <p className="text-slate-600 dark:text-gray-400 mb-2">
                    Drag & drop an image here
                  </p>
                  <p className="text-sm text-slate-500 dark:text-gray-500">
                    or use the URL field above
                  </p>
                </div>

                {/* Sample Images */}
                <div className="mt-6">
                  <p className="text-sm font-medium text-slate-700 dark:text-gray-300 mb-3">
                    Or choose from samples:
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {sampleImages.map((url, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleImageUrlChange(url)}
                        className="relative group overflow-hidden rounded-lg border-2 border-transparent hover:border-blue-400 transition-all duration-200 transform hover:scale-105"
                      >
                        <img
                          src={url}
                          alt={`Sample ${index + 1}`}
                          className="w-full h-20 object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Image Preview */}
                {imagePreview && (
                  <div className="mt-6 animate-fadeIn">
                    <p className="text-sm font-medium text-slate-700 dark:text-gray-300 mb-3">
                      Preview:
                    </p>
                    <div className="relative group">
                      <img
                        src={imagePreview}
                        alt="Product preview"
                        className="w-full h-48 object-cover rounded-lg shadow-md"
                        onError={() => setImagePreview('')}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </div>
                  </div>
                )}
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3 animate-slideUp">
                <Button type="submit" className="w-full py-4 text-lg font-semibold hover:scale-105 transform transition-all duration-200">
                  <Save className="h-5 w-5 mr-2" />
                  Create Product
                </Button>
                <Button variant="outline" onClick={goBack} className="w-full py-4 hover:scale-105 transform transition-all duration-200">
                  <X className="h-5 w-5 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}