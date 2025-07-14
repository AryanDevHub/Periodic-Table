// src/components/FunFacts/FunFacts.jsx

// What: Importing React and its state/effect hooks.
// Why: We need to manage which fact is currently displayed and handle the cycling of facts.
import React, { useState, useEffect } from 'react';
import styles from './FunFacts.module.css';

// What: A predefined list of fun facts.
// Why: For this feature, we can hardcode the data directly in the component.
// For a larger app, this could be fetched from an API.
const funFacts = [
  "The only letter not in the periodic table is 'J'.",
  "Gallium is a metal that would melt in your hand. Its melting point is 29.76 °C (85.58 °F).",
  "Francium is the rarest element on Earth. It's estimated that there is only about 20-30 grams of it in the Earth's crust at any one time.",
  "Oxygen is the most abundant element in the Earth's crust, water, and atmosphere (about 49.5%).",
  "Although oxygen gas is colorless, the liquid and solid forms of oxygen are blue.",
  "The word 'Helium' comes from the Greek word 'helios', meaning sun. It was first detected as a new spectral line signature in sunlight.",
  "Astatine is the second rarest naturally occurring element. The total amount in Earth’s crust is estimated to be less than a single gram.",
  "The only two non-silvery metals are gold and copper."
];

const FunFacts = () => {
  // What: State to keep track of the index of the currently displayed fact.
  // Why: This allows us to cycle through the `funFacts` array.
  const [currentFactIndex, setCurrentFactIndex] = useState(0);

  // What: A side effect that runs on a timer.
  // Why: This creates the automatic cycling effect, showing a new fact every few seconds.
  useEffect(() => {
    // What: A timer that calls a function after a set interval.
    // Why: `setInterval` is a browser API that repeatedly executes a function with a fixed time delay between each call.
    const timer = setInterval(() => {
      // What: We update the state using a function to get the previous index.
      // Why: This is the safest way to update state that depends on the previous state.
      // The modulo operator (%) ensures the index wraps around to 0 when it reaches the end of the array.
      setCurrentFactIndex(prevIndex => (prevIndex + 1) % funFacts.length);
    }, 7000); // 7000ms = 7 seconds

    // What: A cleanup function.
    // Why: It's crucial to clear the interval when the component is unmounted (e.g., user navigates away).
    // If we don't, it will continue running in the background, causing memory leaks.
    return () => clearInterval(timer);
  }, []); // The empty dependency array `[]` means this effect runs only once when the component mounts.

  return (
    <section className={styles.funFactsSection}>
      <div className={styles.icon}>
        <i className="fas fa-flask"></i>
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>Did You Know?</h3>
        {/* What: The key prop is crucial for React's rendering performance.
            Why: By changing the key whenever the fact changes, we tell React to treat each
            new fact as a completely new element, which allows us to re-trigger CSS animations. */}
        <p key={currentFactIndex} className={styles.fact}>
          {funFacts[currentFactIndex]}
        </p>
      </div>
    </section>
  );
};

// What: The default export.
// Why: This is the line that fixes the error! It makes this component available for import in other files.
export default FunFacts;