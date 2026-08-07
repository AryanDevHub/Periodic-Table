// src/components/Auth/AuthForm.jsx

// What: Importing React and its state hook.
// Why: This component is a controlled form, meaning its state is managed by React.
import React, { useState } from 'react';

// What: Importing the component's specific styles.
// Why: Using CSS Modules keeps our styles scoped and prevents conflicts.
import styles from './AuthForm.module.css';

// What: A reusable form component for both login and registration.
// Why: It takes props to customize its behavior, preventing code duplication.
const AuthForm = ({ formType, onSubmit, error, isLoading }) => {
  // --- STATE MANAGEMENT ---
  // What: State for each form field.
  // Why: We need to track the user's input for each field.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // What: The 'username' field is only needed for registration.
  // Why: We conditionally create this state based on the `formType` prop.
  const [username, setUsername] = useState('');

  // What: Determines if the form is for registration.
  // Why: A simple boolean for easier conditional rendering inside the JSX.
  const isRegister = formType === 'register';

  // --- EVENT HANDLERS ---

  // What: A handler that runs when the form is submitted.
  // Why: It prevents the default browser page reload and passes the form data to the parent component.
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegister) {
      onSubmit({ username, email, password });
    } else {
      onSubmit({ email, password });
    }
  };

  // --- JSX RENDER OUTPUT ---
  return (
    <form onSubmit={handleSubmit} className={styles.authForm}>
      {/* What: The username input field.
          Why: This entire div is only rendered if the formType is 'register'. */}
      {isRegister && (
        <div className={styles.formGroup}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
          />
        </div>
      )}

      <div className={styles.formGroup}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete={isRegister ? 'new-password' : 'current-password'}
        />
      </div>

      {/* What: An area to display API errors.
          Why: Provides feedback to the user if their login/register attempt fails. */}
      {error && <p className={styles.errorMessage}>{error}</p>}

      <button type="submit" className={styles.submitButton} disabled={isLoading}>
        {/* What: A dynamic button label.
            Why: Shows a loading state to prevent multiple submissions. */}
        {isLoading ? 'Loading...' : (isRegister ? 'Create Account' : 'Log In')}
      </button>
    </form>
  );
};

export default AuthForm;