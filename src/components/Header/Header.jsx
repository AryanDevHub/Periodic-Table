// FILE: src/components/Header/Header.jsx

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Header.module.css';
import ProgressBadge from '../ProgressBadge/ProgressBadge';

const Header = ({ onSearchChange, searchTerm, onThemeToggle, currentTheme, showSearchBar }) => {
  const { isAuthenticated, logout, user, isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

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
      return (
        <div className={styles.profileContainer} ref={dropdownRef}>
          <button
            className={styles.profileLink}
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            aria-haspopup="true"
            aria-expanded={isDropdownOpen}
          >
            {user.profilePicture ? (
              <img src={user.profilePicture} alt={user.username} className={styles.profileAvatar} />
            ) : (
              <i className="fas fa-user-circle"></i>
            )}
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

  const playLearnLinks = [
    { to: '/compare', icon: 'fa-balance-scale', label: 'Compare Elements' },
    { to: '/build-atom', icon: 'fa-atom', label: 'Build an Atom' },
    { to: '/balancer', icon: 'fa-equals', label: 'Equation Balancer' },
    { to: '/reaction-lab', icon: 'fa-flask', label: 'Reaction Lab' },
  ];

  const [isPlayMenuOpen, setIsPlayMenuOpen] = useState(false);
  const playMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutsidePlayMenu = (event) => {
      if (playMenuRef.current && !playMenuRef.current.contains(event.target)) {
        setIsPlayMenuOpen(false);
      }
    };
    if (isPlayMenuOpen) {
      document.addEventListener('mousedown', handleClickOutsidePlayMenu);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutsidePlayMenu);
    };
  }, [isPlayMenuOpen]);

  const renderPlayLearnMenu = () => (
    <div className={styles.playMenuContainer} ref={playMenuRef}>
      <button
        className={styles.navLink}
        onClick={() => setIsPlayMenuOpen((prev) => !prev)}
        aria-haspopup="true"
        aria-expanded={isPlayMenuOpen}
      >
        <i className="fas fa-gamepad"></i>
        <span>Play &amp; Learn</span>
        <i className={`fas fa-chevron-down ${styles.chevron} ${isPlayMenuOpen ? styles.chevronUp : ''}`}></i>
      </button>
      {isPlayMenuOpen && (
        <div className={styles.dropdownMenu}>
          {playLearnLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={styles.dropdownItem}
              onClick={() => setIsPlayMenuOpen(false)}
            >
              <i className={`fas ${link.icon}`}></i> {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        {!isHomePage && (
          <Link to="/" className={styles.homeButton} aria-label="Go to Homepage">
            <i className="fas fa-home"></i>
          </Link>
        )}
      </div>

      <h1 className={styles.title}>
        <Link to="/" className={styles.titleLink}>
          <i className={`fas fa-atom ${styles.logoIcon}`}></i>
          <span className={styles.titleText}>Quarx</span>
        </Link>
      </h1>

      <div className={styles.controls}>
        <input
          type="search"
          placeholder="Search..."
          aria-label="Search elements"
          className={`${styles.searchInput} ${showSearchBar ? '' : styles.searchInputHidden}`}
          value={searchTerm}
          onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
        />

        {renderPlayLearnMenu()}

        <ProgressBadge />

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