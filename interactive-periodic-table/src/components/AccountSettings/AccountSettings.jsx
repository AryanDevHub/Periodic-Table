// src/components/AccountSettings/AccountSettings.jsx

import React, { useState, useRef } from 'react'; 
import styles from './AccountSettings.module.css';


const AccountSettings = ({ user, onUpdateDetails, onChangePassword, onUploadPicture }) => {
  
  
  const [username, setUsername] = useState(user.username);
  const [selectedFile, setSelectedFile] = useState(null); 
  
 
  const fileInputRef = useRef(null);

  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    
  
    if (selectedFile) {
      const formData = new FormData();
      formData.append('profilePicture', selectedFile);
      onUploadPicture(formData);
    }

    
    if (username !== user.username) {
      onUpdateDetails({ username });
    }

    
    setSelectedFile(null);
  };

  
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

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
          <label>Profile Picture</label>
          <div className={styles.fileUploadContainer}>
            <button 
              type="button"
              className={styles.fileUploadButton} 
              onClick={() => fileInputRef.current.click()} 
            >
              Choose File
            </button>
            <span className={styles.fileName}>
              {selectedFile ? selectedFile.name : "No file chosen"}
            </span>
          </div>
          
          <input
            id="profilePicture"
            type="file"
            accept="image/png, image/jpeg" 
            ref={fileInputRef}
            onChange={handleFileSelect}
            style={{ display: 'none' }} 
          />
        </div>
        
        <button type="submit" className={styles.submitButton}>Save Details</button>
      </form>

      <div className={styles.divider}></div>

      
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