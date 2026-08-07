// src/utils/positionExplainer.js
// Generates a short, plain-language explanation of why an element sits
// where it does on the periodic table, derived entirely from data already
// present on the element object — no extra API calls needed.

const CATEGORY_EXPLANATIONS = {
  'alkali-metal':
    'Alkali metals sit in Group 1 because they each have exactly one electron in their outer shell, which they lose easily to form a +1 ion. This makes them extremely reactive.',
  'alkaline-earth-metal':
    'Alkaline earth metals sit in Group 2 because they have two electrons in their outer shell, which they lose to form a +2 ion. They are reactive, but less so than alkali metals.',
  'transition-metal':
    'Transition metals fill the d-block (the middle block of the table) because their outermost electrons occupy d-orbitals. This is why they often form multiple stable ion charges.',
  'post-transition-metal':
    'Post-transition metals sit just after the transition metals because their outer electrons are filling p-orbitals, giving them properties partway between metals and metalloids.',
  metalloid:
    'Metalloids sit along the "staircase" line dividing metals and nonmetals because they share properties of both — for example, conducting electricity better than nonmetals but worse than metals.',
  nonmetal:
    'Nonmetals sit on the right side of the table because their outer shells are close to full, so they tend to gain electrons rather than lose them.',
  halogen:
    'Halogens sit in Group 17 because they have seven electrons in their outer shell — just one short of a full shell — making them highly reactive nonmetals that readily gain an electron.',
  'noble-gas':
    'Noble gases sit in Group 18 because their outer electron shell is completely full, making them extremely stable and mostly unreactive.',
  lanthanide:
    'Lanthanides are pulled out into their own row below the main table because their outer electrons fill f-orbitals — placing them in the main grid would make the table impractically wide.',
  actinide:
    'Actinides sit in the second pulled-out row for the same reason as lanthanides: their electrons fill f-orbitals. Most actinides are radioactive and synthetic.',
  unknown:
    "This element's category isn't fully characterized, often because it's a synthetic, extremely short-lived element that has only been produced in tiny quantities in a lab.",
};

function periodDescription(period) {
  return `It's in Period ${period}, meaning its outermost electrons occupy the ${period}${ordinalSuffix(
    period
  )} electron shell.`;
}

function ordinalSuffix(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

function groupDescription(group) {
  if (group === -1) {
    // Lanthanides/actinides use group -1 in your data model
    return null;
  }
  return `It's in Group ${group}, which groups it with elements that share similar outer-electron behavior and chemical reactivity.`;
}

export function explainPosition(element) {
  const categoryText =
    CATEGORY_EXPLANATIONS[element.category] || CATEGORY_EXPLANATIONS.unknown;
  const periodText = periodDescription(element.period);
  const groupText = groupDescription(element.group);

  return [categoryText, groupText, periodText].filter(Boolean).join(' ');
}