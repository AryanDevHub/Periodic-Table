// src/components/ScientistCard/ScientistCard.jsx
import React, { useEffect, useRef, useState } from 'react';
import styles from './ScientistCard.module.css';

const ScientistCard = ({ scientist, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target); // Stop observing once visible
          }
        });
      },
      {
        threshold: 0.15, // Trigger when 15% of the element is visible
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  const layoutDirection = index % 2 === 0 ? styles.layoutLeft : styles.layoutRight;
  // The 'reveal' class will trigger the animation
  const animationClass = isVisible ? styles.reveal : '';

  return (
    <article // Changed div to article for semantics
      ref={cardRef}
      className={`${styles.scientistEntry} ${layoutDirection} ${animationClass}`}
    >
      <div className={styles.imageWrapper}>
        <img src={scientist.image} alt={scientist.name} className={styles.scientistImage} />
      </div>
      <div className={styles.contentWrapper}>
        <h3 className={styles.scientistName}>{scientist.name}</h3>
        <p className={styles.scientistContribution}>{scientist.contribution}</p>
        {/* You could add a "Read More" link here later */}
      </div>
    </article>
  );
};

export default ScientistCard;