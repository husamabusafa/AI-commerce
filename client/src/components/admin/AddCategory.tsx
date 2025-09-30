import { useState } from 'react';
import { ArrowLeft, Save, X, Tag, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { useLanguage } from '../../context/LanguageContext';
import { CREATE_CATEGORY, GET_CATEGORIES } from '../../graphql/queries';
import toast from 'react-hot-toast';

export default function AddCategory() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [createCategory] = useMutation(CREATE_CATEGORY, {
    refetchQueries: [{ query: GET_CATEGORIES }],
    awaitRefetchQueries: true,
  });

  const [nameEn, setNameEn] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!nameEn.trim() && !nameAr.trim()) {
      newErrors.name = t('categories.requiredName');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await createCategory({
        variables: { 
          createCategoryInput: { 
            name: nameEn || nameAr, 
            nameEn: nameEn || nameAr, 
            nameAr: nameAr || nameEn, 
            description: description.trim() || undefined 
          } 
        },
      });
      toast.success(t('categories.created'));
      navigate('/admin/categories');
    } catch (err: any) {
      toast.error(err.message || t('categories.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const goBack = () => {
    navigate('/admin/categories');
  };

  return (
    <div className="min-h-screen app-bg p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-luxury-text-light dark:text-luxury-text-dark arabic-heading">
              {t('categories.addCategory')}
            </h1>
            <p className="text-luxury-gray-600 dark:text-luxury-gray-400 mt-1 arabic-text">
              {t('categories.subtitle')}
            </p>
          </div>
          <button
            onClick={goBack}
            className="inline-flex items-center gap-2 px-4 py-2 text-luxury-gray-600 dark:text-luxury-gray-400 hover:text-luxury-text-light dark:hover:text-luxury-text-dark transition-colors rounded-xl hover:bg-luxury-gray-100 dark:hover:bg-luxury-gray-700"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="arabic-text">{t('addProduct.backToProducts')}</span>
          </button>
        </div>

        {/* Form Card */}
        <div className="glass rounded-3xl shadow-luxury border border-luxury-gray-200 dark:border-luxury-gray-700">
          <div className="p-8">
            {/* Icon Header */}
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-luxury-gold-primary/10 rounded-2xl">
                <Tag className="h-6 w-6 text-luxury-gold-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-luxury-text-light dark:text-luxury-text-dark arabic-heading">
                  {t('categories.title')}
                </h2>
                <p className="text-sm text-luxury-gray-600 dark:text-luxury-gray-400 arabic-text">
                  Fill in the category information
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* English Name */}
                <div>
                  <label className="block text-sm font-medium text-luxury-text-light dark:text-luxury-text-dark mb-2 arabic-text">
                    {t('categories.nameEn')}
                  </label>
                  <input
                    type="text"
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    placeholder={t('categories.namePlaceholder')}
                    className="w-full px-4 py-3 glass rounded-2xl border border-luxury-gray-300 dark:border-luxury-gray-600 focus:ring-2 focus:ring-luxury-gold-primary focus:border-transparent text-luxury-text-light dark:text-luxury-text-dark placeholder-luxury-gray-400 transition-all"
                  />
                </div>

                {/* Arabic Name */}
                <div>
                  <label className="block text-sm font-medium text-luxury-text-light dark:text-luxury-text-dark mb-2 arabic-text">
                    {t('categories.nameAr')}
                  </label>
                  <input
                    type="text"
                    value={nameAr}
                    onChange={(e) => setNameAr(e.target.value)}
                    placeholder="مثال: إلكترونيات"
                    className="w-full px-4 py-3 glass rounded-2xl border border-luxury-gray-300 dark:border-luxury-gray-600 focus:ring-2 focus:ring-luxury-gold-primary focus:border-transparent text-luxury-text-light dark:text-luxury-text-dark placeholder-luxury-gray-400 transition-all"
                    dir="rtl"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-luxury-text-light dark:text-luxury-text-dark mb-2 arabic-text">
                  {t('categories.description')}
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t('categories.descriptionPlaceholder')}
                  rows={4}
                  className="w-full px-4 py-3 glass rounded-2xl border border-luxury-gray-300 dark:border-luxury-gray-600 focus:ring-2 focus:ring-luxury-gold-primary focus:border-transparent text-luxury-text-light dark:text-luxury-text-dark placeholder-luxury-gray-400 transition-all resize-none"
                />
              </div>

              {/* Info Box */}
              <div className="flex items-start gap-3 p-4 bg-luxury-gold-primary/5 border border-luxury-gold-primary/20 rounded-2xl">
                <Info className="h-5 w-5 text-luxury-gold-primary mt-0.5 flex-shrink-0" />
                <p className="text-sm text-luxury-text-light dark:text-luxury-text-dark arabic-text">
                  At least one name (English or Arabic) is required. If only one is provided, it will be used for both languages.
                </p>
              </div>

              {/* Error Message */}
              {errors.name && (
                <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-2xl">
                  <svg className="h-5 w-5 text-red-600 dark:text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-red-700 dark:text-red-300">{errors.name}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-none px-8 py-3 bg-luxury-gold-primary hover:bg-luxury-gold-secondary text-white font-medium rounded-2xl transition-all duration-200 hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center justify-center gap-2"
                >
                  <Save className="h-5 w-5" />
                  <span className="arabic-text">
                    {isSubmitting ? t('categories.loading') : t('categories.addCategory')}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={goBack}
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-none px-8 py-3 bg-luxury-gray-100 dark:bg-luxury-gray-700 hover:bg-luxury-gray-200 dark:hover:bg-luxury-gray-600 text-luxury-text-light dark:text-luxury-text-dark font-medium rounded-2xl transition-colors flex items-center justify-center gap-2"
                >
                  <X className="h-5 w-5" />
                  <span className="arabic-text">{t('addProduct.cancel')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
