// FILE: src/pages/AccountPage.jsx (Final and Corrected Version)

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import styles from './AccountPage.module.css';
import AccountSettings from '../components/AccountSettings/AccountSettings';

// Use base URL from environment
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

  // --- Update User Details Handler (for username) ---
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

  // --- NEW: API Handler for the actual file upload ---
  const handleUploadPicture = async (formData) => {
    setError(null);
    try {
      const response = await fetch(`${API_USER_URL}/upload-picture`, {
        method: 'POST',
        headers: { 'x-auth-token': token }, // NOTE: No 'Content-Type' header here
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

  // --- Change Password Handler (remains the same) ---
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
      {/* --- THIS HEADER SECTION IS NOW UPDATED --- */}
      <header className={styles.pageHeader}>
        {/* WHAT: Display the profile picture or a placeholder. */}
        {/* WHY:  Provides immediate visual confirmation of the user's current avatar. */}
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

        {/* WHAT: The new onUploadPicture prop is now passed to the child component. */}
        {/* WHY: This connects the child's form to the parent's API logic. */}
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