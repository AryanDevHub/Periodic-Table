// src/pages/HomePage.jsx (Final and Complete Version)

import React, { useState, useCallback, useEffect } from 'react';

// Component Imports
import PeriodicTable from '../components/PeriodicTable/PeriodicTable';
import ElementDetailPanel from '../components/ElementDetailPanel/ElementDetailPanel';
import Legend from '../components/Legend/Legend';
import BackToTopButton from '../components/BackToTopButton/BackToTopButton';
import ScrollingScientistsSection from '../components/ScrollingScientistsSection/ScrollingScientistsSection';
import FunFacts from '../components/FunFacts/FunFacts';
import Quiz from '../components/Quiz/Quiz';

// Constants and Styles
import { CATEGORY_COLORS, CATEGORY_NAMES } from '../constants';
import styles from './HomePage.module.css';

const HomePage = ({ allElements, filteredElements, scientists, searchTerm }) => {
  // --- State for page interactivity ---
  const [selectedElement, setSelectedElement] = useState(null);
  const [showPanel, setShowPanel] = useState(false);
  const [hoveredLegendCategory, setHoveredLegendCategory] = useState(null);
  const [selectedLegendCategory, setSelectedLegendCategory] = useState(null);

  // --- Event Handlers ---
  const handleElementClick = useCallback((element) => {
    setSelectedElement(element);
    setShowPanel(true);
  }, []);

  const handleClosePanel = useCallback(() => {
    setShowPanel(false);
    // Let the panel animate out before clearing the element data
    setTimeout(() => setSelectedElement(null), 300);
  }, []);
  
  const handleLegendCategoryHover = useCallback((categoryKey) => setHoveredLegendCategory(categoryKey), []);
  
  const handleLegendCategoryClick = useCallback((categoryKey) => {
    setSelectedLegendCategory(prev => (prev === categoryKey ? null : categoryKey));
    setHoveredLegendCategory(null);
  }, []);

  // Effect to prevent the body from scrolling when the side panel is open
  useEffect(() => {
    if (showPanel) {
      document.body.classList.add('body-no-scroll');
    } else {
      document.body.classList.remove('body-no-scroll');
    }
    // Cleanup function to ensure the class is removed if the component unmounts
    return () => {
      document.body.classList.remove('body-no-scroll');
    };
  }, [showPanel]);

  const activeLegendCategory = hoveredLegendCategory || selectedLegendCategory;

  return (
    <div className={styles.homePageContainer}>
      
      {/* This div is the container that will scroll horizontally on small screens */}
      <div className={styles.interactiveArea}>
        <div className={styles.tableArea}>
          <Legend
            categoryColors={CATEGORY_COLORS}
            categoryNames={CATEGORY_NAMES}
            onCategoryHover={handleLegendCategoryHover}
            onCategoryClick={handleLegendCategoryClick}
            hoveredCategoryKey={hoveredLegendCategory}
            selectedCategoryKey={selectedLegendCategory}
          />
          <PeriodicTable
            elements={filteredElements}
            onElementClick={handleElementClick}
            categoryColors={CATEGORY_COLORS}
            allElements={allElements}
            searchTerm={searchTerm}
            activeLegendCategory={activeLegendCategory}
          />
        </div>
      </div>
      
      {/* The overlay and panel are rendered outside the interactiveArea to slide over it */}
      {showPanel && (
        <div className={`app-overlay ${showPanel ? 'visible' : ''}`} onClick={handleClosePanel} />
      )}
      
      <ElementDetailPanel
        element={selectedElement}
        onClose={handleClosePanel}
        categoryColors={CATEGORY_COLORS}
        isOpen={showPanel}
      />

      {/* Static content sections below the interactive table */}
      <div className={styles.fullWidthSections}>
        <FunFacts />
        <Quiz allElements={allElements} />
        <ScrollingScientistsSection scientists={scientists} />
      </div>

      <BackToTopButton />
    </div>
  );
};

export default HomePage;