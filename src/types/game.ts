export type Direction = 0 | 1 | 2 | 3; // 0: UP, 1: RIGHT, 2: DOWN, 3: LEFT

export const DIR_UP: Direction = 0;
export const DIR_RIGHT: Direction = 1;
export const DIR_DOWN: Direction = 2;
export const DIR_LEFT: Direction = 3;

export const OPPOSITE_DIR: Record<Direction, Direction> = {
  0: 2, // UP -> DOWN
  1: 3, // RIGHT -> LEFT
  2: 0, // DOWN -> UP
  3: 1, // LEFT -> RIGHT
};

export const DIR_OFFSETS: Record<Direction, { r: number; c: number }> = {
  0: { r: -1, c: 0 },
  1: { r: 0, c: 1 },
  2: { r: 1, c: 0 },
  3: { r: 0, c: -1 },
};

export type PipeType =
  | 'straight'
  | 'elbow'
  | 'tee'
  | 'cross'
  | 'source'
  | 'destination'
  | 'block'
  | 'empty';

export type GameMode = 'fire' | 'tree';

export interface PipeCell {
  id: string;
  row: number;
  col: number;
  type: PipeType;
  /** Current rotation in quarter-turns (0, 1, 2, 3 = 0, 90, 180, 270 deg) */
  rotation: Direction;
  /** Initial canonical rotation for the solution */
  correctRotation?: Direction;
  /** Is this pipe locked from user rotation (e.g. source, destination, obstacles, fixed pipes) */
  locked?: boolean;
  /** Explicit fixed ports on this pipe that are locked in direction */
  fixedPorts?: Direction[];
  /** Is connection through this fixed pipe / fixed port mandatory for level success */
  isFixedPortRequired?: boolean;
  /** Is this cell on the intended solution route (used for smart hints) */
  isOnSolutionPath?: boolean;
  /** Is this pipe on the active water connection path that feeds the destination */
  isOnActivePath?: boolean;
  /** Is this pipe an unused pipe after level success (disabled and dimmed) */
  isUnusedDisabled?: boolean;
  /** Is this pipe currently supplied with water from source */
  hasWater?: boolean;
  /** Order in the water flow sequence (0 = source, 1 = first step...) */
  waterFlowOrder?: number;
  /** Open directions that are spraying water because they are not connected to a matching neighbor */
  leakingDirections?: Direction[];
  /** Continuous rotation in degrees for smooth animations without snapping */
  displayRotationDeg?: number;
  /** Is this pipe highlighted as a hint */
  isHinted?: boolean;
}

export interface LevelData {
  id: number;
  title: string;
  mode: GameMode;
  rows: number;
  cols: number;
  source: { row: number; col: number; dir: Direction }; // Where water comes in and points into the grid
  destination: { row: number; col: number; dir: Direction }; // Target location and required entry direction (backwards compatible)
  destinations?: Array<{ id: string; row: number; col: number; dir: Direction }>; // All target locations (e.g. 2 flowers when T-pipe branches)
  solutionPath?: Array<{ row: number; col: number }>;
  grid: {
    row: number;
    col: number;
    type: PipeType;
    correctRotation: Direction;
    initialRotation?: Direction;
    locked?: boolean;
    isOnSolutionPath?: boolean;
    fixedPorts?: Direction[];
    isFixedPortRequired?: boolean;
  }[];
  parMoves: number;
  timeLimit?: number;
  threeStarTime?: number;
  twoStarTime?: number;
  oneStarTime?: number;
  description?: string;
}

export interface UserProgress {
  unlockedLevel: number;
  lastPlayedLevel?: number;
  levelStars: Record<number, number>; // levelId -> stars (1-3)
  bestMoves: Record<number, number>;
  bestTimes?: Record<number, number>;
  totalStars: number;
}
