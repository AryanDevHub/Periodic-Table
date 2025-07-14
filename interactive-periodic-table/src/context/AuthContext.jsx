// FILE: src/context/AuthContext.jsx (Definitive Correct Version)

import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';

const API_BASE_URL = 'http://localhost:4000/api';

export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const verifyUserSession = async () => {
      if (token && !user) {
        setIsAuthLoading(true);
        try {
          const response = await fetch(`${API_BASE_URL}/user/me`, {
            headers: { 'x-auth-token': token },
          });
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            localStorage.removeItem('token');
            setToken(null);
          }
        } catch (error) {
          console.error("Error verifying session:", error);
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

  const login = useCallback((loginData) => {
    setUser(loginData.user);
    setToken(loginData.token);
    localStorage.setItem('token', loginData.token);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  }, []);

  const updateUser = useCallback((newUserData) => {
    setUser(newUserData);
  }, []);

  // --- THE FIX IS HERE ---
  // The dependency array now correctly lists the state variables and functions.
  const value = useMemo(() => ({
    user,
    token,
    login,
    logout,
    updateUser,
    isAuthLoading,
    isAuthenticated: !!user,
  }), [user, token, isAuthLoading, login, logout, updateUser]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};