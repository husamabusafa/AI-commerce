import { Settings, ShoppingBag, Users, Package, BarChart3, Search, User, ShoppingCart, Menu, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import Button from '../shared/Button';
import ThemeToggle from '../shared/ThemeToggle';
import LanguageToggle from '../shared/LanguageToggle';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Navigation() {
  const { state } = useApp();
  const { t, formatNumber, state: langState } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const adminNavItems = [
    { id: 'dashboard', label: t('nav.dashboard'), icon: BarChart3 },
    { id: 'products', label: t('nav.products'), icon: Package },
    { id: 'orders', label: t('nav.orders'), icon: ShoppingBag },
    { id: 'users', label: t('nav.users'), icon: Users }
  ];

  const clientNavItems = [
    { id: 'shop', label: t('nav.shop'), icon: Search },
    { id: 'cart', label: t('nav.cart'), icon: ShoppingCart },
    { id: 'orders', label: t('nav.myOrders'), icon: Package },
    { id: 'account', label: t('nav.account'), icon: User }
  ];

  const navItems = state.currentPanel === 'admin' ? adminNavItems : clientNavItems;
  const currentPath = location.pathname;

  const pathForItem = (panel: 'admin' | 'client', id: string) => {
    if (panel === 'admin') {
      switch (id) {
        case 'dashboard': return '/admin';
        case 'products': return '/admin/products';
        case 'orders': return '/admin/orders';
        case 'users': return '/admin/users';
        default: return '/admin';
      }
    } else {
      switch (id) {
        case 'shop': return '/';
        case 'cart': return '/cart';
        case 'orders': return '/orders';
        case 'account': return '/account';
        default: return '/';
      }
    }
  };

  const cartItemsCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="fixed ltr:right-0 rtl:left-0 top-4 bottom-4 ltr:mr-4 rtl:ml-4 w-72 z-40 glass rounded-3xl shadow-luxury">
        <div className="h-full overflow-y-auto p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <LanguageToggle />
              <ThemeToggle />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const to = state.currentPanel === 'admin' ? '/' : '/admin';
                  navigate(to);
                }}
                className="p-2"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <h1 className="arabic-heading text-lg font-bold text-luxury-text-light dark:text-luxury-text-dark text-center leading-tight">
            {state.currentPanel === 'admin' ? t('nav.adminPanel') : t('nav.store')}
          </h1>
        </div>

        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const target = pathForItem(state.currentPanel, item.id);
            const isActive = currentPath === target || (state.currentPanel === 'admin' ? currentPath.startsWith(target) : currentPath === target);
            
            return (
              <button
                key={item.id}
                onClick={() => navigate(target)}
                className={`
                  w-full group flex items-center px-4 py-3 text-sm font-medium rounded-2xl transition-all duration-200 transition-luxury
                  ${isActive 
                    ? 'bg-luxury-gold-primary text-white shadow-glow' 
                    : 'text-luxury-gray-600 dark:text-luxury-gray-400 hover:text-luxury-text-light dark:hover:text-luxury-text-dark hover:bg-luxury-gray-100 dark:hover:bg-luxury-gray-700'
                  }
                `}
              >
                <Icon className="h-5 w-5 ltr:ml-3 rtl:mr-3 flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity duration-200" />
                <span className="arabic-text">{item.label}</span>
                            {item.id === 'cart' && cartItemsCount > 0 && (
                              <span className="ltr:mr-auto rtl:ml-auto bg-luxury-gold-secondary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                                {formatNumber(cartItemsCount)}
                              </span>
                            )}
              </button>
            );
          })}
        </div>

        {state.currentUser && (
          <div className="mt-8 pt-4 border-t border-luxury-gray-200 dark:border-luxury-gray-700">
            <div className="flex items-center space-x-3 space-x-reverse">
              <img
                src={state.currentUser.avatar}
                alt={state.currentUser.name}
                className="h-10 w-10 rounded-full border-2 border-luxury-gold-primary/20"
              />
              <div className="flex-1 min-w-0">
                        <p className="arabic-text text-sm font-medium text-luxury-text-light dark:text-luxury-text-dark truncate">
                          {langState.currentLanguage === 'ar' ? state.currentUser.name : (state.currentUser.nameEn || state.currentUser.name)}
                        </p>
                <p className="arabic-text text-xs text-luxury-gray-500 dark:text-luxury-gray-400 truncate">
                  {state.currentUser.email}
                </p>
              </div>
            </div>
          </div>
        )}
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="fixed top-4 ltr:right-4 rtl:left-4 z-50 p-3 bg-luxury-gold-primary text-white rounded-2xl shadow-luxury hover:bg-luxury-gold-secondary transition-colors"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
            
            {/* Mobile Menu Panel */}
            <div className="fixed ltr:right-0 rtl:left-0 top-0 bottom-0 w-80 max-w-[90vw] bg-luxury-light dark:bg-luxury-dark shadow-luxury animate-slideIn">
              <div className="h-full overflow-y-auto p-6">
            {/* Mobile Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-luxury-gray-100 dark:hover:bg-luxury-gray-700 rounded-xl transition-colors"
                >
                  <X className="h-6 w-6 text-luxury-text-light dark:text-luxury-text-dark" />
                </button>
                <div className="flex items-center gap-2">
                  <LanguageToggle />
                  <ThemeToggle />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const to = state.currentPanel === 'admin' ? '/' : '/admin';
                      navigate(to);
                    }}
                    className="p-2"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <h1 className="arabic-heading text-lg font-bold text-luxury-text-light dark:text-luxury-text-dark text-center leading-tight px-2">
                {state.currentPanel === 'admin' ? t('nav.adminPanel') : t('nav.store')}
              </h1>
            </div>

                {/* Mobile Navigation Items */}
                <div className="space-y-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const target = pathForItem(state.currentPanel, item.id);
                    const isActive = currentPath === target || (state.currentPanel === 'admin' ? currentPath.startsWith(target) : currentPath === target);
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          navigate(target);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`
                          w-full group flex items-center px-4 py-4 text-base font-medium rounded-2xl transition-all duration-200 transition-luxury
                          ${isActive 
                            ? 'bg-luxury-gold-primary text-white shadow-glow' 
                            : 'text-luxury-gray-600 dark:text-luxury-gray-400 hover:text-luxury-text-light dark:hover:text-luxury-text-dark hover:bg-luxury-gray-100 dark:hover:bg-luxury-gray-700'
                          }
                        `}
                      >
                        <Icon className="h-6 w-6 ltr:ml-3 rtl:mr-3 flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity duration-200" />
                        <span className="arabic-text">{item.label}</span>
                            {item.id === 'cart' && cartItemsCount > 0 && (
                              <span className="ltr:mr-auto rtl:ml-auto bg-luxury-gold-secondary text-white text-sm rounded-full h-6 w-6 flex items-center justify-center font-medium">
                                {formatNumber(cartItemsCount)}
                              </span>
                            )}
                      </button>
                    );
                  })}
                </div>

                {/* Mobile User Profile */}
                {state.currentUser && (
                  <div className="mt-8 pt-6 border-t border-luxury-gray-200 dark:border-luxury-gray-700">
                    <div className="flex items-center space-x-4 space-x-reverse">
                      <img
                        src={state.currentUser.avatar}
                        alt={state.currentUser.name}
                        className="h-12 w-12 rounded-full border-2 border-luxury-gold-primary/20"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="arabic-text text-base font-medium text-luxury-text-light dark:text-luxury-text-dark truncate">
                          {langState.currentLanguage === 'ar' ? state.currentUser.name : (state.currentUser.nameEn || state.currentUser.name)}
                        </p>
                        <p className="arabic-text text-sm text-luxury-gray-500 dark:text-luxury-gray-400 truncate">
                          {state.currentUser.email}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}