import { create } from 'zustand';
import { 
  login as loginApi, 
  logout as logoutApi, 
  getCurrentUser 
} from '../api/auth';

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
  
  // Login
  login: async (credentials) => {
    try {
      set({ loading: true, error: null });
      const data = await loginApi(credentials);
      set({ 
        user: data.user, 
        isAuthenticated: true, 
        loading: false 
      });
      return data;
    } catch (error) {
      set({ 
        error: error.message || 'Login failed', 
        loading: false 
      });
      throw error;
    }
  },
  
  // Logout
  logout: async () => {
    try {
      set({ loading: true });
      await logoutApi();
      set({ 
        user: null, 
        isAuthenticated: false, 
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error.message || 'Logout failed', 
        loading: false 
      });
      throw error;
    }
  },
  
  // Check if user is authenticated
  checkAuth: async () => {
    try {
      set({ loading: true });
      const data = await getCurrentUser();
      set({ 
        user: data.user, 
        isAuthenticated: true, 
        loading: false 
      });
    } catch (error) {
      set({ 
        user: null, 
        isAuthenticated: false, 
        loading: false 
      });
      // Don't throw error here as this is an expected case when not logged in
    }
  },
  
  // Set user
  setUser: (user) => {
    set({ user, isAuthenticated: !!user });
  },
  
  // Update user profile in state
  updateUserProfile: (updatedUser) => {
    set({ user: { ...get().user, ...updatedUser } });
  },
  
  // Clear errors
  clearError: () => {
    set({ error: null });
  }
}));