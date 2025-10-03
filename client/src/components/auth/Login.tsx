import React, { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../context/LanguageContext';
import Button from '../shared/Button';

export default function Login() {
  const { t, state: langState } = useLanguage();
  const { handleLogin, isLoading, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as any;

  // If already authenticated, redirect to admin panel if admin, otherwise home or from
  const from = location.state?.from?.pathname || '/';
  if (isAuthenticated) {
    const destination = user?.role === 'ADMIN' ? '/admin' : from;
    return <Navigate to={destination} replace />;
  }

  const [email, setEmail] = useState('admin@ecommerce.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = await handleLogin(email, password);
    console.log("resresresres",res);
    if (res?.success) {
      // Navigate to admin panel if user is admin, otherwise go to home or from location
      const destination = res.user?.role === 'ADMIN' ? '/admin' : from;
      navigate(destination, { replace: true });
    } else {
      setError(res?.error || t('auth.loginFailed') || 'Login failed');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md glass rounded-2xl shadow-luxury p-6">
        <div className="text-center mb-6">
          <div className="h-12 w-12 rounded-2xl mx-auto mb-3 bg-luxury-gold-primary/10 text-luxury-gold-primary flex items-center justify-center shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6"><path d="M2.25 12.76c0-1.6 1.025-2.978 2.437-3.43a48.507 48.507 0 0 1 14.626 0c1.412.452 2.437 1.83 2.437 3.43v1.49c0 1.6-1.025 2.978-2.437 3.43a48.51 48.51 0 0 1-14.626 0c-1.412-.452-2.437-1.83-2.437-3.43v-1.49Z"/><path d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/></svg>
          </div>
          <h1 className="arabic-heading text-xl font-bold text-luxury-text-light dark:text-luxury-text-dark">AI Commerce</h1>
          <p className="arabic-text text-sm text-luxury-gray-600 dark:text-luxury-gray-400">{t('auth.login') || (langState.currentLanguage === 'ar' ? 'تسجيل الدخول' : 'Login')}</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="arabic-text block text-sm font-medium text-luxury-text-light dark:text-luxury-text-dark mb-1">
              {t('auth.email') || (langState.currentLanguage === 'ar' ? 'البريد الإلكتروني' : 'Email')}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-luxury-gray-300 dark:border-luxury-gray-700 bg-luxury-light dark:bg-luxury-dark text-luxury-text-light dark:text-luxury-text-dark px-3 py-2 focus:outline-none focus:ring-2 focus:ring-luxury-gold-primary/50"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="arabic-text block text-sm font-medium text-luxury-text-light dark:text-luxury-text-dark mb-1">
              {t('auth.password') || (langState.currentLanguage === 'ar' ? 'كلمة المرور' : 'Password')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-luxury-gray-300 dark:border-luxury-gray-700 bg-luxury-light dark:bg-luxury-dark text-luxury-text-light dark:text-luxury-text-dark px-3 py-2 focus:outline-none focus:ring-2 focus:ring-luxury-gold-primary/50"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="arabic-text text-sm text-red-600 dark:text-red-400">{error}</div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (t('auth.loading') || (langState.currentLanguage === 'ar' ? 'جاري التحميل...' : 'Loading...')) : (t('auth.login') || (langState.currentLanguage === 'ar' ? 'تسجيل الدخول' : 'Login'))}
          </Button>
        </form>

        {/* Register and Continue Links */}
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
            onClick={() => navigate('/register')}
            className="w-full px-4 py-2 border border-luxury-gold-primary text-luxury-gold-primary rounded-xl font-medium hover:bg-luxury-gold-primary/10 transition-all arabic-text"
          >
            {langState.currentLanguage === 'ar' ? 'إنشاء حساب جديد' : 'Create Account'}
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
          {t('auth.hint') || (langState.currentLanguage === 'ar' ? 'استخدم بيانات المشرف الافتراضية أعلاه' : 'Use the default admin credentials above')}
        </div>
      </div>
    </div>
  );
}
