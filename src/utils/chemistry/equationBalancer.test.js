import { describe, it, expect } from 'vitest';
import { balanceEquation } from './equationBalancer';

describe('balanceEquation', () => {
  it('balances a simple already-balanced-ratio equation (water formation)', () => {
    const result = balanceEquation('H2 + O2 -> H2O');
    expect(result.reactantCoeffs).toEqual([2, 1]);
    expect(result.productCoeffs).toEqual([2]);
    expect(result.balancedEquation).toBe('2H2 + O2 -> 2H2O');
  });

  it('balances iron oxidation (rust formation)', () => {
    const result = balanceEquation('Fe + O2 -> Fe2O3');
    expect(result.reactantCoeffs).toEqual([4, 3]);
    expect(result.productCoeffs).toEqual([2]);
  });

  it('balances combustion of propane (multiple products)', () => {
    const result = balanceEquation('C3H8 + O2 -> CO2 + H2O');
    expect(result.reactantCoeffs).toEqual([1, 5]);
    expect(result.productCoeffs).toEqual([3, 4]);
  });

  it('balances ammonia synthesis (Haber process)', () => {
    const result = balanceEquation('N2 + H2 -> NH3');
    expect(result.reactantCoeffs).toEqual([1, 3]);
    expect(result.productCoeffs).toEqual([2]);
  });

  it('balances a thermite-style reaction with multiple reactants and products', () => {
    const result = balanceEquation('Al + Fe3O4 -> Al2O3 + Fe');
    expect(result.reactantCoeffs).toEqual([8, 3]);
    expect(result.productCoeffs).toEqual([4, 9]);
  });

  it('balances equations with parentheses in formulas', () => {
    const result = balanceEquation('Ca(OH)2 + HCl -> CaCl2 + H2O');
    expect(result.reactantCoeffs).toEqual([1, 2]);
    expect(result.productCoeffs).toEqual([1, 2]);
  });

  it('accepts alternate arrow notations', () => {
    const arrowResult = balanceEquation('H2 + O2 => H2O');
    const equalsResult = balanceEquation('H2 + O2 = H2O');
    expect(arrowResult.balancedEquation).toBe(equalsResult.balancedEquation);
  });

  it('leaves an already-balanced equation with coefficient 1 where appropriate', () => {
    const result = balanceEquation('C + O2 -> CO2');
    expect(result.reactantCoeffs).toEqual([1, 1]);
    expect(result.productCoeffs).toEqual([1]);
  });

  it('throws a clear error when an element appears only on one side', () => {
    expect(() => balanceEquation('H2 + O2 -> NaCl')).toThrow(/appears in/);
  });

  it('throws a clear error when the equation has no arrow', () => {
    expect(() => balanceEquation('H2 + O2 H2O')).toThrow(/exactly one/);
  });

  it('throws a clear error when reactants or products are missing', () => {
    expect(() => balanceEquation('-> H2O')).toThrow();
  });
});