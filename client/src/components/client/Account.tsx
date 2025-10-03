import { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Edit3, Save, X, LogOut, ShoppingBag, DollarSign, Bell } from 'lucide-react';
import { useApp, logout } from '../../context/AppContext';
import { useOrders } from '../../hooks/useOrders';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import Button from '../shared/Button';
import Input from '../shared/Input';

export default function Account() {
  const { state, dispatch } = useApp();
  const { myOrders } = useOrders();
  const { t, formatNumber } = useLanguage();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: state.currentUser?.name || '',
    nameEn: state.currentUser?.nameEn || '',
    email: state.currentUser?.email || '',
    phone: '',
    address: '',
    notifications: true,
    newsletter: false
  });

  const orders = myOrders || [];

  const handleSave = () => {
    setIsEditing(false);
    dispatch({ 
      type: 'SHOW_TOAST', 
      payload: { message: t('account.profileUpdated') || 'Profile updated successfully', type: 'success' } 
    });
  };

  const handleLogout = () => {
    logout(dispatch);
    dispatch({ 
      type: 'SHOW_TOAST', 
      payload: { message: t('user.logout') || 'Logged out successfully', type: 'success' } 
    });
    navigate('/login');
  };

  const accountStats = {
    totalOrders: orders?.length || 0,
    totalSpent: orders?.reduce((sum: number, order: any) => sum + (order?.total || 0), 0) || 0,
    memberSince: state.currentUser?.joinedAt || new Date().toISOString()
  };

  return (
    <div className="min-h-screen bg-luxury-light dark:bg-luxury-dark p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="animate-slideUp">
          <h1 className="text-3xl font-bold text-luxury-text-light dark:text-luxury-text-dark mb-2 arabic-heading">
            {t('account.settings') || 'Account Settings'}
          </h1>
          <p className="text-luxury-gray-600 dark:text-luxury-gray-400 arabic-text">
            {t('account.manageProfile') || 'Manage your profile and preferences'}
          </p>
        </div>

        {/* Profile Section */}
        <div className="glass rounded-2xl p-6 border border-luxury-gray-200 dark:border-luxury-gray-700 animate-slideUp">
          <div className="flex items-start justify-between mb-6">
            <h3 className="text-xl font-semibold text-luxury-text-light dark:text-luxury-text-dark arabic-heading">
              {t('account.profileInfo') || 'Profile Information'}
            </h3>
            <Button
              variant={isEditing ? "ghost" : "outline"}
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? <X className="h-4 w-4 ltr:mr-2 rtl:ml-2" /> : <Edit3 className="h-4 w-4 ltr:mr-2 rtl:ml-2" />}
              <span className="arabic-text">{isEditing ? t('common.cancel') || 'Cancel' : t('common.edit') || 'Edit'}</span>
            </Button>
          </div>

          <div className="flex items-center gap-6 mb-6">
            <img
              src={state.currentUser?.avatar}
              alt={state.currentUser?.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-luxury-gold-primary/20"
            />
            <div>
              <h3 className="text-2xl font-semibold text-luxury-text-light dark:text-luxury-text-dark mb-1 arabic-heading">
                {state.currentUser?.name}
              </h3>
              <p className="text-luxury-gray-600 dark:text-luxury-gray-400 mb-1">{state.currentUser?.email}</p>
              <p className="text-sm text-luxury-gray-500 dark:text-luxury-gray-400 arabic-text">
                {t('account.memberSince') || 'Member since'} {new Date(accountStats.memberSince).toLocaleDateString()}
              </p>
            </div>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label={t('account.fullName') || 'Full Name (Arabic)'}
                  value={formData.name}
                  onChange={(value) => setFormData({ ...formData, name: value })}
                />
                <Input
                  label={t('account.nameEn') || 'Name (English)'}
                  value={formData.nameEn}
                  onChange={(value) => setFormData({ ...formData, nameEn: value })}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label={t('account.phone') || 'Phone'}
                  value={formData.phone}
                  onChange={(value) => setFormData({ ...formData, phone: value })}
                />
                <Input
                  label={t('account.address') || 'Address'}
                  value={formData.address}
                  onChange={(value) => setFormData({ ...formData, address: value })}
                />
              </div>

              <Button onClick={handleSave} className="w-full md:w-auto">
                <Save className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                <span className="arabic-text">{t('common.save') || 'Save Changes'}</span>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-luxury-gold-primary" />
                  <div>
                    <p className="text-sm text-luxury-gray-600 dark:text-luxury-gray-400 arabic-text">
                      {t('account.fullName') || 'Full Name'}
                    </p>
                    <p className="font-medium text-luxury-text-light dark:text-luxury-text-dark arabic-heading">
                      {formData.name}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-luxury-gold-primary" />
                  <div>
                    <p className="text-sm text-luxury-gray-600 dark:text-luxury-gray-400 arabic-text">
                      {t('account.email') || 'Email'}
                    </p>
                    <p className="font-medium text-luxury-text-light dark:text-luxury-text-dark">
                      {formData.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {formData.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-luxury-gold-primary" />
                    <div>
                      <p className="text-sm text-luxury-gray-600 dark:text-luxury-gray-400 arabic-text">
                        {t('account.phone') || 'Phone'}
                      </p>
                      <p className="font-medium text-luxury-text-light dark:text-luxury-text-dark">
                        {formData.phone}
                      </p>
                    </div>
                  </div>
                )}
                
                {formData.address && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-luxury-gold-primary" />
                    <div>
                      <p className="text-sm text-luxury-gray-600 dark:text-luxury-gray-400 arabic-text">
                        {t('account.address') || 'Address'}
                      </p>
                      <p className="font-medium text-luxury-text-light dark:text-luxury-text-dark">
                        {formData.address}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Account Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass rounded-2xl p-6 text-center border border-luxury-gray-200 dark:border-luxury-gray-700 animate-slideUp">
            <ShoppingBag className="h-10 w-10 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-luxury-text-light dark:text-luxury-text-dark mb-1">
              {accountStats.totalOrders}
            </div>
            <div className="text-sm text-luxury-gray-600 dark:text-luxury-gray-400 arabic-text">
              {t('account.totalOrders') || 'Total Orders'}
            </div>
          </div>
          
          <div className="glass rounded-2xl p-6 text-center border border-luxury-gray-200 dark:border-luxury-gray-700 animate-slideUp">
            <DollarSign className="h-10 w-10 text-green-600 dark:text-green-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-luxury-text-light dark:text-luxury-text-dark mb-1">
              ${formatNumber(accountStats.totalSpent.toFixed(2))}
            </div>
            <div className="text-sm text-luxury-gray-600 dark:text-luxury-gray-400 arabic-text">
              {t('account.totalSpent') || 'Total Spent'}
            </div>
          </div>
          
          <div className="glass rounded-2xl p-6 text-center border border-luxury-gray-200 dark:border-luxury-gray-700 animate-slideUp">
            <Calendar className="h-10 w-10 text-purple-600 dark:text-purple-400 mx-auto mb-3" />
            <div className="text-sm text-luxury-gray-600 dark:text-luxury-gray-400 mb-1 arabic-text">
              {t('account.memberSince') || 'Member Since'}
            </div>
            <div className="text-2xl font-medium text-luxury-text-light dark:text-luxury-text-dark">
              {new Date(accountStats.memberSince).getFullYear()}
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="glass rounded-2xl p-6 border border-luxury-gray-200 dark:border-luxury-gray-700 animate-slideUp">
          <h3 className="text-xl font-semibold text-luxury-text-light dark:text-luxury-text-dark mb-6 arabic-heading">
            {t('account.preferences') || 'Preferences'}
          </h3>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-luxury-gold-primary" />
                <div>
                  <p className="font-medium text-luxury-text-light dark:text-luxury-text-dark arabic-heading">
                    {t('account.orderNotifications') || 'Order Notifications'}
                  </p>
                  <p className="text-sm text-luxury-gray-600 dark:text-luxury-gray-400 arabic-text">
                    {t('account.orderNotificationsDesc') || 'Get notified about order updates'}
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.notifications}
                  onChange={(e) => setFormData({ ...formData, notifications: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-luxury-gray-300 dark:bg-luxury-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-luxury-gold-primary/30 rounded-full peer peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] peer-checked:after:start-[22px] after:bg-white after:border-luxury-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-luxury-gold-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-luxury-gold-primary" />
                <div>
                  <p className="font-medium text-luxury-text-light dark:text-luxury-text-dark arabic-heading">
                    {t('account.newsletter') || 'Newsletter'}
                  </p>
                  <p className="text-sm text-luxury-gray-600 dark:text-luxury-gray-400 arabic-text">
                    {t('account.newsletterDesc') || 'Receive our weekly newsletter'}
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.newsletter}
                  onChange={(e) => setFormData({ ...formData, newsletter: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-luxury-gray-300 dark:bg-luxury-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-luxury-gold-primary/30 rounded-full peer peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] peer-checked:after:start-[22px] after:bg-white after:border-luxury-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-luxury-gold-primary"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="glass rounded-2xl p-6 border border-luxury-gray-200 dark:border-luxury-gray-700 animate-slideUp">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <LogOut className="h-5 w-5 ltr:mr-2 rtl:ml-2" />
            <span className="arabic-text">{t('user.logout') || 'Logout'}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
