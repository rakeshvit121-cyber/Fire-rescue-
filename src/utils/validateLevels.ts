import { ALL_LEVEL_TEMPLATES, loadLevel } from '../data/levels';
import { calculateWaterFlow } from './pipeLogic';

export function testAllLevels(): { allValid: boolean; results: Array<{ id: number; valid: boolean; error?: string }> } {
  const results = [];
  let allValid = true;

  for (const tpl of ALL_LEVEL_TEMPLATES) {
    const lvl = loadLevel(tpl.id);
    // Put all cells into their correctRotation
    const testCells = lvl.grid.map((c) => ({
      id: `${c.row}-${c.col}`,
      row: c.row,
      col: c.col,
      type: c.type,
      rotation: c.correctRotation,
      correctRotation: c.correctRotation,
      locked: c.locked,
    }));

    const flow = calculateWaterFlow(testCells, lvl.rows, lvl.cols, lvl.source, lvl.destinations || lvl.destination);
    if (!flow.reachedDestination) {
      allValid = false;
      results.push({ id: tpl.id, valid: false, error: 'Cannot reach destination with correctRotation' });
    } else {
      results.push({ id: tpl.id, valid: true });
    }
  }

  return { allValid, results };
}
