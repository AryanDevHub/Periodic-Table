import React, { useState, useRef } from 'react';
import styles from './ElementCell.module.css';
import ElementTooltip from '../ElementTooltip/ElementTooltip';

const ElementCell = ({
  element,
  onClick,
  categoryColor,
  isDimmedBySearch,
  activeLegendCategory,
  // Initial animation props
  initialX,
  initialY,
  animationDelay,
  enableInitialAnimation
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const cellRef = useRef(null);
  const tooltipId = `tooltip-${element.number}`;

  // --- Style determination for interactive states (after initial animation) ---
  let cellOpacity = 1;
  let cellFilter = 'none';
  let cellZIndex = 1;
  let cellTransform = 'scale(1)'; // Base transform after initial animation
  let cellBoxShadow = 'none';
  let cellOutline = 'none';

  const isHighlightedByActiveLegend = activeLegendCategory && element.category === activeLegendCategory;
  const isDimmedByActiveLegend = activeLegendCategory && element.category !== activeLegendCategory;
  const groupHighlightColor = '#00bfff';

  if (isHighlightedByActiveLegend) {
    cellOpacity = 1;
    cellFilter = 'brightness(1.05)';
    cellZIndex = 10;
    cellTransform = 'scale(1.03)';
    cellOutline = `2px solid ${groupHighlightColor}`;
    cellBoxShadow = `0 0 10px ${groupHighlightColor}66`;
  } else if (isDimmedByActiveLegend) {
    cellOpacity = 0.2;
    cellZIndex = 0;
  } else if (isDimmedBySearch) {
    cellOpacity = 0.3;
    cellZIndex = 1;
  }

  // --- Initial Animation Styles ---
  let initialAnimationStyle = {};
  if (enableInitialAnimation) {
    initialAnimationStyle = {
      // Translate from the random start point, opacity 0
      transform: `translate(${initialX}, ${initialY}) scale(0.5)`, // Start smaller
      opacity: 0,
      // The animation will be applied by CSS based on parent class
    };
  } else {
    // When not doing initial animation (i.e., it's finished or wasn't enabled)
    // Apply interactive transforms
    initialAnimationStyle.transform = cellTransform; // Apply the calculated scale for legend highlight etc.
    initialAnimationStyle.opacity = cellOpacity; // Apply calculated opacity
  }


  const allowIndividualInteractions =
    !enableInitialAnimation && // No interactions during initial fly-in
    ((activeLegendCategory && isHighlightedByActiveLegend) ||
    (!activeLegendCategory && !isDimmedBySearch));

  const cellStyle = {
    gridColumnStart: element.column,
    gridRowStart: element.row,
    backgroundColor: categoryColor,
    // Opacity and transform are now handled by initialAnimationStyle or interactive logic
    // opacity: cellOpacity, // Managed by initialAnimationStyle or interactive logic
    filter: cellFilter,
    zIndex: cellZIndex,
    // transform: cellTransform, // Managed by initialAnimationStyle or interactive logic
    boxShadow: cellBoxShadow,
    outline: cellOutline,
    outlineOffset: '-1.5px',
    // Add animation-delay from props for staggered effect, only if initial animation is active
    // The animation-name and duration will be set in ElementCell.module.css
    animationDelay: enableInitialAnimation ? animationDelay : '0s',
    transition: enableInitialAnimation ? 'none' : 'opacity 0.3s ease, filter 0.3s ease, transform 0.2s ease-out, box-shadow 0.2s ease-out, outline 0.2s ease-out, z-index 0s linear 0.3s',
    position: 'relative', // Keep for tooltip
    ...initialAnimationStyle // Spread initial animation styles (transform, opacity)
  };

  const handleMouseEnter = () => {
    if (!allowIndividualInteractions || !cellRef.current) {
      setShowTooltip(false);
      return;
    }
    // Tooltip positioning logic (same as before)
    const cellRect = cellRef.current.getBoundingClientRect();
    const tooltipEstimatedHeight = 150;
    const tooltipEstimatedWidth = 250;
    let ttTop = -(tooltipEstimatedHeight + 8);
    let ttLeft = cellRect.width / 2;

    if (cellRect.top - tooltipEstimatedHeight - 8 < 0) {
      ttTop = cellRect.height + 8;
    }
    if (cellRect.left + (cellRect.width / 2) - (tooltipEstimatedWidth / 2) < 10) {
        ttLeft = (tooltipEstimatedWidth / 2) - (cellRect.left - 10);
    }
    else if (cellRect.left + (cellRect.width / 2) + (tooltipEstimatedWidth / 2) > window.innerWidth - 10) {
        ttLeft = cellRect.width - (tooltipEstimatedWidth / 2) - ( (cellRect.left + cellRect.width) - (window.innerWidth - 10) );
    }

    setTooltipPosition({
      top: `${ttTop}px`,
      left: `${ttLeft}px`,
      transform: 'translateX(-50%)',
    });
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const applyIndividualNeonGlow = showTooltip && allowIndividualInteractions;

  return (
    <div
      ref={cellRef}
      className={`${styles.elementCell} ${applyIndividualNeonGlow ? styles.individualHoverEffect : ''} ${enableInitialAnimation ? styles.initialAnimateElement : ''}`}
      style={cellStyle}
      onClick={allowIndividualInteractions ? onClick : undefined}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
      tabIndex={allowIndividualInteractions ? 0 : -1}
      role="button"
      aria-label={`Element ${element.name}, number ${element.number}`}
      aria-describedby={showTooltip && allowIndividualInteractions ? tooltipId : undefined}
      aria-hidden={isDimmedByActiveLegend && !enableInitialAnimation}
    >
      <div className={styles.number}>{element.number}</div>
      <div className={styles.symbol}>{element.symbol}</div>
      <div className={styles.name}>{element.name}</div>

      <ElementTooltip
        id={tooltipId}
        element={element}
        style={tooltipPosition}
        categoryColor={categoryColor}
        isVisible={showTooltip && allowIndividualInteractions}
      />
    </div>
  );
};

export default ElementCell;