// FILE: src/pages/LoginPage.jsx (Corrected and Final Version)

import React, { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import AuthForm from '../components/Auth/AuthForm';
import styles from './AuthPage.module.css';

const API_LOGIN_URL = 'http://localhost:4000/api/auth/login';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // This reads the page the user was on before being redirected to login.
  // It defaults to the homepage if they came here directly.
  const from = location.state?.from?.pathname || '/';

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // --- THE FIX IS HERE ---
  // The function is wrapped in useCallback to prevent it from being recreated on every render.
  const handleLogin = useCallback(async (formData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(API_LOGIN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to log in');
      }

      // Pass the full data object to the context's login function
      login(data);

      // Navigate to the page the user was trying to access
      navigate(from, { replace: true });

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [login, navigate, from]); // Dependencies for useCallback

  return (
    <div className={styles.authPage}>
      <div className={styles.authContainer}>
        <h1 className={styles.title}>Welcome Back!</h1>
        <p className={styles.subtitle}>
          Log in to access your personalized table.
        </p>
        <AuthForm
          formType="login"
          onSubmit={handleLogin}
          error={error}
          isLoading={isLoading}
        />
        <div className={styles.redirectLink}>
          Don't have an account? <Link to="/register">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;