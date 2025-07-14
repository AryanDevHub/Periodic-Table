// src/components/ElementDetailPanel/ElementDetailPanel.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './ElementDetailPanel.module.css';

const API_USER_URL = 'http://localhost:4000/api/user';

// Helper component to display each property cleanly and handle different data types.
const DetailItem = ({ label, value, unit = '', isApprox = false }) => {
  if (value === null || typeof value === 'undefined') {
    return null; // Don't render if there's no data
  }
  const displayValue = value === "Unknown" ? "Unknown" : `${value} ${unit}`.trim();
  return (
    <div className={styles.detailItem}>
      <strong>{label}</strong>
      <span>
        {displayValue}
        {isApprox && <span className={styles.approx}> (approx.)</span>}
      </span>
    </div>
  );
};

const ElementDetailPanel = ({ element, onClose, categoryColors, isOpen }) => {
  const { isAuthenticated, user, token, updateUser } = useAuth();
  
  // State for the notes functionality
  const [noteText, setNoteText] = useState('');
  const [initialNote, setInitialNote] = useState('');
  const [saveStatus, setSaveStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Effect to load the correct note when the element changes
  useEffect(() => {
    if (isAuthenticated && user?.notes && element) {
      const existingNoteText = user.notes.find(note => note.elementNumber === element.number)?.text || '';
      setNoteText(existingNoteText);
      setInitialNote(existingNoteText);
      setSaveStatus(''); // Reset status on element change
      setIsSaving(false);
    }
  }, [isAuthenticated, user, element]);

  // Handler for the manual save button
  const handleSaveNote = async () => {
    if (!element) return;
    
    setIsSaving(true);
    setSaveStatus('Saving...');
    
    try {
      const response = await fetch(`${API_USER_URL}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify({ elementNumber: element.number, text: noteText }),
      });
      
      const updatedUserData = await response.json();
      if (!response.ok) throw new Error(updatedUserData.message || 'Failed to save note.');

      updateUser(updatedUserData);
      setInitialNote(noteText); // Update the "saved" text baseline
      setSaveStatus('Saved!');
    } catch (error) {
      console.error(error);
      setSaveStatus('Error!');
    } finally {
      setIsSaving(false);
    }
  };

  const handleNoteChange = (e) => {
    setNoteText(e.target.value);
    setSaveStatus(''); // Clear save status when user types
  };
  
  // Handler for the favorite button with optimistic UI update
  const handleFavoriteToggle = async () => {
    if (!isAuthenticated || !element?._id || !user) return;
    const originalUser = user;
    const isCurrentlyFavorited = originalUser.favoriteElements.some(fav => fav._id === element._id);
    
    // Optimistically update the UI immediately
    const optimisticUser = {
      ...originalUser,
      favoriteElements: isCurrentlyFavorited
        ? originalUser.favoriteElements.filter(fav => fav._id !== element._id)
        : [...originalUser.favoriteElements, { ...element }],
    };
    updateUser(optimisticUser);

    // Then, sync with the server
    try {
      const response = await fetch(`${API_USER_URL}/favorites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify({ elementId: element._id }),
      });
      const finalUserData = await response.json();
      if (!response.ok) throw new Error('Server error');
      // Sync with the final state from the server
      updateUser(finalUserData);
    } catch (error) {
      console.error("Failed to sync favorite status:", error);
      // If the API call fails, revert to the original state
      updateUser(originalUser);
    }
  };

  const hasUnsavedChanges = noteText !== initialNote;
  if (!element) return null;
  const categoryColor = categoryColors[element.category] || categoryColors['unknown'];
  const isFavorited = isAuthenticated && user?.favoriteElements?.some(fav => fav._id === element._id);
  const isApprox = element.isApproximate || {};

  return (
    <aside className={`${styles.sidePanel} ${isOpen ? styles.open : ''}`} aria-labelledby="element-panel-title" role="dialog" aria-modal="true">
      <div className={styles.panelHeader}>
        <h2 
          id="element-panel-title" 
          className={styles.elementName} 
          style={{ borderLeftColor: categoryColor, color: categoryColor }}
        >
          {element.name} ({element.symbol})
        </h2>
        {isAuthenticated && (
          <button
            onClick={handleFavoriteToggle}
            className={`${styles.favoriteButton} ${isFavorited ? styles.favorited : ''}`}
            aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
            aria-pressed={isFavorited}
          >
            <i className={isFavorited ? 'fas fa-heart' : 'far fa-heart'}></i>
          </button>
        )}
        <button onClick={onClose} className={styles.closeButton} aria-label="Close element details">
          <i className="fas fa-times"></i>
        </button>
      </div>

      <div className={styles.panelBody}>
        <div className={styles.propertyGroup}>
          <h3>Atomic Properties</h3>
          <DetailItem label="Atomic Number" value={element.number} />
          <DetailItem label="Atomic Mass" value={element.atomicMass} unit="u" />
          <DetailItem label="Electron Config" value={element.electronConfig} />
          <DetailItem label="Oxidation States" value={element.oxidationStates} />
          <DetailItem label="Electronegativity (Pauling)" value={element.electronegativity} isApprox={isApprox.electronegativity} />
          <DetailItem label="Atomic Radius" value={element.atomicRadius} unit="pm" />
          <DetailItem label="Ionization Energy" value={element.ionizationEnergy} unit="kJ/mol" />
          <DetailItem label="Electron Affinity" value={element.electronAffinity} unit="kJ/mol" />
        </div>

        <div className={styles.divider}></div>

        <div className={styles.propertyGroup}>
          <h3>Physical Properties</h3>
          <DetailItem label="State at STP" value={element.state} isApprox={isApprox.state} />
          <DetailItem label="Density" value={element.density} unit="g/cm³" isApprox={isApprox.density} />
          <DetailItem label="Melting Point" value={element.meltingPoint} unit="K" isApprox={isApprox.meltingPoint} />
          <DetailItem label="Boiling Point" value={element.boilingPoint} unit="K" isApprox={isApprox.boilingPoint} />
        </div>
        
        <div className={styles.divider}></div>

        <div className={styles.propertyGroup}>
            <h3>Classification & Info</h3>
            <div className={styles.detailItem}>
                <strong>Category:</strong>
                <span className={styles.categoryTag} style={{ backgroundColor: categoryColor }}>
                    {element.category.replace(/-/g, ' ')}
                </span>
            </div>
            {element.name && (
                <div className={styles.detailItem}>
                    <strong>Wikipedia:</strong>
                    <a href={`https://en.wikipedia.org/wiki/${element.name}`} target="_blank" rel="noopener noreferrer">
                        Read More <i className="fas fa-external-link-alt"></i>
                    </a>
                </div>
            )}
        </div>

        {isAuthenticated && (
          <div className={styles.notesSection}>
            <h3>Your Notes</h3>
            <textarea
              value={noteText}
              onChange={handleNoteChange}
              placeholder={`Add your personal notes for ${element.name}...`}
              className={styles.notesTextarea}
              rows="5"
            />
            <div className={styles.notesActions}>
              <button
                onClick={handleSaveNote}
                className={styles.saveButton}
                disabled={!hasUnsavedChanges || isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Note'}
              </button>
              <div className={styles.saveStatus}>
                {hasUnsavedChanges && !isSaving && saveStatus !== 'Error!' && 'Unsaved changes'}
                {saveStatus && (isSaving || saveStatus === 'Saved!' || saveStatus === 'Error!') && saveStatus}
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default ElementDetailPanel;