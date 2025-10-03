import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import Navigation from './components/layout/Navigation';
import Topbar from './components/layout/Topbar';
import Toast from './components/shared/Toast';
import { Toaster } from 'react-hot-toast';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';

// Admin Components
import Dashboard from './components/admin/Dashboard';
import Products from './components/admin/Products';
import AddProduct from './components/admin/AddProduct';
import EditProduct from './components/admin/EditProduct';
import Orders from './components/admin/Orders';
import Categories from './components/admin/Categories';
import AddCategory from './components/admin/AddCategory';
import Profile from './components/admin/Profile';

// Client Components
import Shop from './components/client/Shop';
import ProductDetails from './components/client/ProductDetails';
import Cart from './components/client/Cart';
import Checkout from './components/client/Checkout';
import ClientOrders from './components/client/ClientOrders';
import Account from './components/client/Account';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

function AppContent() {
  const { state, dispatch } = useApp();
  const location = useLocation();

  // Keep currentPanel in sync with URL for labels and RTL paddings
  React.useEffect(() => {
    const isAdmin = location.pathname.startsWith('/admin');
    dispatch({ type: 'SET_PANEL', payload: isAdmin ? 'admin' : 'client' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // ProtectedRoute wrapper
  const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
    if (!state.currentUser) {
      return <Navigate to="/login" replace state={{ from: location }} />;
    }
    return children;
  };

  // AdminRoute wrapper - only admins can access
  const AdminRoute = ({ children }: { children: React.ReactElement }) => {
    if (!state.currentUser) {
      return <Navigate to="/login" replace state={{ from: location }} />;
    }
    if (state.currentUser.role !== 'ADMIN') {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  const isAuthPage = location.pathname.startsWith('/login') || location.pathname.startsWith('/register');

  return (
    <div className="min-h-screen app-bg animate-fadeIn">
      {/* Fixed sidebar - hidden on mobile (not on auth routes) */}
      {!isAuthPage && (
        <div className="hidden lg:block">
          <Navigation />
        </div>
      )}
      
      {/* Content area - responsive padding (mirrors in RTL) */}
      <div className={`${!isAuthPage ? 'lg:ltr:pr-[19rem] lg:rtl:pl-[19rem]' : ''} h-full flex flex-col`}>
        {/* Sticky Topbar (not on auth routes) */}
        {!isAuthPage && <Topbar />}
        
        {/* Scrollable page content below topbar */}
        <main className="flex-1 overflow-y-auto animate-slideIn">
          <div className="p-3 sm:p-4 md:p-6 max-w-7xl mx-auto">
            <Routes>
              {/* Client routes */}
              <Route path="/" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <ClientOrders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/account"
                element={
                  <ProtectedRoute>
                    <Account />
                  </ProtectedRoute>
                }
              />

              {/* Auth */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Profile (accessible by both admin and client) */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Admin routes - Only accessible by ADMIN role */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <Dashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/products"
                element={
                  <AdminRoute>
                    <Products />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/products/add"
                element={
                  <AdminRoute>
                    <AddProduct />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/products/:id/edit"
                element={
                  <AdminRoute>
                    <EditProduct />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/categories"
                element={
                  <AdminRoute>
                    <Categories />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/categories/add"
                element={
                  <AdminRoute>
                    <AddCategory />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <AdminRoute>
                    <Orders />
                  </AdminRoute>
                }
              />
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
      
      {/* React Hot Toast */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'var(--toast-bg)',
            color: 'var(--toast-text)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
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