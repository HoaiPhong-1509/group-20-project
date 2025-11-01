import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { login as apiLogin, signup as apiSignup, logout as apiLogout, getMe } from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Restore session
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const me = await getMe();
        if (mounted) setUser(me);
      } catch (_) {
        // not logged in
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const login = useCallback(async ({ email, password }) => {
    setError(null);
    const u = await apiLogin({ email, password });
    setUser(u);
    return u;
  }, []);

  const signup = useCallback(async ({ name, email, password }) => {
    setError(null);
    const u = await apiSignup({ name, email, password });
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(async () => {
    setError(null);
    await apiLogout();
    setUser(null);
  }, []);

  // Thêm hàm refresh để tải lại thông tin đăng nhập
  const refresh = useCallback(async () => {
    const me = await getMe();
    setUser(me);
    return me;
  }, []);

  const value = { user, loading, error, login, signup, logout, refresh };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
