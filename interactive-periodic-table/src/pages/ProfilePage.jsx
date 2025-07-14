// src/pages/ProfilePage.jsx

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import styles from './ProfilePage.module.css';
import { CATEGORY_COLORS } from '../constants';

// Child Components
import NoteCard from '../components/NoteCard/NoteCard';

const API_USER_URL = 'http://localhost:4000/api/user';

// This page is now dedicated to displaying user-generated content: favorites and notes.
const ProfilePage = () => {
  // What: Gets necessary data and functions from our global AuthContext.
  // Why: This provides the user's data to display and the tools to update it.
  const { user, token, updateUser } = useAuth();
  
  // What: Local state to manage which tab is currently visible.
  const [activeTab, setActiveTab] = useState('favorites'); // Default to showing favorites
  const [error, setError] = useState(null);

  // What: An async function to update a note, passed to the NoteCard component.
  const handleUpdateNote = async (elementNumber, newText) => {
    setError(null);
    try {
      const response = await fetch(`${API_USER_URL}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify({ elementNumber, text: newText }),
      });
      const updatedUserData = await response.json();
      if (!response.ok) throw new Error('Failed to save note.');
      updateUser(updatedUserData); // Refresh global state
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  // What: An async function to delete a note, passed to the NoteCard component.
  const handleDeleteNote = async (elementNumber) => {
    setError(null);
    try {
      const response = await fetch(`${API_USER_URL}/notes/${elementNumber}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token },
      });
      const updatedUserData = await response.json();
      if (!response.ok) throw new Error('Failed to delete note.');
      updateUser(updatedUserData); // Refresh global state
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  // What: A guard clause to prevent rendering before user data is loaded.
  // Why: This avoids errors from trying to access properties of a null user object.
  if (!user) {
    return <div className="status-message">Loading profile...</div>;
  }

  return (
    <div className={styles.profilePage}>
      <header className={styles.profileHeader}>
        {user.profilePicture && (
          <img src={user.profilePicture} alt={user.username} className={styles.profileImage} />
        )}
        <h1>{user.username}'s Collection</h1>
        <p>Your saved favorite elements and personal notes.</p>
      </header>

      {/* --- TABS for Favorites and Notes --- */}
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

      {/* --- CONTENT AREA for the selected tab --- */}
      <div className={styles.tabContent}>
        {error && <p className={styles.feedbackMessage_error}>{error}</p>}
        
        {/* --- FAVORITES TAB CONTENT --- */}
        {activeTab === 'favorites' && (
          <div className={styles.favoritesGrid}>
            {user.favoriteElements && user.favoriteElements.length > 0 ? (
              user.favoriteElements.map(element => (
                <div key={element._id} className={styles.elementCell} style={{ backgroundColor: CATEGORY_COLORS[element.category] }}>
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
        
        {/* --- NOTES TAB CONTENT --- */}
        {activeTab === 'notes' && (
          <div className={styles.notesList}>
            {user.notes && user.notes.length > 0 ? (
              user.notes
                .sort((a, b) => a.elementNumber - b.elementNumber) // Sort notes for consistency
                .map(note => (
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