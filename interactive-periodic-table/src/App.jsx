// src/App.jsx (Final and Complete Version)

import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import styles from './App.module.css';

// Component Imports
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AccountPage from './pages/AccountPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/Auth/ProtectedRoute';

const API_BASE_URL = 'http://localhost:4000/api';

function App() {
  // State for data fetched from the API
  const [allElements, setAllElements] = useState([]);
  const [scientists, setScientists] = useState([]);
  const [filteredElements, setFilteredElements] = useState([]);
  
  // State for UI and loading status
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  const location = useLocation();

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [elementsRes, scientistsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/elements`),
          fetch(`${API_BASE_URL}/scientists`)
        ]);

        if (!elementsRes.ok || !scientistsRes.ok) {
          throw new Error('Network response was not ok');
        }

        const elementsData = await elementsRes.json();
        const scientistsData = await scientistsRes.json();

        setAllElements(elementsData);
        setFilteredElements(elementsData); // Initially, all elements are shown
        setScientists(scientistsData);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError('Failed to load data from the server. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- THEME MANAGEMENT ---
  useEffect(() => {
    document.documentElement.className = theme === 'dark' ? 'dark-theme' : '';
    localStorage.setItem('theme', theme);
  }, [theme]);

  // --- EVENT HANDLERS ---
  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
    if (!term) {
      setFilteredElements(allElements);
      return;
    }
    const lowerTerm = term.toLowerCase();
    setFilteredElements(
      allElements.filter(el =>
        el.name.toLowerCase().includes(lowerTerm) ||
        el.symbol.toLowerCase().includes(lowerTerm) ||
        String(el.number).includes(lowerTerm)
      )
    );
  }, [allElements]);

  const handleThemeToggle = useCallback(() => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  // What: A check to determine if the search bar should be visible.
  // Why: We only want to show it on the homepage.
  const showSearchBar = location.pathname === '/';

  return (
    <div className={styles.appContainer}>
      <Header
        onSearchChange={showSearchBar ? handleSearch : null} // Conditionally pass the handler
        searchTerm={searchTerm}
        onThemeToggle={handleThemeToggle}
        currentTheme={theme}
      />
      
      <main className={styles.mainContent}>
        {isLoading ? (
          <div className="status-message">Loading Application Data...</div>
        ) : error ? (
          <div className="status-message error">{error}</div>
        ) : (
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  allElements={allElements}
                  filteredElements={filteredElements}
                  scientists={scientists}
                  searchTerm={searchTerm}
                />
              }
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          </Routes>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;