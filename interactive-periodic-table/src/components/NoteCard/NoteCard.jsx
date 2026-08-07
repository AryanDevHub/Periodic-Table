// src/components/NoteCard/NoteCard.jsx

import React, { useState } from 'react';
import styles from './NoteCard.module.css';

const NoteCard = ({ note, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(note.text);

  const handleSave = () => {
    onUpdate(note.elementNumber, editText);
    setIsEditing(false);
  };

  const handleDelete = () => {
   
    
      onDelete(note.elementNumber);
    
  };

  return (
    <div className={styles.noteCard}>
      <div className={styles.cardHeader}>
        <h4>Note for Element #{note.elementNumber}</h4>
        <div className={styles.buttonGroup}>
          {isEditing ? (
            <>
              <button onClick={handleSave} className={`${styles.actionButton} ${styles.saveButton}`}>
                <i className="fas fa-save"></i> Save
              </button>
              <button onClick={() => setIsEditing(false)} className={`${styles.actionButton} ${styles.cancelButton}`}>
                Cancel
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setIsEditing(true)} className={`${styles.actionButton} ${styles.editButton}`}>
                <i className="fas fa-edit"></i> Edit
              </button>
              <button onClick={handleDelete} className={`${styles.actionButton} ${styles.deleteButton}`}>
                <i className="fas fa-trash"></i> Delete
              </button>
            </>
          )}
        </div>
      </div>
      <div className={styles.cardBody}>
        {isEditing ? (
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className={styles.editTextarea}
            rows="4"
          />
        ) : (
          <p>{note.text}</p>
        )}
      </div>
    </div>
  );
};

export default NoteCard;