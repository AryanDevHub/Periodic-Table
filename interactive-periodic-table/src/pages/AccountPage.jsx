// FILE: src/pages/AccountPage.jsx (Final and Correct)

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import styles from './AccountPage.module.css';
import AccountSettings from '../components/AccountSettings/AccountSettings';

const API_USER_URL = `${import.meta.env.VITE_API_BASE_URL}/user`;

const AccountPage = () => {
  const { user, token, updateUser } = useAuth();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const showFeedback = (setter, message) => {
    setter(message);
    setTimeout(() => setter(null), 3000);
  };

  const handleUpdateUserDetails = async (details) => {
    // ... (This function is correct as-is)
  };

  const handleUploadPicture = async (formData) => {
    setError(null);
    try {
      const response = await fetch(`${API_USER_URL}/upload-picture`, {
        method: 'POST',
        headers: { 'x-auth-token': token },
        body: formData,
      });
      const updatedUserData = await response.json();
      if (!response.ok) throw new Error(updatedUserData.message || 'Failed to upload picture.');
      updateUser(updatedUserData);
      showFeedback(setSuccess, 'Picture updated successfully!');
    } catch (err) {
      showFeedback(setError, err.message);
    }
  };

  const handleChangePassword = async (passwords) => {
    // ... (This function is correct as-is)
  };

  if (!user) {
    return <div className="status-message">Loading account details...</div>;
  }

  return (
    <div className={styles.accountPage}>
      <header className={styles.pageHeader}>
        {user.profilePicture ? (
          <img src={user.profilePicture} alt={user.username} className={styles.profileImage} />
        ) : (
          <div className={styles.profileImage_placeholder}>
            <i className="fas fa-user"></i>
          </div>
        )}
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
          onUploadPicture={handleUploadPicture}
        />
      </div>
    </div>
  );
};

export default AccountPage;