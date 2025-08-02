// FILE: src/pages/RegisterPage.jsx

import React, { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import AuthForm from '../components/Auth/AuthForm';
import styles from './AuthPage.module.css';

// Use a relative path for the API endpoint
const API_REGISTER_URL = '/api/auth/register';

const RegisterPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = useCallback(async (formData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(API_REGISTER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to register');
      }

      login(data);
      navigate('/');

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [login, navigate]);

  return (
    <div className={styles.authPage}>
      <div className={styles.authContainer}>
        <h1 className={styles.title}>Create an Account</h1>
        <p className={styles.subtitle}>Unlock features like favorites and notes!</p>
        <AuthForm
          formType="register"
          onSubmit={handleRegister}
          error={error}
          isLoading={isLoading}
        />
        <div className={styles.redirectLink}>
          Already have an account? <Link to="/login">Log In</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;