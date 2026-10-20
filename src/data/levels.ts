import {
  Direction,
  DIR_UP,
  DIR_RIGHT,
  DIR_DOWN,
  DIR_LEFT,
  GameMode,
  LevelData,
  PipeType,
} from '../types/game';

export interface LevelTemplate {
  id: number;
  title: string;
  mode: GameMode;
  rows: number;
  cols: number;
  sourceRow: number;
  destRow: number;
  destRows?: number[];
  solutionPath?: Array<{ r: number; c: number }>;
  description: string;
  parMoves: number;
  timeLimit?: number;
  threeStarTime?: number;
  twoStarTime?: number;
  oneStarTime?: number;
  layout: Array<{
    r: number;
    c: number;
    type: PipeType;
    solRot: Direction;
    isOnSolutionPath?: boolean;
    scramble?: Direction;
    locked?: boolean;
    fixedPorts?: Direction[];
    isFixedPortRequired?: boolean;
  }>;
}

/**
 * Determine pipe type and canonical rotation for two connecting port directions
 */
export function getPipeForDirs(dirA: Direction, dirB: Direction): { type: PipeType; solRot: Direction } {
  const set = new Set([dirA, dirB]);
  if (set.has(DIR_UP) && set.has(DIR_DOWN)) return { type: 'straight', solRot: DIR_UP };
  if (set.has(DIR_LEFT) && set.has(DIR_RIGHT)) return { type: 'straight', solRot: DIR_RIGHT };
  if (set.has(DIR_UP) && set.has(DIR_RIGHT)) return { type: 'elbow', solRot: DIR_UP };
  if (set.has(DIR_RIGHT) && set.has(DIR_DOWN)) return { type: 'elbow', solRot: DIR_RIGHT };
  if (set.has(DIR_DOWN) && set.has(DIR_LEFT)) return { type: 'elbow', solRot: DIR_DOWN };
  if (set.has(DIR_LEFT) && set.has(DIR_UP)) return { type: 'elbow', solRot: DIR_LEFT };
  return { type: 'cross', solRot: DIR_UP };
}

/**
 * Deterministic PRNG seeded per level
 */
