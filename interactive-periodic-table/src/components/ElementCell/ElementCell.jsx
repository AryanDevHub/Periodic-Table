import React, { useState, useRef } from 'react';
import styles from './ElementCell.module.css';
import ElementTooltip from '../ElementTooltip/ElementTooltip';

const ElementCell = ({
  element,
  onClick,
  categoryColor,
  isDimmedBySearch,
  activeLegendCategory,
  initialX,
  initialY,
  animationDelay,
  enableInitialAnimation
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const cellRef = useRef(null);
  const tooltipId = `tooltip-${element.number}`;

  // --- Visual state logic ---
  let cellOpacity = 1;
  let cellFilter = 'none';
  let cellZIndex = 1;
  let cellTransform = 'scale(1)';
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

  // --- Initial animation style ---
  let initialAnimationStyle = {};
  if (enableInitialAnimation) {
    initialAnimationStyle = {
      transform: `translate(${initialX}, ${initialY}) scale(0.5)`,
      opacity: 0,
    };
  } else {
    initialAnimationStyle.transform = cellTransform;
    initialAnimationStyle.opacity = cellOpacity;
  }

  const allowIndividualInteractions =
    !enableInitialAnimation &&
    ((activeLegendCategory && isHighlightedByActiveLegend) ||
      (!activeLegendCategory && !isDimmedBySearch));

  const cellStyle = {
    gridColumnStart: element.column,
    gridRowStart: element.row,
    backgroundColor: categoryColor,
    filter: cellFilter,
    zIndex: cellZIndex,
    boxShadow: cellBoxShadow,
    outline: cellOutline,
    outlineOffset: '-1.5px',
    animationDelay: enableInitialAnimation ? animationDelay : '0s',
    transition: enableInitialAnimation
      ? 'none'
      : 'opacity 0.3s ease, filter 0.3s ease, transform 0.2s ease-out, box-shadow 0.2s ease-out, outline 0.2s ease-out, z-index 0s linear 0.3s',
    position: 'relative',
    ...initialAnimationStyle,
  };

  // ✅ Viewport-aware tooltip positioning
  const handleMouseEnter = () => {
    if (!allowIndividualInteractions || !cellRef.current) {
      setShowTooltip(false);
      return;
    }

    const cellRect = cellRef.current.getBoundingClientRect();
    const tooltipEstimatedHeight = 150;
    const tooltipEstimatedWidth = 250;
    const viewportMargin = 10;

    // --- Vertical logic ---
    let top = -(tooltipEstimatedHeight + 8);
    if (cellRect.top - tooltipEstimatedHeight - 8 < viewportMargin) {
      top = cellRect.height + 8;
    }

    // --- Horizontal logic ---
    let left = cellRect.width / 2;
    let transform = 'translateX(-50%)';

    const tooltipCenterOnScreen = cellRect.left + (cellRect.width / 2);
    const tooltipLeftEdge = tooltipCenterOnScreen - (tooltipEstimatedWidth / 2);
    const tooltipRightEdge = tooltipCenterOnScreen + (tooltipEstimatedWidth / 2);

    if (tooltipLeftEdge < viewportMargin) {
      const overflowAmount = viewportMargin - tooltipLeftEdge;
      transform = `translateX(calc(-50% + ${overflowAmount}px))`;
    } else if (tooltipRightEdge > window.innerWidth - viewportMargin) {
      const overflowAmount = tooltipRightEdge - (window.innerWidth - viewportMargin);
      transform = `translateX(calc(-50% - ${overflowAmount}px))`;
    }

    setTooltipPosition({
      top: `${top}px`,
      left: `${left}px`,
      transform,
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
