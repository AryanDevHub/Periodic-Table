// src/utils/chemistry/formulaParser.js
// Parses a chemical formula string (e.g. "Ca(OH)2") into
// { Ca: 1, O: 2, H: 2 }. Supports nested parentheses with multipliers.

export function parseFormula(formula) {
  const cleaned = formula.replace(/\s/g, '');
  let i = 0;

  function parseGroup() {
    const counts = {};
    while (i < cleaned.length && cleaned[i] !== ')') {
      if (cleaned[i] === '(') {
        i++; // skip '('
        const inner = parseGroup();
        if (cleaned[i] !== ')') {
          throw new Error(`Unmatched "(" in formula "${formula}".`);
        }
        i++; // skip ')'
        let multStr = '';
        while (i < cleaned.length && /[0-9]/.test(cleaned[i])) {
          multStr += cleaned[i];
          i++;
        }
        const mult = multStr ? parseInt(multStr, 10) : 1;
        for (const el in inner) {
          counts[el] = (counts[el] || 0) + inner[el] * mult;
        }
      } else {
        const match = /^[A-Z][a-z]?/.exec(cleaned.slice(i));
        if (!match) {
          throw new Error(`Could not parse formula "${formula}" near position ${i}.`);
        }
        const symbol = match[0];
        i += symbol.length;
        let numStr = '';
        while (i < cleaned.length && /[0-9]/.test(cleaned[i])) {
          numStr += cleaned[i];
          i++;
        }
        const count = numStr ? parseInt(numStr, 10) : 1;
        counts[symbol] = (counts[symbol] || 0) + count;
      }
    }
    return counts;
  }

  if (!cleaned) {
    throw new Error('Formula cannot be empty.');
  }

  const result = parseGroup();

  if (i !== cleaned.length) {
    throw new Error(`Unexpected character in formula "${formula}" at position ${i}.`);
  }

  return result;
}