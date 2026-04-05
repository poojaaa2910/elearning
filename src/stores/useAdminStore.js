import { create } from 'zustand';
import { authService } from '../services/authService';

export const useAdminStore = create((set, get) => ({
  isAdmin: false,
  isLoading: false,
  error: null,
  user: null,

  checkAdminStatus: async (uid) => {
    if (!uid) {
      set({ isAdmin: false });
      return false;
    }
    const isAdmin = await authService.checkIsAdmin(uid);
    set({ isAdmin });
    return isAdmin;
  },

  becomeAdmin: async (secretCode) => {
    set({ isLoading: true, error: null });
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        throw new Error('You must be logged in to become an admin');
      }
      await authService.becomeAdmin(secretCode, currentUser.uid);
      set({ isAdmin: true });
      return true;
    } catch (error) {
      set({ error: error.message });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  setUser: (user) => set({ user }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null })
}));
