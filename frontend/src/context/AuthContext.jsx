import { createContext, useContext, useState, useCallback } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  });

  const persist = (data) => {
    localStorage.setItem('token', data.token || localStorage.getItem('token'));
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
  };

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    persist(data);
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    persist(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = useCallback((updated) => {
    const merged = { ...user, ...updated };
    localStorage.setItem('user', JSON.stringify(merged));
    setUser(merged);
  }, [user]);

  // Refresh user from server (call after payment verify)
  const refreshUser = useCallback(async () => {
    try {
      const { data } = await api.get('/auth/me');
      const current = JSON.parse(localStorage.getItem('user') || '{}');
      const merged = { ...current, ...data };
      localStorage.setItem('user', JSON.stringify(merged));
      setUser(merged);
    } catch { /* silent */ }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
