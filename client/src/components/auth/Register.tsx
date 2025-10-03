import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../context/LanguageContext';
import Button from '../shared/Button';
import { User, Mail, Lock } from 'lucide-react';

export default function Register() {
  const { t, state: langState } = useLanguage();
  const { handleRegister, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // If already authenticated, redirect to home
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const [formData, setFormData] = useState({
    name: '',
    nameEn: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setError(langState.currentLanguage === 'ar' ? 'الرجاء ملء جميع الحقول المطلوبة' : 'Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(langState.currentLanguage === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError(langState.currentLanguage === 'ar' ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : 'Password must be at least 6 characters');
      return;
    }

    const res = await handleRegister(formData.name, formData.email, formData.password, formData.nameEn);
    if (res?.success) {
      // Navigate to shop after successful registration
      navigate('/', { replace: true });
    } else {
      setError(res?.error || (langState.currentLanguage === 'ar' ? 'فشل في إنشاء الحساب' : 'Registration failed'));
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md glass rounded-2xl shadow-luxury p-6">
        <div className="text-center mb-6">
          <div className="h-12 w-12 rounded-2xl mx-auto mb-3 bg-luxury-gold-primary/10 text-luxury-gold-primary flex items-center justify-center shadow-inner">
            <User className="h-6 w-6" />
          </div>
          <h1 className="arabic-heading text-xl font-bold text-luxury-text-light dark:text-luxury-text-dark">
            {langState.currentLanguage === 'ar' ? 'إنشاء حساب جديد' : 'Create Account'}
          </h1>
          <p className="arabic-text text-sm text-luxury-gray-600 dark:text-luxury-gray-400">
            {langState.currentLanguage === 'ar' ? 'انضم إلى AI Commerce' : 'Join AI Commerce'}
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Arabic Name */}
          <div>
            <label className="arabic-text block text-sm font-medium text-luxury-text-light dark:text-luxury-text-dark mb-1">
              {langState.currentLanguage === 'ar' ? 'الاسم (بالعربية) *' : 'Name (Arabic) *'}
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-luxury-gray-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-xl border border-luxury-gray-300 dark:border-luxury-gray-700 bg-luxury-light dark:bg-luxury-dark text-luxury-text-light dark:text-luxury-text-dark px-10 py-2 focus:outline-none focus:ring-2 focus:ring-luxury-gold-primary/50"
                placeholder={langState.currentLanguage === 'ar' ? 'أحمد محمد' : 'أحمد محمد'}
                required
              />
            </div>
          </div>

          {/* English Name (Optional) */}
          <div>
            <label className="arabic-text block text-sm font-medium text-luxury-text-light dark:text-luxury-text-dark mb-1">
              {langState.currentLanguage === 'ar' ? 'الاسم (بالإنجليزية)' : 'Name (English)'}
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-luxury-gray-400" />
              <input
                type="text"
                name="nameEn"
                value={formData.nameEn}
                onChange={handleChange}
                className="w-full rounded-xl border border-luxury-gray-300 dark:border-luxury-gray-700 bg-luxury-light dark:bg-luxury-dark text-luxury-text-light dark:text-luxury-text-dark px-10 py-2 focus:outline-none focus:ring-2 focus:ring-luxury-gold-primary/50"
                placeholder="Ahmed Mohamed"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="arabic-text block text-sm font-medium text-luxury-text-light dark:text-luxury-text-dark mb-1">
              {langState.currentLanguage === 'ar' ? 'البريد الإلكتروني *' : 'Email *'}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-luxury-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-luxury-gray-300 dark:border-luxury-gray-700 bg-luxury-light dark:bg-luxury-dark text-luxury-text-light dark:text-luxury-text-dark px-10 py-2 focus:outline-none focus:ring-2 focus:ring-luxury-gold-primary/50"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="arabic-text block text-sm font-medium text-luxury-text-light dark:text-luxury-text-dark mb-1">
              {langState.currentLanguage === 'ar' ? 'كلمة المرور *' : 'Password *'}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-luxury-gray-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-xl border border-luxury-gray-300 dark:border-luxury-gray-700 bg-luxury-light dark:bg-luxury-dark text-luxury-text-light dark:text-luxury-text-dark px-10 py-2 focus:outline-none focus:ring-2 focus:ring-luxury-gold-primary/50"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="arabic-text block text-sm font-medium text-luxury-text-light dark:text-luxury-text-dark mb-1">
              {langState.currentLanguage === 'ar' ? 'تأكيد كلمة المرور *' : 'Confirm Password *'}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-luxury-gray-400" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full rounded-xl border border-luxury-gray-300 dark:border-luxury-gray-700 bg-luxury-light dark:bg-luxury-dark text-luxury-text-light dark:text-luxury-text-dark px-10 py-2 focus:outline-none focus:ring-2 focus:ring-luxury-gold-primary/50"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && (
            <div className="arabic-text text-sm text-red-600 dark:text-red-400">{error}</div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading 
              ? (langState.currentLanguage === 'ar' ? 'جاري التحميل...' : 'Loading...') 
              : (langState.currentLanguage === 'ar' ? 'إنشاء حساب' : 'Create Account')}
          </Button>
        </form>

        {/* Links */}
        <div className="mt-6 space-y-3">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-luxury-gray-200 dark:border-luxury-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white dark:bg-luxury-dark text-luxury-gray-500 dark:text-luxury-gray-400 arabic-text">
                {langState.currentLanguage === 'ar' ? 'أو' : 'OR'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/login')}
            className="w-full px-4 py-2 text-luxury-gray-600 dark:text-luxury-gray-400 hover:text-luxury-text-light dark:hover:text-luxury-text-dark transition-all text-sm arabic-text"
          >
            {langState.currentLanguage === 'ar' ? 'لديك حساب؟ تسجيل الدخول' : 'Already have an account? Login'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-full px-4 py-2 text-luxury-gray-600 dark:text-luxury-gray-400 hover:text-luxury-text-light dark:hover:text-luxury-text-dark transition-all text-sm arabic-text"
          >
            {langState.currentLanguage === 'ar' ? 'متابعة بدون تسجيل الدخول' : 'Continue without login'}
          </button>
        </div>

        <div className="mt-4 text-xs text-center text-luxury-gray-500 dark:text-luxury-gray-400 arabic-text">
          {langState.currentLanguage === 'ar' 
            ? 'بإنشاء حساب، فإنك توافق على شروط الخدمة وسياسة الخصوصية' 
            : 'By creating an account, you agree to our Terms of Service and Privacy Policy'}
        </div>
      </div>
    </div>
  );
}
