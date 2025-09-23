import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export type Language = 'ar' | 'en';

interface LanguageState {
  currentLanguage: Language;
  isRTL: boolean;
}

interface LanguageContextType {
  state: LanguageState;
  dispatch: React.Dispatch<LanguageAction>;
  t: (key: string) => string;
  formatNumber: (number: number) => string;
  translateProduct: (product: any) => any;
}

type LanguageAction = 
  | { type: 'SET_LANGUAGE'; payload: Language };

const initialState: LanguageState = {
  currentLanguage: 'ar',
  isRTL: true,
};

// Translation strings
const translations = {
  ar: {
    // Navigation
    'nav.dashboard': 'لوحة التحكم',
    'nav.products': 'المنتجات',
    'nav.orders': 'الطلبات',
    'nav.users': 'المستخدمين',
    'nav.shop': 'المتجر',
    'nav.cart': 'السلة',
    'nav.myOrders': 'طلباتي',
    'nav.account': 'حسابي',
    'nav.adminPanel': 'لوحة الإدارة',
    'nav.store': 'متجر إلكتروني',
    
    // Search
    'search.placeholder': 'ابحث عن المنتجات، الطلبات، المستخدمين...',
    'search.mobilePlaceholder': 'بحث...',
    'search.results': 'نتائج البحث',
    'search.recent': 'البحث الأخير',
    
    // Product
    'product.addToCart': 'أضف للسلة',
    'product.viewDetails': 'عرض التفاصيل',
    'product.inStock': 'متوفر فوراً',
    'product.outOfStock': 'غير متوفر',
    'product.new': 'جديد',
    'product.featured': 'مميز',
    'product.exclusive': 'حصري',
    'product.reviews': 'تقييم',
    'product.rating': 'التقييم',
    
    // Cart
    'cart.title': 'سلة التسوق',
    'cart.empty': 'سلة التسوق فارغة',
    'cart.emptyDesc': 'ابدأ التسوق لإضافة منتجات إلى سلتك',
    'cart.continueShopping': 'متابعة التسوق',
    'cart.checkout': 'إتمام الطلب',
    'cart.total': 'المجموع',
    'cart.subtotal': 'المجموع الفرعي',
    'cart.shipping': 'الشحن',
    'cart.free': 'مجاني',
    
    // Hero Section
    'hero.title': 'اكتشف مجموعتنا الفاخرة',
    'hero.subtitle': 'منتجات عالية الجودة بأسعار تنافسية',
    'hero.cta': 'تسوق الآن',
    
    // Benefits
    'benefits.freeShipping': 'شحن مجاني فوق 300 ريال',
    'benefits.returns': 'إرجاع خلال 14 يوم',
    'benefits.support': 'دعم 24/7',
    
    // Filters
    'filters.all': 'الكل',
    'filters.category': 'الفئة',
    'filters.price': 'السعر',
    'filters.brand': 'العلامة التجارية',
    'filters.color': 'اللون',
    'filters.sort': 'ترتيب حسب',
    'filters.newest': 'الأحدث',
    'filters.bestSelling': 'الأكثر مبيعاً',
    'filters.priceHighLow': 'السعر: عالي إلى منخفض',
    'filters.priceLowHigh': 'السعر: منخفض إلى عالي',
    'filters.results': 'نتيجة',
    
    // Testimonials
    'testimonials.title': 'آراء عملائنا',
    'testimonials.subtitle': 'اكتشف تجارب عملائنا المميزة مع منتجاتنا وخدماتنا',
    
    // Toast Messages
    'toast.addedToCart': 'تم إضافة المنتج إلى السلة',
    'toast.removedFromCart': 'تم إزالة المنتج من السلة',
    'toast.error': 'حدث خطأ، يرجى المحاولة مرة أخرى',
    
    // Currency
    'currency.sar': 'ريال',
    
    // Common
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.success': 'نجح',
    'common.cancel': 'إلغاء',
    'common.save': 'حفظ',
    'common.edit': 'تعديل',
    'common.delete': 'حذف',
    'common.add': 'إضافة',
    'common.view': 'عرض',
    'common.close': 'إغلاق',
    'common.browse': 'تصفح الفئات',
    
    // Categories
    'category.electronics': 'إلكترونيات',
    'category.clothing': 'ملابس',
    'category.books': 'كتب',
    'category.home': 'منزل وحديقة',
    'category.sports': 'رياضة',
    'category.beauty': 'جمال وعناية',
    'category.toys': 'ألعاب',
    'category.automotive': 'سيارات',
    'category.all': 'جميع الفئات',
    
    // Product Names (examples)
    'product.headphones': 'سماعات رأس لاسلكية فاخرة',
    'product.laptop': 'لابتوب عالي الأداء',
    'product.watch': 'ساعة ذكية للياقة البدنية',
    'product.camera': 'كاميرا رقمية احترافية',
    'product.phone': 'هاتف ذكي متطور',
    'product.tablet': 'جهاز لوحي متعدد الاستخدامات',
    
    // Product Descriptions
    'desc.headphones': 'سماعات رأس لاسلكية عالية الجودة مع إلغاء الضوضاء',
    'desc.laptop': 'لابتوب قوي مثالي للعمل والألعاب',
    'desc.watch': 'ساعة ذكية متقدمة لتتبع اللياقة البدنية',
    'desc.camera': 'كاميرا رقمية احترافية للتصوير الفوتوغرافي',
    'desc.phone': 'هاتف ذكي بأحدث التقنيات والمواصفات',
    'desc.tablet': 'جهاز لوحي متطور للعمل والترفيه',
    
    // Featured Products Section
    'featured.title': 'المنتجات المميزة',
    'featured.viewAll': 'عرض الكل',
    
    // User Profile
    'user.profile': 'الملف الشخصي',
    'user.settings': 'الإعدادات',
    'user.logout': 'تسجيل الخروج',
  },
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.products': 'Products',
    'nav.orders': 'Orders',
    'nav.users': 'Users',
    'nav.shop': 'Shop',
    'nav.cart': 'Cart',
    'nav.myOrders': 'My Orders',
    'nav.account': 'Account',
    'nav.adminPanel': 'Admin Panel',
    'nav.store': 'E-commerce Store',
    
    // Search
    'search.placeholder': 'Search for products, orders, users...',
    'search.mobilePlaceholder': 'Search...',
    'search.results': 'Search Results',
    'search.recent': 'Recent Searches',
    
    // Product
    'product.addToCart': 'Add to Cart',
    'product.viewDetails': 'View Details',
    'product.inStock': 'In Stock',
    'product.outOfStock': 'Out of Stock',
    'product.new': 'New',
    'product.featured': 'Featured',
    'product.exclusive': 'Exclusive',
    'product.reviews': 'reviews',
    'product.rating': 'Rating',
    
    // Cart
    'cart.title': 'Shopping Cart',
    'cart.empty': 'Your cart is empty',
    'cart.emptyDesc': 'Start shopping to add items to your cart',
    'cart.continueShopping': 'Continue Shopping',
    'cart.checkout': 'Checkout',
    'cart.total': 'Total',
    'cart.subtotal': 'Subtotal',
    'cart.shipping': 'Shipping',
    'cart.free': 'Free',
    
    // Hero Section
    'hero.title': 'Discover Our Luxury Collection',
    'hero.subtitle': 'Premium quality products at competitive prices',
    'hero.cta': 'Shop Now',
    
    // Benefits
    'benefits.freeShipping': 'Free shipping over 300 SAR',
    'benefits.returns': '14-day returns',
    'benefits.support': '24/7 support',
    
    // Filters
    'filters.all': 'All',
    'filters.category': 'Category',
    'filters.price': 'Price',
    'filters.brand': 'Brand',
    'filters.color': 'Color',
    'filters.sort': 'Sort by',
    'filters.newest': 'Newest',
    'filters.bestSelling': 'Best Selling',
    'filters.priceHighLow': 'Price: High to Low',
    'filters.priceLowHigh': 'Price: Low to High',
    'filters.results': 'results',
    
    // Testimonials
    'testimonials.title': 'Customer Reviews',
    'testimonials.subtitle': 'Discover our customers\' amazing experiences with our products and services',
    
    // Toast Messages
    'toast.addedToCart': 'Product added to cart',
    'toast.removedFromCart': 'Product removed from cart',
    'toast.error': 'An error occurred, please try again',
    
    // Currency
    'currency.sar': 'SAR',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.add': 'Add',
    'common.view': 'View',
    'common.close': 'Close',
    'common.browse': 'Browse Categories',
    
    // Categories
    'category.electronics': 'Electronics',
    'category.clothing': 'Clothing',
    'category.books': 'Books',
    'category.home': 'Home & Garden',
    'category.sports': 'Sports',
    'category.beauty': 'Beauty & Care',
    'category.toys': 'Toys',
    'category.automotive': 'Automotive',
    'category.all': 'All Categories',
    
    // Product Names (examples)
    'product.headphones': 'Premium Wireless Headphones',
    'product.laptop': 'High-Performance Laptop',
    'product.watch': 'Smart Fitness Watch',
    'product.camera': 'Professional Digital Camera',
    'product.phone': 'Advanced Smartphone',
    'product.tablet': 'Versatile Tablet Device',
    
    // Product Descriptions
    'desc.headphones': 'High-quality wireless headphones with noise cancellation',
    'desc.laptop': 'Powerful laptop perfect for work and gaming',
    'desc.watch': 'Advanced smartwatch for fitness tracking',
    'desc.camera': 'Professional digital camera for photography',
    'desc.phone': 'Smartphone with latest technology and specifications',
    'desc.tablet': 'Advanced tablet for work and entertainment',
    
    // Featured Products Section
    'featured.title': 'Featured Products',
    'featured.viewAll': 'View All',
    
    // User Profile
    'user.profile': 'Profile',
    'user.settings': 'Settings',
    'user.logout': 'Logout',
  }
};

