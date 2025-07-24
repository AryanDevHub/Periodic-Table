// FILE: src/pages/AccountPage.jsx

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import styles from './AccountPage.module.css';
import AccountSettings from '../components/AccountSettings/AccountSettings';

// ✅ Use base URL from environment
const API_USER_URL = `${import.meta.env.VITE_API_BASE_URL}/user`;

const AccountPage = () => {
  const { user, token, updateUser } = useAuth();

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Helper to show feedback temporarily
  const showFeedback = (setter, message) => {
    setter(message);
    setTimeout(() => setter(null), 3000);
  };

  // --- Update User Details Handler ---
  const handleUpdateUserDetails = async (details) => {
    setError(null);
    try {
      const response = await fetch(`${API_USER_URL}/details`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify(details),
      });

      const updatedUserData = await response.json();

      if (!response.ok) {
        throw new Error(updatedUserData.message || 'Failed to update details.');
      }

      updateUser(updatedUserData);
      showFeedback(setSuccess, 'Details saved successfully!');
    } catch (err) {
      showFeedback(setError, err.message);
    }
  };

  // --- Change Password Handler ---
  const handleChangePassword = async (passwords) => {
    setError(null);
    try {
      const response = await fetch(`${API_USER_URL}/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify(passwords),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to change password.');
      }

      showFeedback(setSuccess, data.message);
    } catch (err) {
      showFeedback(setError, err.message);
    }
  };

  // --- Show Loading if User Not Ready ---
  if (!user) {
    return <div className="status-message">Loading account details...</div>;
  }

  return (
    <div className={styles.accountPage}>
      <header className={styles.pageHeader}>
        <h1>My Account Settings</h1>
        <p>Update your personal details and manage your password.</p>
      </header>

      <div className={styles.contentArea}>
        {error && <p className={styles.feedbackMessage_error}>{error}</p>}
        {success && <p className={styles.feedbackMessage_success}>{success}</p>}

        <AccountSettings
          user={user}
          onUpdateDetails={handleUpdateUserDetails}
          onChangePassword={handleChangePassword}
        />
      </div>
    </div>
  );
};

export default AccountPage;
