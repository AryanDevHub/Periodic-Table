import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header/Header';
import PeriodicTable from './components/PeriodicTable/PeriodicTable';
import ElementDetailPanel from './components/ElementDetailPanel/ElementDetailPanel';
import Legend from './components/Legend/Legend';
import BackToTopButton from './components/BackToTopButton/BackToTopButton';
import elementsData from './data/elements.json';
import { CATEGORY_COLORS, CATEGORY_NAMES } from './constants';
import styles from './App.module.css';

function App() {
  const [allElements] = useState(elementsData);
  const [filteredElements, setFilteredElements] = useState(allElements);
  const [selectedElement, setSelectedElement] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [showPanel, setShowPanel] = useState(false);

  const [hoveredLegendCategory, setHoveredLegendCategory] = useState(null);
  const [selectedLegendCategory, setSelectedLegendCategory] = useState(null); // New state for sticky highlight

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
    // Clear legend selection when an element detail is opened
    // Or, only clear if element.category !== selectedLegendCategory
    setSelectedLegendCategory(null);
    setHoveredLegendCategory(null);
  }, []);

  const handleClosePanel = useCallback(() => {
    setShowPanel(false);
    setTimeout(() => setSelectedElement(null), 300);
  }, []);

  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
    setHoveredLegendCategory(null);
    setSelectedLegendCategory(null); // Clear sticky highlight on search
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
    // If clicking the already selected category, unselect it. Otherwise, select the new one.
    setSelectedLegendCategory(prevSelected => (prevSelected === categoryKey ? null : categoryKey));
    setHoveredLegendCategory(null); // Clear hover when a click occurs
  }, []);

  // Determine the currently active category for highlighting (hover takes precedence over selected)
  const activeLegendCategory = hoveredLegendCategory || selectedLegendCategory;

  return (
    <div className={styles.appContainer}>
      <Header
        onSearchChange={handleSearch} // Search clears sticky highlight
        onThemeToggle={handleThemeToggle}
        currentTheme={theme}
        searchTerm={searchTerm}
      />
      <main className={styles.mainContent}>
        <Legend
          categoryColors={CATEGORY_COLORS}
          categoryNames={CATEGORY_NAMES}
          onCategoryHover={handleLegendCategoryHover}
          onCategoryClick={handleLegendCategoryClick} // New prop
          hoveredCategoryKey={hoveredLegendCategory}
          selectedCategoryKey={selectedLegendCategory} // New prop
        />
        <PeriodicTable
          elements={filteredElements}
          onElementClick={handleElementClick} // Clicking an element clears sticky highlight
          categoryColors={CATEGORY_COLORS}
          allElements={allElements}
          searchTerm={searchTerm}
          activeLegendCategory={activeLegendCategory} // Use combined active category
        />
      </main>
      {showPanel && selectedElement && (
        <>
          <div
            className={`app-overlay ${showPanel ? 'visible' : ''}`}
            onClick={handleClosePanel}
            aria-hidden="true"
          />
          <ElementDetailPanel
            element={selectedElement}
            onClose={handleClosePanel}
            categoryColors={CATEGORY_COLORS}
            isOpen={showPanel}
          />
        </>
      )}
      <BackToTopButton />
    </div>
  );
}

export default App;