// src/pages/BuildAtomPage.jsx

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { apiClient } from '../api/apiClient';
import { fillShells, describeAtom, getIonCharge } from '../utils/atomBuilder';
import styles from './BuildAtomPage.module.css';

const BuildAtomPage = () => {
  const [allElements, setAllElements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [protons, setProtons] = useState(1);
  const [neutrons, setNeutrons] = useState(0);
  const [electrons, setElectrons] = useState(1);

  // 3D rotation state, driven by drag
  const [rotation, setRotation] = useState({ x: -20, y: 25 });
  const dragState = useRef({ isDragging: false, lastX: 0, lastY: 0 });

  useEffect(() => {
    let isMounted = true;
    apiClient
      .get('/elements')
      .then((data) => {
        if (isMounted) setAllElements(data);
      })
      .catch((err) => {
        console.error('Failed to load elements:', err);
        if (isMounted) setLoadError('Could not load element data.');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const matchedElement = useMemo(
    () => allElements.find((el) => el.number === protons) || null,
    [allElements, protons]
  );

  const shells = useMemo(() => fillShells(electrons), [electrons]);
  const charge = getIonCharge(protons, electrons);
  const description = useMemo(
    () => describeAtom({ protons, neutrons, electrons, matchedElement }),
    [protons, neutrons, electrons, matchedElement]
  );

  const adjust = (setter, value, delta, min = 0, max = 118) => {
    setter(Math.min(max, Math.max(min, value + delta)));
  };

  const handleReset = () => {
    setProtons(1);
    setNeutrons(0);
    setElectrons(1);
  };

  // --- Drag-to-rotate handlers ---
  const handlePointerDown = useCallback((e) => {
    dragState.current.isDragging = true;
    dragState.current.lastX = e.clientX;
    dragState.current.lastY = e.clientY;
  }, []);

  const handlePointerMove = useCallback((e) => {
    if (!dragState.current.isDragging) return;
    const deltaX = e.clientX - dragState.current.lastX;
    const deltaY = e.clientY - dragState.current.lastY;
    dragState.current.lastX = e.clientX;
    dragState.current.lastY = e.clientY;
    setRotation((prev) => ({
      x: Math.max(-80, Math.min(80, prev.x - deltaY * 0.4)),
      y: prev.y + deltaX * 0.4,
    }));
  }, []);

  const handlePointerUp = useCallback(() => {
    dragState.current.isDragging = false;
  }, []);

  useEffect(() => {
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [handlePointerMove, handlePointerUp]);

  if (isLoading) return <div className="status-message">Loading...</div>;
  if (loadError) return <div className="status-message" role="alert">{loadError}</div>;

  return (
    <div className={styles.buildAtomPage}>
      <header className={styles.pageHeader}>
        <h1>Build an Atom</h1>
        <p>Add protons, neutrons, and electrons — drag to rotate the atom in 3D.</p>
      </header>

      <div className={styles.workspace}>
        <div
          className={styles.atomVisual}
          onPointerDown={handlePointerDown}
          style={{ cursor: dragState.current.isDragging ? 'grabbing' : 'grab' }}
        >
          <div className={styles.perspectiveWrapper}>
            <div
              className={styles.atomScene}
              style={{
                transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
              }}
            >
              <div className={styles.nucleus}>
                <div className={styles.particleCluster}>
                  {Array.from({ length: Math.min(protons, 30) }).map((_, i) => (
                    <span
                      key={`p-${i}`}
                      className={styles.proton}
                      style={{ animationDelay: `${(i % 7) * 0.15}s` }}
                      title="Proton"
                    />
                  ))}
                  {Array.from({ length: Math.min(neutrons, 30) }).map((_, i) => (
                    <span
                      key={`n-${i}`}
                      className={styles.neutron}
                      style={{ animationDelay: `${(i % 5) * 0.2}s` }}
                      title="Neutron"
                    />
                  ))}
                </div>
              </div>

              {shells.map((count, shellIndex) => {
                // Give each shell ring a distinct tilt so multiple shells
                // read as layered 3D rings rather than flat overlapping circles.
                const shellTilt = 60 - shellIndex * 12;
                const radius = 70 + shellIndex * 45;
                return (
                  <div
                    key={shellIndex}
                    className={styles.shell}
                    style={{
                      width: `${radius * 2}px`,
                      height: `${radius * 2}px`,
                      transform: `rotateX(${shellTilt}deg)`,
                    }}
                  >
                    <div className={styles.shellSpin}>
                      {Array.from({ length: count }).map((_, i) => {
                        const angle = (360 / count) * i;
                        return (
                          <span
                            key={i}
                            className={styles.electron}
                            style={{
                              transform: `rotateZ(${angle}deg) translateX(${radius}px) rotateZ(${-angle}deg)`,
                            }}
                            title="Electron"
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {(protons > 30 || neutrons > 30) && (
            <span className={styles.overflowNote}>
              {protons}p / {neutrons}n
            </span>
          )}
          <span className={styles.dragHint}>Drag to rotate</span>
        </div>

        <div className={styles.controlsPanel}>
          <div className={styles.particleControl}>
            <span className={styles.particleLabel}>
              <span className={styles.dotProton}></span> Protons
            </span>
            <div className={styles.stepper}>
              <button onClick={() => adjust(setProtons, protons, -1, 1)}>−</button>
              <span>{protons}</span>
              <button onClick={() => adjust(setProtons, protons, 1, 1, 118)}>+</button>
            </div>
          </div>

          <div className={styles.particleControl}>
            <span className={styles.particleLabel}>
              <span className={styles.dotNeutron}></span> Neutrons
            </span>
            <div className={styles.stepper}>
              <button onClick={() => adjust(setNeutrons, neutrons, -1, 0)}>−</button>
              <span>{neutrons}</span>
              <button onClick={() => adjust(setNeutrons, neutrons, 1, 0, 180)}>+</button>
            </div>
          </div>

          <div className={styles.particleControl}>
            <span className={styles.particleLabel}>
              <span className={styles.dotElectron}></span> Electrons
            </span>
            <div className={styles.stepper}>
              <button onClick={() => adjust(setElectrons, electrons, -1, 0)}>−</button>
              <span>{electrons}</span>
              <button onClick={() => adjust(setElectrons, electrons, 1, 0, 118)}>+</button>
            </div>
          </div>

          <button className={styles.resetButton} onClick={handleReset}>
            Reset
          </button>

          <div className={styles.infoCard}>
            {matchedElement ? (
              <>
                <div className={styles.elementBadge}>
                  <span className={styles.badgeSymbol}>{matchedElement.symbol}</span>
                  <span className={styles.badgeName}>{matchedElement.name}</span>
                </div>
                {charge !== 0 && (
                  <div className={styles.chargeTag}>
                    {charge > 0 ? `+${charge} ion` : `${charge} ion`}
                  </div>
                )}
              </>
            ) : (
              <div className={styles.elementBadge}>
                <span className={styles.badgeSymbol}>?</span>
                <span className={styles.badgeName}>Unknown</span>
              </div>
            )}
            <p className={styles.description}>{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildAtomPage;