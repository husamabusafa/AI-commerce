import { useState } from 'react';
import { Plus, Trash2, Tag, Package, AlertCircle } from 'lucide-react';
import { useQuery, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { GET_CATEGORIES, DELETE_CATEGORY } from '../../graphql/queries';
import ConfirmModal from '../shared/ConfirmModal';
import toast from 'react-hot-toast';

interface Category {
  id: string;
  name: string;
  nameEn: string;
  nameAr: string;
  description?: string;
  _count?: {
    products: number;
  };
}

export default function Categories() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { data, loading, error } = useQuery(GET_CATEGORIES);
  const [deleteCategory] = useMutation(DELETE_CATEGORY, {
    refetchQueries: [{ query: GET_CATEGORIES }],
    awaitRefetchQueries: true,
  });
  
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    categoryId: string;
    categoryName: string;
    productCount: number;
  }>({
    isOpen: false,
    categoryId: '',
    categoryName: '',
    productCount: 0,
  });
  const [isDeleting, setIsDeleting] = useState(false);
  
  const categories: Category[] = data?.categories || [];

  const handleDeleteClick = (id: string, name: string, productCount: number) => {
    setDeleteModal({
      isOpen: true,
      categoryId: id,
      categoryName: name,
      productCount,
    });
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await deleteCategory({ variables: { id: deleteModal.categoryId } });
      toast.success(t('categories.deleted'));
      setDeleteModal({ isOpen: false, categoryId: '', categoryName: '', productCount: 0 });
    } catch (err: any) {
      toast.error(err.message || t('categories.error'));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen app-bg p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-luxury-text-light dark:text-luxury-text-dark arabic-heading">
              {t('categories.title')}
            </h1>
            <p className="text-luxury-gray-600 dark:text-luxury-gray-400 mt-1 arabic-text">
              {t('categories.subtitle')}
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/categories/add')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-luxury-gold-primary hover:bg-luxury-gold-secondary text-white font-medium rounded-2xl transition-all duration-200 hover:shadow-glow"
          >
            <Plus className="h-5 w-5" />
            <span className="arabic-text">{t('categories.addCategory')}</span>
          </button>
        </div>

        {/* Categories List Card */}
        <div className="glass rounded-3xl shadow-luxury border border-luxury-gray-200 dark:border-luxury-gray-700">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-luxury-gold-primary/10 rounded-2xl">
                <Tag className="h-5 w-5 text-luxury-gold-primary" />
              </div>
              <h2 className="text-lg font-semibold text-luxury-text-light dark:text-luxury-text-dark arabic-heading">
                {t('categories.title')}
              </h2>
              {!loading && (
                <span className="ltr:ml-auto rtl:mr-auto px-3 py-1.5 bg-luxury-gray-100 dark:bg-luxury-gray-700 text-luxury-text-light dark:text-luxury-text-dark text-sm font-medium rounded-xl">
                  {categories.length}
                </span>
              )}
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-luxury-gold-primary"></div>
              </div>
            ) : error ? (
              <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-2xl">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                <p className="text-red-700 dark:text-red-300 arabic-text">{error.message}</p>
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex p-4 bg-luxury-gray-100 dark:bg-luxury-gray-700 rounded-3xl mb-4">
                  <Tag className="h-12 w-12 text-luxury-gray-400 dark:text-luxury-gray-500" />
                </div>
                <p className="text-luxury-gray-600 dark:text-luxury-gray-400 font-medium arabic-text">
                  {t('categories.noCategories')}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {categories.map((cat) => {
                  const productCount = cat._count?.products || 0;
                  
                  return (
                    <div 
                      key={cat.id} 
                      className="flex items-center justify-between p-5 glass hover:bg-luxury-gray-50 dark:hover:bg-luxury-gray-700/50 rounded-2xl transition-all duration-200 border border-luxury-gray-200 dark:border-luxury-gray-700 group"
                    >
                      <div className="flex items-start gap-4 flex-1">
                        <div className="p-2.5 bg-luxury-gold-primary/10 rounded-xl group-hover:bg-luxury-gold-primary/20 transition-colors">
                          <Tag className="h-5 w-5 text-luxury-gold-primary" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-luxury-text-light dark:text-luxury-text-dark arabic-heading">
                              {cat.name}
                            </h3>
                            {productCount > 0 && (
                              <div className="flex items-center gap-1.5 px-3 py-1 bg-luxury-gold-primary/10 rounded-xl">
                                <Package className="h-3.5 w-3.5 text-luxury-gold-primary" />
                                <span className="text-xs font-medium text-luxury-gold-primary arabic-text">
                                  {productCount} {productCount === 1 ? t('categories.productCount') : t('categories.productCountPlural')}
                                </span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm">
                            {cat.nameEn && (
                              <span className="text-luxury-gray-600 dark:text-luxury-gray-400">
                                <span className="font-medium">EN:</span> {cat.nameEn}
                              </span>
                            )}
                            {cat.nameAr && (
                              <span className="text-luxury-gray-600 dark:text-luxury-gray-400" dir="rtl">
                                <span className="font-medium">AR:</span> {cat.nameAr}
                              </span>
                            )}
                          </div>
                          
                          {cat.description && (
                            <p className="text-sm text-luxury-gray-500 dark:text-luxury-gray-400 mt-2 arabic-text">
                              {cat.description}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleDeleteClick(cat.id, cat.name, productCount)}
                        className="ltr:ml-4 rtl:mr-4 p-2.5 text-luxury-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200 flex-shrink-0"
                        title={t('common.delete')}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, categoryId: '', categoryName: '', productCount: 0 })}
        onConfirm={handleDeleteConfirm}
        title={t('categories.deleteTitle')}
        message={
          deleteModal.productCount > 0
            ? `${t('categories.deleteConfirmWithProducts')} "${deleteModal.categoryName}". ${deleteModal.productCount} ${deleteModal.productCount === 1 ? t('categories.productCount') : t('categories.productCountPlural')} ${t('categories.willBeUncategorized')}`
            : `${t('categories.deleteConfirm')} "${deleteModal.categoryName}"?`
        }
        confirmText={t('common.delete')}
        cancelText={t('common.cancel')}
        isDangerous={true}
        isLoading={isDeleting}
      />
    </div>
  );
}
