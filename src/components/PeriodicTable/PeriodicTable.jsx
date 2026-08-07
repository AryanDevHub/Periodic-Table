import React, { useState, useEffect } from 'react';
import ElementCell from '../ElementCell/ElementCell';
import styles from './PeriodicTable.module.css';

const ANIMATION_DURATION_MS = 6000; 
const MAX_STAGGER_DELAY_MS = 2000; 

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
    
    const positions = {};
    allElements.forEach(el => {
      positions[el.number] = {
        
        initialX: `${Math.random() * 60 - 30}vw`, 
        initialY: `${Math.random() * 60 - 30}vh`, 
        delay: `${Math.random() * MAX_STAGGER_DELAY_MS}ms` 
      };
    });
    setInitialPositions(positions);

    
    const timer = setTimeout(() => {
      setStartInitialAnimation(true);
    }, 100); 
    return () => clearTimeout(timer);
  }, [allElements]); 

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