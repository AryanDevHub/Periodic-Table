// src/utils/atomBuilder.js
// Simplified Bohr-model shell filling (2, 8, 8, 18, 18, 32...) — good enough
// for a teaching visualization; not meant to model real subshell exceptions.

const SHELL_CAPACITIES = [2, 8, 8, 18, 18, 32, 32];

export function fillShells(electronCount) {
  const shells = [];
  let remaining = electronCount;
  for (const capacity of SHELL_CAPACITIES) {
    if (remaining <= 0) break;
    const electronsInShell = Math.min(remaining, capacity);
    shells.push(electronsInShell);
    remaining -= electronsInShell;
  }
  return shells;
}

export function getIonCharge(protons, electrons) {
  return protons - electrons;
}

export function describeAtom({ protons, neutrons, electrons, matchedElement }) {
  const charge = getIonCharge(protons, electrons);
  const massNumber = protons + neutrons;

  if (protons === 0) {
    return 'Add a proton to begin building your atom.';
  }

  if (!matchedElement) {
    return `${protons} protons doesn't match any known element yet — keep exploring!`;
  }

  const parts = [`This is ${matchedElement.name} (${matchedElement.symbol}).`];

  if (charge > 0) {
    parts.push(`With ${electrons} electrons vs ${protons} protons, it's a cation with a +${charge} charge.`);
  } else if (charge < 0) {
    parts.push(`With ${electrons} electrons vs ${protons} protons, it's an anion with a ${charge} charge.`);
  } else {
    parts.push(`With equal protons and electrons, it's electrically neutral.`);
  }

  const standardNeutrons = Math.round(
    parseFloat(matchedElement.atomicMass) - matchedElement.number
  );
  if (!Number.isNaN(standardNeutrons) && neutrons !== standardNeutrons) {
    parts.push(
      `Mass number ${massNumber} — this is an isotope (the common form has about ${standardNeutrons} neutrons).`
    );
  } else {
    parts.push(`Mass number: ${massNumber}.`);
  }

  return parts.join(' ');
}