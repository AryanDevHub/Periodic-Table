// src/utils/chemistry/reactionLookup.js
// Combines the curated table (highest confidence) with rule-based
// predictions (medium confidence) and a graceful "unknown" fallback.

import { lookupReaction } from '../../data/reactions';
import { applyRules } from './reactionRules';

export function findReaction(elementA, elementB) {
  const curated = lookupReaction(elementA.symbol, elementB.symbol);
  if (curated) {
    return { ...curated, confidence: 'known', type: 'known' };
  }

  const ruleResult = applyRules(elementA, elementB);
  if (ruleResult) {
    if (ruleResult.type === 'no-reaction') {
      return { confidence: 'rule', type: 'no-reaction', explanation: ruleResult.explanation };
    }
    return {
      equation: ruleResult.equation,
      product: ruleResult.product,
      explanation: ruleResult.explanation,
      confidence: 'predicted',
      type: 'predicted',
    };
  }

  return {
    type: 'unknown',
    confidence: 'unknown',
    explanation: `We don't have a known reaction on file for ${elementA.name} and ${elementB.name} yet — this pair may require specific conditions (heat, catalysts, solutions) that go beyond a simple combination.`,
  };
}