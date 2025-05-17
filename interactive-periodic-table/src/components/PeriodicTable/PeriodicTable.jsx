import React, { useState, useEffect } from 'react';
import ElementCell from '../ElementCell/ElementCell';
import styles from './PeriodicTable.module.css';

const ANIMATION_DURATION_MS = 2500; // 2.5 seconds for the main animation
const MAX_STAGGER_DELAY_MS = 500; // Max additional delay for staggering (total 2.5 + 0.5 = 3s)

const PeriodicTable = ({
  elements,
  onElementClick,
  categoryColors,
  searchTerm,
  allElements,
  activeLegendCategory
}) => {
  const [startInitialAnimation, setStartInitialAnimation] = useState(false);
  const [initialPositions, setInitialPositions] = useState({});

  useEffect(() => {
    // Prepare initial random positions and delays for animation
    const positions = {};
    allElements.forEach(el => {
      positions[el.number] = {
        // Start elements slightly off-center and spread out
        initialX: `${Math.random() * 60 - 30}vw`, // Randomly spread across viewport width
        initialY: `${Math.random() * 60 - 30}vh`, // Randomly spread across viewport height
        delay: `${Math.random() * MAX_STAGGER_DELAY_MS}ms` // Random stagger delay
      };
    });
    setInitialPositions(positions);

    // Trigger animation shortly after mount
    const timer = setTimeout(() => {
      setStartInitialAnimation(true);
    }, 100); // Small delay to ensure elements are rendered before animation class is applied

    return () => clearTimeout(timer);
  }, [allElements]); // Re-run if allElements changes, though it shouldn't for this app

  const filteredElementNumbers = new Set(elements.map(el => el.number));

  const placeholderText = (text, row, column, span) => (
    <div style={{ gridRow: row, gridColumn: `${column} / span ${span}`}} className={styles.seriesPlaceholder}>
      {text}
    </div>
  );

  return (
    <div className={styles.periodicTableContainer}>
      <div className={`${styles.periodicTable} ${startInitialAnimation ? styles.animateIn : ''}`}>
        {allElements.map(element => {
          const isDimmedBySearch = searchTerm && !filteredElementNumbers.has(element.number);
          const elementInitialPos = initialPositions[element.number] || { initialX: '0vw', initialY: '0vh', delay: '0ms' };

          return (
            <ElementCell
              key={element.number}
              element={element}
              onClick={() => onElementClick(element)}
              categoryColor={categoryColors[element.category] || categoryColors['unknown']}
              isDimmedBySearch={isDimmedBySearch}
              activeLegendCategory={activeLegendCategory}
              // Pass initial animation props
              initialX={elementInitialPos.initialX}
              initialY={elementInitialPos.initialY}
              animationDelay={elementInitialPos.delay}
              enableInitialAnimation={!startInitialAnimation} // Only apply initial transforms before animation starts
            />
          );
        })}
        {/* Placeholders should probably not animate, or have a simpler fade-in */}
        {startInitialAnimation && (
          <>
            {placeholderText("57-71", 6, 3, 1)}
            {placeholderText("89-103", 7, 3, 1)}
            <div style={{gridRow: 9, gridColumn: '2 / span 1'}} className={styles.seriesLabel}>La-Lu</div>
            <div style={{gridRow: 10, gridColumn: '2 / span 1'}} className={styles.seriesLabel}>Ac-Lr</div>
          </>
        )}
      </div>
    </div>
  );
};

export default PeriodicTable;