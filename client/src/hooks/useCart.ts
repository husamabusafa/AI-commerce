import { useQuery, useMutation } from '@apollo/client';
import { useApp } from '../context/AppContext';
import { 
  GET_CART,
  ADD_TO_CART,
  UPDATE_CART_ITEM,
  REMOVE_FROM_CART,
  CLEAR_CART 
} from '../graphql/queries';

export const useCart = () => {
  const { state, dispatch } = useApp();

  const { 
    data: cartData, 
    loading: cartLoading, 
    error: cartError,
    refetch: refetchCart 
  } = useQuery(GET_CART, {
    skip: !state.currentUser, // Only fetch if user is logged in
  });

  const [addToCartMutation] = useMutation(ADD_TO_CART);
  const [updateCartItemMutation] = useMutation(UPDATE_CART_ITEM);
  const [removeFromCartMutation] = useMutation(REMOVE_FROM_CART);
  const [clearCartMutation] = useMutation(CLEAR_CART);

  const addToCart = async (productId: string, quantity: number = 1) => {
    if (!state.currentUser) {
      dispatch({ 
        type: 'SHOW_TOAST', 
        payload: { message: 'يجب تسجيل الدخول أولاً', type: 'error' } 
      });
      return { success: false };
    }

    try {
      const { data } = await addToCartMutation({
        variables: { addToCartInput: { productId, quantity } },
        refetchQueries: [{ query: GET_CART }],
      });
      
      dispatch({ 
        type: 'SHOW_TOAST', 
        payload: { message: 'تم إضافة المنتج إلى السلة', type: 'success' } 
      });
      
      return { success: true, cartItem: data.addToCart };
    } catch (error: any) {
      dispatch({ 
        type: 'SHOW_TOAST', 
        payload: { message: error.message || 'فشل في إضافة المنتج', type: 'error' } 
      });
      return { success: false, error: error.message };
    }
  };

  const updateCartItem = async (cartItemId: string, quantity: number) => {
    try {
      const { data } = await updateCartItemMutation({
        variables: { updateCartItemInput: { cartItemId, quantity } },
        refetchQueries: [{ query: GET_CART }],
      });
      
      dispatch({ 
        type: 'SHOW_TOAST', 
        payload: { message: 'تم تحديث الكمية', type: 'success' } 
      });
      
      return { success: true, cartItem: data.updateCartItem };
    } catch (error: any) {
      dispatch({ 
        type: 'SHOW_TOAST', 
        payload: { message: error.message || 'فشل في تحديث الكمية', type: 'error' } 
      });
      return { success: false, error: error.message };
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    try {
      await removeFromCartMutation({
        variables: { cartItemId },
        refetchQueries: [{ query: GET_CART }],
      });
      
      dispatch({ 
        type: 'SHOW_TOAST', 
        payload: { message: 'تم حذف المنتج من السلة', type: 'success' } 
      });
      
      return { success: true };
    } catch (error: any) {
      dispatch({ 
        type: 'SHOW_TOAST', 
        payload: { message: error.message || 'فشل في حذف المنتج', type: 'error' } 
      });
      return { success: false, error: error.message };
    }
  };

  const clearCart = async () => {
    try {
      await clearCartMutation({
        refetchQueries: [{ query: GET_CART }],
      });
      
      dispatch({ 
        type: 'SHOW_TOAST', 
        payload: { message: 'تم إفراغ السلة', type: 'success' } 
      });
      
      return { success: true };
    } catch (error: any) {
      dispatch({ 
        type: 'SHOW_TOAST', 
        payload: { message: error.message || 'فشل في إفراغ السلة', type: 'error' } 
      });
      return { success: false, error: error.message };
    }
  };

  const cartItems = cartData?.cart || [];
  const cartTotal = cartItems.reduce((total: number, item: any) => 
    total + (item.product.price * item.quantity), 0
  );
  const cartCount = cartItems.reduce((count: number, item: any) => 
    count + item.quantity, 0
  );

  return {
    cartItems,
    cartTotal,
    cartCount,
    loading: cartLoading,
    error: cartError,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refetchCart,
  };
};
