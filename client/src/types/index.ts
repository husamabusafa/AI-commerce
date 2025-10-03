export interface Category {
  id: string;
  name: string;
  nameEn: string;
  nameAr: string;
}

export interface Product {
  id: string;
  name: string;
  nameEn: string;
  nameAr: string;
  price: number;
  description: string;
  descriptionEn: string;
  descriptionAr: string;
  image: string;
  category: Category;
  stock: number;
  featured: boolean;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber?: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  phoneNumber?: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  nameEn?: string;
  email: string;
  role: 'ADMIN' | 'CLIENT';
  avatar: string;
  joinedAt: string;
}

export type PanelType = 'admin' | 'client';
export type AdminView = 'dashboard' | 'products' | 'orders' | 'users' | 'add-product' | 'edit-product';
export type ClientView = 'shop' | 'product' | 'cart' | 'checkout' | 'account' | 'orders';