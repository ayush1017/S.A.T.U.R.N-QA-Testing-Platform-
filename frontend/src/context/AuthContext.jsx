import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, setAuthToken } from '../services/api';
import { markHasAccount } from '../utils/authStorage';

const AuthContext = createContext(null);
const STORAGE_KEY = 'saturn_auth';

function loadStoredAuth() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function persistAuth(token, user) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }));
  setAuthToken(token);
  markHasAccount();
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = loadStoredAuth();
    if (stored?.token) {
      setAuthToken(stored.token);
      api.me()
        .then(({ user }) => {
          markHasAccount();
          setUser(user);
        })
        .catch(() => {
          localStorage.removeItem(STORAGE_KEY);
          setAuthToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (username, password) => {
    const { token, user } = await api.login({ username, password });
    persistAuth(token, user);
    setUser(user);
    navigate('/');
    return user;
  }, [navigate]);

  const register = useCallback(async ({ username, password, name, email }) => {
    const { token, user } = await api.register({ username, password, name, email });
    persistAuth(token, user);
    setUser(user);
    navigate('/');
    return user;
  }, [navigate]);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setAuthToken(null);
    setUser(null);
    navigate('/login');
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
