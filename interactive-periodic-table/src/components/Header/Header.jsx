import React from 'react';
import styles from './Header.module.css';

const Header = ({ onSearchChange, onThemeToggle, currentTheme, searchTerm }) => {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Interactive Periodic Table</h1>
      <div className={styles.controls}>
        <input
          type="search"
          placeholder="Search element (name, symbol, number)"
          aria-label="Search elements"
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <button
          onClick={onThemeToggle}
          className={styles.themeToggle}
          aria-label={`Switch to ${currentTheme === 'light' ? 'dark' : 'light'} theme`}
        >
          <i className={`fas ${currentTheme === 'light' ? 'fa-moon' : 'fa-sun'}`}></i>
        </button>
      </div>
    </header>
  );
};

export default Header;