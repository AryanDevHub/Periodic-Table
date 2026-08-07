// src/utils/progress.js
const STORAGE_KEY = 'quarx_progress';

const DEFAULT_PROGRESS = {
  xp: 0,
  streak: 0,
  lastPlayedDate: null, // 'YYYY-MM-DD'
  quizzesCompleted: 0,
};

function todayDateString() {
  return new Date().toISOString().split('T')[0];
}

function daysBetween(dateStrA, dateStrB) {
  const a = new Date(dateStrA);
  const b = new Date(dateStrB);
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((b - a) / msPerDay);
}

export function getProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROGRESS };
    return { ...DEFAULT_PROGRESS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  // Lets any mounted component (e.g. a header badge) know to re-read progress.
  window.dispatchEvent(new Event('progress-updated'));
}

function applyDailyStreak(progress) {
  const today = todayDateString();
  if (!progress.lastPlayedDate) {
    progress.streak = 1;
  } else if (progress.lastPlayedDate !== today) {
    const diff = daysBetween(progress.lastPlayedDate, today);
    progress.streak = diff === 1 ? progress.streak + 1 : 1;
  }
  progress.lastPlayedDate = today;
  return progress;
}

export function recordQuizCompletion({ score, total }) {
  const progress = getProgress();
  const xpEarned = score * 10 + (score === total ? 20 : 0); // bonus for a perfect run
  progress.xp += xpEarned;
  progress.quizzesCompleted += 1;
  applyDailyStreak(progress);
  saveProgress(progress);
  return { progress, xpEarned };
}

export function resetProgress() {
  saveProgress({ ...DEFAULT_PROGRESS });
}