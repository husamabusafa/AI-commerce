import { useState } from 'react';
import { Plus, Edit3, Trash2, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { useLanguage } from '../../context/LanguageContext';
import { Product } from '../../types';
import ConfirmModal from '../shared/ConfirmModal';
import toast from 'react-hot-toast';

export default function Products() {
  const navigate = useNavigate();
  const { products, deleteProduct } = useProducts();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    productId: string;
    productName: string;
  }>({
    isOpen: false,
    productId: '',
    productName: '',
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredProducts = (products || []).filter((product: Product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.category?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteClick = (productId: string, productName: string) => {
    setDeleteModal({
      isOpen: true,
      productId,
      productName,
    });
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteProduct(deleteModal.productId);
      if (result.success) {
        toast.success(t('products.deleted'));
        setDeleteModal({ isOpen: false, productId: '', productName: '' });
      }
    } catch (err: any) {
      toast.error(err.message || t('products.deleteError'));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen app-bg p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-luxury-text-light dark:text-luxury-text-dark arabic-heading">{t('products.title')}</h1>
            <p className="text-luxury-gray-600 dark:text-luxury-gray-400 mt-1 arabic-text">{t('products.subtitle')}</p>
          </div>
          <button
            onClick={() => navigate('/admin/products/add')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-luxury-gold-primary hover:bg-luxury-gold-secondary text-white font-medium rounded-2xl shadow-glow transition-all hover:scale-105 arabic-text"
          >
            <Plus className="h-5 w-5" />
            {t('products.addProduct')}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass rounded-2xl p-6 border border-luxury-gray-200 dark:border-luxury-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
                <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-luxury-gray-600 dark:text-luxury-gray-400 arabic-text">{t('products.total')}</p>
                <p className="text-2xl font-bold text-luxury-text-light dark:text-luxury-text-dark">{(products || []).length}</p>
              </div>
            </div>
          </div>
          <div className="glass rounded-2xl p-6 border border-luxury-gray-200 dark:border-luxury-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-100 dark:bg-amber-900/20 rounded-xl">
                <Package className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-luxury-gray-600 dark:text-luxury-gray-400 arabic-text">{t('products.lowStock')}</p>
                <p className="text-2xl font-bold text-luxury-text-light dark:text-luxury-text-dark">{(products || []).filter((p: Product) => p.stock < 10).length}</p>
              </div>
            </div>
          </div>
          <div className="glass rounded-2xl p-6 border border-luxury-gray-200 dark:border-luxury-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-xl">
                <Package className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-luxury-gray-600 dark:text-luxury-gray-400 arabic-text">{t('products.inStock')}</p>
                <p className="text-2xl font-bold text-luxury-text-light dark:text-luxury-text-dark">{(products || []).filter((p: Product) => p.stock >= 10).length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="glass rounded-2xl p-4 border border-luxury-gray-200 dark:border-luxury-gray-700">
          <input
            type="search"
            placeholder={t('products.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 bg-transparent text-luxury-text-light dark:text-luxury-text-dark placeholder-luxury-gray-400 focus:outline-none arabic-text"
          />
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="glass rounded-3xl p-12 text-center border border-luxury-gray-200 dark:border-luxury-gray-700">
            <div className="p-4 bg-luxury-gray-100 dark:bg-luxury-gray-800 rounded-2xl w-fit mx-auto mb-4">
              <Package className="h-12 w-12 text-luxury-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-luxury-text-light dark:text-luxury-text-dark mb-2 arabic-heading">{t('products.noProductsTitle')}</h3>
            <p className="text-luxury-gray-600 dark:text-luxury-gray-400 mb-6 arabic-text">
              {searchQuery ? t('products.noProductsDesc') : t('products.firstProductDesc')}
            </p>
            <button
              onClick={() => navigate('/admin/products/add')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-luxury-gold-primary hover:bg-luxury-gold-secondary text-white font-medium rounded-2xl shadow-glow transition-all arabic-text"
            >
              <Plus className="h-5 w-5" />
              {t('products.addProduct')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
            {filteredProducts.map((product: Product) => (
              <div key={product.id} className="glass rounded-3xl p-6 border border-luxury-gray-200 dark:border-luxury-gray-700 hover:shadow-luxury transition-all group relative">
                <div className="aspect-w-16 aspect-h-9 mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-2xl"
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-luxury-text-light dark:text-luxury-text-dark line-clamp-2 arabic-heading">{product.name}</h3>
                    {product.featured && (
                      <span className="px-2 py-1 bg-luxury-gold-primary/10 text-luxury-gold-primary text-xs rounded-lg whitespace-nowrap">{t('products.featured')}</span>
                    )}
                  </div>
                  
                  <p className="text-sm text-luxury-gray-600 dark:text-luxury-gray-400 line-clamp-2 arabic-text">{product.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-luxury-text-light dark:text-luxury-text-dark">${product.price}</span>
                    <span className={`px-3 py-1 rounded-xl text-sm font-medium ${
                      product.stock < 10 
                        ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                        : 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                    }`}>
                      {product.stock} {t('products.inStock')}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-luxury-gray-500 dark:text-luxury-gray-400">
                    <span className="arabic-text">{product.category?.name || t('category.uncategorized')}</span>
                    <span>{new Date(product.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 flex gap-2">
                  <button
                    onClick={() => navigate(`/admin/products/${product.id}/edit`)}
                    className="p-2.5 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/40 rounded-xl transition-all"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(product.id, product.name)}
                    className="p-2.5 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/40 rounded-xl transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, productId: '', productName: '' })}
        onConfirm={handleDeleteConfirm}
        title={t('products.deleteTitle')}
        message={`${t('products.deleteConfirm')} "${deleteModal.productName}"?`}
        confirmText={t('common.delete')}
        cancelText={t('common.cancel')}
        isDangerous={true}
        isLoading={isDeleting}
      />
    </div>
  );
}