import React, { useState } from 'react';
import { ArrowLeft, Save, X, Upload, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { useLanguage } from '../../context/LanguageContext';
import Card from '../shared/Card';
import Button from '../shared/Button';
import Input from '../shared/Input';

export default function AddProduct() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { categories, createProduct, loading } = useProducts();
  const [formData, setFormData] = useState({
    name: '',
    nameAr: '',
    nameEn: '',
    price: 0,
    description: '',
    descriptionAr: '',
    descriptionEn: '',
    image: '',
    images: [] as string[],
    categoryId: '',
    stock: 0,
    featured: false,
    active: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);

  // Set default category if categories are loaded and no category is selected
  React.useEffect(() => {
    if (categories.length > 0 && !formData.categoryId) {
      setFormData(prev => ({ ...prev, categoryId: categories[0].id }));
    }
  }, [categories, formData.categoryId]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.image.trim()) newErrors.image = 'Image URL is required';
    if (!formData.categoryId) newErrors.categoryId = 'Category is required';
    if (formData.stock < 0) newErrors.stock = 'Stock cannot be negative';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const result = await createProduct(formData);
    if (result.success) {
      navigate('/admin/products');
    }
  };

  const goBack = () => {
    navigate('/admin/products');
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
    <div className="min-h-screen bg-luxury-light dark:bg-luxury-dark p-6 animate-slideIn">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex items-center space-x-4 rtl:space-x-reverse mb-6">
          <Button variant="ghost" onClick={goBack} className="animate-fadeIn hover:scale-105">
            <ArrowLeft className="h-5 w-5 ltr:mr-2 rtl:ml-2 rtl:scale-x-[-1]" />
            {t('addProduct.backToProducts')}
          </Button>
        </div>
        
        <div className="animate-slideUp">
          <h1 className="text-3xl font-bold text-luxury-text-light dark:text-luxury-text-dark mb-2">
            {t('addProduct.title')}
          </h1>
          <p className="text-luxury-gray-600 dark:text-luxury-gray-400">
            {t('addProduct.subtitle')}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card className="animate-scaleIn hover:shadow-luxury transition-all duration-200">
                <div className="flex items-center space-x-3 rtl:space-x-reverse mb-6">
                  <div className="p-2 bg-luxury-gray-100 dark:bg-luxury-gray-700 rounded-lg">
                    <ImageIcon className="h-5 w-5 text-luxury-gold-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-luxury-text-light dark:text-luxury-text-dark">
                    {t('addProduct.basicInfo')}
                  </h3>
                </div>

                <div className="space-y-6">
                  <Input
                    label={t('addProduct.productName')}
                    value={formData.name}
                    onChange={(value) => setFormData({ ...formData, name: value })}
                    error={errors.name}
                    required
                    placeholder="Enter product name..."
                    className="animate-slideUp"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label={t('addProduct.price')}
                      type="number"
                      value={formData.price.toString()}
                      onChange={(value) => setFormData({ ...formData, price: parseFloat(value) || 0 })}
                      error={errors.price}
                      required
                      placeholder="0.00"
                      className="animate-slideUp"
                    />

                    <Input
                      label={t('addProduct.stock')}
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
                    <label className="block text-sm font-medium text-luxury-gray-700 dark:text-luxury-gray-300 mb-2">
                      {t('addProduct.category')} <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                      className={`block w-full px-4 py-3 text-sm border rounded-xl bg-white dark:bg-luxury-dark text-luxury-text-light dark:text-luxury-text-dark focus:outline-none focus:ring-2 focus:ring-luxury-gold-primary transition-all duration-200 ${
                        errors.categoryId ? 'border-red-300 dark:border-red-600' : 'border-luxury-gray-300 dark:border-luxury-gray-600 hover:border-luxury-gray-400 dark:hover:border-luxury-gray-500'
                      }`}
                    >
                      <option value="">{t('addProduct.selectCategory')}</option>
                      {categories.map((category: any) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {errors.categoryId && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-2 animate-fadeIn flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.categoryId}
                      </p>
                    )}
                  </div>

                  <div className="animate-slideUp">
                    <label className="block text-sm font-medium text-luxury-gray-700 dark:text-luxury-gray-300 mb-2">
                      {t('addProduct.description')} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className={`block w-full px-4 py-3 text-sm border rounded-xl bg-white dark:bg-luxury-dark text-luxury-text-light dark:text-luxury-text-dark transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-luxury-gold-primary resize-none ${
                        errors.description ? 'border-red-300 dark:border-red-600' : 'border-luxury-gray-300 dark:border-luxury-gray-600 hover:border-luxury-gray-400 dark:hover:border-luxury-gray-500'
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

                  <div className="flex items-center space-x-3 rtl:space-x-reverse p-4 bg-luxury-gray-100 dark:bg-luxury-gray-800 rounded-xl animate-slideUp">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="h-4 w-4 text-luxury-gold-primary focus:ring-luxury-gold-primary border-luxury-gray-300 dark:border-luxury-gray-600 rounded transition-all duration-200"
                    />
                    <label htmlFor="featured" className="text-sm font-medium text-luxury-gray-700 dark:text-luxury-gray-300">
                      {t('addProduct.featured')}
                    </label>
                  </div>
                </div>
              </Card>
            </div>

            {/* Image Upload Section */}
            <div className="space-y-6">
              <Card className="animate-scaleIn hover:shadow-luxury transition-all duration-200">
                <div className="flex items-center space-x-3 rtl:space-x-reverse mb-6">
                  <div className="p-2 bg-luxury-gray-100 dark:bg-luxury-gray-700 rounded-lg">
                    <Upload className="h-5 w-5 text-luxury-gold-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-luxury-text-light dark:text-luxury-text-dark">
                    {t('addProduct.productImage')}
                  </h3>
                </div>

                {/* Image URL Input */}
                <div className="mb-6">
                  <Input
                    label={t('addProduct.imageUrl')}
                    value={formData.image}
                    onChange={handleImageUrlChange}
                    error={errors.image}
                    required
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                {/* Drag & Drop Area */}
                <div
                  className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 ${
                    dragActive
                      ? 'border-luxury-gold-primary bg-luxury-gold-primary/10'
                      : 'border-luxury-gray-300 dark:border-luxury-gray-600 hover:border-luxury-gold-primary'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="h-10 w-10 text-luxury-gray-400 dark:text-luxury-gray-500 mx-auto mb-3" />
                  <p className="text-luxury-gray-600 dark:text-luxury-gray-400 mb-2">
                    {t('addProduct.dragDrop')}
                  </p>
                  <p className="text-sm text-luxury-gray-500 dark:text-luxury-gray-500">
                    {t('addProduct.orUseUrl')}
                  </p>
                </div>

                {/* Sample Images */}
                <div className="mt-6">
                  <p className="text-sm font-medium text-luxury-gray-700 dark:text-luxury-gray-300 mb-3">
                    {t('addProduct.chooseSamples')}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {sampleImages.map((url, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleImageUrlChange(url)}
                        className="relative group overflow-hidden rounded-lg border-2 border-transparent hover:border-luxury-gold-primary transition-all duration-200 transform hover:scale-105"
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
                    <p className="text-sm font-medium text-luxury-gray-700 dark:text-luxury-gray-300 mb-3">
                      {t('addProduct.preview')}
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
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-3 font-semibold bg-luxury-gold-primary hover:bg-luxury-gold-secondary text-white hover:scale-[1.02] transform transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                  {loading ? 'Creating...' : t('addProduct.createProduct')}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={goBack} 
                  className="w-full py-3 border-luxury-gray-300 dark:border-luxury-gray-600 text-luxury-text-light dark:text-luxury-text-dark hover:bg-luxury-gray-100 dark:hover:bg-luxury-gray-700 hover:scale-[1.02] transform transition-all duration-200"
                >
                  <X className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                  {t('addProduct.cancel')}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}