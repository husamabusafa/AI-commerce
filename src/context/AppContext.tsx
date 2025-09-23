import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Product, CartItem, Order, User, PanelType, AdminView, ClientView } from '../types';

interface AppState {
  currentPanel: PanelType;
  adminView: AdminView;
  clientView: ClientView;
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  users: User[];
  currentUser: User | null;
  selectedProduct: Product | null;
  isLoading: boolean;
  searchQuery: string;
  selectedCategory: string;
  editingProduct: Product | null;
  toast: {
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  };
}

type AppAction =
  | { type: 'SET_PANEL'; payload: PanelType }
  | { type: 'SET_ADMIN_VIEW'; payload: AdminView }
  | { type: 'SET_CLIENT_VIEW'; payload: ClientView }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'ADD_TO_CART'; payload: Product }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER_STATUS'; payload: { orderId: string; status: Order['status'] } }
  | { type: 'SET_SELECTED_PRODUCT'; payload: Product | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_SELECTED_CATEGORY'; payload: string }
  | { type: 'SET_CURRENT_USER'; payload: User | null }
  | { type: 'SET_EDITING_PRODUCT'; payload: Product | null }
  | { type: 'SHOW_TOAST'; payload: { message: string; type: 'success' | 'error' | 'info' } }
  | { type: 'HIDE_TOAST' };

const initialState: AppState = {
  currentPanel: 'client',
  adminView: 'dashboard',
  clientView: 'shop',
  toast: {
    show: false,
    message: '',
    type: 'success'
  },
  products: [
    {
      id: '1',
      name: 'Premium Wireless Headphones',
      price: 199.99,
      description: 'High-quality wireless headphones with noise cancellation and premium sound quality.',
      image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Electronics',
      stock: 15,
      featured: true,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Ergonomic Office Chair',
      price: 349.99,
      description: 'Comfortable and supportive office chair designed for long working hours.',
      image: 'https://images.pexels.com/photos/586020/pexels-photo-586020.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Furniture',
      stock: 8,
      featured: false,
      createdAt: '2024-01-12'
    },
    {
      id: '3',
      name: 'Smart Fitness Watch',
      price: 299.99,
      description: 'Advanced fitness tracking with heart rate monitoring and GPS functionality.',
      image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Electronics',
      stock: 22,
      featured: true,
      createdAt: '2024-01-10'
    },
    {
      id: '4',
      name: 'Premium Coffee Maker',
      price: 189.99,
      description: 'Professional-grade coffee maker with multiple brewing options and programmable settings.',
      image: 'https://images.pexels.com/photos/324028/pexels-photo-324028.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Kitchen',
      stock: 12,
      featured: false,
      createdAt: '2024-01-08'
    }
  ],
  cart: [],
  orders: [
    {
      id: 'ORD-001',
      items: [
        {
          product: {
            id: '1',
            name: 'Premium Wireless Headphones',
            price: 199.99,
            description: 'High-quality wireless headphones',
            image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
            category: 'Electronics',
            stock: 15,
            featured: true,
            createdAt: '2024-01-15'
          },
          quantity: 1
        }
      ],
      total: 199.99,
      status: 'processing',
      customerName: 'John Smith',
      customerEmail: 'john@example.com',
      shippingAddress: '123 Main St, New York, NY 10001',
      createdAt: '2024-01-20'
    },
    {
      id: 'ORD-002',
      items: [
        {
          product: {
            id: '3',
            name: 'Smart Fitness Watch',
            price: 299.99,
            description: 'Advanced fitness tracking watch',
            image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400',
            category: 'Electronics',
            stock: 22,
            featured: true,
            createdAt: '2024-01-10'
          },
          quantity: 2
        }
      ],
      total: 599.98,
      status: 'shipped',
      customerName: 'Sarah Johnson',
      customerEmail: 'sarah@example.com',
      shippingAddress: '456 Oak Ave, Los Angeles, CA 90210',
      createdAt: '2024-01-18'
    }
  ],
  users: [
    {
      id: '1',
      name: 'Admin User',
      email: 'admin@ecommerce.com',
      role: 'admin',
      avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100',
      joinedAt: '2024-01-01'
    },
    {
      id: '2',
      name: 'John Smith',
      email: 'john@example.com',
      role: 'client',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100',
      joinedAt: '2024-01-15'
    },
    {
      id: '3',
      name: 'أحمد محمد العلي',
      nameEn: 'Ahmed Mohammed Al-Ali',
      email: 'ahmed@example.com',
      role: 'client',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format',
      joinedAt: '2024-01-10'
    }
  ],
  currentUser: {
    id: '3',
    name: 'أحمد محمد العلي',
    nameEn: 'Ahmed Mohammed Al-Ali',
    email: 'ahmed@example.com',
    role: 'client',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format',
    joinedAt: '2024-01-10'
  },
  selectedProduct: null,
  isLoading: false,
  searchQuery: '',
  selectedCategory: 'All',
  editingProduct: null
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_PANEL':
      return { ...state, currentPanel: action.payload };
    case 'SET_ADMIN_VIEW':
      return { ...state, adminView: action.payload };
    case 'SET_CLIENT_VIEW':
      return { ...state, clientView: action.payload };
    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.payload] };
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(p => 
          p.id === action.payload.id ? action.payload : p
        )
      };
    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(p => p.id !== action.payload)
      };
    case 'ADD_TO_CART':
      const existingItem = state.cart.find(item => item.product.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.product.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          toast: {
            show: true,
            message: 'تم تحديث الكمية في السلة',
            type: 'success'
          }
        };
      }
      return {
        ...state,
        cart: [...state.cart, { product: action.payload, quantity: 1 }],
        toast: {
          show: true,
          message: 'تم إضافة المنتج إلى السلة',
          type: 'success'
        }
      };
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.product.id !== action.payload)
      };
    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.product.id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ).filter(item => item.quantity > 0)
      };
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    case 'ADD_ORDER':
      return { ...state, orders: [action.payload, ...state.orders] };
    case 'UPDATE_ORDER_STATUS':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.orderId
            ? { ...order, status: action.payload.status }
            : order
        )
      };
    case 'SET_SELECTED_PRODUCT':
      return { ...state, selectedProduct: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_SELECTED_CATEGORY':
      return { ...state, selectedCategory: action.payload };
    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload };
    case 'SET_EDITING_PRODUCT':
      return { ...state, editingProduct: action.payload };
    case 'SHOW_TOAST':
      return {
        ...state,
        toast: {
          show: true,
          message: action.payload.message,
          type: action.payload.type
        }
      };
    case 'HIDE_TOAST':
      return {
        ...state,
        toast: {
          ...state.toast,
          show: false
        }
      };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}