// src/pages/ComparePage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { apiClient } from '../api/apiClient';
import { CATEGORY_COLORS } from '../constants';
import styles from './ComparePage.module.css';

const MAX_COMPARE = 3;

const PROPERTY_ROWS = [
  { label: 'Atomic Number', key: 'number' },
  { label: 'Atomic Mass', key: 'atomicMass', unit: 'u' },
  { label: 'Category', key: 'category', format: (v) => v.replace(/-/g, ' ') },
  { label: 'State at STP', key: 'state' },
  { label: 'Electron Config', key: 'electronConfig' },
  { label: 'Electronegativity', key: 'electronegativity' },
  { label: 'Atomic Radius', key: 'atomicRadius', unit: 'pm' },
  { label: 'Ionization Energy', key: 'ionizationEnergy', unit: 'kJ/mol' },
  { label: 'Electron Affinity', key: 'electronAffinity', unit: 'kJ/mol' },
  { label: 'Density', key: 'density', unit: 'g/cm³' },
  { label: 'Melting Point', key: 'meltingPoint', unit: 'K' },
  { label: 'Boiling Point', key: 'boilingPoint', unit: 'K' },
];

const ComparePage = () => {
  const [allElements, setAllElements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    let isMounted = true;
    apiClient
      .get('/elements')
      .then((data) => {
        if (!isMounted) return;
        setAllElements([...data].sort((a, b) => a.number - b.number));
      })
      .catch((err) => {
        console.error('Failed to load elements for comparison:', err);
        if (isMounted) setLoadError('Could not load element data.');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const selectedElements = useMemo(
    () => selectedNumbers.map((num) => allElements.find((el) => el.number === num)).filter(Boolean),
    [selectedNumbers, allElements]
  );

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return allElements;
    const lower = searchTerm.toLowerCase();
    return allElements.filter(
      (el) =>
        el.name.toLowerCase().includes(lower) ||
        el.symbol.toLowerCase().includes(lower) ||
        String(el.number).includes(lower)
    );
  }, [searchTerm, allElements]);

  const handleAddElement = (number) => {
    if (selectedNumbers.includes(number)) return;
    if (selectedNumbers.length >= MAX_COMPARE) return;
    setSelectedNumbers((prev) => [...prev, number]);
    setSearchTerm('');
  };

  const handleRemoveElement = (number) => {
    setSelectedNumbers((prev) => prev.filter((n) => n !== number));
  };

  const formatValue = (element, row) => {
    const raw = element[row.key];
    if (raw === null || typeof raw === 'undefined' || raw === 'Unknown') return 'Unknown';
    const formatted = row.format ? row.format(raw) : raw;
    return row.unit ? `${formatted} ${row.unit}` : formatted;
  };

  if (isLoading) {
    return <div className="status-message">Loading elements...</div>;
  }

  if (loadError) {
    return <div className="status-message" role="alert">{loadError}</div>;
  }

  return (
    <div className={styles.comparePage}>
      <header className={styles.pageHeader}>
        <h1>Compare Elements</h1>
        <p>Pick up to {MAX_COMPARE} elements to see their properties side by side.</p>
      </header>

      <div className={styles.selectorArea}>
        <div className={styles.selectedChips}>
          {selectedElements.map((el) => (
            <div
              key={el.number}
              className={styles.chip}
              style={{ backgroundColor: CATEGORY_COLORS[el.category] || CATEGORY_COLORS.unknown }}
            >
              <span>{el.symbol} — {el.name}</span>
              <button
                onClick={() => handleRemoveElement(el.number)}
                aria-label={`Remove ${el.name} from comparison`}
                className={styles.removeChipButton}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          ))}
          {selectedElements.length === 0 && (
            <p className={styles.emptyHint}>No elements selected yet.</p>
          )}
        </div>

        {selectedNumbers.length < MAX_COMPARE && (
          <div className={styles.searchWrapper}>
            <input
              type="search"
              placeholder="Search an element to add..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
              aria-label="Search elements to compare"
            />
            {searchTerm && (
              <div className={styles.suggestions}>
                {filteredOptions.slice(0, 8).map((el) => (
                  <button
                    key={el.number}
                    className={styles.suggestionItem}
                    onClick={() => handleAddElement(el.number)}
                    disabled={selectedNumbers.includes(el.number)}
                  >
                    <span
                      className={styles.suggestionSwatch}
                      style={{ backgroundColor: CATEGORY_COLORS[el.category] || CATEGORY_COLORS.unknown }}
                    ></span>
                    {el.number}. {el.name} ({el.symbol})
                  </button>
                ))}
                {filteredOptions.length === 0 && (
                  <p className={styles.noResults}>No matching elements.</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {selectedElements.length >= 2 ? (
        <div className={styles.tableWrapper}>
          <table className={styles.compareTable}>
            <thead>
              <tr>
                <th>Property</th>
                {selectedElements.map((el) => (
                  <th key={el.number}>
                    <div
                      className={styles.tableHeaderCell}
                      style={{ borderColor: CATEGORY_COLORS[el.category] || CATEGORY_COLORS.unknown }}
                    >
                      <span className={styles.headerSymbol}>{el.symbol}</span>
                      <span className={styles.headerName}>{el.name}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PROPERTY_ROWS.map((row) => (
                <tr key={row.key}>
                  <td className={styles.rowLabel}>{row.label}</td>
                  {selectedElements.map((el) => (
                    <td key={el.number} style={{ textTransform: row.key === 'category' ? 'capitalize' : 'none' }}>
                      {formatValue(el, row)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className={styles.emptyHint}>Select at least 2 elements to see a comparison.</p>
      )}
    </div>
  );
};

export default ComparePage;