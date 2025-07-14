// src/components/ScientistCard/ScientistCard.jsx

import React, { useEffect, useRef, useState } from 'react';
import styles from './ScientistCard.module.css';

const ScientistCard = ({ scientist, index }) => {
   console.log(scientist); 
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  // This effect handles the scroll-triggered animation. It's working perfectly.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target); // Stop observing once visible to save performance.
          }
        });
      },
      {
        threshold: 0.15, // Trigger when 15% of the element is visible.
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    // Cleanup function to unobserve the element if the component unmounts.
    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []); // Empty dependency array means this runs only once on mount.

  // Logic for alternating layout and triggering animation.
  const layoutDirection = index % 2 === 0 ? styles.layoutLeft : styles.layoutRight;
  const animationClass = isVisible ? styles.reveal : '';

  return (
    // 'article' is a good semantic choice for self-contained content.
    <article
      ref={cardRef}
      className={`${styles.scientistEntry} ${layoutDirection} ${animationClass}`}
    >
      <div className={styles.imageWrapper}>
        <img src={scientist.image} alt={scientist.name} className={styles.scientistImage} />
      </div>
      <div className={styles.contentWrapper}>
        <h3 className={styles.scientistName}>{scientist.name}</h3>
        <p className={styles.scientistContribution}>{scientist.contribution}</p>
        
        {/* --- NEWLY ADDED "READ MORE" LINK --- */}
        {/* What: This conditionally renders the link only if a 'wikiUrl' exists in the data. */}
        {/* Why: This makes the component robust and prevents errors if a URL is missing. */}
        {scientist.wikiUrl && (
          <a
            href={scientist.wikiUrl}
            target="_blank" // Opens the link in a new tab.
            rel="noopener noreferrer" // Important security measure for target="_blank".
            className={styles.readMoreLink}
          >
            Read More <i className="fas fa-external-link-alt"></i>
          </a>
        )}
      </div>
    </article>
  );
};

export default ScientistCard;