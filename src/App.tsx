import { AppProvider, useApp } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import Navigation from './components/layout/Navigation';
import Topbar from './components/layout/Topbar';
import Toast from './components/shared/Toast';

// Admin Components
import Dashboard from './components/admin/Dashboard';
import Products from './components/admin/Products';
import AddProduct from './components/admin/AddProduct';
import EditProduct from './components/admin/EditProduct';
import Orders from './components/admin/Orders';
import Users from './components/admin/Users';

// Client Components
import Shop from './components/client/Shop';
import ProductDetails from './components/client/ProductDetails';
import Cart from './components/client/Cart';
import Checkout from './components/client/Checkout';
import ClientOrders from './components/client/ClientOrders';
import Account from './components/client/Account';

function AppContent() {
  const { state } = useApp();

  const renderAdminView = () => {
    switch (state.adminView) {
      case 'dashboard': return <Dashboard />;
      case 'products': return <Products />;
      case 'add-product': return <AddProduct />;
      case 'edit-product': return <EditProduct />;
      case 'orders': return <Orders />;
      case 'users': return <Users />;
      default: return <Dashboard />;
    }
  };

  const renderClientView = () => {
    switch (state.clientView) {
      case 'shop': return <Shop />;
      case 'product': return <ProductDetails />;
      case 'cart': return <Cart />;
      case 'checkout': return <Checkout />;
      case 'orders': return <ClientOrders />;
      case 'account': return <Account />;
      default: return <Shop />;
    }
  };

  return (
    <div className="min-h-screen app-bg animate-fadeIn">
      {/* Fixed sidebar - hidden on mobile */}
      <div className="hidden lg:block">
        <Navigation />
      </div>
      
      {/* Content area - responsive padding */}
      <div className="lg:pr-[19rem] h-full flex flex-col">
        {/* Sticky Topbar */}
        <Topbar />
        
        {/* Scrollable page content below topbar */}
        <main className="flex-1 overflow-y-auto animate-slideIn">
          <div className="p-3 sm:p-4 md:p-6 max-w-7xl mx-auto">
            {state.currentPanel === 'admin' ? renderAdminView() : renderClientView()}
          </div>
        </main>
      </div>
      
      {/* Toast Notifications */}
      <Toast
        show={state.toast.show}
        message={state.toast.message}
        type={state.toast.type}
        onClose={() => dispatch({ type: 'HIDE_TOAST' })}
      />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;