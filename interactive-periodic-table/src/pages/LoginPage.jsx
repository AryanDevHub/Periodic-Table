// FILE: src/pages/LoginPage.jsx

import React, { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import AuthForm from '../components/Auth/AuthForm';
import styles from './AuthPage.module.css';

// ✅ Use environment variable
const API_LOGIN_URL = `${import.meta.env.VITE_API_BASE_URL}/auth/login`;

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect path after successful login
  const from = location.state?.from?.pathname || '/';

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // --- HANDLE LOGIN SUBMIT ---
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

      login(data); // Set user in context
      navigate(from, { replace: true }); // Redirect to intended page

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [login, navigate, from]);

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
