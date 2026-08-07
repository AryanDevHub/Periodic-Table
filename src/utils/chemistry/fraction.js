// src/utils/chemistry/fraction.js
// Minimal exact-arithmetic fraction class used by the equation balancer.
// Floating point would introduce rounding errors during Gaussian elimination,
// which can silently produce wrong coefficients — fractions avoid that.

export function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a || 1;
}

export function lcm(a, b) {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
}

export class Frac {
  constructor(num, den = 1) {
    if (den === 0) throw new Error('Division by zero in fraction.');
    if (den < 0) {
      num = -num;
      den = -den;
    }
    const g = gcd(num, den) || 1;
    this.num = num / g;
    this.den = den / g;
  }

  add(other) {
    return new Frac(this.num * other.den + other.num * this.den, this.den * other.den);
  }

  sub(other) {
    return new Frac(this.num * other.den - other.num * this.den, this.den * other.den);
  }

  mul(other) {
    return new Frac(this.num * other.num, this.den * other.den);
  }

  div(other) {
    return new Frac(this.num * other.den, this.den * other.num);
  }

  isZero() {
    return this.num === 0;
  }
}