// src/utils/chemistry/equationBalancer.js
// Balances a chemical equation using linear algebra: builds a matrix of
// element counts per compound, solves the homogeneous system via Gaussian
// elimination (exact fractions), then scales the null-space solution to the
// smallest positive integers.

import { Frac, gcd, lcm } from './fraction';
import { parseFormula } from './formulaParser';

function solveHomogeneous(matrix, numVars) {
  const rows = matrix.length;
  const m = matrix.map((row) => row.slice());
  const pivotCols = [];
  let pivotRow = 0;

  for (let col = 0; col < numVars && pivotRow < rows; col++) {
    let sel = -1;
    for (let r = pivotRow; r < rows; r++) {
      if (!m[r][col].isZero()) {
        sel = r;
        break;
      }
    }
    if (sel === -1) continue;

    [m[pivotRow], m[sel]] = [m[sel], m[pivotRow]];

    const pivotVal = m[pivotRow][col];
    m[pivotRow] = m[pivotRow].map((v) => v.div(pivotVal));

    for (let r = 0; r < rows; r++) {
      if (r !== pivotRow && !m[r][col].isZero()) {
        const factor = m[r][col];
        m[r] = m[r].map((v, c) => v.sub(factor.mul(m[pivotRow][c])));
      }
    }

    pivotCols.push(col);
    pivotRow++;
  }

  const freeCols = [];
  for (let c = 0; c < numVars; c++) {
    if (!pivotCols.includes(c)) freeCols.push(c);
  }

  if (freeCols.length === 0) {
    throw new Error(
      'This equation cannot be balanced — check that the same elements appear on both sides.'
    );
  }

  const solution = new Array(numVars).fill(null);
  solution[freeCols[0]] = new Frac(1);
  for (const c of freeCols.slice(1)) {
    solution[c] = new Frac(0);
  }

  for (let i = 0; i < pivotCols.length; i++) {
    const col = pivotCols[i];
    const row = m[i];
    let val = new Frac(0);
    for (let c = 0; c < numVars; c++) {
      if (c !== col && solution[c] !== null) {
        val = val.sub(row[c].mul(solution[c]));
      }
    }
    solution[col] = val;
  }

  const denominators = solution.map((f) => f.den);
  const lcmAll = denominators.reduce((a, b) => lcm(a, b), 1);
  let intCoeffs = solution.map((f) => f.num * (lcmAll / f.den));

  if (intCoeffs.every((v) => v <= 0)) {
    intCoeffs = intCoeffs.map((v) => -v);
  }

  if (intCoeffs.some((v) => v <= 0)) {
    throw new Error(
      'Could not find a balanced form with all-positive coefficients for this equation.'
    );
  }

  const g = intCoeffs.reduce((a, b) => gcd(a, b));
  return intCoeffs.map((v) => v / g);
}

export function balanceEquation(equationStr) {
  const sides = equationStr.split(/->|=>|→|=/);
  if (sides.length !== 2) {
    throw new Error('Equation must contain exactly one "->" arrow separating reactants and products.');
  }

  const [reactantsStr, productsStr] = sides;
  const reactants = reactantsStr.split('+').map((s) => s.trim()).filter(Boolean);
  const products = productsStr.split('+').map((s) => s.trim()).filter(Boolean);

  if (reactants.length === 0 || products.length === 0) {
    throw new Error('Equation must have at least one reactant and one product.');
  }

  const compounds = [...reactants, ...products];
  const parsedCompounds = compounds.map(parseFormula);

  const reactantElements = new Set(parsedCompounds.slice(0, reactants.length).flatMap((c) => Object.keys(c)));
  const productElements = new Set(parsedCompounds.slice(reactants.length).flatMap((c) => Object.keys(c)));

  for (const el of reactantElements) {
    if (!productElements.has(el)) {
      throw new Error(`Element "${el}" appears in reactants but not in products.`);
    }
  }
  for (const el of productElements) {
    if (!reactantElements.has(el)) {
      throw new Error(`Element "${el}" appears in products but not in reactants.`);
    }
  }

  const elements = Array.from(new Set(parsedCompounds.flatMap((c) => Object.keys(c))));
  const numReactants = reactants.length;

  const matrix = elements.map((el) =>
    parsedCompounds.map((c, colIdx) => {
      const count = c[el] || 0;
      return new Frac(colIdx < numReactants ? count : -count);
    })
  );

  const coefficients = solveHomogeneous(matrix, compounds.length);

  const formatSide = (list, coeffs) =>
    list.map((formula, idx) => (coeffs[idx] === 1 ? formula : `${coeffs[idx]}${formula}`)).join(' + ');

  const reactantCoeffs = coefficients.slice(0, numReactants);
  const productCoeffs = coefficients.slice(numReactants);

  return {
    balancedEquation: `${formatSide(reactants, reactantCoeffs)} -> ${formatSide(products, productCoeffs)}`,
    reactants,
    products,
    reactantCoeffs,
    productCoeffs,
  };
}