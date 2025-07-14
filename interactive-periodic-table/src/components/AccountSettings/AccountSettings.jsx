// src/components/AccountSettings/AccountSettings.jsx

import React, { useState } from 'react';
import styles from './AccountSettings.module.css';

const AccountSettings = ({ user, onUpdateDetails, onChangePassword }) => {
  // State for the details form
  const [username, setUsername] = useState(user.username);
  const [profilePicture, setProfilePicture] = useState(user.profilePicture || '');

  // State for the password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    onUpdateDetails({ username, profilePicture });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match.");
      return;
    }
    onChangePassword({ currentPassword, newPassword });
    // Clear fields after submission
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className={styles.settingsContainer}>
      {/* --- Profile Details Form --- */}
      <form onSubmit={handleDetailsSubmit} className={styles.settingsForm}>
        <h3>Profile Details</h3>
        <div className={styles.formGroup}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="profilePicture">Profile Picture URL</label>
          <input
            id="profilePicture"
            type="text"
            value={profilePicture}
            placeholder="https://example.com/image.png"
            onChange={(e) => setProfilePicture(e.target.value)}
          />
        </div>
        <button type="submit" className={styles.submitButton}>Save Details</button>
      </form>

      <div className={styles.divider}></div>

      {/* --- Change Password Form --- */}
      <form onSubmit={handlePasswordSubmit} className={styles.settingsForm}>
        <h3>Change Password</h3>
        <div className={styles.formGroup}>
          <label htmlFor="currentPassword">Current Password</label>
          <input
            id="currentPassword"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="newPassword">New Password</label>
          <input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button type="submit" className={styles.submitButton}>Change Password</button>
      </form>
    </div>
  );
};

export default AccountSettings;