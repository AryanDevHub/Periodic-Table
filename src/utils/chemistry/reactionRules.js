// src/utils/chemistry/reactionRules.js
const NOBLE_GASES = ['He', 'Ne', 'Ar', 'Kr', 'Xe', 'Rn'];
const ALKALI_METALS = ['Li', 'Na', 'K', 'Rb', 'Cs', 'Fr'];
const ALKALINE_EARTH_METALS = ['Be', 'Mg', 'Ca', 'Sr', 'Ba', 'Ra'];
const HALOGENS = ['F', 'Cl', 'Br', 'I', 'At', 'Ts'];

function isMetal(category) {
  return [
    'alkali-metal',
    'alkaline-earth-metal',
    'transition-metal',
    'post-transition-metal',
    'lanthanide',
    'actinide',
  ].includes(category);
}

export function applyRules(elementA, elementB) {
  const { symbol: symA, category: catA } = elementA;
  const { symbol: symB, category: catB } = elementB;

  if (NOBLE_GASES.includes(symA) || NOBLE_GASES.includes(symB)) {
    const nobleGas = NOBLE_GASES.includes(symA) ? elementA : elementB;
    return {
      type: 'no-reaction',
      explanation: `${nobleGas.name} is a noble gas — its outer electron shell is already full, so it doesn't readily form bonds with other elements.`,
    };
  }

  if (isMetal(catA) && isMetal(catB)) {
    return {
      type: 'no-reaction',
      explanation: `${elementA.name} and ${elementB.name} are both metals — rather than reacting chemically, metals typically mix to form an alloy (a physical blend), not a new compound.`,
    };
  }

  if (
    (ALKALI_METALS.includes(symA) && HALOGENS.includes(symB)) ||
    (ALKALI_METALS.includes(symB) && HALOGENS.includes(symA))
  ) {
    const metal = ALKALI_METALS.includes(symA) ? elementA : elementB;
    const halogen = HALOGENS.includes(symA) ? elementA : elementB;
    return {
      type: 'predicted',
      equation: `2${metal.symbol} + ${halogen.symbol}2 -> 2${metal.symbol}${halogen.symbol}`,
      product: `${metal.name} ${halogen.name.replace(/ine$/, 'ide')} (${metal.symbol}${halogen.symbol})`,
      explanation: `${metal.name} (Group 1, +1 charge) and ${halogen.name} (Group 17, -1 charge) combine in a 1:1 ratio to form a simple ionic salt — similar to how sodium and chlorine form table salt.`,
    };
  }

  if (
    (ALKALINE_EARTH_METALS.includes(symA) && HALOGENS.includes(symB)) ||
    (ALKALINE_EARTH_METALS.includes(symB) && HALOGENS.includes(symA))
  ) {
    const metal = ALKALINE_EARTH_METALS.includes(symA) ? elementA : elementB;
    const halogen = HALOGENS.includes(symA) ? elementA : elementB;
    return {
      type: 'predicted',
      equation: `${metal.symbol} + ${halogen.symbol}2 -> ${metal.symbol}${halogen.symbol}2`,
      product: `${metal.name} ${halogen.name.replace(/ine$/, 'ide')} (${metal.symbol}${halogen.symbol}2)`,
      explanation: `${metal.name} (Group 2, +2 charge) needs two ${halogen.name} atoms (each -1 charge) to balance charge, forming this ionic salt.`,
    };
  }

  return null;
}