function createPrng(seed: number) {
  let s = seed;
  return function rand() {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

/**
 * Find a clean, solvable path from (sourceRow, 0) to (destRow, cols - 1)
 * with moderate, fun complexity.
 */
function findControlledPath(
  rows: number,
  cols: number,
  sourceRow: number,
  destRow: number,
  targetLength: number,
  seed: number
): Array<{ r: number; c: number }> {
  const rand = createPrng(seed);
  const start = { r: sourceRow, c: 0 };
  const goal = { r: destRow, c: cols - 1 };

  let bestPath: Array<{ r: number; c: number }> | null = null;
  let iterations = 0;

  function dfs(curr: { r: number; c: number }, visited: Set<string>, path: Array<{ r: number; c: number }>): boolean {
    iterations++;
    if (iterations > 18000) return false;

    if (curr.r === goal.r && curr.c === goal.c) {
      if (path.length >= targetLength) {
        bestPath = [...path];
        return true;
      }
      if (!bestPath || path.length > bestPath.length) {
        bestPath = [...path];
      }
      return false;
    }

    const neighbors = [
      { r: curr.r - 1, c: curr.c },
      { r: curr.r + 1, c: curr.c },
      { r: curr.r, c: curr.c - 1 },
      { r: curr.r, c: curr.c + 1 },
    ];

    // Shuffle neighbors
    for (let i = neighbors.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [neighbors[i], neighbors[j]] = [neighbors[j], neighbors[i]];
    }

    neighbors.sort((a, b) => {
      const distA = Math.abs(a.r - goal.r) + Math.abs(a.c - goal.c);
      const distB = Math.abs(b.r - goal.r) + Math.abs(b.c - goal.c);
      if (path.length < targetLength) {
        return distB - distA;
      }
      return distA - distB;
    });

    for (const next of neighbors) {
      if (next.r >= 0 && next.r < rows && next.c >= 0 && next.c < cols) {
        const key = `${next.r},${next.c}`;
        if (!visited.has(key)) {
          visited.add(key);
          path.push(next);
          if (dfs(next, visited, path)) return true;
          path.pop();
          visited.delete(key);
        }
      }
    }
    return false;
  }

  const visited = new Set<string>();
  visited.add(`${start.r},${start.c}`);
  dfs(start, visited, [start]);

  const found = bestPath as Array<{ r: number; c: number }> | null;
  if (found && found.length >= 3) {
    return found;
  }

  // Fallback direct path
  const fallback: Array<{ r: number; c: number }> = [];
  let cr = sourceRow;
  let cc = 0;
  fallback.push({ r: cr, c: cc });
  while (cc < cols - 1 || cr !== destRow) {
    if (cr < destRow) cr++;
    else if (cr > destRow) cr--;
    else cc++;
    fallback.push({ r: cr, c: cc });
  }
  return fallback;
}

// 100 level titles
const FIRE_TITLES = [
  'Kitchen Flare', 'Barn in Flames', 'Cottage Smoke', 'Ranch Inferno', 'Bakery Spark',
  'Suburban Alarm', 'Chimney Hazard', 'Workshop Blaze', 'Old Sawmill', 'Harbor Warehouse',
  'Grain Silo Fire', 'Campground Sparks', 'Lumber Mill Fire', 'Manor Emergency', 'Foundry Alarm',
  'Clocktower Smoke', 'Docks on Fire', 'Brewery Blaze', 'Valley Chalet', 'Granite Forge',
  'Town Square Hall', 'Boiler Room', 'Vineyard Cottage', 'Blacksmith Shop', 'Railroad Depot',
  'Rooftop Conflagration', 'Old Tannery', 'Waterfront Tavern', 'Cliffside Bungalow', 'Paper Mill Flare',
  'Mountain Observatory', 'Bridge Gatehouse', 'Fisherman Hut', 'Distillery Flash', 'Fortress Tower',
  'Castle Gate', 'Armory Emergency', 'Trophy Hall', 'Garrison Barracks', 'Shipyard Beacon',
  'Windmill Inferno', 'Trading Outpost', 'Carriage House', 'Timber Yard', 'Pottery Kiln',
  'Marketplace Stalls', 'Monastery Library', 'Grand Villa', 'Industrial Furnace', 'Citadel Fortress'
];

const TREE_TITLES = [
  'First Droplets', 'Twin Blossoms', 'Forest Sanctuary', 'Blooming Bonsai', 'Valley Meadow',
  'Ancient Redwood', 'Golden Willow', 'Whispering Pine', 'Cherry Blossom', 'Sacred Fig',
  'Desert Cactus', 'Alpine Spruce', 'Emerald Fern', 'Bamboo Sanctuary', 'Autumn Maple',
  'Royal Palm', 'Silver Birch', 'Mountain Cedar', 'Sunlit Sunflower', 'Enchanted Rose',
  'Fragrant Jasmine', 'Weeping Willow', 'Highland Juniper', 'Spring Magnolia', 'Misty Sequoia',
  'Lakeside Willow', 'Wildflower Haven', 'Ancient Cypress', 'Orchid Greenhouse', 'Lemon Grove',
  'Orange Orchard', 'Peaceful Ginkgo', 'Banyan Sanctuary', 'Olive Grove', 'Sweet Honeysuckle',
  'Lavender Fields', 'Alpine Edelweiss', 'Moonlight Camellia', 'Coastal Cypress', 'Sunburst Dahlia',
  'Dewdrop Blossom', 'Mossy Redwood', 'Cedar Ridge', 'Crimson Clover', 'Wild Heather',
  'Enchanted Glade', 'Evergreen Fir', 'Morning Glory', 'Great Mother Tree', 'Sacred Eden'
];

/**
 * Build 100 balanced, intuitive, guaranteed-solvable levels
 */
function generate100Levels(): LevelTemplate[] {
  const levels: LevelTemplate[] = [];

  for (let id = 1; id <= 100; id++) {
    const isFire = id % 2 !== 0; // Odd = Fire Rescue, Even = Tree Rescue
    const mode: GameMode = isFire ? 'fire' : 'tree';

    // Progressive grid sizes (moderate and comfortable, no massive 8x8 walls)
    // 1-5: 3x3 (5-7 pipes)
    // 6-20: 4x3 / 3x4 (6-8 pipes)
    // 21-50: 4x4 (7-10 pipes)
    // 51-75: 4x5 (9-12 pipes)
    // 76-90: 5x5 (11-14 pipes)
    // 91-100: 5x6 (12-16 pipes)
    let rows = 3;
    let cols = 3;

    if (id <= 5) {
      rows = 3; cols = 3;
    } else if (id <= 20) {
      rows = 4; cols = 3;
    } else if (id <= 50) {
      rows = 4; cols = 4;
    } else if (id <= 75) {
      rows = 4; cols = 5;
    } else if (id <= 90) {
      rows = 5; cols = 5;
    } else {
      rows = 5; cols = 6;
    }

    // Source and Destination rows
    const sourceRow = Math.min(rows - 1, Math.max(0, (id * 2 + 1) % rows));
    let destRow = Math.min(rows - 1, Math.max(0, (id * 3 + 2) % rows));
    if (destRow === sourceRow && rows > 2) {
      destRow = (sourceRow + 1) % rows;
    }

    // Target length is around 50% to 60% of board tiles (balanced & fun)
    const targetLength = Math.max(
      4,
      Math.floor(rows * cols * (id <= 10 ? 0.55 : id <= 50 ? 0.58 : 0.62))
    );

    const path = findControlledPath(rows, cols, sourceRow, destRow, targetLength, id * 8191 + 47);

    // Build map of solution path pipes
    const pathMap = new Map<string, { type: PipeType; solRot: Direction }>();
    for (let idx = 0; idx < path.length; idx++) {
      const p = path[idx];
      const prev = idx === 0 ? { r: sourceRow, c: -1 } : path[idx - 1];
      const next = idx === path.length - 1 ? { r: destRow, c: cols } : path[idx + 1];

      const dirToPrev: Direction =
        prev.r < p.r ? DIR_UP : prev.r > p.r ? DIR_DOWN : prev.c < p.c ? DIR_LEFT : DIR_RIGHT;
      const dirToNext: Direction =
        next.r < p.r ? DIR_UP : next.r > p.r ? DIR_DOWN : next.c < p.c ? DIR_LEFT : DIR_RIGHT;

      const pipe = getPipeForDirs(dirToPrev, dirToNext);
      pathMap.set(`${p.r},${p.c}`, pipe);
    }

    // Build the grid: path pipes have isOnSolutionPath = true
    // Non-path cells have clean, valid rotatable pipes (no dead blocks!)
    const layout: LevelTemplate['layout'] = [];
    const rand = createPrng(id * 997 + 13);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const key = `${r},${c}`;
        const onPath = pathMap.get(key);

        if (onPath) {
          layout.push({
            r,
            c,
            type: onPath.type,
            solRot: onPath.solRot,
            isOnSolutionPath: true,
            locked: false,
          });
        } else {
          // Standard rotatable decoy pipe
          const decoys: PipeType[] = ['elbow', 'straight', 'elbow', 'tee'];
          const chosenType = decoys[Math.floor(rand() * decoys.length)];
          const chosenRot = (Math.floor(rand() * 4)) as Direction;
          layout.push({
            r,
            c,
            type: chosenType,
            solRot: chosenRot,
            isOnSolutionPath: false,
            locked: false,
          });
        }
      }
    }

    const titleIndex = Math.floor((id - 1) / 2);
    const title = isFire
      ? (FIRE_TITLES[titleIndex] || `Fire Mission #${id}`)
      : (TREE_TITLES[titleIndex] || `Tree Mission #${id}`);

    const parMoves = Math.max(4, Math.floor(path.length * 0.9) + 2);
    const timeLimit = id <= 20 ? 60 : id <= 60 ? 75 : 90;
    const threeStarTime = Math.round(timeLimit * 0.45);
    const twoStarTime = Math.round(timeLimit * 0.72);
    const oneStarTime = timeLimit;

    levels.push({
      id,
      title,
      mode,
      rows,
      cols,
      sourceRow,
      destRow,
      solutionPath: path,
      description: isFire
        ? `Connect water to extinguish the flames!`
        : `Deliver water to restore the thirsty tree!`,
      parMoves,
      timeLimit,
      threeStarTime,
      twoStarTime,
      oneStarTime,
      layout,
    });
  }

  return levels;
}

