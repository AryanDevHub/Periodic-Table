import React, { useState, useEffect, useCallback } from 'react';
import { getProgress } from '../../utils/progress';
import styles from './ProgressBadge.module.css';

const ProgressBadge = () => {
  const [progress, setProgress] = useState(getProgress());

  const refresh = useCallback(() => setProgress(getProgress()), []);

  useEffect(() => {
    window.addEventListener('progress-updated', refresh);
    return () => window.removeEventListener('progress-updated', refresh);
  }, [refresh]);

  if (progress.xp === 0 && progress.streak === 0) return null;

  return (
    <div className={styles.badge} title={`${progress.xp} XP · ${progress.streak}-day streak`}>
      <span className={styles.xp}>
        <i className="fas fa-star"></i> {progress.xp} XP
      </span>
      {progress.streak > 0 && (
        <span className={styles.streak}>
          <i className="fas fa-fire"></i> {progress.streak}
        </span>
      )}
    </div>
  );
};

export default ProgressBadge;