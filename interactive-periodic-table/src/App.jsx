import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header/Header';
import PeriodicTable from './components/PeriodicTable/PeriodicTable';
import ElementDetailPanel from './components/ElementDetailPanel/ElementDetailPanel';
import Legend from './components/Legend/Legend';
import BackToTopButton from './components/BackToTopButton/BackToTopButton';
import elementsData from './data/elements.json';
import { CATEGORY_COLORS, CATEGORY_NAMES } from './constants';
import styles from './App.module.css'; // Styles specific to App.jsx layout
import ScrollingScientistsSection from './components/ScrollingScientistsSection/ScrollingScientistsSection'; 

function App() {
  const [allElements] = useState(elementsData);
  const [filteredElements, setFilteredElements] = useState(allElements);
  const [selectedElement, setSelectedElement] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [showPanel, setShowPanel] = useState(false);

  const [hoveredLegendCategory, setHoveredLegendCategory] = useState(null);
  const [selectedLegendCategory, setSelectedLegendCategory] = useState(null);

  // This useEffect correctly applies/removes 'dark-theme' class to <html>
  useEffect(() => {
    document.documentElement.className = theme === 'dark' ? 'dark-theme' : '';
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleThemeToggle = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleElementClick = useCallback((element) => {
    setSelectedElement(element);
    setShowPanel(true);
    setSelectedLegendCategory(null);
    setHoveredLegendCategory(null);
  }, []);

  const handleClosePanel = useCallback(() => {
    setShowPanel(false);
    setTimeout(() => setSelectedElement(null), 300); // Delay for panel animation
  }, []);

  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
    setHoveredLegendCategory(null);
    setSelectedLegendCategory(null);
    if (!term) {
      setFilteredElements(allElements);
    } else {
      const lowerTerm = term.toLowerCase();
      setFilteredElements(
        allElements.filter(
          el =>
            el.name.toLowerCase().includes(lowerTerm) ||
            el.symbol.toLowerCase().includes(lowerTerm) ||
            String(el.number).includes(lowerTerm)
        )
      );
    }
  }, [allElements]);

  const handleLegendCategoryHover = useCallback((categoryKey) => {
    setHoveredLegendCategory(categoryKey);
  }, []);

  const handleLegendCategoryClick = useCallback((categoryKey) => {
    setSelectedLegendCategory(prevSelected => (prevSelected === categoryKey ? null : categoryKey));
    setHoveredLegendCategory(null);
  }, []);

  const activeLegendCategory = hoveredLegendCategory || selectedLegendCategory;

  return (
    <div className={styles.appContainer}> {/* Uses App.module.css for main container styling */}
      <Header
        onSearchChange={handleSearch}
        onThemeToggle={handleThemeToggle}
        currentTheme={theme}
        searchTerm={searchTerm}
      />

      <main className={`${styles.mainContent} ${showPanel ? styles.mainContentShifted : ''}`}>
        <div className={styles.tableArea}> {/* This div is for layout shifting */}
          <Legend
            categoryColors={CATEGORY_COLORS} // These are direct colors, not CSS vars here
            categoryNames={CATEGORY_NAMES}
            onCategoryHover={handleLegendCategoryHover}
            onCategoryClick={handleLegendCategoryClick}
            hoveredCategoryKey={hoveredLegendCategory}
            selectedCategoryKey={selectedLegendCategory}
          />
          <PeriodicTable
            elements={filteredElements}
            onElementClick={handleElementClick}
            categoryColors={CATEGORY_COLORS} // Direct colors passed here
            allElements={allElements}
            searchTerm={searchTerm}
            activeLegendCategory={activeLegendCategory}
          />
        </div>
      </main>
       {/* >>>>>>>> ADD THE NEW SECTION HERE <<<<<<<<<< */}
      <ScrollingScientistsSection />
      {/* >>>>>>>> END OF NEW SECTION <<<<<<<<<< */}


      {/* Panel and Overlay */}
      {showPanel && selectedElement && (
        <>
          {/*
            Overlay class name adjusted to use global CSS if defined there.
            If .app-overlay and .visible are in App.module.css, use styles.appOverlay and styles.visible.
          */}
          <div
            className={`app-overlay ${showPanel ? 'visible' : ''}`} // Assumes .app-overlay & .visible are global
            onClick={handleClosePanel}
            aria-hidden="true"
          />
          <ElementDetailPanel
            element={selectedElement}
            onClose={handleClosePanel}
            categoryColors={CATEGORY_COLORS} // Direct colors passed here
            isOpen={showPanel}
          />
        </>
      )}
      <BackToTopButton />
    </div>
  );
}

export default App;