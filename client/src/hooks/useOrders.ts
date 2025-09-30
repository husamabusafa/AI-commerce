import { useQuery, useMutation } from '@apollo/client';
import { useApp } from '../context/AppContext';
import { 
  GET_MY_ORDERS,
  GET_ALL_ORDERS,
  CREATE_ORDER,
  CREATE_GUEST_ORDER,
  UPDATE_ORDER_STATUS,
  GET_ORDER_BY_NUMBER 
} from '../graphql/queries';

export const useOrders = () => {
  const { state, dispatch } = useApp();

  const { 
    data: myOrdersData, 
    loading: myOrdersLoading, 
    error: myOrdersError,
    refetch: refetchMyOrders 
  } = useQuery(GET_MY_ORDERS, {
    skip: !state.currentUser,
  });

  const { 
    data: allOrdersData, 
    loading: allOrdersLoading, 
    error: allOrdersError,
    refetch: refetchAllOrders 
  } = useQuery(GET_ALL_ORDERS, {
    skip: !state.currentUser || state.currentUser.role !== 'admin',
  });

  const [createOrderMutation] = useMutation(CREATE_ORDER);
  const [createGuestOrderMutation] = useMutation(CREATE_GUEST_ORDER);
  const [updateOrderStatusMutation] = useMutation(UPDATE_ORDER_STATUS);

  const createOrder = async (orderData: any) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const mutation = state.currentUser ? createOrderMutation : createGuestOrderMutation;
      const mutationName = state.currentUser ? 'createOrder' : 'createGuestOrder';
      
      const { data } = await mutation({
        variables: { createOrderInput: orderData },
        refetchQueries: state.currentUser ? [{ query: GET_MY_ORDERS }] : [],
      });
      
      dispatch({ 
        type: 'SHOW_TOAST', 
        payload: { message: 'تم إنشاء الطلب بنجاح', type: 'success' } 
      });
      
      return { success: true, order: data[mutationName] };
    } catch (error: any) {
      dispatch({ 
        type: 'SHOW_TOAST', 
        payload: { message: error.message || 'فشل في إنشاء الطلب', type: 'error' } 
      });
      return { success: false, error: error.message };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const { data } = await updateOrderStatusMutation({
        variables: { updateOrderStatusInput: { orderId, status } },
        refetchQueries: [{ query: GET_ALL_ORDERS }],
      });
      
      dispatch({ 
        type: 'SHOW_TOAST', 
        payload: { message: 'تم تحديث حالة الطلب بنجاح', type: 'success' } 
      });
      
      return { success: true, order: data.updateOrderStatus };
    } catch (error: any) {
      dispatch({ 
        type: 'SHOW_TOAST', 
        payload: { message: error.message || 'فشل في تحديث حالة الطلب', type: 'error' } 
      });
      return { success: false, error: error.message };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return {
    myOrders: myOrdersData?.myOrders || [],
    allOrders: allOrdersData?.orders || [],
    myOrdersLoading,
    allOrdersLoading,
    myOrdersError,
    allOrdersError,
    createOrder,
    updateOrderStatus,
    refetchMyOrders,
    refetchAllOrders,
  };
};

export const useOrderByNumber = (orderNumber: string) => {
  const { data, loading, error } = useQuery(GET_ORDER_BY_NUMBER, {
    variables: { orderNumber },
    skip: !orderNumber,
  });

  return {
    order: data?.orderByNumber,
    loading,
    error,
  };
};
