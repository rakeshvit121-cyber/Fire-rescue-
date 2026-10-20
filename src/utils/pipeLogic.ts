import {
  Direction,
  DIR_UP,
  DIR_RIGHT,
  DIR_DOWN,
  DIR_LEFT,
  DIR_OFFSETS,
  OPPOSITE_DIR,
  PipeCell,
  PipeType,
} from '../types/game';

/**
 * Base openings for each pipe type when rotation = 0
 */
export const BASE_OPENINGS: Record<PipeType, Direction[]> = {
  straight: [DIR_UP, DIR_DOWN], // 0, 2
  elbow: [DIR_UP, DIR_RIGHT], // 0, 1
  tee: [DIR_UP, DIR_RIGHT, DIR_LEFT], // 0, 1, 3 (T-junction)
  cross: [DIR_UP, DIR_RIGHT, DIR_DOWN, DIR_LEFT], // all 4
  source: [DIR_RIGHT], // default source points right
  destination: [DIR_LEFT], // default destination receives from left
  block: [],
  empty: [],
};

/**
 * Get active openings for a pipe given its current rotation
 */
export function getPipeOpenings(type: PipeType, rotation: Direction): Direction[] {
  const base = BASE_OPENINGS[type] || [];
  return base.map((dir) => ((dir + rotation) % 4) as Direction);
}

/**
 * Check whether a pipe has an opening facing the specified direction
 */
export function hasOpeningInDirection(type: PipeType, rotation: Direction, dir: Direction): boolean {
  const openings = getPipeOpenings(type, rotation);
  return openings.includes(dir);
}

export interface FlowResult {
  reachedDestination: boolean; // True ONLY if ALL destinations have water AND all required fixed ports are used!
  waterGrid: Map<string, { hasWater: boolean; order: number; leakingDirections: Direction[] }>;
  pathCoords: Array<{ row: number; col: number }>;
  reachedDestRows: number[]; // Array of destination row indices that currently have water
  allDestinationsReached: boolean;
  totalDestinations: number;
  fixedPortsRequiredCount: number;
  fixedPortsConnectedCount: number;
  fixedPortMissing: boolean; // True if destinations were reached but bypassed a required fixed port
  activePathKeys: Set<string>;
}

export type DestinationTarget = { row: number; col: number; dir: Direction; id?: string };

/**
 * Perform BFS to trace water flow from source through pipes to destination(s).
 * If multiple destinations are provided (e.g. 2 flowers in a T-pipe level),
 * reachedDestination is true ONLY when ALL destinations are reached!
 * Also enforces that 1 or more fixed direction ports must be used to complete the connection.
 */
