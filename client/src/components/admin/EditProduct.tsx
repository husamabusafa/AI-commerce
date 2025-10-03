import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, X, Trash2, Package, Upload, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { useLanguage } from '../../context/LanguageContext';
import { useProduct } from '../../hooks/useProducts';
import ConfirmModal from '../shared/ConfirmModal';
import Card from '../shared/Card';
import Button from '../shared/Button';
import Input from '../shared/Input';
import CustomSelect from '../shared/CustomSelect';
import toast from 'react-hot-toast';

export default function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const { categories, updateProduct, deleteProduct } = useProducts();
  const { product, loading: productLoading } = useProduct(id || '');
  
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    nameEn: '',
    nameAr: '',
    price: 0,
    description: '',
    descriptionEn: '',
    descriptionAr: '',
    image: '',
    images: [] as string[],
    categoryId: '',
    stock: 0,
    featured: false,
    active: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        id: product.id,
        name: product.name,
        nameEn: product.nameEn || '',
        nameAr: product.nameAr || '',
        price: product.price,
        description: product.description,
        descriptionEn: product.descriptionEn || '',
        descriptionAr: product.descriptionAr || '',
        image: product.image,
        images: product.images || [],
        categoryId: product.category?.id || (categories.length > 0 ? categories[0].id : ''),
        stock: product.stock,
        featured: product.featured,
        active: product.active
      });
      setImagePreview(product.image);
    }
  }, [product, categories]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = t('addProduct.nameRequired');
    if (formData.price <= 0) newErrors.price = t('addProduct.priceRequired');
    if (!formData.description.trim()) newErrors.description = t('addProduct.descriptionRequired');
    if (!formData.image.trim()) newErrors.image = t('addProduct.imageRequired');
    if (!formData.categoryId) newErrors.categoryId = t('addProduct.categoryRequired');
    if (formData.stock < 0) newErrors.stock = t('addProduct.stockRequired');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    const result = await updateProduct(formData);
    setIsSubmitting(false);
    
    if (result.success) {
      navigate('/admin/products');
    }
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    const result = await deleteProduct(id || '');
    setIsDeleting(false);
    
    if (result.success) {
      toast.success(t('products.deleted'));
      setDeleteModal(false);
      navigate('/admin/products');
    } else {
      toast.error(result.error || t('products.deleteError'));
    }
  };

  const handleImageUrlChange = (value: string) => {
    setFormData({ ...formData, image: value });
    setImagePreview(value);
  };

  const goBack = () => {
    navigate('/admin/products');
  };

  if (productLoading) {
    return (
      <div className="min-h-screen app-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luxury-gold-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen app-bg p-6">
        <div className="max-w-7xl mx-auto">
          <div className="glass rounded-3xl p-12 text-center border border-luxury-gray-200 dark:border-luxury-gray-700">
            <div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-2xl w-fit mx-auto mb-4">
              <Package className="h-12 w-12 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-luxury-text-light dark:text-luxury-text-dark mb-2 arabic-heading">{t('products.notFound')}</h2>
            <p className="text-luxury-gray-600 dark:text-luxury-gray-400 mb-6 arabic-text">{t('products.notFoundDesc')}</p>
            <button
              onClick={goBack}
              className="px-6 py-3 bg-luxury-gold-primary hover:bg-luxury-gold-secondary text-white font-medium rounded-2xl shadow-glow transition-all arabic-text"
            >
              {t('common.back')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-light dark:bg-luxury-dark p-6 animate-slideIn">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center space-x-4 rtl:space-x-reverse mb-6">
          <Button variant="ghost" onClick={goBack} className="animate-fadeIn hover:scale-105">
            <ArrowLeft className="h-5 w-5 ltr:mr-2 rtl:ml-2 rtl:scale-x-[-1]" />
            {t('addProduct.backToProducts')}
          </Button>
        </div>
        
        <div className="flex items-center justify-between animate-slideUp">
          <div>
            <h1 className="text-3xl font-bold text-luxury-text-light dark:text-luxury-text-dark mb-2">
              {t('editProduct.title')}
            </h1>
            <p className="text-luxury-gray-600 dark:text-luxury-gray-400">
              {t('editProduct.subtitle')}
            </p>
          </div>
          <Button 
            variant="danger" 
            onClick={() => setDeleteModal(true)}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <Trash2 className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
            {t('common.delete')}
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
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
                    <CustomSelect
                      label={t('addProduct.category')}
                      value={formData.categoryId}
                      onChange={(value) => setFormData({ ...formData, categoryId: value })}
                      options={categories}
                      placeholder={t('addProduct.selectCategory')}
                      error={errors.categoryId}
                      required
                    />
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
                  disabled={isSubmitting}
                  className="w-full py-3 font-semibold bg-luxury-gold-primary hover:bg-luxury-gold-secondary text-white hover:scale-[1.02] transform transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                  {isSubmitting ? t('common.loading') : t('editProduct.update')}
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

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title={t('products.deleteTitle')}
        message={`${t('products.deleteConfirm')} "${product.name}"?`}
        confirmText={t('common.delete')}
        cancelText={t('common.cancel')}
        isDangerous={true}
        isLoading={isDeleting}
      />
    </div>
  );
}