import React, { useEffect, useRef } from 'react';
import styles from './ElementDetailPanel.module.css';

const ElementDetailPanel = ({ element, onClose, categoryColors, isOpen }) => {
  const panelRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (isOpen && panelRef.current) {
      // Focus the panel or a specific element like close button when it opens
      closeButtonRef.current?.focus();
      
      // Trap focus (basic example)
      const focusableElements = panelRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      const handleKeyDown = (e) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) { // Shift + Tab
            if (document.activeElement === firstElement) {
              lastElement.focus();
              e.preventDefault();
            }
          } else { // Tab
            if (document.activeElement === lastElement) {
              firstElement.focus();
              e.preventDefault();
            }
          }
        } else if (e.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  if (!element) return null;

  const categoryColor = categoryColors[element.category] || categoryColors['unknown'];

  return (
    <aside 
      ref={panelRef}
      className={`${styles.sidePanel} ${isOpen ? styles.open : ''}`} 
      aria-labelledby="element-panel-title"
      role="dialog"
      aria-modal="true"
    >
      <button 
        ref={closeButtonRef}
        onClick={onClose} 
        className={styles.closeButton} 
        aria-label="Close element details"
      >
        <i className="fas fa-times"></i>
      </button>
      <h2 id="element-panel-title" className={styles.elementName} style={{ borderLeftColor: categoryColor }}>
        {element.name} ({element.symbol})
      </h2>
      <div className={styles.detailGrid}>
        <p><strong>Atomic Number:</strong> {element.number}</p>
        <p><strong>Atomic Mass:</strong> {element.atomicMass} u</p>
        <p><strong>Category:</strong> <span className={styles.categoryTag} style={{ backgroundColor: categoryColor }}>{element.category.replace(/-/g, ' ')}</span></p>
        <p><strong>Electron Config:</strong> {element.electronConfig}</p>
        <p><strong>State at STP:</strong> {element.state}</p>
        <p><strong>Group:</strong> {element.group > 0 ? element.group : 'N/A'}</p>
        <p><strong>Period:</strong> {element.period}</p>
        {/* Add more details as needed */}
        {element.name && (
            <p><strong>More Info:</strong> <a href={`https://en.wikipedia.org/wiki/${element.name}`} target="_blank" rel="noopener noreferrer">Wikipedia</a></p>
        )}
      </div>
    </aside>
  );
};

export default ElementDetailPanel;