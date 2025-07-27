// FILE: src/components/ElementDetailPanel/ElementDetailPanel.jsx

// The import statement is now corrected to include the necessary hooks.
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './ElementDetailPanel.module.css';

const API_USER_URL = `${import.meta.env.VITE_API_BASE_URL}/user`;

const DetailItem = ({ label, value, unit = '', isApprox = false }) => {
  if (value === null || typeof value === 'undefined') return null;
  const displayValue = value === 'Unknown' ? 'Unknown' : `${value} ${unit}`.trim();

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
  const [noteText, setNoteText] = useState('');
  const [initialNote, setInitialNote] = useState('');
  const [saveStatus, setSaveStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.notes && element) {
      const existingNote = user.notes.find(n => n.elementNumber === element.number)?.text || '';
      setNoteText(existingNote);
      setInitialNote(existingNote);
      setSaveStatus('');
      setIsSaving(false);
    }
  }, [isAuthenticated, user, element]);

  const handleSaveNote = async () => {
    if (!element) return;
    setIsSaving(true);
    setSaveStatus('Saving...');
    try {
      const res = await fetch(`${API_USER_URL}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify({ elementNumber: element.number, text: noteText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save note.');
      updateUser(data);
      setInitialNote(noteText);
      setSaveStatus('Saved!');
    } catch (err) {
      console.error(err);
      setSaveStatus('Error!');
    } finally {
      setIsSaving(false);
    }
  };

  const handleNoteChange = (e) => {
    setNoteText(e.target.value);
    setSaveStatus('');
  };

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated || !element?._id || !user) return;

    const originalUser = user;
    const isFavorited = user.favoriteElements.some(fav => fav._id === element._id);
    const optimisticUser = {
      ...user,
      favoriteElements: isFavorited
        ? user.favoriteElements.filter(fav => fav._id !== element._id)
        : [...user.favoriteElements, { ...element }],
    };
    updateUser(optimisticUser);

    try {
      const res = await fetch(`${API_USER_URL}/favorites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify({ elementId: element._id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update favorites.');
      updateUser(data);
    } catch (err) {
      console.error('Favorite sync failed:', err);
      updateUser(originalUser); // Revert if failed
    }
  };

  if (!element) return null;

  const categoryColor = categoryColors[element.category] || categoryColors['unknown'];
  const isFavorited = isAuthenticated && user?.favoriteElements?.some(fav => fav._id === element._id);
  const hasUnsavedChanges = noteText !== initialNote;
  const isApprox = element.isApproximate || {};

  return (
    <aside
      className={`${styles.sidePanel} ${isOpen ? styles.open : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="element-panel-title"
    >
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
              <a
                href={`https://en.wikipedia.org/wiki/${element.name}`}
                target="_blank"
                rel="noopener noreferrer"
              >
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
                {hasUnsavedChanges && !isSaving && !saveStatus && 'Unsaved changes'}
                {saveStatus && saveStatus}
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default ElementDetailPanel;