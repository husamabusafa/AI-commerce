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

// Initialize with saved language or default to Arabic
const getInitialLanguage = (): Language => {
  if (typeof window === 'undefined') return 'ar'; // SSR fallback
  
  try {
    const saved = localStorage.getItem('lang') as Language | null;
    if (saved && (saved === 'ar' || saved === 'en')) {
      return saved;
    }
  } catch {}
  
  return 'ar'; // Default to Arabic
};

const initialLanguage = getInitialLanguage();

const initialState: LanguageState = {
  currentLanguage: initialLanguage,
  isRTL: initialLanguage === 'ar',
};

// Translation strings
const translations: Record<Language, Record<string, string>> = {
  ar: {
    // Navigation
    'nav.dashboard': 'لوحة التحكم',
    'nav.products': 'المنتجات',
    'nav.categories': 'الفئات',
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
    'filters.label': 'الفلاتر:',

    // Price Ranges
    'price.all': 'الكل',
    'price.under50': '< 200 ريال',
    'price.50to200': '200-800 ريال',
    'price.over200': '> 800 ريال',

    // Shop Empty States
    'shop.noProductsTitle': 'لم يتم العثور على منتجات',
    'shop.noProductsDesc': 'جرب تعديل الفلاتر أو مصطلحات البحث',
    'shop.resetFilters': 'إعادة تعيين الفلاتر',
    
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
    'category.uncategorized': 'غير مصنف',
    
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
    
    // Orders (Admin)
    'orders.title': 'الطلبات',
    'orders.subtitle': 'تتبع وأدر طلبات العملاء',
    'orders.stats.total': 'إجمالي الطلبات',
    'orders.status.pending': 'قيد الانتظار',
    'orders.status.processing': 'معالجة',
    'orders.status.shipped': 'تم الشحن',
    'orders.status.delivered': 'تم التسليم',
    'orders.status.cancelled': 'ملغي',
    'orders.searchPlaceholder': 'بحث في الطلبات...',
    'orders.filter.all': 'كل الحالات',
    'orders.table.orderId': 'رقم الطلب',
    'orders.table.customer': 'العميل',
    'orders.table.items': 'العناصر',
    'orders.table.total': 'الإجمالي',
    'orders.table.status': 'الحالة',
    'orders.table.date': 'التاريخ',
    'orders.table.actions': 'إجراءات',
    'orders.itemSingular': 'عنصر',
    'orders.itemPlural': 'عناصر',
    'orders.details.title': 'تفاصيل الطلب',
    'orders.details.orderInfo': 'معلومات الطلب',
    'orders.details.customerInfo': 'معلومات العميل',
    'orders.details.name': 'الاسم',
    'orders.details.email': 'البريد الإلكتروني',
    'orders.details.address': 'العنوان',
    'orders.details.items': 'عناصر الطلب',
    'orders.details.quantity': 'الكمية',
    'orders.details.each': 'لكل قطعة',

    // Products (Admin)
    'products.title': 'المنتجات',
    'products.subtitle': 'إدارة مخزون المنتجات',
    'products.addProduct': 'إضافة منتج',
    'products.searchPlaceholder': 'البحث في المنتجات...',
    'products.total': 'الإجمالي',
    'products.lowStock': 'مخزون منخفض',
    'products.inStock': 'متوفر',
    'products.noProductsTitle': 'لم يتم العثور على منتجات',
    'products.noProductsDesc': 'لا توجد منتجات تطابق معايير البحث.',
    'products.firstProductDesc': 'ابدأ بإضافة منتجك الأول.',
    'products.featured': 'مميز',
    'products.deleteTitle': 'تأكيد الحذف',
    'products.deleteConfirm': 'هل أنت متأكد من حذف المنتج',
    'products.deleted': 'تم حذف المنتج بنجاح',
    'products.deleteError': 'حدث خطأ أثناء حذف المنتج',
    'products.notFound': 'المنتج غير موجود',
    'products.notFoundDesc': 'المنتج الذي تحاول تحريره غير موجود',

    // Edit Product
    'editProduct.title': 'تحرير المنتج',
    'editProduct.subtitle': 'تحديث معلومات المنتج',
    'editProduct.update': 'تحديث المنتج',

    // Users (Admin)
    'users.title': 'المستخدمين',
    'users.subtitle': 'إدارة حسابات المستخدمين والصلاحيات',
    'users.inviteUser': 'دعوة مستخدم',
    'users.totalUsers': 'إجمالي المستخدمين',
    'users.admins': 'المديرين',
    'users.clients': 'العملاء',
    'users.newUsers': 'جديد (30 يوم)',
    'users.searchPlaceholder': 'البحث في المستخدمين...',
    'users.allRoles': 'جميع الأدوار',
    'users.admin': 'مدير',
    'users.client': 'عميل',
    'users.noUsersTitle': 'لم يتم العثور على مستخدمين',
    'users.noUsersDesc': 'لا يوجد مستخدمين يطابقون معايير البحث.',
    'users.joined': 'انضم في',
    'users.viewProfile': 'عرض الملف الشخصي',

    // Add Product Form
    'addProduct.title': 'إنشاء منتج جديد',
    'addProduct.subtitle': 'إضافة منتج جديد إلى مخزون المتجر',
    'addProduct.backToProducts': 'العودة إلى المنتجات',
    'addProduct.basicInfo': 'المعلومات الأساسية',
    'addProduct.productName': 'اسم المنتج',
    'addProduct.price': 'السعر',
    'addProduct.stock': 'كمية المخزون',
    'addProduct.category': 'الفئة',
    'addProduct.description': 'الوصف',
    'addProduct.featured': 'منتج مميز',
    'addProduct.productImage': 'صورة المنتج',
    'addProduct.imageUrl': 'رابط الصورة',
    'addProduct.dragDrop': 'اسحب وأفلت صورة هنا',
    'addProduct.orUseUrl': 'أو استخدم حقل الرابط أعلاه',
    'addProduct.chooseSamples': 'أو اختر من النماذج:',
    'addProduct.preview': 'معاينة:',
    'addProduct.createProduct': 'إنشاء المنتج',
    'addProduct.cancel': 'إلغاء',
    'addProduct.selectCategory': 'اختر فئة',

    // Dashboard (Admin)
    'dashboard.title': 'لوحة التحكم',
    'dashboard.welcome': 'مرحباً بعودتك! إليك ما يحدث في متجرك.',
    'dashboard.totalRevenue': 'إجمالي الإيرادات',
    'dashboard.totalOrders': 'إجمالي الطلبات',
    'dashboard.products': 'المنتجات',
    'dashboard.users': 'المستخدمين',
    'dashboard.recentOrders': 'الطلبات الأخيرة',
    'dashboard.inventoryStatus': 'حالة المخزون',
    'dashboard.lowStockAlert': 'تنبيه مخزون منخفض',
    'dashboard.lowStockMessage': 'منتج يعاني من نقص في المخزون',
    'dashboard.lowStockMessagePlural': 'منتجات تعاني من نقص في المخزون',
    'dashboard.units': 'وحدة',
    'dashboard.lowStock': 'مخزون منخفض',
    'dashboard.inStock': 'متوفر',

    // Categories (Admin)
    'categories.title': 'الفئات',
    'categories.subtitle': 'إدارة فئات المنتجات لمتجرك',
    'categories.addCategory': 'إضافة فئة',
    'categories.name': 'اسم الفئة',
    'categories.nameEn': 'الاسم بالإنجليزية',
    'categories.nameAr': 'الاسم بالعربية',
    'categories.description': 'الوصف',
    'categories.descriptionPlaceholder': 'اختياري',
    'categories.namePlaceholder': 'مثال: إلكترونيات',
    'categories.noCategories': 'لا توجد فئات بعد. أضف أول فئة في الأعلى.',
    'categories.productCount': 'منتج',
    'categories.productCountPlural': 'منتجات',
    'categories.deleteTitle': 'تأكيد الحذف',
    'categories.deleteConfirm': 'هل أنت متأكد من حذف الفئة',
    'categories.deleteConfirmWithProducts': 'هل أنت متأكد من حذف الفئة',
    'categories.willBeUncategorized': 'ستصبح بدون تصنيف',
    'categories.loading': 'جاري التحميل...',
    'categories.error': 'حدث خطأ في تحميل الفئات',
    'categories.created': 'تم إنشاء الفئة بنجاح',
    'categories.deleted': 'تم حذف الفئة بنجاح',
    'categories.requiredName': 'اسم الفئة مطلوب',
  },
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.products': 'Products',
    'nav.categories': 'Categories',
    'nav.orders': 'Orders',
    'nav.users': 'Users',
    'nav.shop': 'Shop',
    'nav.cart': 'Cart',
    'nav.myOrders': 'My Orders',
    'nav.account': 'Account',
    'nav.adminPanel': 'Admin Panel',
    'nav.store': 'Store',
    
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
    'filters.label': 'Filters:',

    // Price Ranges
    'price.all': 'All',
    'price.under50': '< 200 SAR',
    'price.50to200': '200-800 SAR',
    'price.over200': '> 800 SAR',

    // Shop Empty States
    'shop.noProductsTitle': 'No products found',
    'shop.noProductsDesc': 'Try adjusting filters or search terms',
    'shop.resetFilters': 'Reset Filters',
    
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
    'category.uncategorized': 'Uncategorized',
    
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

    // Orders (Admin)
    'orders.title': 'Orders',
    'orders.subtitle': 'Track and manage customer orders',
    'orders.stats.total': 'Total Orders',
    'orders.status.pending': 'Pending',
    'orders.status.processing': 'Processing',
    'orders.status.shipped': 'Shipped',
    'orders.status.delivered': 'Delivered',
    'orders.status.cancelled': 'Cancelled',
    'orders.searchPlaceholder': 'Search orders...',
    'orders.filter.all': 'All Status',
    'orders.table.orderId': 'Order ID',
    'orders.table.customer': 'Customer',
    'orders.table.items': 'Items',
    'orders.table.total': 'Total',
    'orders.table.status': 'Status',
    'orders.table.date': 'Date',
    'orders.table.actions': 'Actions',
    'orders.itemSingular': 'item',
    'orders.itemPlural': 'items',
    'orders.details.title': 'Order Details',
    'orders.details.orderInfo': 'Order Information',
    'orders.details.customerInfo': 'Customer Information',
    'orders.details.name': 'Name',
    'orders.details.email': 'Email',
    'orders.details.address': 'Address',
    'orders.details.items': 'Order Items',
    'orders.details.quantity': 'Quantity',
    'orders.details.each': 'each',

    // Products (Admin)
    'products.title': 'Products',
    'products.subtitle': 'Manage your product inventory',
    'products.addProduct': 'Add Product',
    'products.searchPlaceholder': 'Search products...',
    'products.total': 'Total',
    'products.lowStock': 'Low Stock',
    'products.inStock': 'in stock',
    'products.noProductsTitle': 'No products found',
    'products.noProductsDesc': 'No products match your search criteria.',
    'products.firstProductDesc': 'Start by adding your first product.',
    'products.featured': 'Featured',
    'products.deleteTitle': 'Confirm Deletion',
    'products.deleteConfirm': 'Are you sure you want to delete product',
    'products.deleted': 'Product deleted successfully',
    'products.deleteError': 'Error deleting product',
    'products.notFound': 'Product not found',
    'products.notFoundDesc': 'The product you are trying to edit does not exist',

    // Edit Product
    'editProduct.title': 'Edit Product',
    'editProduct.subtitle': 'Update product information',
    'editProduct.update': 'Update Product',

    // Users (Admin)
    'users.title': 'Users',
    'users.subtitle': 'Manage user accounts and permissions',
    'users.inviteUser': 'Invite User',
    'users.totalUsers': 'Total Users',
    'users.admins': 'Admins',
    'users.clients': 'Clients',
    'users.newUsers': 'New (30d)',
    'users.searchPlaceholder': 'Search users...',
    'users.allRoles': 'All Roles',
    'users.admin': 'Admin',
    'users.client': 'Client',
    'users.noUsersTitle': 'No users found',
    'users.noUsersDesc': 'No users match your search criteria.',
    'users.joined': 'Joined',
    'users.viewProfile': 'View Profile',

    // Add Product Form
    'addProduct.title': 'Create New Product',
    'addProduct.subtitle': 'Add a new product to your store inventory',
    'addProduct.backToProducts': 'Back to Products',
    'addProduct.basicInfo': 'Basic Information',
    'addProduct.productName': 'Product Name',
    'addProduct.price': 'Price',
    'addProduct.stock': 'Stock Quantity',
    'addProduct.category': 'Category',
    'addProduct.description': 'Description',
    'addProduct.featured': 'Mark as Featured Product',
    'addProduct.productImage': 'Product Image',
    'addProduct.imageUrl': 'Image URL',
    'addProduct.dragDrop': 'Drag & drop an image here',
    'addProduct.orUseUrl': 'or use the URL field above',
    'addProduct.chooseSamples': 'Or choose from samples:',
    'addProduct.preview': 'Preview:',
    'addProduct.createProduct': 'Create Product',
    'addProduct.cancel': 'Cancel',
    'addProduct.selectCategory': 'Select a category',

    // Dashboard (Admin)
    'dashboard.title': 'Dashboard',
    'dashboard.welcome': 'Welcome back! Here\'s what\'s happening with your store.',
    'dashboard.totalRevenue': 'Total Revenue',
    'dashboard.totalOrders': 'Total Orders',
    'dashboard.products': 'Products',
    'dashboard.users': 'Users',
    'dashboard.recentOrders': 'Recent Orders',
    'dashboard.inventoryStatus': 'Inventory Status',
    'dashboard.lowStockAlert': 'Low Stock Alert',
    'dashboard.lowStockMessage': 'product running low on stock',
    'dashboard.lowStockMessagePlural': 'products running low on stock',
    'dashboard.units': 'units',
    'dashboard.lowStock': 'Low Stock',
    'dashboard.inStock': 'In Stock',

    // Categories (Admin)
    'categories.title': 'Categories',
    'categories.subtitle': 'Manage product categories for your store',
    'categories.addCategory': 'Add Category',
    'categories.name': 'Category Name',
    'categories.nameEn': 'Name in English',
    'categories.nameAr': 'Name in Arabic',
    'categories.description': 'Description',
    'categories.descriptionPlaceholder': 'Optional',
    'categories.namePlaceholder': 'e.g. Electronics',
    'categories.noCategories': 'No categories yet. Add your first one above.',
    'categories.productCount': 'product',
    'categories.productCountPlural': 'products',
    'categories.deleteTitle': 'Confirm Deletion',
    'categories.deleteConfirm': 'Are you sure you want to delete category',
    'categories.deleteConfirmWithProducts': 'Are you sure you want to delete category',
    'categories.willBeUncategorized': 'will become uncategorized',
    'categories.loading': 'Loading...',
    'categories.error': 'Error loading categories',
    'categories.created': 'Category created successfully',
    'categories.deleted': 'Category deleted successfully',
    'categories.requiredName': 'Category name is required',
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
        category: {
          ...product.category,
          name: getArabicCategory(product.category?.name || '')
        }
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
    // Persist language
    try {
      localStorage.setItem('lang', state.currentLanguage);
    } catch {}
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
