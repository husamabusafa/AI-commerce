import { User, Mail, Shield, Calendar, LogOut, Edit } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../context/AppContext';

export default function Profile() {
  const { state, dispatch } = useApp();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(dispatch);
    navigate('/login');
  };

  if (!state.currentUser) {
    navigate('/login');
    return null;
  }

  const user = state.currentUser;

  return (
    <div className="min-h-screen bg-luxury-light dark:bg-luxury-dark p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="animate-slideUp">
          <h1 className="text-3xl font-bold text-luxury-text-light dark:text-luxury-text-dark mb-2 arabic-heading">
            {t('user.profile')}
          </h1>
          <p className="text-luxury-gray-600 dark:text-luxury-gray-400 arabic-text">
            Manage your account information
          </p>
        </div>

        {/* Profile Card */}
        <div className="glass rounded-3xl p-8 border border-luxury-gray-200 dark:border-luxury-gray-700 animate-fadeIn">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-32 h-32 rounded-2xl border-4 border-luxury-gold-primary/20 object-cover shadow-luxury"
              />
              <button className="absolute bottom-2 right-2 p-2 bg-luxury-gold-primary text-white rounded-xl shadow-lg hover:bg-luxury-gold-secondary transition-all">
                <Edit className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-luxury-text-light dark:text-luxury-text-dark mb-2 arabic-heading">
                {user.nameEn || user.name}
              </h2>
              <p className="text-luxury-gray-600 dark:text-luxury-gray-400 mb-3 arabic-text">
                {user.email}
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-luxury-gold-primary/10 text-luxury-gold-primary rounded-xl font-medium">
                <Shield className="h-4 w-4" />
                <span className="capitalize arabic-text">{user.role}</span>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-luxury-text-light dark:text-luxury-text-dark mb-4 flex items-center gap-2 arabic-heading">
                <User className="h-5 w-5 text-luxury-gold-primary" />
                Personal Information
              </h3>
              
              <div className="space-y-3">
                <div className="p-4 bg-luxury-gray-50 dark:bg-luxury-gray-800 rounded-xl">
                  <p className="text-sm text-luxury-gray-500 dark:text-luxury-gray-400 mb-1 arabic-text">Full Name</p>
                  <p className="font-medium text-luxury-text-light dark:text-luxury-text-dark arabic-text">
                    {user.name}
                  </p>
                </div>

                {user.nameEn && (
                  <div className="p-4 bg-luxury-gray-50 dark:bg-luxury-gray-800 rounded-xl">
                    <p className="text-sm text-luxury-gray-500 dark:text-luxury-gray-400 mb-1 arabic-text">English Name</p>
                    <p className="font-medium text-luxury-text-light dark:text-luxury-text-dark">
                      {user.nameEn}
                    </p>
                  </div>
                )}

                <div className="p-4 bg-luxury-gray-50 dark:bg-luxury-gray-800 rounded-xl">
                  <p className="text-sm text-luxury-gray-500 dark:text-luxury-gray-400 mb-1 arabic-text">Email Address</p>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-luxury-gray-400" />
                    <p className="font-medium text-luxury-text-light dark:text-luxury-text-dark">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-luxury-text-light dark:text-luxury-text-dark mb-4 flex items-center gap-2 arabic-heading">
                <Shield className="h-5 w-5 text-luxury-gold-primary" />
                Account Information
              </h3>
              
              <div className="space-y-3">
                <div className="p-4 bg-luxury-gray-50 dark:bg-luxury-gray-800 rounded-xl">
                  <p className="text-sm text-luxury-gray-500 dark:text-luxury-gray-400 mb-1 arabic-text">Role</p>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-luxury-gold-primary" />
                    <p className="font-medium text-luxury-text-light dark:text-luxury-text-dark capitalize arabic-text">
                      {user.role}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-luxury-gray-50 dark:bg-luxury-gray-800 rounded-xl">
                  <p className="text-sm text-luxury-gray-500 dark:text-luxury-gray-400 mb-1 arabic-text">Member Since</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-luxury-gray-400" />
                    <p className="font-medium text-luxury-text-light dark:text-luxury-text-dark">
                      {user.joinedAt ? new Date(user.joinedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-luxury-gray-50 dark:bg-luxury-gray-800 rounded-xl">
                  <p className="text-sm text-luxury-gray-500 dark:text-luxury-gray-400 mb-1 arabic-text">User ID</p>
                  <p className="font-mono text-sm text-luxury-text-light dark:text-luxury-text-dark break-all">
                    {user.id}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 pt-6 border-t border-luxury-gray-200 dark:border-luxury-gray-700">
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-3 bg-luxury-gray-100 dark:bg-luxury-gray-800 text-luxury-text-light dark:text-luxury-text-dark rounded-xl font-medium hover:bg-luxury-gray-200 dark:hover:bg-luxury-gray-700 transition-all arabic-text"
              >
                Go Back
              </button>
              <button
                onClick={handleLogout}
                className="px-6 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-all flex items-center justify-center gap-2 arabic-text"
              >
                <LogOut className="h-5 w-5" />
                {t('user.logout')}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats (if admin) */}
        {user.role === 'ADMIN' && (
          <div className="glass rounded-2xl p-6 border border-luxury-gray-200 dark:border-luxury-gray-700 animate-fadeIn">
            <h3 className="text-lg font-semibold text-luxury-text-light dark:text-luxury-text-dark mb-4 arabic-heading">
              Quick Access
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => navigate('/admin')}
                className="p-4 bg-luxury-gray-50 dark:bg-luxury-gray-800 rounded-xl hover:bg-luxury-gray-100 dark:hover:bg-luxury-gray-700 transition-all text-center"
              >
                <Shield className="h-6 w-6 text-luxury-gold-primary mx-auto mb-2" />
                <p className="text-sm font-medium text-luxury-text-light dark:text-luxury-text-dark arabic-text">
                  Dashboard
                </p>
              </button>
              <button
                onClick={() => navigate('/admin/products')}
                className="p-4 bg-luxury-gray-50 dark:bg-luxury-gray-800 rounded-xl hover:bg-luxury-gray-100 dark:hover:bg-luxury-gray-700 transition-all text-center"
              >
                <svg className="h-6 w-6 text-luxury-gold-primary mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <p className="text-sm font-medium text-luxury-text-light dark:text-luxury-text-dark arabic-text">
                  Products
                </p>
              </button>
              <button
                onClick={() => navigate('/admin/orders')}
                className="p-4 bg-luxury-gray-50 dark:bg-luxury-gray-800 rounded-xl hover:bg-luxury-gray-100 dark:hover:bg-luxury-gray-700 transition-all text-center"
              >
                <svg className="h-6 w-6 text-luxury-gold-primary mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <p className="text-sm font-medium text-luxury-text-light dark:text-luxury-text-dark arabic-text">
                  Orders
                </p>
              </button>
              <button
                onClick={() => navigate('/admin/categories')}
                className="p-4 bg-luxury-gray-50 dark:bg-luxury-gray-800 rounded-xl hover:bg-luxury-gray-100 dark:hover:bg-luxury-gray-700 transition-all text-center"
              >
                <svg className="h-6 w-6 text-luxury-gold-primary mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <p className="text-sm font-medium text-luxury-text-light dark:text-luxury-text-dark arabic-text">
                  Categories
                </p>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