export const ALL_LEVEL_TEMPLATES: LevelTemplate[] = generate100Levels();

/**
 * Instantiate level data with scrambled rotations so every level starts unsolved
 */
export function loadLevel(levelId: number): LevelData {
  const tpl = ALL_LEVEL_TEMPLATES.find((l) => l.id === levelId) || ALL_LEVEL_TEMPLATES[0];

  const grid = tpl.layout.map((item, idx) => {
    // Scramble the rotation unless locked
    let initialRotation = item.solRot;
    if (!item.locked && item.type !== 'block' && item.type !== 'empty') {
      // Rotate by 1, 2, or 3 quarter turns so it starts unsolved
      const offset = ((idx % 3) + 1) as Direction;
      initialRotation = ((item.solRot + offset) % 4) as Direction;
    }

    return {
      row: item.r,
      col: item.c,
      type: item.type,
      correctRotation: item.solRot,
      initialRotation,
      locked: false,
      isOnSolutionPath: item.isOnSolutionPath ?? false,
      isFixedPortRequired: false,
    };
  });

  const destinations = [
    {
      id: 'dest-0',
      row: tpl.destRow,
      col: tpl.cols,
      dir: DIR_RIGHT,
    },
  ];

  const defaultTimeLimit = tpl.id <= 20 ? 60 : tpl.id <= 60 ? 75 : 90;
  const timeLimit = tpl.timeLimit ?? defaultTimeLimit;
  const threeStarTime = tpl.threeStarTime ?? Math.round(timeLimit * 0.45);
  const twoStarTime = tpl.twoStarTime ?? Math.round(timeLimit * 0.72);
  const oneStarTime = tpl.oneStarTime ?? timeLimit;

  return {
    id: tpl.id,
    title: tpl.title,
    mode: tpl.mode,
    rows: tpl.rows,
    cols: tpl.cols,
    source: { row: tpl.sourceRow, col: -1, dir: DIR_RIGHT },
    destination: destinations[0],
    destinations,
    solutionPath: tpl.solutionPath?.map((p) => ({ row: p.r, col: p.c })),
    grid,
    parMoves: tpl.parMoves,
    timeLimit,
    threeStarTime,
    twoStarTime,
    oneStarTime,
    description: tpl.description,
  };
}

export const TOTAL_LEVELS = ALL_LEVEL_TEMPLATES.length;
