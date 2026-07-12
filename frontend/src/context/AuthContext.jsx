import { createContext, useCallback, useContext, useState } from 'react';
import {
  getStoredUser,
  getToken,
  loginUser,
  logoutUser,
  registerUser,
} from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser());
  const [authError, setAuthError] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const { user } = await loginUser({ email, password });
      setUser(user);
      return true;
    } catch (err) {
      setAuthError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const { user, token } = await registerUser({ name, email, password });
      // Some backends don't log the user in on register (no token returned).
      // In that case we just clear the form state and let them log in.
      if (token) setUser(user);
      return { success: true, autoLoggedIn: !!token };
    } catch (err) {
      setAuthError(err.message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    logoutUser();
    setUser(null);
  }, []);

  const value = {
    user,
    isAuthenticated: !!getToken() && !!user,
    isAdmin: !!user?.isAdmin,
    authError,
    loading,
    login,
    register,
    logout,
    clearAuthError: () => setAuthError(null),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
