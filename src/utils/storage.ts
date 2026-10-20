import { UserProgress } from '../types/game';

const STORAGE_KEY = 'pipe_rescue_progress_v1';

export function getInitialProgress(): UserProgress {
  return {
    unlockedLevel: 1,
    levelStars: {},
    bestMoves: {},
    bestTimes: {},
    totalStars: 0,
  };
}

export function loadUserProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getInitialProgress();
    const parsed = JSON.parse(raw);
    return {
      unlockedLevel: parsed.unlockedLevel || 1,
      lastPlayedLevel: parsed.lastPlayedLevel || parsed.unlockedLevel || 1,
      levelStars: parsed.levelStars || {},
      bestMoves: parsed.bestMoves || {},
      bestTimes: parsed.bestTimes || {},
      totalStars: Object.values(parsed.levelStars || {}).reduce((acc: number, val) => acc + Number(val || 0), 0),
    };
  } catch {
    return getInitialProgress();
  }
}

export function saveLastPlayedLevel(levelId: number): void {
  try {
    const current = loadUserProgress();
    current.lastPlayedLevel = levelId;
    saveUserProgress(current);
  } catch (e) {
    console.error('Failed to save last played level', e);
  }
}

export function saveUserProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save progress', e);
  }
}

export function recordLevelSuccess(
  levelId: number,
  moves: number,
  stars: number,
  completionTimeSeconds?: number
): UserProgress {
  const current = loadUserProgress();
  
  // Update stars if better
  const previousStars = current.levelStars[levelId] || 0;
  if (stars > previousStars) {
    current.levelStars[levelId] = stars;
  }

  // Update best moves
  const previousBest = current.bestMoves[levelId];
  if (!previousBest || moves < previousBest) {
    current.bestMoves[levelId] = moves;
  }

  // Update best completion time
  if (completionTimeSeconds !== undefined && completionTimeSeconds > 0) {
    if (!current.bestTimes) current.bestTimes = {};
    const prevTime = current.bestTimes[levelId];
    if (!prevTime || completionTimeSeconds < prevTime) {
      current.bestTimes[levelId] = completionTimeSeconds;
    }
  }

  // Unlock next level up to 100 when level is finished with at least 1 star!
  if (stars >= 1 && levelId >= current.unlockedLevel && levelId < 100) {
    current.unlockedLevel = levelId + 1;
  }

  current.totalStars = Object.values(current.levelStars).reduce((acc, val) => acc + (val || 0), 0);
  saveUserProgress(current);
  return current;
}

export function resetAllProgress(): UserProgress {
  const fresh = getInitialProgress();
  saveUserProgress(fresh);
  return fresh;
}
