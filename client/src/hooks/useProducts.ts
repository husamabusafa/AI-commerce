import { useQuery, useMutation } from '@apollo/client';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';
import { 
  GET_PRODUCTS, 
  GET_PRODUCT, 
  GET_CATEGORIES,
  CREATE_PRODUCT,
  UPDATE_PRODUCT,
  DELETE_PRODUCT 
} from '../graphql/queries';

export const useProducts = () => {
  const { state, dispatch } = useApp();

  const { 
    data: productsData, 
    loading: productsLoading, 
    error: productsError,
    refetch: refetchProducts 
  } = useQuery(GET_PRODUCTS, {
    variables: {
      search: state.searchQuery || undefined,
      categoryId: state.selectedCategory === 'All' ? undefined : state.selectedCategory,
    },
  });

  const { 
    data: categoriesData, 
    loading: categoriesLoading 
  } = useQuery(GET_CATEGORIES);

  const [createProductMutation] = useMutation(CREATE_PRODUCT);
  const [updateProductMutation] = useMutation(UPDATE_PRODUCT);  
  const [deleteProductMutation] = useMutation(DELETE_PRODUCT);

  const createProduct = async (productData: any) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const { data } = await createProductMutation({
        variables: { createProductInput: productData },
        refetchQueries: [{ query: GET_PRODUCTS }],
      });
      
      toast.success('Product created successfully');
      
      return { success: true, product: data.createProduct };
    } catch (error: any) {
      toast.error(error.message || 'Failed to create product');
      return { success: false, error: error.message };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateProduct = async (productData: any) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const { data } = await updateProductMutation({
        variables: { updateProductInput: productData },
        refetchQueries: [{ query: GET_PRODUCTS }],
      });
      
      toast.success('Product updated successfully');
      
      return { success: true, product: data.updateProduct };
    } catch (error: any) {
      toast.error(error.message || 'Failed to update product');
      return { success: false, error: error.message };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await deleteProductMutation({
        variables: { id: productId },
        refetchQueries: [{ query: GET_PRODUCTS }],
      });
      
      // Success toast will be shown by the component
      
      return { success: true };
    } catch (error: any) {
      // Error toast will be shown by the component
      return { success: false, error: error.message };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return {
    products: productsData?.products || [],
    categories: categoriesData?.categories || [],
    loading: productsLoading || categoriesLoading,
    error: productsError,
    createProduct,
    updateProduct,
    deleteProduct,
    refetchProducts,
  };
};

export const useProduct = (productId: string) => {
  const { data, loading, error } = useQuery(GET_PRODUCT, {
    variables: { id: productId },
    skip: !productId,
  });

  return {
    product: data?.product,
    loading,
    error,
  };
};
