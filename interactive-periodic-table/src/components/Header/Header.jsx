// src/components/Header/Header.jsx

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Header.module.css';

const Header = ({ onSearchChange, searchTerm, onThemeToggle, currentTheme }) => {
  const { isAuthenticated, logout, user, isAuthLoading } = useAuth();
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const renderAuthLinks = () => {
    if (isAuthLoading) return null;

    if (isAuthenticated && user) {
      // This section for logged-in users is already responsive.
      return (
        <div className={styles.profileContainer} ref={dropdownRef}>
          <button
            className={styles.profileLink}
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            aria-haspopup="true"
            aria-expanded={isDropdownOpen}
          >
            <i className="fas fa-user-circle"></i>
            <span className={styles.authButtonText}>{user.username}</span>
            <i className={`fas fa-chevron-down ${styles.chevron} ${isDropdownOpen ? styles.chevronUp : ''}`}></i>
          </button>
          {isDropdownOpen && (
            <div className={styles.dropdownMenu}>
              <Link to="/account" className={styles.dropdownItem} onClick={() => setIsDropdownOpen(false)}>
                <i className="fas fa-user-cog"></i> My Account
              </Link>
              <Link to="/profile" className={styles.dropdownItem} onClick={() => setIsDropdownOpen(false)}>
                <i className="fas fa-star"></i> Favorites & Notes
              </Link>
              <div className={styles.dropdownDivider}></div>
              <button onClick={handleLogout} className={`${styles.dropdownItem} ${styles.logoutButton}`}>
                <i className="fas fa-sign-out-alt"></i> Logout
              </button>
            </div>
          )}
        </div>
      );
    }

    // --- UPDATED LOGGED-OUT BUTTONS ---
    // Icons are added, and text is wrapped in a span for responsive hiding.
    return (
      <div className={styles.authLinks}>
        <Link to="/login" className={styles.authButton} aria-label="Login">
          <i className="fas fa-sign-in-alt"></i>
          <span className={styles.authButtonText}>Login</span>
        </Link>
        <Link to="/register" className={`${styles.authButton} ${styles.registerButton}`} aria-label="Sign Up">
          <i className="fas fa-user-plus"></i>
          <span className={styles.authButtonText}>Sign Up</span>
        </Link>
      </div>
    );
  };

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}></div>
      <h1 className={styles.title}>
        <Link to="/" className={styles.titleLink}>
          <i className={`fas fa-atom ${styles.logoIcon}`}></i>
          <span className={styles.titleText}>Atomify</span>
        </Link>
      </h1>
      <div className={styles.controls}>
        {onSearchChange && (
          <input
            type="search"
            placeholder="Search..."
            aria-label="Search elements"
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        )}
        {renderAuthLinks()}
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