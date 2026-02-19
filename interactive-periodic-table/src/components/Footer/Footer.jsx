// src/components/Footer/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Brand & Mission Column */}
        <div className={styles.brandColumn}>
          <div className={styles.logo}>
            <i className="fas fa-atom"></i>
            <span>Quarx</span>
          </div>
          <p className={styles.missionText}>
            Empowering students and researchers with interactive chemical data and 
            insights into the pioneers of atomic science.
          </p>
        </div>

        {/* Navigation Column */}
        <div className={styles.linkColumn}>
          <h4>Platform</h4>
          <ul>
            <li><Link to="/">Periodic Table</Link></li>
            <li><Link to="/profile">Favorites</Link></li>
            <li><Link to="/account">Settings</Link></li>
          </ul>
        </div>

        {/* Support/Info Column */}
        <div className={styles.linkColumn}>
          <h4>Resources</h4>
          <ul>
            <li><a href="https://en.wikipedia.org/wiki/Periodic_table" target="_blank" rel="noreferrer">Chemistry Docs</a></li>
            <li><a href="#quiz">Skill Test</a></li>
            <li><a href="#scientists">Scientists Bio</a></li>
          </ul>
        </div>

        {/* Social & Contact Column */}
        <div className={styles.contactColumn}>
          <h4>Connect</h4>
          <div className={styles.socialGrid}>
            <a href="https://github.com/AryanDevHub/Periodic-Table" aria-label="GitHub"><i className="fab fa-github"></i></a>
            <a href="https://www.instagram.com/quarx_edu?igsh=MWg1bGJzMzdhN21pNQ==" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
            <a href="quarx.edu@gmail.com" aria-label="Email"><i className="fas fa-envelope"></i></a>
          </div>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <div className={styles.container}>
          <p>© {currentYear} Quarx. All rights reserved.</p>
          <div className={styles.legalLinks}>
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;