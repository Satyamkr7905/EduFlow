import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { onUnauthorized, tokenStorage } from '../services/api';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | authenticated | anonymous

  const logout = useCallback(() => {
    tokenStorage.clear();
    setAdmin(null);
    setStatus('anonymous');
  }, []);

  // Restore session on first load
  useEffect(() => {
    onUnauthorized(logout);

    const token = tokenStorage.get();
    if (!token) {
      setStatus('anonymous');
      return;
    }

    let cancelled = false;
    authService
      .me()
      .then((me) => {
        if (cancelled) return;
        setAdmin(me);
        setStatus('authenticated');
      })
      .catch(() => {
        if (!cancelled) logout();
      });

    return () => {
      cancelled = true;
    };
  }, [logout]);

  const login = useCallback(async ({ email, password, rememberMe }) => {
    const { admin: me, token } = await authService.login({ email, password, rememberMe });
    tokenStorage.set(token, rememberMe);
    setAdmin(me);
    setStatus('authenticated');
    return me;
  }, []);

  const updateAdmin = useCallback((next) => setAdmin(next), []);

  const value = useMemo(
    () => ({
      admin,
      status,
      isAuthenticated: status === 'authenticated',
      isLoading: status === 'loading',
      login,
      logout,
      updateAdmin,
    }),
    [admin, status, login, logout, updateAdmin]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
