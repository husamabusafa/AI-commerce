import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import Navigation from './components/layout/Navigation';
import Topbar from './components/layout/Topbar';
import Toast from './components/shared/Toast';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';

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
  const { state, dispatch } = useApp();
  const location = useLocation();

  // Keep currentPanel in sync with URL for labels and RTL paddings
  React.useEffect(() => {
    const isAdmin = location.pathname.startsWith('/admin');
    dispatch({ type: 'SET_PANEL', payload: isAdmin ? 'admin' : 'client' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <div className="min-h-screen app-bg animate-fadeIn">
      {/* Fixed sidebar - hidden on mobile */}
      <div className="hidden lg:block">
        <Navigation />
      </div>
      
      {/* Content area - responsive padding (mirrors in RTL) */}
      <div className="lg:ltr:pr-[19rem] lg:rtl:pl-[19rem] h-full flex flex-col">
        {/* Sticky Topbar */}
        <Topbar />
        
        {/* Scrollable page content below topbar */}
        <main className="flex-1 overflow-y-auto animate-slideIn">
          <div className="p-3 sm:p-4 md:p-6 max-w-7xl mx-auto">
            <Routes>
              {/* Client routes */}
              <Route path="/" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<ClientOrders />} />
              <Route path="/account" element={<Account />} />

              {/* Admin routes */}
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/admin/products" element={<Products />} />
              <Route path="/admin/products/add" element={<AddProduct />} />
              <Route path="/admin/products/:id/edit" element={<EditProduct />} />
              <Route path="/admin/orders" element={<Orders />} />
              <Route path="/admin/users" element={<Users />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
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