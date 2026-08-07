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
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
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
  const animationClass = isVisible ? styles.reveal : '';
  const wrapperClass = [styles.scientistEntry, layoutDirection, animationClass].join(' ');

  const readMoreLink = scientist.wikiUrl
    ? React.createElement(
        'a',
        {
          href: scientist.wikiUrl,
          target: '_blank',
          rel: 'noopener noreferrer',
          className: styles.readMoreLink,
        },
        'Read More ',
        React.createElement('i', { className: 'fas fa-external-link-alt' })
      )
    : null;

  return (
    <article ref={cardRef} className={wrapperClass}>
      <div className={styles.imageWrapper}>
        <img src={scientist.image} alt={scientist.name} className={styles.scientistImage} />
      </div>
      <div className={styles.contentWrapper}>
        <h3 className={styles.scientistName}>{scientist.name}</h3>
        <p className={styles.scientistContribution}>{scientist.contribution}</p>
        {readMoreLink}
      </div>
    </article>
  );
};

export default ScientistCard;