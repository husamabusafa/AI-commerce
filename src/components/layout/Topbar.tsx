import { Bell, Search, ShoppingCart } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Button from '../shared/Button';

export default function Topbar() {
  const { state, dispatch } = useApp();

  const title = state.currentPanel === 'admin' ? 'Admin Panel' : 'Storefront';
  const subtitle = state.currentPanel === 'admin' ? state.adminView : state.clientView;

  const cartItemsCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-30 w-full bg-transparent backdrop-blur-sm">
      <div className="px-4 sm:px-6">
        <div className="my-3 mx-auto max-w-7xl px-4 py-3 flex items-center gap-4 w-full justify-between glass rounded-2xl shadow-soft ring-1 ring-white/60 dark:ring-white/10">
        {/* Titles */}
       <div className="flex items-center gap-4 w-full">
       <div className="min-w-0">
          <h2 className="text-base font-semibold text-slate-900 dark:text-gray-100 truncate">{title}</h2>
          <p className="text-xs text-slate-500 dark:text-gray-400 capitalize truncate">{subtitle}</p>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-3xl md:max-w-4xl">
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-slate-500/80 dark:text-gray-400/80">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="search"
              value={state.searchQuery}
              onChange={(e) => dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value })}
              placeholder="Search products, orders, users..."
              className="w-full pl-10 pr-4 py-3 text-sm rounded-full bg-white/60 dark:bg-white/10 text-slate-900 dark:text-gray-100 placeholder-slate-400/70 dark:placeholder-gray-500/70 backdrop-blur-sm ring-0 outline-none focus:ring-4 focus:ring-blue-500/25 focus:bg-white/70 dark:focus:bg-white/15 transition-all duration-300 transition-spring"
            />
          </div>
        </div>
       </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" className="px-3">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="sm" className="px-3 relative">
            <ShoppingCart className="h-4 w-4" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 min-w-[16px] px-1 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </Button>
          {state.currentUser && (
            <div className="ml-1 flex items-center gap-2">
              <img
                src={state.currentUser.avatar}
                alt={state.currentUser.name}
                className="h-8 w-8 min-w-8 rounded-full ring-2 ring-white/60 dark:ring-white/10"
              />
            </div>
          )}
        </div>
      </div>
      </div>
    </header>
  );
}