function languageReducer(state: LanguageState, action: LanguageAction): LanguageState {
  switch (action.type) {
    case 'SET_LANGUAGE':
      return {
        ...state,
        currentLanguage: action.payload,
        isRTL: action.payload === 'ar',
      };
    default:
      return state;
  }
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(languageReducer, initialState);

  // Translation function
  const t = (key: string): string => {
    return translations[state.currentLanguage][key] || key;
  };

  // Number formatting function
  const formatNumber = (number: number): string => {
    const locale = state.currentLanguage === 'ar' ? 'ar-SA' : 'en-US';
    return number.toLocaleString(locale);
  };

  // Product translation function
  const translateProduct = (product: any) => {
    if (state.currentLanguage === 'ar') {
      return {
        ...product,
        name: getArabicProductName(product.name),
        description: getArabicProductDescription(product.description),
        category: getArabicCategory(product.category)
      };
    }
    return product;
  };

  // Helper functions for product translations
  const getArabicProductName = (englishName: string): string => {
    const productNameMap: { [key: string]: string } = {
      'Premium Wireless Headphones': 'سماعات رأس لاسلكية فاخرة',
      'Professional Laptop': 'لابتوب احترافي',
      'Smart Fitness Watch': 'ساعة ذكية للياقة البدنية',
      'Digital Camera': 'كاميرا رقمية',
      'Smartphone': 'هاتف ذكي',
      'Tablet Device': 'جهاز لوحي',
      'Wireless Mouse': 'فأرة لاسلكية',
      'Mechanical Keyboard': 'لوحة مفاتيح ميكانيكية',
      'Gaming Monitor': 'شاشة ألعاب',
      'Bluetooth Speaker': 'مكبر صوت بلوتوث'
    };
    return productNameMap[englishName] || englishName;
  };

  const getArabicProductDescription = (englishDesc: string): string => {
    const descMap: { [key: string]: string } = {
      'High-quality wireless headphones with noise cancellation and premium sound quality.': 'سماعات رأس لاسلكية عالية الجودة مع إلغاء الضوضاء وجودة صوت فائقة.',
      'Powerful laptop perfect for work and gaming with high-performance specifications.': 'لابتوب قوي مثالي للعمل والألعاب بمواصفات عالية الأداء.',
      'Advanced smartwatch for fitness tracking with heart rate monitor and GPS.': 'ساعة ذكية متقدمة لتتبع اللياقة البدنية مع مراقب معدل ضربات القلب و GPS.',
      'Professional digital camera with high resolution and advanced features.': 'كاميرا رقمية احترافية بدقة عالية وميزات متقدمة.',
      'Latest smartphone with cutting-edge technology and premium design.': 'أحدث هاتف ذكي بتقنية متطورة وتصميم فاخر.',
      'Versatile tablet for work and entertainment with long battery life.': 'جهاز لوحي متعدد الاستخدامات للعمل والترفيه مع بطارية طويلة المدى.'
    };
    return descMap[englishDesc] || englishDesc;
  };

  const getArabicCategory = (englishCategory: string): string => {
    const categoryMap: { [key: string]: string } = {
      'Electronics': 'إلكترونيات',
      'Clothing': 'ملابس',
      'Books': 'كتب',
      'Home & Garden': 'منزل وحديقة',
      'Sports': 'رياضة',
      'Beauty': 'جمال وعناية',
      'Toys': 'ألعاب',
      'Automotive': 'سيارات'
    };
    return categoryMap[englishCategory] || englishCategory;
  };

  // Update document direction and language when language changes
  React.useEffect(() => {
    document.documentElement.lang = state.currentLanguage;
    document.documentElement.dir = state.isRTL ? 'rtl' : 'ltr';
    document.body.style.direction = state.isRTL ? 'rtl' : 'ltr';
  }, [state.currentLanguage, state.isRTL]);

  return (
    <LanguageContext.Provider value={{ state, dispatch, t, formatNumber, translateProduct }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
