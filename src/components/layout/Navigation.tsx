import { Settings, ShoppingBag, Users, Package, BarChart3, Search, User, ShoppingCart } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Button from '../shared/Button';
import ThemeToggle from '../shared/ThemeToggle';

export default function Navigation() {
  const { state, dispatch } = useApp();
  
  const adminNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'users', label: 'Users', icon: Users }
  ];

  const clientNavItems = [
    { id: 'shop', label: 'Shop', icon: Search },
    { id: 'cart', label: 'Cart', icon: ShoppingCart },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'account', label: 'Account', icon: User }
  ];

  const navItems = state.currentPanel === 'admin' ? adminNavItems : clientNavItems;
  const currentView = state.currentPanel === 'admin' ? state.adminView : state.clientView;

  const cartItemsCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="fixed left-0 top-4 bottom-4 ml-4 w-64 z-40 glass rounded-3xl shadow-soft">
      <div className="h-full overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-bold text-slate-900 dark:text-gray-100">
            {state.currentPanel === 'admin' ? 'Admin Panel' : 'E-Commerce'}
          </h1>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => dispatch({ 
                type: 'SET_PANEL', 
                payload: state.currentPanel === 'admin' ? 'client' : 'admin' 
              })}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (state.currentPanel === 'admin') {
                    dispatch({ type: 'SET_ADMIN_VIEW', payload: item.id as any });
                  } else {
                    dispatch({ type: 'SET_CLIENT_VIEW', payload: item.id as any });
                  }
                }}
                className={`
                  w-full group flex items-center px-3 py-2.5 text-sm font-medium rounded-2xl transition-all duration-300 transition-spring
                  ${isActive 
                    ? 'bg-white/60 dark:bg-white/10 text-slate-900 dark:text-gray-100 shadow-soft' 
                    : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-100 hover:bg-white/40 dark:hover:bg-white/5'
                  }
                `}
              >
                <Icon className="h-5 w-5 mr-3 flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                <span>{item.label}</span>
                {item.id === 'cart' && cartItemsCount > 0 && (
                  <span className="ml-auto bg-blue-600 dark:bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {state.currentUser && (
          <div className="mt-8 pt-4">
            <div className="flex items-center space-x-3">
              <img
                src={state.currentUser.avatar}
                alt={state.currentUser.name}
                className="h-8 w-8 rounded-full"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-gray-100 truncate">
                  {state.currentUser.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-gray-400 truncate">
                  {state.currentUser.email}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}