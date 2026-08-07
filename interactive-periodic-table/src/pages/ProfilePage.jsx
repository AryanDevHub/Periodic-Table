// FILE: src/pages/ProfilePage.jsx

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import styles from './ProfilePage.module.css';
import { CATEGORY_COLORS } from '../constants';
import NoteCard from '../components/NoteCard/NoteCard';

// ✅ Use environment variable for base URL
const API_USER_URL = `${import.meta.env.VITE_API_BASE_URL}/user`;

const ProfilePage = () => {
  const { user, token, updateUser } = useAuth();

  const [activeTab, setActiveTab] = useState('favorites');
  const [error, setError] = useState(null);

  // --- Update a Note ---
  const handleUpdateNote = async (elementNumber, newText) => {
    setError(null);
    try {
      const response = await fetch(`${API_USER_URL}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify({ elementNumber, text: newText }),
      });

      const updatedUserData = await response.json();
      if (!response.ok) throw new Error(updatedUserData.message || 'Failed to save note.');

      updateUser(updatedUserData);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  // --- Delete a Note ---
  const handleDeleteNote = async (elementNumber) => {
    setError(null);
    try {
      const response = await fetch(`${API_USER_URL}/notes/${elementNumber}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token,
        },
      });

      const updatedUserData = await response.json();
      if (!response.ok) throw new Error(updatedUserData.message || 'Failed to delete note.');

      updateUser(updatedUserData);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  // --- Loading state ---
  if (!user) {
    return <div className="status-message">Loading profile...</div>;
  }

  return (
    <div className={styles.profilePage}>
      <header className={styles.profileHeader}>
        {user.profilePicture && (
          <img
            src={user.profilePicture}
            alt={user.username}
            className={styles.profileImage}
          />
        )}
        <h1>{user.username}'s Collection</h1>
        <p>Your saved favorite elements and personal notes.</p>
      </header>

      {/* --- Tab Selector --- */}
      <div className={styles.tabContainer}>
        <button
          className={`${styles.tabButton} ${activeTab === 'favorites' ? styles.active : ''}`}
          onClick={() => setActiveTab('favorites')}
        >
          <i className="fas fa-heart"></i> My Favorites
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'notes' ? styles.active : ''}`}
          onClick={() => setActiveTab('notes')}
        >
          <i className="fas fa-sticky-note"></i> My Notes
        </button>
      </div>

      {/* --- Content Section --- */}
      <div className={styles.tabContent}>
        {error && <p className={styles.feedbackMessage_error}>{error}</p>}

        {/* Favorites View */}
        {activeTab === 'favorites' && (
          <div className={styles.favoritesGrid}>
            {user.favoriteElements && user.favoriteElements.length > 0 ? (
              user.favoriteElements.map((element) => (
                <div
                  key={element._id}
                  className={styles.elementCell}
                  style={{ backgroundColor: CATEGORY_COLORS[element.category] }}
                >
                  <div className={styles.number}>{element.number}</div>
                  <div className={styles.symbol}>{element.symbol}</div>
                  <div className={styles.name}>{element.name}</div>
                </div>
              ))
            ) : (
              <p>You haven't added any favorite elements yet.</p>
            )}
          </div>
        )}

        {/* Notes View */}
        {activeTab === 'notes' && (
          <div className={styles.notesList}>
            {user.notes && user.notes.length > 0 ? (
              user.notes
                .sort((a, b) => a.elementNumber - b.elementNumber)
                .map((note) => (
                  <NoteCard
                    key={note.elementNumber}
                    note={note}
                    onUpdate={handleUpdateNote}
                    onDelete={handleDeleteNote}
                  />
                ))
            ) : (
              <p>You haven't written any notes yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
