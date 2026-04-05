import { create } from 'zustand';
import { authService } from '../services/authService';
import { userService } from '../services/userService';

export const useAuthStore = create((set, get) => ({
  user: null,
  loading: true,
  error: null,
  initialized: false,

  initialize: () => {
    if (get().initialized) {
      console.log('Already initialized, skipping...');
      return;
    }
    
    console.log('Setting up auth listener for real...');
    authService.onAuthChange(async (firebaseUser) => {
      console.log('Auth changed, user:', firebaseUser?.email || 'none');
      if (firebaseUser) {
        const userData = await userService.getUser(firebaseUser.uid);
        set({ user: userData, loading: false, initialized: true });
      } else {
        set({ user: null, loading: false, initialized: true });
      }
    });
  },

  signInWithGoogle: async () => {
    set({ loading: true, error: null });
    try {
      const user = await authService.signInWithGoogle();
      const userData = await userService.getUser(user.uid);
      set({ user: userData, loading: false });
      return userData;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  logout: async () => {
    await authService.logout();
    set({ user: null });
  },

  updateUser: (userData) => {
    set({ user: userData });
  },

  clearError: () => set({ error: null })
}));