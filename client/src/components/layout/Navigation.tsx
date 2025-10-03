import { Settings, ShoppingBag, Package, BarChart3, Search, User, ShoppingCart, Menu, X, Tags, LogOut, ChevronDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../hooks/useCart';
import { logout } from '../../context/AppContext';
import Button from '../shared/Button';
import ThemeToggle from '../shared/ThemeToggle';
import LanguageToggle from '../shared/LanguageToggle';
import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Navigation() {
  const { state, dispatch } = useApp();
  const { t, formatNumber, state: langState } = useLanguage();
  const { cartCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout(dispatch);
    setIsProfileOpen(false);
    navigate('/login');
  };
  
  const adminNavItems = [
    { id: 'dashboard', label: t('nav.dashboard'), icon: BarChart3 },
    { id: 'products', label: t('nav.products'), icon: Package },
    { id: 'categories', label: t('nav.categories'), icon: Tags },
    { id: 'orders', label: t('nav.orders'), icon: ShoppingBag }
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
        case 'categories': return '/admin/categories';
        case 'orders': return '/admin/orders';
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

  const cartItemsCount = cartCount || 0;

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="fixed ltr:right-0 rtl:left-0 top-4 bottom-4 ltr:mr-4 rtl:ml-4 w-72 z-40 glass rounded-3xl shadow-luxury">
        <div className="h-full p-6 flex flex-col">
          {/* Brand + Controls */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-2xl bg-luxury-gold-primary/10 text-luxury-gold-primary flex items-center justify-center shadow-inner">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div>
                <p className="arabic-heading text-base font-semibold text-luxury-text-light dark:text-luxury-text-dark leading-tight">AI Commerce</p>
                <p className="arabic-text text-xs text-luxury-gray-500 dark:text-luxury-gray-400">{state.currentPanel === 'admin' ? t('nav.adminPanel') : t('nav.store')}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
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
          </div>

          {/* Nav Items */}
          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const target = pathForItem(state.currentPanel, item.id);
              const isActive = currentPath === target;
              
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
                  <Icon className="h-5 w-5 ltr:mr-3 rtl:ml-3 flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity duration-200" />
                  <span className="arabic-text">{item.label}</span>
                  {item.id === 'cart' && state.currentPanel !== 'admin' && cartItemsCount > 0 && (
                    <span className="ltr:mr-auto rtl:ml-auto bg-luxury-gold-secondary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                      {formatNumber(cartItemsCount)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom Profile Box with Dropdown */}
          {state.currentUser && (
            <div className="mt-auto pt-4" ref={profileRef}>
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="w-full rounded-2xl border border-luxury-gray-200 dark:border-luxury-gray-700 bg-luxury-light/60 dark:bg-luxury-dark/60 p-3 hover:bg-luxury-gray-100 dark:hover:bg-luxury-gray-800 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={state.currentUser.avatar}
                      alt={state.currentUser.name}
                      className="h-10 w-10 rounded-xl border-2 border-luxury-gold-primary/20 object-cover"
                    />
                    <div className="flex-1 min-w-0 text-left">
                      <p className="arabic-text text-sm font-medium text-luxury-text-light dark:text-luxury-text-dark truncate">
                        {langState.currentLanguage === 'ar' ? state.currentUser.name : (state.currentUser.nameEn || state.currentUser.name)}
                      </p>
                      <p className="arabic-text text-xs text-luxury-gray-500 dark:text-luxury-gray-400 truncate">
                        {state.currentUser.email}
                      </p>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-luxury-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute bottom-full left-0 right-0 mb-2 glass rounded-2xl border border-luxury-gray-200 dark:border-luxury-gray-700 shadow-luxury animate-scaleIn overflow-hidden">
                    <button
                      onClick={() => {
                        navigate('/profile');
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-luxury-gray-100 dark:hover:bg-luxury-gray-800 transition-all text-left"
                    >
                      <User className="h-4 w-4 text-luxury-gray-500" />
                      <span className="text-sm font-medium text-luxury-text-light dark:text-luxury-text-dark arabic-text">
                        {t('user.profile')}
                      </span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all text-left border-t border-luxury-gray-200 dark:border-luxury-gray-700"
                    >
                      <LogOut className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium text-red-600 dark:text-red-400 arabic-text">
                        {t('user.logout')}
                      </span>
                    </button>
                  </div>
                )}
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
              <div className="h-full p-6 flex flex-col">
                {/* Mobile Header with Brand */}
                <div className="mb-6">
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
                  <div className="flex items-center gap-3 px-1">
                    <div className="h-10 w-10 rounded-2xl bg-luxury-gold-primary/10 text-luxury-gold-primary flex items-center justify-center shadow-inner">
                      <ShoppingBag className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="arabic-heading text-base font-semibold text-luxury-text-light dark:text-luxury-text-dark leading-tight">AI Commerce</p>
                      <p className="arabic-text text-xs text-luxury-gray-500 dark:text-luxury-gray-400">{state.currentPanel === 'admin' ? t('nav.adminPanel') : t('nav.store')}</p>
                    </div>
                  </div>
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
                            {item.id === 'cart' && state.currentPanel !== 'admin' && cartItemsCount > 0 && (
                              <span className="ltr:mr-auto rtl:ml-auto bg-luxury-gold-secondary text-white text-sm rounded-full h-6 w-6 flex items-center justify-center font-medium">
                                {formatNumber(cartItemsCount)}
                              </span>
                            )}
                      </button>
                    );
                  })}
                </div>

                {/* Mobile Bottom Profile Box */}
                {state.currentUser && (
                  <div className="mt-auto pt-4 space-y-2">
                    <div className="rounded-2xl border border-luxury-gray-200 dark:border-luxury-gray-700 bg-luxury-light/60 dark:bg-luxury-dark/60 p-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={state.currentUser.avatar}
                          alt={state.currentUser.name}
                          className="h-12 w-12 rounded-xl border-2 border-luxury-gold-primary/20 object-cover"
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
                    
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          navigate('/profile');
                          setIsMobileMenuOpen(false);
                        }}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-luxury-gold-primary text-white rounded-xl font-medium hover:bg-luxury-gold-secondary transition-all"
                      >
                        <User className="h-4 w-4" />
                        <span className="text-sm arabic-text">{t('user.profile')}</span>
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-all"
                      >
                        <LogOut className="h-4 w-4" />
                        <span className="text-sm arabic-text">{t('user.logout')}</span>
                      </button>
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