import React, { useState, useCallback, useEffect } from 'react';

import PeriodicTable from '../components/PeriodicTable/PeriodicTable';
import ElementDetailPanel from '../components/ElementDetailPanel/ElementDetailPanel';
import Legend from '../components/Legend/Legend';
import BackToTopButton from '../components/BackToTopButton/BackToTopButton';
import ScrollingScientistsSection from '../components/ScrollingScientistsSection/ScrollingScientistsSection';
import FunFacts from '../components/FunFacts/FunFacts';
import Quiz from '../components/Quiz/Quiz';

import { CATEGORY_COLORS, CATEGORY_NAMES } from '../constants';
import styles from './HomePage.module.css';

const HomePage = ({ allElements, filteredElements, scientists, searchTerm }) => {
  const [selectedElement, setSelectedElement] = useState(null);
  const [showPanel, setShowPanel] = useState(false);
  const [hoveredLegendCategory, setHoveredLegendCategory] = useState(null);
  const [selectedLegendCategory, setSelectedLegendCategory] = useState(null);

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
    setSelectedLegendCategory(prev => prev === categoryKey ? null : categoryKey);
    setHoveredLegendCategory(null);
  }, []);

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

  const activeLegendCategory = hoveredLegendCategory || selectedLegendCategory;

  return (
    <div className={styles.homePageContainer}>
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
      
      {showPanel && (
        <div className={`app-overlay ${showPanel ? 'visible' : ''}`} onClick={handleClosePanel} />
      )}
      
      <ElementDetailPanel
        element={selectedElement}
        onClose={handleClosePanel}
        categoryColors={CATEGORY_COLORS}
        isOpen={showPanel}
      />

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