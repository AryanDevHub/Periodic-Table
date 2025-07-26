// src/components/AccountSettings/AccountSettings.jsx

import React, { useState, useRef } from 'react'; // Add useRef for the file input
import styles from './AccountSettings.module.css';

// Add the 'onUploadPicture' prop to receive the handler from the parent page
const AccountSettings = ({ user, onUpdateDetails, onChangePassword, onUploadPicture }) => {
  
  // --- State for the details form ---
  const [username, setUsername] = useState(user.username);
  const [selectedFile, setSelectedFile] = useState(null); // This will hold the image file the user chooses
  
  // --- Ref for the hidden file input ---
  // This allows us to trigger the file selection dialog from our custom button
  const fileInputRef = useRef(null);

  // --- State for the password form (remains the same) ---
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    
    // 1. If the user has selected a new file, call the upload handler first.
    if (selectedFile) {
      const formData = new FormData();
      formData.append('profilePicture', selectedFile);
      onUploadPicture(formData);
    }

    // 2. If the username has been changed, call the details update handler.
    if (username !== user.username) {
      onUpdateDetails({ username });
    }

    // Clear the selected file after submission to reset the form state.
    setSelectedFile(null);
  };

  // This function is called when the user selects a file from the dialog.
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  // The password handler remains unchanged.
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match.");
      return;
    }
    onChangePassword({ currentPassword, newPassword });
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
        
        {/* --- NEW FILE UPLOAD UI --- */}
        <div className={styles.formGroup}>
          <label>Profile Picture</label>
          <div className={styles.fileUploadContainer}>
            <button 
              type="button" // Important: type="button" prevents it from submitting the form
              className={styles.fileUploadButton} 
              onClick={() => fileInputRef.current.click()} // Click the hidden file input
            >
              Choose File
            </button>
            <span className={styles.fileName}>
              {selectedFile ? selectedFile.name : "No file chosen"}
            </span>
          </div>
          {/* This is the actual file input, but it's hidden from the user */}
          <input
            id="profilePicture"
            type="file"
            accept="image/png, image/jpeg" // Only allow image files
            ref={fileInputRef}
            onChange={handleFileSelect}
            style={{ display: 'none' }} 
          />
        </div>
        
        <button type="submit" className={styles.submitButton}>Save Details</button>
      </form>

      <div className={styles.divider}></div>

      {/* --- Change Password Form (remains the same) --- */}
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