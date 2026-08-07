import { describe, it, expect } from 'vitest';
import { Frac, gcd, lcm } from './fraction';

describe('gcd', () => {
  it('finds the greatest common divisor of two positive numbers', () => {
    expect(gcd(12, 18)).toBe(6);
    expect(gcd(17, 5)).toBe(1);
  });

  it('handles zero correctly', () => {
    expect(gcd(0, 5)).toBe(5);
    expect(gcd(5, 0)).toBe(5);
  });

  it('handles negative inputs by taking absolute values', () => {
    expect(gcd(-12, 18)).toBe(6);
  });
});

describe('lcm', () => {
  it('finds the least common multiple of two numbers', () => {
    expect(lcm(4, 6)).toBe(12);
    expect(lcm(3, 5)).toBe(15);
  });

  it('returns 0 if either input is 0', () => {
    expect(lcm(0, 5)).toBe(0);
  });
});

describe('Frac', () => {
  it('reduces fractions to lowest terms on construction', () => {
    const f = new Frac(4, 8);
    expect(f.num).toBe(1);
    expect(f.den).toBe(2);
  });

  it('normalizes negative denominators', () => {
    const f = new Frac(3, -4);
    expect(f.num).toBe(-3);
    expect(f.den).toBe(4);
  });

  it('throws on division by zero denominator', () => {
    expect(() => new Frac(1, 0)).toThrow();
  });

  it('adds fractions correctly', () => {
    const result = new Frac(1, 2).add(new Frac(1, 3));
    expect(result.num).toBe(5);
    expect(result.den).toBe(6);
  });

  it('subtracts fractions correctly', () => {
    const result = new Frac(3, 4).sub(new Frac(1, 4));
    expect(result.num).toBe(1);
    expect(result.den).toBe(2);
  });

  it('multiplies fractions correctly', () => {
    const result = new Frac(2, 3).mul(new Frac(3, 4));
    expect(result.num).toBe(1);
    expect(result.den).toBe(2);
  });

  it('divides fractions correctly', () => {
    const result = new Frac(1, 2).div(new Frac(1, 4));
    expect(result.num).toBe(2);
    expect(result.den).toBe(1);
  });

  it('correctly identifies zero', () => {
    expect(new Frac(0, 5).isZero()).toBe(true);
    expect(new Frac(1, 5).isZero()).toBe(false);
  });
});