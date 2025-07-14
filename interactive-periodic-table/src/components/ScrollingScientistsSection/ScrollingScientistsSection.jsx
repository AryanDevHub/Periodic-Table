// src/components/ScrollingScientistsSection/ScrollingScientistsSection.jsx
import React from 'react';
// REMOVED: import { scientists } from '../../data/scientistsData';
import ScientistCard from '../ScientistCard/ScientistCard';
import styles from './ScrollingScientistsSection.module.css';

// --- What: Accept a 'scientists' array as a prop ---
const ScrollingScientistsSection = ({ scientists }) => {
  // --- What: Add a check for empty or loading data ---
  if (!scientists || scientists.length === 0) {
    return null; // Or a loading spinner if you prefer
  }

  return (
    <section className={styles.scientistsSection}>
      <h2 className={styles.sectionTitle}>Pioneers of the Periodic Table</h2>
      <div className={styles.scientistsContainer}>
        {scientists.map((scientist, index) => (
          <ScientistCard key={scientist.id} scientist={scientist} index={index} />
        ))}
      </div>
    </section>
  );
};

export default ScrollingScientistsSection;