import { Bell, Search, ShoppingCart, Mic, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import Button from '../shared/Button';
import { useState } from 'react';

export default function Topbar() {
  const { state, dispatch } = useApp();
  const { t, formatNumber, state: langState } = useLanguage();
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);

  const title = state.currentPanel === 'admin' ? t('nav.adminPanel') : t('nav.store');
  const subtitle = state.currentPanel === 'admin' ? state.adminView : state.clientView;

  const cartItemsCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);

  // Mock search suggestions
  const searchSuggestions = [
    'أجهزة إلكترونية',
    'ملابس رجالية',
    'أثاث منزلي',
    'كتب ومجلات',
    'أدوات مطبخ'
  ];

  const recentSearches = [
    'هاتف ذكي',
    'لابتوب',
    'ساعة ذكية'
  ];

  return (
    <header className="sticky top-0 z-30 w-full bg-transparent backdrop-blur-sm">
      <div className="px-3 sm:px-4 md:px-6">
        <div className="my-2 sm:my-3 mx-auto max-w-7xl px-3 sm:px-4 md:px-6 py-3 sm:py-4 flex items-center gap-3 sm:gap-4 md:gap-6 w-full justify-between bg-transparent">
          {/* Titles - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-6 w-full">
            <div className="min-w-0">
              <h2 className="arabic-heading text-lg font-semibold text-luxury-text-light dark:text-luxury-text-dark truncate">{title}</h2>
              <p className="arabic-text text-sm text-luxury-gray-500 dark:text-luxury-gray-400 capitalize truncate">{subtitle}</p>
            </div>

            {/* Enhanced Search - Desktop */}
            <div className="flex-1 max-w-4xl relative">
              <div className="relative">
                  <span className="absolute inset-y-0 rtl:right-4 ltr:left-4 flex items-center text-luxury-gray-500/80 dark:text-luxury-gray-400/80 pointer-events-none z-10">
                    <Search className="h-5 w-5" />
                  </span>
                  <input
                    type="text"
                    value={state.searchQuery}
                    onChange={(e) => dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value })}
                    onFocus={() => setShowSearchSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
                    placeholder={t('search.placeholder')}
                    className="w-full rtl:pr-12 rtl:pl-12 ltr:pl-12 ltr:pr-12 py-4 text-sm rounded-2xl bg-white/80 dark:bg-white/10 text-luxury-text-light dark:text-luxury-text-dark placeholder-luxury-gray-400/70 dark:placeholder-luxury-gray-500/70 backdrop-blur-sm border border-luxury-gray-200/50 dark:border-luxury-gray-700/50 outline-none focus:ring-2 focus:ring-luxury-gold-primary/50 focus:bg-white/90 dark:focus:bg-white/15 transition-all duration-200"
                    style={{ WebkitAppearance: 'none', appearance: 'none' }}
                  />
                  <button className="absolute inset-y-0 rtl:left-4 ltr:right-4 flex items-center text-luxury-gray-500/80 dark:text-luxury-gray-400/80 hover:text-luxury-gold-primary transition-colors z-10">
                    <Mic className="h-4 w-4" />
                  </button>
              </div>

              {/* Search Suggestions Dropdown */}
              {showSearchSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-luxury-gray-800 rounded-2xl shadow-luxury border border-luxury-gray-200 dark:border-luxury-gray-700 overflow-hidden z-50">
                  {state.searchQuery ? (
                    <div className="p-4">
                      <div className="text-sm font-medium text-luxury-text-light dark:text-luxury-text-dark mb-3">{t('search.results')}</div>
                      {searchSuggestions
                        .filter(suggestion => suggestion.includes(state.searchQuery))
                        .map((suggestion, index) => (
                          <button
                            key={index}
                            className="w-full text-right px-4 py-3 text-sm text-luxury-gray-600 dark:text-luxury-gray-400 hover:bg-luxury-gray-100 dark:hover:bg-luxury-gray-700 transition-colors"
                            onClick={() => {
                              dispatch({ type: 'SET_SEARCH_QUERY', payload: suggestion });
                              setShowSearchSuggestions(false);
                            }}
                          >
                            {suggestion}
                          </button>
                        ))}
                    </div>
                  ) : (
                    <div className="p-4">
                      <div className="text-sm font-medium text-luxury-text-light dark:text-luxury-text-dark mb-3">{t('search.recent')}</div>
                      {recentSearches.map((search, index) => (
                        <button
                          key={index}
                          className="w-full text-right px-4 py-3 text-sm text-luxury-gray-600 dark:text-luxury-gray-400 hover:bg-luxury-gray-100 dark:hover:bg-luxury-gray-700 transition-colors flex items-center justify-between"
                          onClick={() => {
                            dispatch({ type: 'SET_SEARCH_QUERY', payload: search });
                            setShowSearchSuggestions(false);
                          }}
                        >
                          <span>{search}</span>
                          <X className="h-4 w-4 opacity-50" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden flex-1 relative">
          <div className="relative">
            <span className="absolute inset-y-0 rtl:right-3 ltr:left-3 flex items-center text-luxury-gray-500/80 dark:text-luxury-gray-400/80 pointer-events-none z-10">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              value={state.searchQuery}
              onChange={(e) => dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value })}
              placeholder={t('search.mobilePlaceholder')}
              className="w-full rtl:pr-10 rtl:pl-3 ltr:pl-10 ltr:pr-3 py-3 text-sm rounded-xl bg-white/80 dark:bg-white/10 text-luxury-text-light dark:text-luxury-text-dark placeholder-luxury-gray-400/70 dark:placeholder-luxury-gray-500/70 backdrop-blur-sm border border-luxury-gray-200/50 dark:border-luxury-gray-700/50 outline-none focus:ring-2 focus:ring-luxury-gold-primary/50 transition-all duration-200"
              style={{ WebkitAppearance: 'none', appearance: 'none' }}
            />
          </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Button variant="ghost" size="sm" className="p-2 sm:p-3 hover:bg-luxury-gray-100 dark:hover:bg-luxury-gray-700 hidden sm:flex">
              <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-luxury-gray-600 dark:text-luxury-gray-400" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2 sm:p-3 relative hover:bg-luxury-gray-100 dark:hover:bg-luxury-gray-700"
              onClick={() => dispatch({ type: 'SET_CLIENT_VIEW', payload: 'cart' })}
            >
              <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 text-luxury-gray-600 dark:text-luxury-gray-400" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 sm:h-5 min-w-[16px] sm:min-w-[20px] px-1 rounded-full bg-luxury-gold-primary text-white text-xs font-medium flex items-center justify-center">
                  {formatNumber(cartItemsCount)}
                </span>
              )}
            </Button>
            
            {state.currentUser && (
              <div className="hidden sm:flex items-center gap-3">
                <img
                  src={state.currentUser.avatar}
                  alt={langState.currentLanguage === 'ar' ? state.currentUser.name : (state.currentUser.nameEn || state.currentUser.name)}
                  className="h-8 w-8 sm:h-10 sm:w-10 min-w-8 sm:min-w-10 rounded-full ring-2 ring-luxury-gold-primary/20 hover:ring-luxury-gold-primary/40 transition-all duration-200 cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
