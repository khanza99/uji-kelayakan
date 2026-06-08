import { create } from 'zustand';

const useAuthStore = create((set, get) => ({
  token: localStorage.getItem('token') || null,
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  isAuthenticated: !!localStorage.getItem('token'),

  // Get user role from Spatie roles array or user.role field
  get role() {
    const user = get().user;
    if (!user) return null;
    if (user.roles?.length > 0) return user.roles[0].name;
    return user.role || null;
  },

  setAuth: (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ token, user, isAuthenticated: true });
  },

  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },

  clearAuth: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ token: null, user: null, isAuthenticated: false });
  },

  hasRole: (role) => {
    const user = get().user;
    if (!user) return false;
    if (user.roles?.length > 0) {
      return user.roles.some((r) => r.name === role);
    }
    return user.role === role;
  },

  hasAnyRole: (...roles) => {
    return roles.some((role) => get().hasRole(role));
  },
}));

export default useAuthStore;
