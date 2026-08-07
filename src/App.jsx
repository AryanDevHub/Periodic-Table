// FILE: src/App.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import styles from './App.module.css';
import ComparePage from './pages/ComparePage';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AccountPage from './pages/AccountPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import { apiClient } from './api/apiClient';
import BuildAtomPage from './pages/BuildAtomPage';
import BalancerPage from './pages/BalancerPage';
import ReactionLabPage from './pages/ReactionLabPage';

function App() {
  const [allElements, setAllElements] = useState([]);
  const [scientists, setScientists] = useState([]);
  const [filteredElements, setFilteredElements] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const location = useLocation();

  useEffect(() => {
    document.documentElement.className = theme === 'dark' ? 'dark-theme' : '';
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const [elementsData, scientistsData] = await Promise.all([
          apiClient.get('/elements'),
          apiClient.get('/scientists'),
        ]);
        if (!isMounted) return;

        const sortedElements = [...elementsData].sort((a, b) => a.number - b.number);
        const sortedScientists = [...scientistsData].sort(
          (a, b) => a.discoveryYear - b.discoveryYear
        );

        setAllElements(sortedElements);
        setFilteredElements(sortedElements);
        setScientists(sortedScientists);
      } catch (err) {
        console.error('Failed to load data from API:', err);
        if (!isMounted) return;
        setLoadError(
          'Could not load periodic table data from the server. Please check your connection and try refreshing.'
        );
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSearch = useCallback(
    (term) => {
      setSearchTerm(term);
      if (!term) {
        setFilteredElements(allElements);
        return;
      }
      const lowerTerm = term.toLowerCase();
      setFilteredElements(
        allElements.filter(
          (el) =>
            el.name.toLowerCase().includes(lowerTerm) ||
            el.symbol.toLowerCase().includes(lowerTerm) ||
            String(el.number).includes(lowerTerm)
        )
      );
    },
    [allElements]
  );

  const handleThemeToggle = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const showSearchBar = location.pathname === '/';

  if (isLoading) {
    return (
      <div className={styles.appContainer}>
        <div className="status-message" role="status" aria-live="polite">
          Loading periodic table data...
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className={styles.appContainer}>
        <div className="status-message" role="alert">
          {loadError}
        </div>
      </div>
    );
  }

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
          <Route path="/build-atom" element={<BuildAtomPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/balancer" element={<BalancerPage />} />
          <Route path="/reaction-lab" element={<ReactionLabPage />} />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <AccountPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;