// src/pages/BalancerPage.jsx

import React, { useState } from 'react';
import { balanceEquation } from '../utils/chemistry/equationBalancer';
import styles from './BalancerPage.module.css';

const EXAMPLES = [
  'H2 + O2 -> H2O',
  'Fe + O2 -> Fe2O3',
  'C3H8 + O2 -> CO2 + H2O',
  'N2 + H2 -> NH3',
  'Al + Fe3O4 -> Al2O3 + Fe',
  'Ca(OH)2 + HCl -> CaCl2 + H2O',
];

const BalancerPage = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleBalance = (equationText) => {
    const text = equationText !== undefined ? equationText : input;
    setError(null);
    setResult(null);
    try {
      const balanced = balanceEquation(text);
      setResult(balanced);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleExampleClick = (example) => {
    setInput(example);
    handleBalance(example);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleBalance();
  };

  return (
    <div className={styles.balancerPage}>
      <header className={styles.pageHeader}>
        <h1>Equation Balancer</h1>
        <p>Type an unbalanced chemical equation and we'll balance it instantly.</p>
      </header>

      <form onSubmit={handleSubmit} className={styles.inputForm}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. Fe + O2 -> Fe2O3"
          className={styles.equationInput}
          aria-label="Chemical equation to balance"
        />
        <button type="submit" className={styles.balanceButton}>
          Balance
        </button>
      </form>

      <div className={styles.examples}>
        <span className={styles.examplesLabel}>Try:</span>
        {EXAMPLES.map((ex) => (
          <button key={ex} className={styles.exampleChip} onClick={() => handleExampleClick(ex)}>
            {ex}
          </button>
        ))}
      </div>

      {error && (
        <div className={styles.errorBox} role="alert">
          {error}
        </div>
      )}

      {result && (
        <div className={styles.resultBox}>
          <div className={styles.balancedEquation}>{formatWithCoefficients(result)}</div>
        </div>
      )}
    </div>
  );
};

// Renders coefficients as subtle superscript-style prefixes for visual clarity.
function formatWithCoefficients(result) {
  const { reactants, products, reactantCoeffs, productCoeffs } = result;

  const renderSide = (list, coeffs) =>
    list.map((formula, idx) => (
      <span key={idx} className={styles.compoundTerm}>
        {coeffs[idx] !== 1 && <span className={styles.coefficient}>{coeffs[idx]}</span>}
        <span className={styles.formula}>{formatFormulaSubscripts(formula)}</span>
        {idx < list.length - 1 && <span className={styles.plus}> + </span>}
      </span>
    ));

  return (
    <>
      {renderSide(reactants, reactantCoeffs)}
      <span className={styles.arrow}> → </span>
      {renderSide(products, productCoeffs)}
    </>
  );
}

// Turns "H2O" into H<sub>2</sub>O for proper chemical notation display.
function formatFormulaSubscripts(formula) {
  const parts = formula.split(/([0-9]+)/);
  return parts.map((part, i) =>
    /^[0-9]+$/.test(part) ? <sub key={i}>{part}</sub> : <span key={i}>{part}</span>
  );
}

export default BalancerPage;