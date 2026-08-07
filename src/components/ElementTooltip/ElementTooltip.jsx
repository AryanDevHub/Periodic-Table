import React from 'react';
import ReactDOM from 'react-dom';
import styles from './ElementTooltip.module.css';

const ElementTooltip = ({ element, style, categoryColor, isVisible, id }) => {
  if (!element) return null;

  const getTextColorForBackground = (hexColor) => {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  };

  const headerTextColor = categoryColor ? getTextColorForBackground(categoryColor) : '#000000';

  const tooltipMarkup = (
    <div
      id={id}
      className={`${styles.tooltip} ${isVisible ? styles.visible : ''}`}
      style={{ ...style, borderColor: categoryColor }}
      aria-hidden={!isVisible}
      role="tooltip"
    >
      <h4 
        className={styles.tooltipName} 
        style={{ backgroundColor: categoryColor, color: headerTextColor }}
      >
        {element.name} ({element.symbol})
      </h4>
      <div className={styles.tooltipDetails}>
        <p><strong>Atomic Mass:</strong> {element.atomicMass} u</p>
        <p><strong>Electron Config:</strong> {element.electronConfig}</p>
        <p><strong>State (STP):</strong> {element.state}</p>
        <p><strong>Category:</strong> <span style={{textTransform: 'capitalize'}}>{element.category.replace(/-/g, ' ')}</span></p>
      </div>
    </div>
  );

  return ReactDOM.createPortal(
    tooltipMarkup,
    document.getElementById('tooltip-root')
  );
};

export default ElementTooltip;