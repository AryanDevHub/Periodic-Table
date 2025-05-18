// src/components/ScrollingScientistsSection/ScrollingScientistsSection.jsx
import React from 'react';
import { scientists } from '../../data/scientistsData'; // Adjust path
import ScientistCard from '../ScientistCard/ScientistCard';
import styles from './ScrollingScientistsSection.module.css';

const ScrollingScientistsSection = () => {
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