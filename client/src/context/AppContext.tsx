import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Product, User, PanelType, AdminView, ClientView } from '../types';

interface AppState {
  currentPanel: PanelType;
  adminView: AdminView;
  clientView: ClientView;
  currentUser: User | null;
  selectedProduct: Product | null;
  isLoading: boolean;
  searchQuery: string;
  selectedCategory: string;
  editingProduct: Product | null;
  accessToken: string | null;
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
  | { type: 'SET_SELECTED_PRODUCT'; payload: Product | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_SELECTED_CATEGORY'; payload: string }
  | { type: 'SET_CURRENT_USER'; payload: User | null }
  | { type: 'SET_EDITING_PRODUCT'; payload: Product | null }
  | { type: 'SET_ACCESS_TOKEN'; payload: string | null }
  | { type: 'SHOW_TOAST'; payload: { message: string; type: 'success' | 'error' | 'info' } }
  | { type: 'HIDE_TOAST' };

const initialState: AppState = {
  currentPanel: 'client',
  adminView: 'dashboard',
  clientView: 'shop',
  currentUser: null,
  selectedProduct: null,
  isLoading: false,
  searchQuery: '',
  selectedCategory: 'All',
  editingProduct: null,
  accessToken: localStorage.getItem('accessToken'),
  toast: {
    show: false,
    message: '',
    type: 'success'
  }
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_PANEL':
      return { ...state, currentPanel: action.payload };
    case 'SET_ADMIN_VIEW':
      return { ...state, adminView: action.payload };
    case 'SET_CLIENT_VIEW':
      return { ...state, clientView: action.payload };
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
    case 'SET_ACCESS_TOKEN':
      // Also save to localStorage
      if (action.payload) {
        localStorage.setItem('accessToken', action.payload);
      } else {
        localStorage.removeItem('accessToken');
      }
      return { ...state, accessToken: action.payload };
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

// Helper functions for authentication
export const login = (token: string, user: User, dispatch: React.Dispatch<AppAction>) => {
  dispatch({ type: 'SET_ACCESS_TOKEN', payload: token });
  dispatch({ type: 'SET_CURRENT_USER', payload: user });
  localStorage.setItem('user', JSON.stringify(user));
};

export const logout = (dispatch: React.Dispatch<AppAction>) => {
  dispatch({ type: 'SET_ACCESS_TOKEN', payload: null });
  dispatch({ type: 'SET_CURRENT_USER', payload: null });
  localStorage.removeItem('user');
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, {
    ...initialState,
    currentUser: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
  });

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