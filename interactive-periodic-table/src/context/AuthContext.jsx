// FILE: src/context/AuthContext.jsx

import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
} from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const verifyUserSession = async () => {
      if (token && !user) {
        try {
          const response = await fetch(`${API_BASE_URL}/user/me`, {
            headers: { 'x-auth-token': token },
          });
          if (!response.ok) throw new Error('Unauthorized');

          const userData = await response.json();
          setUser(userData);
        } catch (err) {
          console.error('Session verification failed:', err);
          localStorage.removeItem('token');
          setToken(null);
        } finally {
          setIsAuthLoading(false);
        }
      } else {
        setIsAuthLoading(false);
      }
    };

    verifyUserSession();
  }, [token, user]);

  const login = useCallback(({ user, token }) => {
    setUser(user);
    setToken(token);
    localStorage.setItem('token', token);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  }, []);

  const updateUser = useCallback((newUserData) => {
    setUser(newUserData);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      login,
      logout,
      updateUser,
      isAuthLoading,
      isAuthenticated: !!user,
    }),
    [user, token, isAuthLoading, login, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
