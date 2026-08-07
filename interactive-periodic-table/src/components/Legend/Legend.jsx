import React from 'react';
import styles from './Legend.module.css';

const Legend = ({
  categoryColors,
  categoryNames,
  onCategoryHover,
  onCategoryClick, // New prop
  hoveredCategoryKey,
  selectedCategoryKey // New prop
}) => {
  return (
    <div className={styles.legend}>
      {Object.entries(categoryColors).map(([categoryKey, color]) => {
        const isHovered = hoveredCategoryKey === categoryKey;
        const isSelected = selectedCategoryKey === categoryKey && !isHovered; // Selected only if not currently overridden by hover
        const isActive = isHovered || isSelected;

        return (
          <div
            key={categoryKey}
            className={`${styles.legendItem} ${isActive ? styles.activeLegendItem : ''} ${isSelected ? styles.selectedLegendItem : ''}`}
            onMouseEnter={() => onCategoryHover(categoryKey)}
            onMouseLeave={() => onCategoryHover(null)}
            onClick={() => onCategoryClick(categoryKey)} // Handle click
            onFocus={() => onCategoryHover(categoryKey)}
            onBlur={() => onCategoryHover(null)}
            tabIndex={0}
            role="button"
            aria-pressed={isSelected} // True if it's the "sticky" selected one
            aria-label={`${isSelected ? 'Currently selected: ' : ''}Highlight ${categoryNames[categoryKey] || categoryKey.replace(/-/g, ' ')} elements. ${isSelected ? 'Click to unselect.' : 'Click to select.'}`}
          >
            <span className={styles.colorBox} style={{ backgroundColor: color }}></span>
            {categoryNames[categoryKey] || categoryKey.replace(/-/g, ' ')}
          </div>
        );
      })}
    </div>
  );
};

export default Legend;