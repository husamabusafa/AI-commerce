import { useMutation } from '@apollo/client';
import { useApp, login, logout } from '../context/AppContext';
import { LOGIN_MUTATION, REGISTER_MUTATION } from '../graphql/queries';

export const useAuth = () => {
  const { state, dispatch } = useApp();
  const [loginMutation] = useMutation(LOGIN_MUTATION);
  const [registerMutation] = useMutation(REGISTER_MUTATION);

  const handleLogin = async (email: string, password: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const { data } = await loginMutation({
        variables: {
          loginInput: { email, password }
        }
      });

      if (data?.login) {
        login(data.login.accessToken, data.login.user, dispatch);
        dispatch({ 
          type: 'SHOW_TOAST', 
          payload: { message: 'تم تسجيل الدخول بنجاح', type: 'success' } 
        });
        return { success: true, user: data.login.user };
      }
    } catch (error: any) {
      dispatch({ 
        type: 'SHOW_TOAST', 
        payload: { 
          message: error.message || 'فشل في تسجيل الدخول', 
          type: 'error' 
        } 
      });
      return { success: false, error: error.message };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const handleRegister = async (name: string, email: string, password: string, nameEn?: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const { data } = await registerMutation({
        variables: {
          registerInput: { name, email, password, nameEn }
        }
      });

      if (data?.register) {
        login(data.register.accessToken, data.register.user, dispatch);
        dispatch({ 
          type: 'SHOW_TOAST', 
          payload: { message: 'تم إنشاء الحساب بنجاح', type: 'success' } 
        });
        return { success: true, user: data.register.user };
      }
    } catch (error: any) {
      dispatch({ 
        type: 'SHOW_TOAST', 
        payload: { 
          message: error.message || 'فشل في إنشاء الحساب', 
          type: 'error' 
        } 
      });
      return { success: false, error: error.message };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const handleLogout = () => {
    logout(dispatch);
    dispatch({ 
      type: 'SHOW_TOAST', 
      payload: { message: 'تم تسجيل الخروج بنجاح', type: 'success' } 
    });
  };

  return {
    user: state.currentUser,
    isAuthenticated: !!state.currentUser,
    isLoading: state.isLoading,
    handleLogin,
    handleRegister,
    handleLogout,
  };
};
