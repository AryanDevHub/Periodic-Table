// src/pages/ReactionLabPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { apiClient } from '../api/apiClient';
import { CATEGORY_COLORS } from '../constants';
import { findReaction } from '../utils/chemistry/reactionLookup';
import styles from './ReactionLabPage.module.css';

const ReactionLabPage = () => {
  const [allElements, setAllElements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [elementA, setElementA] = useState(null);
  const [elementB, setElementB] = useState(null);
  const [searchA, setSearchA] = useState('');
  const [searchB, setSearchB] = useState('');
  const [isReacting, setIsReacting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    let isMounted = true;
    apiClient
      .get('/elements')
      .then((data) => {
        if (isMounted) setAllElements([...data].sort((a, b) => a.number - b.number));
      })
      .catch((err) => {
        console.error('Failed to load elements:', err);
        if (isMounted) setLoadError('Could not load element data.');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredA = useMemo(
    () => filterElements(allElements, searchA, elementB),
    [allElements, searchA, elementB]
  );
  const filteredB = useMemo(
    () => filterElements(allElements, searchB, elementA),
    [allElements, searchB, elementA]
  );

  function filterElements(list, term, exclude) {
    let pool = list;
    if (exclude) pool = pool.filter((el) => el.number !== exclude.number);
    if (!term) return pool.slice(0, 8);
    const lower = term.toLowerCase();
    return pool
      .filter((el) => el.name.toLowerCase().includes(lower) || el.symbol.toLowerCase().includes(lower))
      .slice(0, 8);
  }

  const handleReact = () => {
    if (!elementA || !elementB) return;
    setIsReacting(true);
    setResult(null);
    // Small delay purely for the visual "merge" animation to play out.
    setTimeout(() => {
      const reaction = findReaction(elementA, elementB);
      setResult(reaction);
      setIsReacting(false);
    }, 900);
  };

  const handleReset = () => {
    setElementA(null);
    setElementB(null);
    setSearchA('');
    setSearchB('');
    setResult(null);
  };

  if (isLoading) return <div className="status-message">Loading...</div>;
  if (loadError) return <div className="status-message" role="alert">{loadError}</div>;

  return (
    <div className={styles.reactionLabPage}>
      <header className={styles.pageHeader}>
        <h1>Reaction Lab</h1>
        <p>Pick two elements and see what happens when they react.</p>
      </header>

      <div className={styles.pickerRow}>
        <ElementPicker
          label="Element A"
          selected={elementA}
          onSelect={setElementA}
          searchTerm={searchA}
          onSearchChange={setSearchA}
          options={filteredA}
        />

        <div className={styles.plusSign}>
          <div className={`${styles.reactVisual} ${isReacting ? styles.reacting : ''}`}>
            {elementA && (
              <span
                className={styles.reactOrb}
                style={{ backgroundColor: CATEGORY_COLORS[elementA.category] }}
              >
                {elementA.symbol}
              </span>
            )}
            <span className={styles.plusIcon}>+</span>
            {elementB && (
              <span
                className={styles.reactOrb}
                style={{ backgroundColor: CATEGORY_COLORS[elementB.category] }}
              >
                {elementB.symbol}
              </span>
            )}
          </div>
        </div>

        <ElementPicker
          label="Element B"
          selected={elementB}
          onSelect={setElementB}
          searchTerm={searchB}
          onSearchChange={setSearchB}
          options={filteredB}
        />
      </div>

      <div className={styles.actions}>
        <button
          className={styles.reactButton}
          onClick={handleReact}
          disabled={!elementA || !elementB || isReacting}
        >
          {isReacting ? 'Reacting...' : 'React!'}
        </button>
        {(elementA || elementB || result) && (
          <button className={styles.resetButton} onClick={handleReset}>
            Reset
          </button>
        )}
      </div>

      {result && <ResultCard result={result} />}
    </div>
  );
};

const ElementPicker = ({ label, selected, onSelect, searchTerm, onSearchChange, options }) => (
  <div className={styles.pickerColumn}>
    <span className={styles.pickerLabel}>{label}</span>
    {selected ? (
      <div className={styles.selectedCard} style={{ borderColor: CATEGORY_COLORS[selected.category] }}>
        <span className={styles.selectedSymbol}>{selected.symbol}</span>
        <span className={styles.selectedName}>{selected.name}</span>
        <button
          className={styles.changeButton}
          onClick={() => onSelect(null)}
          aria-label={`Change ${label}`}
        >
          Change
        </button>
      </div>
    ) : (
      <div className={styles.pickerSearch}>
        <input
          type="search"
          placeholder="Search element..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className={styles.pickerInput}
        />
        <div className={styles.pickerOptions}>
          {options.map((el) => (
            <button key={el.number} className={styles.pickerOption} onClick={() => onSelect(el)}>
              <span
                className={styles.optionSwatch}
                style={{ backgroundColor: CATEGORY_COLORS[el.category] }}
              ></span>
              {el.symbol} — {el.name}
            </button>
          ))}
        </div>
      </div>
    )}
  </div>
);

const ResultCard = ({ result }) => {
  if (result.type === 'no-reaction') {
    return (
      <div className={`${styles.resultCard} ${styles.noReaction}`}>
        <h3>No Reaction</h3>
        <p>{result.explanation}</p>
      </div>
    );
  }

  if (result.type === 'unknown') {
    return (
      <div className={`${styles.resultCard} ${styles.unknownReaction}`}>
        <h3>Not in our database yet</h3>
        <p>{result.explanation}</p>
      </div>
    );
  }

  return (
    <div className={`${styles.resultCard} ${styles.knownReaction}`}>
      {result.confidence === 'predicted' && (
        <span className={styles.predictedTag}>Predicted from general rules</span>
      )}
      <h3>{result.product}</h3>
      <p className={styles.equationText}>{result.equation}</p>
      <p>{result.explanation}</p>
    </div>
  );
};

export default ReactionLabPage;