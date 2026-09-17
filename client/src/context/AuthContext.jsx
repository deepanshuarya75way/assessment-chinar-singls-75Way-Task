import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('tc_user')); } catch { return null; }
  });
  const [loading, setLoading] = useState(true);

  // Validate token on mount
  useEffect(() => {
    const token = localStorage.getItem('tc_token');
    if (token) {
      authAPI.getMe()
        .then(data => {
          const userWithProfile = {
            ...data.user,
            name: data.user?.name || data.profile?.name,
            photo: data.user?.photo || data.profile?.photo,
          };
          setUser(userWithProfile);
          localStorage.setItem('tc_user', JSON.stringify(userWithProfile));
        })
        .catch(() => { localStorage.removeItem('tc_token'); localStorage.removeItem('tc_user'); setUser(null); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await authAPI.login({ email, password });
    localStorage.setItem('tc_token', data.token);
    localStorage.setItem('tc_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    try { await authAPI.logout(); } catch {}
    localStorage.removeItem('tc_token');
    localStorage.removeItem('tc_user');
    setUser(null);
  }, []);

  const register = useCallback(async (formData) => {
    const data = await authAPI.register(formData);
    // Note: Registration now returns an OTP message, no token yet!
    return data;
  }, []);

  const updateUser = useCallback((newData) => {
    const updated = { ...user, ...newData };
    localStorage.setItem('tc_user', JSON.stringify(updated));
    setUser(updated);
  }, [user]);

  const isAdmin = user?.role === 'admin';
  const isTeacher = user?.role === 'teacher';

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, updateUser, isAdmin, isTeacher, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}
