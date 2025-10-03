import { useHsafaAction } from '@hsafa/ui-sdk';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { useOrders } from '../../hooks/useOrders';
import { useMutation, useQuery } from '@apollo/client';
import { GET_USERS, GET_CATEGORIES, CREATE_CATEGORY, DELETE_CATEGORY } from '../../graphql/queries';
import toast from 'react-hot-toast';

/**
 * Admin Agent Actions Registry
 * 
 * This component registers all AI agent actions for the admin panel,
 * enabling the agent to control navigation, forms, and CRUD operations.
 */
export default function AdminAgentActions() {
  const navigate = useNavigate();
  const { products, categories, createProduct, updateProduct, deleteProduct } = useProducts();
  const { allOrders, updateOrderStatus } = useOrders();
  const { data: usersData } = useQuery(GET_USERS);
  const [createCategoryMutation] = useMutation(CREATE_CATEGORY, {
    refetchQueries: [{ query: GET_CATEGORIES }],
  });
  const [deleteCategoryMutation] = useMutation(DELETE_CATEGORY, {
    refetchQueries: [{ query: GET_CATEGORIES }],
  });

  // ============================================================
  // NAVIGATION ACTIONS
  // ============================================================

  /**
   * Navigate to any admin page
   * Schema: { path: string }
   * Example: { path: "/admin/products" }
   */
  useHsafaAction('navigate', async (params) => {
    const { path } = params as { path: string };
    navigate(path);
    toast.success(`Navigated to ${path}`);
    return { success: true, path };
  });

  /**
   * Navigate to dashboard
   * Schema: {}
   */
  useHsafaAction('navigateToDashboard', async () => {
    navigate('/admin');
    toast.success('Navigated to Dashboard');
    return { success: true, path: '/admin' };
  });

  /**
   * Navigate to products list
   * Schema: {}
   */
  useHsafaAction('navigateToProducts', async () => {
    navigate('/admin/products');
    toast.success('Navigated to Products');
    return { success: true, path: '/admin/products' };
  });

  /**
   * Navigate to add product page
   * Schema: {}
   */
  useHsafaAction('navigateToAddProduct', async () => {
    navigate('/admin/products/add');
    toast.success('Navigated to Add Product');
    return { success: true, path: '/admin/products/add' };
  });

  /**
   * Navigate to edit product page
   * Schema: { productId: string }
   */
  useHsafaAction('navigateToEditProduct', async (params) => {
    const { productId } = params as { productId: string };
    navigate(`/admin/products/${productId}/edit`);
    toast.success('Navigated to Edit Product');
    return { success: true, path: `/admin/products/${productId}/edit` };
  });

  /**
   * Navigate to orders page
   * Schema: {}
   */
  useHsafaAction('navigateToOrders', async () => {
    navigate('/admin/orders');
    toast.success('Navigated to Orders');
    return { success: true, path: '/admin/orders' };
  });

  /**
   * Navigate to categories page
   * Schema: {}
   */
  useHsafaAction('navigateToCategories', async () => {
    navigate('/admin/categories');
    toast.success('Navigated to Categories');
    return { success: true, path: '/admin/categories' };
  });

  /**
   * Navigate to add category page
   * Schema: {}
   */
  useHsafaAction('navigateToAddCategory', async () => {
    navigate('/admin/categories/add');
    toast.success('Navigated to Add Category');
    return { success: true, path: '/admin/categories/add' };
  });

  // ============================================================
  // PRODUCT CRUD ACTIONS
  // ============================================================

  /**
   * Get all products
   * Schema: {}
   * Returns: { products: Product[] }
   */
  useHsafaAction('getProducts', async () => {
    return { 
      success: true, 
      products: products || [],
      count: (products || []).length 
    };
  });

  /**
   * Get product by ID
   * Schema: { productId: string }
   */
  useHsafaAction('getProduct', async (params) => {
    const { productId } = params as { productId: string };
    const product = (products || []).find(p => p.id === productId);
    
    if (!product) {
      toast.error('Product not found');
      return { success: false, error: 'Product not found' };
    }
    
    return { success: true, product };
  });

  /**
   * Search products
   * Schema: { query: string }
   */
  useHsafaAction('searchProducts', async (params) => {
    const { query } = params as { query: string };
    const filtered = (products || []).filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase()) ||
      (p.category?.name || '').toLowerCase().includes(query.toLowerCase())
    );
    
    return { 
      success: true, 
      products: filtered,
      count: filtered.length,
      query 
    };
  });

  /**
   * Create a new product
   * Schema: {
   *   name: string,
   *   nameAr?: string,
   *   nameEn?: string,
   *   price: number,
   *   description: string,
   *   descriptionAr?: string,
   *   descriptionEn?: string,
   *   image: string,
   *   categoryId: string,
   *   stock: number,
   *   featured?: boolean
   * }
   */
  useHsafaAction('createProduct', async (params) => {
    const result = await createProduct(params);
    
    if (result.success) {
      toast.success('Product created successfully');
      return { success: true, product: result.product };
    } else {
      toast.error(result.error || 'Failed to create product');
      return { success: false, error: result.error };
    }
  });

  /**
   * Update an existing product
   * Schema: {
   *   productId: string,
   *   name?: string,
   *   nameAr?: string,
   *   nameEn?: string,
   *   price?: number,
   *   description?: string,
   *   descriptionAr?: string,
   *   descriptionEn?: string,
   *   image?: string,
   *   categoryId?: string,
   *   stock?: number,
   *   featured?: boolean
   * }
   */
  useHsafaAction('updateProduct', async (params) => {
    const { productId, ...updates } = params as any;
    const result = await updateProduct(productId, updates);
    
    if (result.success) {
      toast.success('Product updated successfully');
      return { success: true, product: result.product };
    } else {
      toast.error(result.error || 'Failed to update product');
      return { success: false, error: result.error };
    }
  });

  /**
   * Delete a product
   * Schema: { productId: string }
   */
  useHsafaAction('deleteProduct', async (params) => {
    const { productId } = params as { productId: string };
    const result = await deleteProduct(productId);
    
    if (result.success) {
      toast.success('Product deleted successfully');
      return { success: true };
    } else {
      toast.error(result.error || 'Failed to delete product');
      return { success: false, error: result.error };
    }
  });

  // ============================================================
  // CATEGORY ACTIONS
  // ============================================================

  /**
   * Get all categories
   * Schema: {}
   */
  useHsafaAction('getCategories', async () => {
    return { 
      success: true, 
      categories: categories || [],
      count: (categories || []).length 
    };
  });

  /**
   * Create a new category
   * Schema: {
   *   name: string,
   *   nameAr: string,
   *   nameEn: string,
   *   description?: string
   * }
   */
  useHsafaAction('createCategory', async (params) => {
    try {
      const { data } = await createCategoryMutation({ variables: { input: params } });
      toast.success('Category created successfully');
      return { success: true, category: data.createCategory };
    } catch (error: any) {
      toast.error(error.message || 'Failed to create category');
      return { success: false, error: error.message };
    }
  });

  /**
   * Delete a category
   * Schema: { categoryId: string }
   */
  useHsafaAction('deleteCategory', async (params) => {
    const { categoryId } = params as { categoryId: string };
    try {
      await deleteCategoryMutation({ variables: { id: categoryId } });
      toast.success('Category deleted successfully');
      return { success: true };
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete category');
      return { success: false, error: error.message };
    }
  });

  // ============================================================
  // ORDER ACTIONS
  // ============================================================

  /**
   * Get all orders
   * Schema: {}
   */
  useHsafaAction('getOrders', async () => {
    return { 
      success: true, 
      orders: allOrders || [],
      count: (allOrders || []).length 
    };
  });

  /**
   * Get order by ID
   * Schema: { orderId: string }
   */
  useHsafaAction('getOrder', async (params) => {
    const { orderId } = params as { orderId: string };
    const order = (allOrders || []).find(o => o.id === orderId);
    
    if (!order) {
      toast.error('Order not found');
      return { success: false, error: 'Order not found' };
    }
    
    return { success: true, order };
  });

  /**
   * Search orders
   * Schema: { query: string }
   */
  useHsafaAction('searchOrders', async (params) => {
    const { query } = params as { query: string };
    const filtered = (allOrders || []).filter(o => 
      o.id.toLowerCase().includes(query.toLowerCase()) ||
      o.customerName.toLowerCase().includes(query.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(query.toLowerCase())
    );
    
    return { 
      success: true, 
      orders: filtered,
      count: filtered.length,
      query 
    };
  });

  /**
   * Filter orders by status
   * Schema: { status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' }
   */
  useHsafaAction('filterOrdersByStatus', async (params) => {
    const { status } = params as { status: string };
    const filtered = (allOrders || []).filter(o => o.status === status);
    
    return { 
      success: true, 
      orders: filtered,
      count: filtered.length,
      status 
    };
  });

  /**
   * Update order status
   * Schema: { 
   *   orderId: string, 
   *   status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' 
   * }
   */
  useHsafaAction('updateOrderStatus', async (params) => {
    const { orderId, status } = params as { orderId: string; status: any };
    
    try {
      await updateOrderStatus(orderId, status);
      toast.success(`Order status updated to ${status}`);
      return { success: true, orderId, status };
    } catch (error: any) {
      toast.error(error.message || 'Failed to update order status');
      return { success: false, error: error.message };
    }
  });

  /**
   * Get order statistics
   * Schema: {}
   */
  useHsafaAction('getOrderStats', async () => {
    const orders = allOrders || [];
    const stats = {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => o.status === 'processing').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
      totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
    };
    
    return { success: true, stats };
  });

  // ============================================================
  // USER ACTIONS
  // ============================================================

  /**
   * Get all users
   * Schema: {}
   */
  useHsafaAction('getUsers', async () => {
    const users = usersData?.users || [];
    return { 
      success: true, 
      users,
      count: users.length 
    };
  });

  /**
   * Search users
   * Schema: { query: string }
   */
  useHsafaAction('searchUsers', async (params) => {
    const { query } = params as { query: string };
    const users = usersData?.users || [];
    const filtered = users.filter((u: any) => 
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase())
    );
    
    return { 
      success: true, 
      users: filtered,
      count: filtered.length,
      query 
    };
  });

  /**
   * Filter users by role
   * Schema: { role: 'ADMIN' | 'CLIENT' }
   */
  useHsafaAction('filterUsersByRole', async (params) => {
    const { role } = params as { role: string };
    const users = usersData?.users || [];
    const filtered = users.filter((u: any) => u.role === role);
    
    return { 
      success: true, 
      users: filtered,
      count: filtered.length,
      role 
    };
  });

  /**
   * Get user statistics
   * Schema: {}
   */
  useHsafaAction('getUserStats', async () => {
    const users = usersData?.users || [];
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const stats = {
      total: users.length,
      admins: users.filter((u: any) => u.role === 'ADMIN').length,
      clients: users.filter((u: any) => u.role === 'CLIENT').length,
      newUsers: users.filter((u: any) => new Date(u.createdAt) >= thirtyDaysAgo).length,
    };
    
    return { success: true, stats };
  });

  // ============================================================
  // DASHBOARD ACTIONS
  // ============================================================

  /**
   * Get dashboard statistics
   * Schema: {}
   */
  useHsafaAction('getDashboardStats', async () => {
    const orders = allOrders || [];
    const productsList = products || [];
    const users = usersData?.users || [];
    
    const stats = {
      totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
      totalOrders: orders.length,
      totalProducts: productsList.length,
      totalUsers: users.length,
      lowStockProducts: productsList.filter(p => p.stock < 10).length,
      pendingOrders: orders.filter(o => o.status === 'pending').length,
    };
    
    return { success: true, stats };
  });

  /**
   * Get low stock products
   * Schema: { threshold?: number }
   */
  useHsafaAction('getLowStockProducts', async (params) => {
    const { threshold = 10 } = params as { threshold?: number };
    const lowStock = (products || []).filter(p => p.stock < threshold);
    
    return { 
      success: true, 
      products: lowStock,
      count: lowStock.length,
      threshold 
    };
  });

  /**
   * Get recent orders
   * Schema: { limit?: number }
   */
  useHsafaAction('getRecentOrders', async (params) => {
    const { limit = 5 } = params as { limit?: number };
    const sorted = [...(allOrders || [])].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    const recent = sorted.slice(0, limit);
    
    return { 
      success: true, 
      orders: recent,
      count: recent.length 
    };
  });

  // This component doesn't render anything, it just registers actions
  return null;
}
