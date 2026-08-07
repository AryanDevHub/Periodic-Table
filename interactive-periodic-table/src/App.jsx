// FILE: src/App.jsx (Final and Complete Version)

import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import styles from './App.module.css';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AccountPage from './pages/AccountPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Import static data directly — no API call needed for reference data
import elementsData from './data/elements.json';
import scientistsData from './data/scientists.json';

function App() {
  const [allElements] = useState(() => [...elementsData].sort((a, b) => a.number - b.number));
  const [scientists] = useState(() => [...scientistsData].sort((a, b) => a.discoveryYear - b.discoveryYear));
  const [filteredElements, setFilteredElements] = useState(allElements);
  const [searchTerm, setSearchTerm] = useState('');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');


  const location = useLocation();

  
  useEffect(() => {
    document.documentElement.className = theme === 'dark' ? 'dark-theme' : '';
    localStorage.setItem('theme', theme);
  }, [theme]);


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

  
  const showSearchBar = location.pathname === '/';

  return (
    <div className={styles.appContainer}>
      <Header
        onSearchChange={handleSearch}
        showSearchBar={showSearchBar} 
        searchTerm={searchTerm}
        onThemeToggle={handleThemeToggle}
        currentTheme={theme}
      />
      
      <main className={styles.mainContent}>
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
      </main>

      <Footer />
    </div>
  );
}

export default App;