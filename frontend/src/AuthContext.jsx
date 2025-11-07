import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getMe, login as apiLogin, signup as apiSignup, logout as apiLogout } from './api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));
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
    setToken(u.token);
    localStorage.setItem('user', JSON.stringify(u));
    localStorage.setItem('token', u.token);
    return u;
  }, []);

  const signup = useCallback(async ({ name, email, password }) => {
    setError(null);
    const u = await apiSignup({ name, email, password });
    setUser(u);
    setToken(u.token);
    localStorage.setItem('user', JSON.stringify(u));
    localStorage.setItem('token', u.token);
    return u;
  }, []);

  const logout = useCallback(async () => {
    setError(null);
    try { await apiLogout(); } catch (_) {}
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }, []);

  // NEW: cập nhật user cục bộ và lưu localStorage
  const updateUser = useCallback((partial) => {
    setUser((prev) => {
      const next = { ...(prev || {}), ...(partial || {}) };
      try { localStorage.setItem('user', JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  // NEW: gọi /auth/me và đồng bộ lại user vào context
  const refreshMe = useCallback(async () => {
    const me = await getMe();
    setUser((prev) => {
      const next = { ...(prev || {}), ...(me || {}) };
      try { localStorage.setItem('user', JSON.stringify(next)); } catch {}
      return next;
    });
    return me;
  }, []);

  const value = {
    user,
    token,
    loading,
    error,
    login,
    signup,
    logout,
    updateUser,   // NEW
    refreshMe,    // NEW
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