export function calculateWaterFlow(
  cells: PipeCell[],
  rows: number,
  cols: number,
  source: { row: number; col: number; dir: Direction },
  destination: DestinationTarget | DestinationTarget[],
  allDestinations?: DestinationTarget[]
): FlowResult {
  const destList: DestinationTarget[] = Array.isArray(destination)
    ? destination
    : allDestinations && allDestinations.length > 0
    ? allDestinations
    : [destination];

  const cellMap = new Map<string, PipeCell>();
  cells.forEach((c) => cellMap.set(`${c.row},${c.col}`, c));

  const requiredFixedCells = cells.filter(
    (c) =>
      c.type !== 'block' &&
      c.type !== 'empty' &&
      (c.isFixedPortRequired || (c.locked && c.isFixedPortRequired !== false))
  );

  const waterGrid = new Map<string, { hasWater: boolean; order: number; leakingDirections: Direction[] }>();
  const pathCoords: Array<{ row: number; col: number }> = [];
  const reachedDestIndices = new Set<number>();
  const reachedDestRows: number[] = [];
  const destParentKeys = new Map<number, string>();

  // Check if source directly points into the board
  // Source is at source.row, source.col and pours in source.dir
  // First target cell in grid is source.row + offset.r, source.col + offset.c
  const firstTargetRow = source.row + DIR_OFFSETS[source.dir].r;
  const firstTargetCol = source.col + DIR_OFFSETS[source.dir].c;
  const firstKey = `${firstTargetRow},${firstTargetCol}`;
  const firstCell = cellMap.get(firstKey);

  if (!firstCell) {
    return {
      reachedDestination: false,
      allDestinationsReached: false,
      totalDestinations: destList.length,
      reachedDestRows: [],
      waterGrid,
      pathCoords,
      fixedPortsRequiredCount: requiredFixedCells.length,
      fixedPortsConnectedCount: 0,
      fixedPortMissing: false,
      activePathKeys: new Set(),
    };
  }

  // Does firstCell have an opening facing back towards source?
  const requiredEntryDir = OPPOSITE_DIR[source.dir];
  if (!hasOpeningInDirection(firstCell.type, firstCell.rotation, requiredEntryDir)) {
    return {
      reachedDestination: false,
      allDestinationsReached: false,
      totalDestinations: destList.length,
      reachedDestRows: [],
      waterGrid,
      pathCoords,
      fixedPortsRequiredCount: requiredFixedCells.length,
      fixedPortsConnectedCount: 0,
      fixedPortMissing: false,
      activePathKeys: new Set(),
    };
  }

  // BFS Queue: [ { row, col, order, parentKey } ]
  const queue: Array<{ row: number; col: number; order: number; parentKey: string | null }> = [
    { row: firstTargetRow, col: firstTargetCol, order: 0, parentKey: null },
  ];

  const visited = new Set<string>();
  const parentMap = new Map<string, string | null>();
  visited.add(firstKey);
  parentMap.set(firstKey, null);
  waterGrid.set(firstKey, { hasWater: true, order: 0, leakingDirections: [] });

  while (queue.length > 0) {
    const current = queue.shift()!;
    const currentKey = `${current.row},${current.col}`;
    const currentCell = cellMap.get(currentKey);
    if (!currentCell) continue;

    const openings = getPipeOpenings(currentCell.type, currentCell.rotation);

    for (const dir of openings) {
      const nr = current.row + DIR_OFFSETS[dir].r;
      const nc = current.col + DIR_OFFSETS[dir].c;
      const neighborKey = `${nr},${nc}`;

      // Check if neighbor matches any destination
      for (let dIdx = 0; dIdx < destList.length; dIdx++) {
        const d = destList[dIdx];
        if (nr === d.row && nc === d.col && dir === d.dir) {
          reachedDestIndices.add(dIdx);
          if (!reachedDestRows.includes(d.row)) {
            reachedDestRows.push(d.row);
          }
          destParentKeys.set(dIdx, currentKey);
        }
      }

      // Bounds check
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;

      // Already visited?
      if (visited.has(neighborKey)) continue;

      const neighborCell = cellMap.get(neighborKey);
      if (!neighborCell || neighborCell.type === 'block' || neighborCell.type === 'empty') continue;

      // Check if neighbor has matching opening
      const requiredOpposite = OPPOSITE_DIR[dir];
      if (hasOpeningInDirection(neighborCell.type, neighborCell.rotation, requiredOpposite)) {
        visited.add(neighborKey);
        parentMap.set(neighborKey, currentKey);
        waterGrid.set(neighborKey, { hasWater: true, order: current.order + 1, leakingDirections: [] });
        queue.push({
          row: nr,
          col: nc,
          order: current.order + 1,
          parentKey: currentKey,
        });
      }
    }
  }

  // Calculate unconnected / leaking openings for every cell that has water
  for (const [key, info] of waterGrid.entries()) {
    const cell = cellMap.get(key);
    if (!cell) continue;

    const leaks: Direction[] = [];
    const cellOpenings = getPipeOpenings(cell.type, cell.rotation);

    for (const dir of cellOpenings) {
      const nr = cell.row + DIR_OFFSETS[dir].r;
      const nc = cell.col + DIR_OFFSETS[dir].c;

      // Check if this opening connects back to the source inlet
      if (nr === source.row && nc === source.col && dir === OPPOSITE_DIR[source.dir]) {
        continue; // Connected to water source
      }

      // Check if this opening connects to any destination
      if (destList.some((d) => nr === d.row && nc === d.col && dir === d.dir)) {
        continue; // Connected to destination
      }

      // Check if neighbor in this direction has a matching connection
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        const neighbor = cellMap.get(`${nr},${nc}`);
        if (neighbor && neighbor.type !== 'block' && neighbor.type !== 'empty') {
          const reqOpposite = OPPOSITE_DIR[dir];
          if (hasOpeningInDirection(neighbor.type, neighbor.rotation, reqOpposite)) {
            // Connected to neighbor pipe!
            continue;
          }
        }
      }

      // If neither source, destination, nor matching neighbor: this opening leaks pressurized water!
      leaks.push(dir);
    }

    info.leakingDirections = leaks;
  }

  // Reconstruct solution path coordinates for all reached destinations
  const visitedPathKeys = new Set<string>();
  for (const dIdx of reachedDestIndices) {
    const pKey = destParentKeys.get(dIdx);
    let curr: string | null = pKey || null;
    while (curr) {
      if (!visitedPathKeys.has(curr)) {
        visitedPathKeys.add(curr);
        const [r, c] = curr.split(',').map(Number);
        pathCoords.unshift({ row: r, col: c });
      }
      curr = parentMap.get(curr) || null;
    }
  }

  // Validate that all required fixed-direction ports/pipes are used in the connection path
  let fixedPortsConnectedCount = 0;
  for (const fc of requiredFixedCells) {
    if (visitedPathKeys.has(`${fc.row},${fc.col}`)) {
      fixedPortsConnectedCount++;
    }
  }

  const allFixedPortsUsed =
    requiredFixedCells.length === 0 || fixedPortsConnectedCount === requiredFixedCells.length;

  const allDestinationsReached = destList.length > 0 && reachedDestIndices.size === destList.length;
  const reachedDestination = allDestinationsReached && allFixedPortsUsed;
  const fixedPortMissing = allDestinationsReached && !allFixedPortsUsed;

  return {
    reachedDestination,
    allDestinationsReached,
    totalDestinations: destList.length,
    reachedDestRows,
    waterGrid,
    pathCoords,
    fixedPortsRequiredCount: requiredFixedCells.length,
    fixedPortsConnectedCount,
    fixedPortMissing,
    activePathKeys: visitedPathKeys,
  };
}

/**
 * Rotate a direction 90 degrees clockwise
 */
export function rotateQuarter(dir: Direction): Direction {
  return ((dir + 1) % 4) as Direction;
}

/**
 * Check if a cell is visually and functionally symmetrical:
 * e.g. straight pipe looks identical at 0 and 2, or 1 and 3.
 * cross pipe looks identical at all rotations.
 */
export function isEquivalentRotation(type: PipeType, rotA: Direction, rotB: Direction): boolean {
  if (type === 'cross') return true;
  if (type === 'straight') return rotA % 2 === rotB % 2;
  return rotA === rotB;
}
