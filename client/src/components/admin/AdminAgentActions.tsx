import { useHsafaAction } from '@hsafa/ui-sdk';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { useOrders } from '../../hooks/useOrders';
import { useMutation } from '@apollo/client';
import { GET_CATEGORIES, DELETE_CATEGORY } from '../../graphql/queries';
import toast from 'react-hot-toast';

/**
 * Admin Agent Actions Registry
 * 
 * This component registers UI manipulation actions for the AI agent.
 * Actions perform operations (navigate, create, update, delete) rather than retrieve data.
 * The agent can see data through the UI itself.
 */
export default function AdminAgentActions() {
  const navigate = useNavigate();
  const { deleteProduct } = useProducts();
  const { updateOrderStatus } = useOrders();
  const [deleteCategoryMutation] = useMutation(DELETE_CATEGORY, {
    refetchQueries: [{ query: GET_CATEGORIES }],
  });

  // ============================================================
  // NAVIGATION ACTION
  // ============================================================

  /**
   * Navigate to any page in the admin panel
   * Schema: { path: string }
   */
  useHsafaAction('navigate', async (params) => {
    const { path } = params as { path: string };
    
    // Only navigate if we're not already on that path
    if (window.location.pathname !== path) {
      navigate(path);
    }
    
    return { success: true };
  });

  // ============================================================
  // PRODUCT ACTIONS
  // ============================================================

  /**
   * Fill product form (streaming - executes on each token)
   * Schema: { name?, nameAr?, nameEn?, price?, description?, descriptionAr?, descriptionEn?, image?, categoryId?, stock?, featured? }
   */
  useHsafaAction('fillProductForm', async (params) => {
    console.log('[fillProductForm] Called with params:', params);
    console.log('[fillProductForm] Current path:', window.location.pathname);
    
    // Navigate to add product page if not already there
    if (!window.location.pathname.includes('/admin/products/add')) {
      console.log('[fillProductForm] Navigating to add product page...');
      navigate('/admin/products/add');
      // Wait for navigation and form to load
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Wait a bit more for the form to be fully rendered
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Fill form fields by dispatching events
    const fillField = async (fieldName: string, value: any) => {
      console.log(`[fillProductForm] Trying to fill field: ${fieldName} with value:`, value);
      
      // Try multiple selector strategies
      let input = document.querySelector(`[name="${fieldName}"]`) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
      
      if (!input) {
        console.log(`[fillProductForm] Field not found by name, trying by placeholder for ${fieldName}`);
        // Try to find by partial placeholder match or data attribute
        const allInputs = document.querySelectorAll('input, textarea, select');
        for (const el of allInputs) {
          const element = el as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
          // Match by placeholder
          const placeholder = element.getAttribute('placeholder')?.toLowerCase() || '';
          
          if (fieldName === 'name' && (placeholder.includes('name') || placeholder.includes('product name'))) {
            input = element;
            console.log('[fillProductForm] Found name input by placeholder');
            break;
          } else if (fieldName === 'price' && (placeholder.includes('price') || placeholder === '0.00')) {
            input = element;
            console.log('[fillProductForm] Found price input by placeholder');
            break;
          } else if (fieldName === 'stock' && (element.type === 'number' && (placeholder === '0' || placeholder.includes('stock')))) {
            input = element;
            console.log('[fillProductForm] Found stock input by placeholder');
            break;
          } else if (fieldName === 'description' && element.tagName === 'TEXTAREA') {
            input = element;
            console.log('[fillProductForm] Found description textarea');
            break;
          } else if (fieldName === 'image' && (placeholder.includes('image') || placeholder.includes('url'))) {
            input = element;
            console.log('[fillProductForm] Found image input by placeholder');
            break;
          } else if (fieldName === 'featured' && element.type === 'checkbox' && element.id === 'featured') {
            input = element;
            console.log('[fillProductForm] Found featured checkbox by id');
            break;
          }
        }
      }
      
      // Special handling for categoryId (custom select component)
      if (fieldName === 'categoryId' && !input) {
        console.log('[fillProductForm] Trying custom select for categoryId');
        try {
          // Find the category select button
          const selectButton = Array.from(document.querySelectorAll('button[type="button"]')).find(
            btn => btn.textContent?.includes('Category') || btn.textContent?.includes('Select')
          ) as HTMLButtonElement;
          
          if (selectButton) {
            console.log('[fillProductForm] Found custom select button, clicking...');
            selectButton.click();
            
            // Wait for dropdown to appear
            await new Promise(resolve => setTimeout(resolve, 200));
            
            // Find and click the option matching the value
            const optionButtons = document.querySelectorAll('button[type="button"]');
            for (const btn of optionButtons) {
              const button = btn as HTMLButtonElement;
              // Check if this button contains the category ID or name
              if (button.getAttribute('data-id') === value || button.textContent?.trim() === value) {
                console.log('[fillProductForm] Found matching category option, clicking...');
                button.click();
                await new Promise(resolve => setTimeout(resolve, 100));
                console.log('[fillProductForm] Successfully selected category');
                return;
              }
            }
            console.warn('[fillProductForm] Could not find matching category option');
          } else {
            console.warn('[fillProductForm] Could not find custom select button');
          }
        } catch (error) {
          console.error('[fillProductForm] Error handling custom select:', error);
        }
        return;
      }
      
      if (input) {
        console.log(`[fillProductForm] Found element for ${fieldName}:`, input.tagName, input.type);
        
        try {
          // Different handling for different input types
          if (input.type === 'checkbox') {
            (input as HTMLInputElement).checked = Boolean(value);
            input.dispatchEvent(new Event('change', { bubbles: true }));
          } else {
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
              input.tagName === 'TEXTAREA' ? window.HTMLTextAreaElement.prototype : 
              input.tagName === 'SELECT' ? window.HTMLSelectElement.prototype :
              window.HTMLInputElement.prototype,
              'value'
            )?.set;
            nativeInputValueSetter?.call(input, String(value));
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
          }
          console.log(`[fillProductForm] Successfully filled ${fieldName}`);
        } catch (error) {
          console.error(`[fillProductForm] Error filling ${fieldName}:`, error);
        }
      } else {
        console.warn(`[fillProductForm] Could not find input for field: ${fieldName}`);
      }
    };

    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        await fillField(key, value);
      }
    }

    console.log('[fillProductForm] Finished filling form');
    return { success: true };
  });

  /**
   * Submit product form (executes once when complete)
   * Schema: {} - Just triggers the form submission
   */
  useHsafaAction('submitProductForm', async () => {
    // Find and click the submit button
    const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
    if (submitButton) {
      submitButton.click();
      return { success: true };
    } else {
      toast.error('Submit button not found');
      return { success: false, error: 'Submit button not found' };
    }
  });

  /**
   * Fill product edit form (streaming - executes on each token)
   * Schema: { productId, name?, nameAr?, nameEn?, price?, description?, descriptionAr?, descriptionEn?, image?, categoryId?, stock?, featured? }
   */
  useHsafaAction('fillProductEditForm', async (params) => {
    const { productId, ...fields } = params as any;
    
    // Navigate to edit product page if not already there
    if (!window.location.pathname.includes(`/admin/products/${productId}/edit`)) {
      navigate(`/admin/products/${productId}/edit`);
      // Wait a bit for the page to load
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Fill form fields
    const fillField = (fieldName: string, value: any) => {
      const input = document.querySelector(`[name="${fieldName}"]`) as HTMLInputElement;
      if (input) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          'value'
        )?.set;
        nativeInputValueSetter?.call(input, value);
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    };

    Object.entries(fields).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        fillField(key, value);
      }
    });

    return { success: true };
  });

  /**
   * Submit product update (executes once when complete)
   * Schema: {} - Just triggers the form submission
   */
  useHsafaAction('submitProductUpdate', async () => {
    // Find and click the submit button
    const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
    if (submitButton) {
      submitButton.click();
      return { success: true };
    } else {
      toast.error('Submit button not found');
      return { success: false, error: 'Submit button not found' };
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
   * Fill category form (streaming - executes on each token)
   * Schema: { name?, nameAr?, nameEn?, description? }
   */
  useHsafaAction('fillCategoryForm', async (params) => {
    // Navigate to add category page if not already there
    if (!window.location.pathname.includes('/admin/categories/add')) {
      navigate('/admin/categories/add');
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    // Fill form fields
    const fillField = (fieldName: string, value: any) => {
      const input = document.querySelector(`[name="${fieldName}"]`) as HTMLInputElement;
      if (input) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          'value'
        )?.set;
        nativeInputValueSetter?.call(input, value);
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    };

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        fillField(key, value);
      }
    });

    return { success: true };
  });

  /**
   * Submit category form (executes once when complete)
   * Schema: {} - Just triggers the form submission
   */
  useHsafaAction('submitCategoryForm', async () => {
    // Find and click the submit button
    const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
    if (submitButton) {
      submitButton.click();
      return { success: true };
    } else {
      toast.error('Submit button not found');
      return { success: false, error: 'Submit button not found' };
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
   * Update order status
   * Schema: { orderId, status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' }
   */
  useHsafaAction('updateOrderStatus', async (params) => {
    const { orderId, status } = params as { orderId: string; status: any };
    try {
      await updateOrderStatus(orderId, status);
      toast.success(`Order status updated to ${status}`);
      return { success: true };
    } catch (error: any) {
      toast.error(error.message || 'Failed to update order status');
      return { success: false, error: error.message };
    }
  });

  // This component doesn't render anything, it just registers actions
  return null;
}
