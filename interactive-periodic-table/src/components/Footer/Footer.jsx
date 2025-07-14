// src/components/Footer/Footer.jsx

import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        
        {/* What: The "About" section.
            Why: Gives a quick summary of the project and your role. */}
        <div className={styles.footerSection}>
          <h4>About This Project</h4>
          <p>
            An interactive periodic table built with React, Node.js, and MongoDB to explore the elements and the brilliant minds who discovered them.
          </p>
        </div>

        {/* What: The "Connect" section.
            Why: Offers a quick way for people to connect with you professionally. */}
        <div className={`${styles.footerSection} ${styles.connectSection}`}>
          <h4>Connect With Me</h4>
          <div className={styles.socialIcons}>
            {/* TODO: Replace with your actual GitHub link */}
            <a href="[Link_To_Your_GitHub]" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><i className="fab fa-github"></i></a>
            
            {/* TODO: Replace with your actual LinkedIn link */}
            <a href="[Link_To_Your_LinkedIn]" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i className="fab fa-linkedin"></i></a>
            
            {/* TODO: Replace with your actual personal portfolio link */}
            <a href="[Link_To_Your_Portfolio]" target="_blank" rel="noopener noreferrer" aria-label="Portfolio"><i className="fas fa-globe"></i></a>
          </div>
        </div>

      </div>

      <div className={styles.footerBottom}>
        {/* TODO: Replace with your name */}
        <p>© {currentYear} [Your Name]. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;