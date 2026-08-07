import { describe, it, expect } from 'vitest';
import { parseFormula } from './formulaParser';

describe('parseFormula', () => {
  it('parses a simple single-element formula', () => {
    expect(parseFormula('H2')).toEqual({ H: 2 });
  });

  it('parses a simple two-element formula', () => {
    expect(parseFormula('H2O')).toEqual({ H: 2, O: 1 });
  });

  it('parses a formula with no explicit subscript as count 1', () => {
    expect(parseFormula('NaCl')).toEqual({ Na: 1, Cl: 1 });
  });

  it('parses formulas with parentheses and a multiplier', () => {
    expect(parseFormula('Ca(OH)2')).toEqual({ Ca: 1, O: 2, H: 2 });
  });

  it('parses formulas with nested parentheses', () => {
    expect(parseFormula('Mg3(PO4)2')).toEqual({ Mg: 3, P: 2, O: 8 });
  });

  it('combines repeated elements across the formula', () => {
    expect(parseFormula('C6H12O6')).toEqual({ C: 6, H: 12, O: 6 });
  });

  it('handles multi-letter element symbols correctly', () => {
    expect(parseFormula('NaOH')).toEqual({ Na: 1, O: 1, H: 1 });
    expect(parseFormula('MgCl2')).toEqual({ Mg: 1, Cl: 2 });
  });

  it('throws on an empty formula', () => {
    expect(() => parseFormula('')).toThrow();
  });

  it('throws on an unmatched parenthesis', () => {
    expect(() => parseFormula('Ca(OH2')).toThrow();
  });

  it('throws on an unparseable formula', () => {
    expect(() => parseFormula('123')).toThrow();
  });

  it('ignores whitespace in the input', () => {
    expect(parseFormula(' H2 O ')).toEqual({ H: 2, O: 1 });
  });
});