// src/pages/HomePage.jsx (Final and Complete Version)

import React, { useState, useCallback, useRef, useEffect } from 'react';

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
  // State for page interactivity
  const [selectedElement, setSelectedElement] = useState(null);
  const [showPanel, setShowPanel] = useState(false);
  const [hoveredLegendCategory, setHoveredLegendCategory] = useState(null);
  const [selectedLegendCategory, setSelectedLegendCategory] = useState(null);
  
  // Ref for the scrolling container
  const scrollContainerRef = useRef(null);

  // Event Handlers
  const handleElementClick = useCallback((element) => {
    setSelectedElement(element);
    setShowPanel(true);
  }, []);

  const handleClosePanel = useCallback(() => {
    setShowPanel(false);
    setTimeout(() => setSelectedElement(null), 300);
  }, []);
  
  const handleLegendCategoryHover = useCallback((categoryKey) => setHoveredLegendCategory(categoryKey), []);
  
  const handleLegendCategoryClick = useCallback((categoryKey) => {
    setSelectedLegendCategory(prev => (prev === categoryKey ? null : categoryKey));
    setHoveredLegendCategory(null);
  }, []);

  // Effect to lock body scroll when panel is open
  useEffect(() => {
    if (showPanel) {
      document.body.classList.add('body-no-scroll');
    } else {
      document.body.classList.remove('body-no-scroll');
    }
    return () => {
      document.body.classList.remove('body-no-scroll');
    };
  }, [showPanel]);

  // Effect to center the table scroll on initial load
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollWidth = container.scrollWidth;
      const clientWidth = container.clientWidth;
      container.scrollLeft = (scrollWidth - clientWidth) / 2;
    }
  }, []);

  const activeLegendCategory = hoveredLegendCategory || selectedLegendCategory;

  return (
    <div className={styles.homePageContainer}>
      
      {/* New non-scrolling container for the top section */}
      <div className={styles.tableSectionContainer}>
        
        {/* The Legend is now outside of the scrolling area and will remain stationary */}
        <Legend
          categoryColors={CATEGORY_COLORS}
          categoryNames={CATEGORY_NAMES}
          onCategoryHover={handleLegendCategoryHover}
          onCategoryClick={handleLegendCategoryClick}
          hoveredCategoryKey={hoveredLegendCategory}
          selectedCategoryKey={selectedLegendCategory}
        />

        {/* This div is the container that will scroll horizontally */}
        <div ref={scrollContainerRef} className={styles.interactiveArea}>
          <div className={styles.tableArea}>
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
      </div>
      
      {/* Overlay and Panel are rendered at the top level to slide over everything */}
      {showPanel && (
        <div className={`app-overlay ${showPanel ? 'visible' : ''}`} onClick={handleClosePanel} />
      )}
      
      <ElementDetailPanel
        element={selectedElement}
        onClose={handleClosePanel}
        categoryColors={CATEGORY_COLORS}
        isOpen={showPanel}
      />

      {/* Static content sections below */}
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