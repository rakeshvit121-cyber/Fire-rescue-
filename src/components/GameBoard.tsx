import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Direction, GameMode, LevelData, PipeCell, UserProgress } from '../types/game';
import { calculateWaterFlow, rotateQuarter, isEquivalentRotation } from '../utils/pipeLogic';
import { soundManager } from '../audio/soundManager';
import { PipePiece } from './PipePiece';
import { WaterSourceInlet } from './WaterSourceInlet';
import { DestinationConnector } from './DestinationConnector';
import { VictoryModal } from './VictoryModal';
import { TimeUpModal } from './TimeUpModal';
import { PauseModal } from './PauseModal';
import { SettingsModal } from './SettingsModal';
import {
  RotateCcw,
  Lightbulb,
  Pause,
  Star,
  Volume2,
  VolumeX,
  ArrowLeft,
  Flame,
  Trees,
  Clock,
} from 'lucide-react';

interface GameBoardProps {
  levelData: LevelData;
  progress: UserProgress;
  onLevelComplete: (levelId: number, moves: number, stars: number, completionTime?: number) => void;
  onNextLevel: () => void;
  onBackToMenu: () => void;
  onSelectLevel: () => void;
  soundEnabled: boolean;
  musicEnabled: boolean;
  onToggleSound: () => void;
  onToggleMusic: () => void;
  onResetProgress: () => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  levelData,
  progress,
  onLevelComplete,
  onNextLevel,
  onBackToMenu,
  onSelectLevel,
  soundEnabled,
  musicEnabled,
  onToggleSound,
  onToggleMusic,
  onResetProgress,
}) => {
  // State
  const [cells, setCells] = useState<PipeCell[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [hintsLeft, setHintsLeft] = useState<number>(3);
  const [hintedCellId, setHintedCellId] = useState<string | null>(null);

  // Victory & Flow animation states
  const [isFlowingWater, setIsFlowingWater] = useState<boolean>(false);
  const [waterReachedDest, setWaterReachedDest] = useState<boolean>(false);
  const [reachedDestRows, setReachedDestRows] = useState<number[]>([]);
  const [isExtinguishing, setIsExtinguishing] = useState<boolean>(false);
  const [isExtinguished, setIsExtinguished] = useState<boolean>(false);
  const [isWateringTree, setIsWateringTree] = useState<boolean>(false);
  const [isTreeSaved, setIsTreeSaved] = useState<boolean>(false);
  const [showVictory, setShowVictory] = useState<boolean>(false);

  // Modals
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showTimeUp, setShowTimeUp] = useState<boolean>(false);

  // Timer & Star Configuration
  const targetTime = levelData.timeLimit ?? (levelData.id <= 10 ? 60 : levelData.id <= 20 ? 90 : 120);
  const threeStarThresh = levelData.threeStarTime ?? Math.round(targetTime * 0.5);
  const twoStarThresh = levelData.twoStarTime ?? Math.round(targetTime * 0.75);
  const oneStarThresh = levelData.oneStarTime ?? targetTime;

  const [timeLeft, setTimeLeft] = useState<number>(targetTime);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [completedTime, setCompletedTime] = useState<number>(0);
  const [earnedStars, setEarnedStars] = useState<number>(1);

  // Responsive grid tile size
  const [tileSize, setTileSize] = useState<number>(56);
  const boardContainerRef = useRef<HTMLDivElement>(null);

  // Initialize level
  useEffect(() => {
    initLevel();
  }, [levelData]);

  const initLevel = () => {
    const limit = levelData.timeLimit ?? (levelData.id <= 10 ? 60 : levelData.id <= 20 ? 90 : 120);
    setTimeLeft(limit);
    setIsTimerRunning(true);
    setShowTimeUp(false);
    setCompletedTime(0);
    setEarnedStars(1);

    const initialCells: PipeCell[] = levelData.grid.map((g) => {
      const initRot = g.initialRotation ?? g.correctRotation;
      return {
        id: `${g.row}-${g.col}`,
        row: g.row,
        col: g.col,
        type: g.type,
        rotation: initRot,
        displayRotationDeg: initRot * 90,
        correctRotation: g.correctRotation,
        locked: g.locked,
        isOnSolutionPath: g.isOnSolutionPath,
        fixedPorts: g.fixedPorts,
        isFixedPortRequired: g.isFixedPortRequired,
        hasWater: false,
        isOnActivePath: false,
        isUnusedDisabled: false, // all pipes interactive again upon reset
        isHinted: false,
        leakingDirections: [],
      };
    });

    // Initial flow check
    const flow = calculateWaterFlow(
      initialCells,
      levelData.rows,
      levelData.cols,
      levelData.source,
      levelData.destinations || levelData.destination
    );

    const cellsWithWater = initialCells.map((c) => {
      const w = flow.waterGrid.get(`${c.row},${c.col}`);
      return {
        ...c,
        hasWater: !!w?.hasWater,
        waterFlowOrder: w?.order,
        leakingDirections: w?.leakingDirections || [],
      };
    });

    setCells(cellsWithWater);
    setReachedDestRows(flow.reachedDestRows || []);
    setMoves(0);
    setHintsLeft(3);
    setHintedCellId(null);
    setIsFlowingWater(false);
    setWaterReachedDest(false);
    setIsExtinguishing(false);
    setIsExtinguished(false);
    setIsWateringTree(false);
    setIsTreeSaved(false);
    setShowVictory(false);
    setIsPaused(false);
  };

  // Adjust tile sizing dynamically for large, clear board on mobile and desktop
  useEffect(() => {
    const updateSize = () => {
      if (!boardContainerRef.current) return;
      const rect = boardContainerRef.current.getBoundingClientRect();
      const availWidth = rect.width - 20; // padding
      const availHeight = rect.height - 20;

      // cols + source pump (0.85) + destination object (1.45) + margins
      const colFit = Math.floor(availWidth / (levelData.cols + 2.35));
      const rowFit = Math.floor(availHeight / (levelData.rows + 0.25));

      const calculated = Math.min(colFit, rowFit);
      // Responsive pipe sizing (28px - 88px) to cleanly fit up to 8x8 boards
      setTileSize(Math.max(28, Math.min(88, calculated)));
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [levelData]);

  // Countdown timer tick effect - runs only when active and unpaused
  useEffect(() => {
    if (!isTimerRunning || isPaused || isFlowingWater || showVictory || showTimeUp) {
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);
          setIsTimerRunning(false);
          soundManager.playTimeUp();
          setShowTimeUp(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isTimerRunning, isPaused, isFlowingWater, showVictory, showTimeUp]);

  // Time-based three-star rating calculation formula:
  // elapsedTime = timeLimit - remainingTime
  // if elapsedTime <= threeStarThreshold: 3 stars
  // else if elapsedTime <= twoStarThreshold: 2 stars
  // else if elapsedTime <= oneStarThreshold: 1 star
  // else: 0 stars
  const calculateStarsByTime = (elapsed: number): number => {
    if (elapsed <= threeStarThresh) return 3;
    if (elapsed <= twoStarThresh) return 2;
    if (elapsed <= oneStarThresh) return 1;
    return 0;
  };

  const currentElapsed = Math.max(0, targetTime - timeLeft);
  const liveStars = calculateStarsByTime(currentElapsed);

  // Handle pipe tile tap
  const handlePipeClick = (clickedCell: PipeCell) => {
    if (isFlowingWater || showVictory || isPaused) return;

    soundManager.playRotate();
    const newMoves = moves + 1;
    setMoves(newMoves);

    // Clear active hint if tapping that cell
    if (hintedCellId === clickedCell.id) {
      setHintedCellId(null);
    }

    // Rotate cell 90 deg clockwise smoothly
    const nextCells = cells.map((cell) => {
      if (cell.id === clickedCell.id) {
        const curDeg = cell.displayRotationDeg !== undefined ? cell.displayRotationDeg : cell.rotation * 90;
        return {
          ...cell,
          rotation: rotateQuarter(cell.rotation),
          displayRotationDeg: curDeg + 90,
          isHinted: false,
        };
      }
      return cell;
    });

    // Check flow
    const flow = calculateWaterFlow(
      nextCells,
      levelData.rows,
      levelData.cols,
      levelData.source,
      levelData.destinations || levelData.destination
    );

    // Apply water connection state & leaks (and disable unused pipes when solved)
    const updatedCells = nextCells.map((c) => {
      const isPath = flow.activePathKeys.has(`${c.row},${c.col}`);
      const w = flow.waterGrid.get(`${c.row},${c.col}`);
      if (flow.reachedDestination) {
        return {
          ...c,
          hasWater: isPath, // water flows strictly through the complete connected route
          isOnActivePath: isPath,
          isUnusedDisabled: !isPath, // unused pipes disabled and darkened
          waterFlowOrder: isPath ? w?.order : undefined,
          leakingDirections: [],
        };
      }
      return {
        ...c,
        hasWater: !!w?.hasWater,
        isOnActivePath: false,
        isUnusedDisabled: false,
        waterFlowOrder: w?.order,
        leakingDirections: w?.leakingDirections || [],
      };
    });

    setCells(updatedCells);
    setReachedDestRows(flow.reachedDestRows || []);

    // If there is an active spray leak at an open connection, play spray hiss sound
    if (!flow.reachedDestination && updatedCells.some((c) => c.hasWater && c.leakingDirections && c.leakingDirections.length > 0)) {
      soundManager.playSprayLeak();
    }

    // Check if water reached the target!
    if (flow.reachedDestination) {
      triggerSuccessSequence(newMoves, flow.pathCoords);
    }
  };

  // Sequence when the complete pipeline is connected
  const triggerSuccessSequence = (
    finalMoves: number,
    path: Array<{ row: number; col: number }>
  ) => {
    setIsFlowingWater(true);
    setIsTimerRunning(false);

    // Calculate time-based stars
    const finalElapsed = Math.max(1, targetTime - timeLeft);
    const calculatedStars = calculateStarsByTime(finalElapsed);
    setCompletedTime(finalElapsed);
    setEarnedStars(calculatedStars);

    // Sequentially play water sounds along the path
    path.forEach((p, idx) => {
      setTimeout(() => {
        soundManager.playWaterFlow(idx);
      }, idx * 110);
    });

    const flowDuration = Math.max(500, path.length * 110 + 200);

    setTimeout(() => {
      setWaterReachedDest(true);

      if (levelData.mode === 'fire') {
        setIsExtinguishing(true);
        soundManager.playExtinguish();

        setTimeout(() => {
          setIsExtinguished(true);
          setIsExtinguishing(false);

          onLevelComplete(levelData.id, finalMoves, calculatedStars, finalElapsed);

          setTimeout(() => {
            setShowVictory(true);
          }, 800);
        }, 1200);
      } else {
        setIsWateringTree(true);
        soundManager.playTreeBloom();

        setTimeout(() => {
          setIsTreeSaved(true);
          setIsWateringTree(false);

          onLevelComplete(levelData.id, finalMoves, calculatedStars, finalElapsed);

          setTimeout(() => {
            setShowVictory(true);
          }, 800);
        }, 1300);
      }
    }, flowDuration);
  };

  // Smart, reliable Hint: find the first pipe along the intended solution path from source forward that is currently misaligned
  const handleUseHint = () => {
    if (hintsLeft <= 0 || isFlowingWater || showVictory) return;

    let candidate: PipeCell | undefined = undefined;

    // 1. Trace along the level's verified solutionPath in order from source to destination
    if (levelData.solutionPath && levelData.solutionPath.length > 0) {
      for (const p of levelData.solutionPath) {
        const found = cells.find((c) => c.row === p.row && c.col === p.col);
        if (
          found &&
          !found.locked &&
          found.type !== 'block' &&
          found.type !== 'empty' &&
          found.correctRotation !== undefined &&
          !isEquivalentRotation(found.type, found.rotation, found.correctRotation)
        ) {
          candidate = found;
          break;
        }
      }
    }

    // 2. Fallback: any cell flagged with isOnSolutionPath that is misaligned
    if (!candidate) {
      candidate = cells.find(
        (c) =>
          c.isOnSolutionPath &&
          !c.locked &&
          c.type !== 'block' &&
          c.type !== 'empty' &&
          c.correctRotation !== undefined &&
          !isEquivalentRotation(c.type, c.rotation, c.correctRotation)
      );
    }

    // 3. Fallback: any rotatable cell on the grid with misaligned correctRotation
    if (!candidate) {
      candidate = cells.find(
        (c) =>
          !c.locked &&
          c.type !== 'block' &&
          c.type !== 'empty' &&
          c.correctRotation !== undefined &&
          !isEquivalentRotation(c.type, c.rotation, c.correctRotation)
      );
    }

    if (candidate) {
      soundManager.playHint();
      setHintsLeft((prev) => prev - 1);
      setHintedCellId(candidate.id);

      // Auto-align this pipe directly to correct rotation with visual feedback
      const nextCells = cells.map((cell) => {
        if (cell.id === candidate!.id) {
          const curDeg = cell.displayRotationDeg !== undefined ? cell.displayRotationDeg : cell.rotation * 90;
          return {
            ...cell,
            rotation: cell.correctRotation!,
            displayRotationDeg: curDeg + 90,
            isHinted: true,
          };
        }
        return cell;
      });

      const flow = calculateWaterFlow(
        nextCells,
        levelData.rows,
        levelData.cols,
        levelData.source,
        levelData.destinations || levelData.destination
      );

      const updated = nextCells.map((c) => {
        const isPath = flow.activePathKeys.has(`${c.row},${c.col}`);
        const w = flow.waterGrid.get(`${c.row},${c.col}`);
        if (flow.reachedDestination) {
          return {
            ...c,
            hasWater: isPath,
            isOnActivePath: isPath,
            isUnusedDisabled: !isPath,
            waterFlowOrder: isPath ? w?.order : undefined,
            leakingDirections: [],
          };
        }
        return {
          ...c,
          hasWater: !!w?.hasWater,
          isOnActivePath: false,
          isUnusedDisabled: false,
          waterFlowOrder: w?.order,
          leakingDirections: w?.leakingDirections || [],
        };
      });

      setCells(updated);
      setReachedDestRows(flow.reachedDestRows || []);
      setMoves((m) => m + 1);

      if (flow.reachedDestination) {
        triggerSuccessSequence(moves + 1, flow.pathCoords);
      }
    }
  };

  const isFire = levelData.mode === 'fire';

  // Create grid 2D array
  const gridCells = useMemo(() => {
    const map = new Map<string, PipeCell>();
    cells.forEach((c) => map.set(`${c.row},${c.col}`, c));
    return map;
  }, [cells]);

  return (
    <div className="w-full h-full max-w-2xl lg:max-w-3xl mx-auto flex flex-col bg-stone-dungeon text-white select-none overflow-hidden relative">
      {/* Compact Top Header Bar matching reference image */}
      <div className="flex items-center justify-between px-3 py-2 bg-stone-950/90 border-b border-stone-800/80 shrink-0 z-20">
        {/* Left: BACK button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundManager.playPop();
              onBackToMenu();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800/90 hover:bg-stone-700 active:scale-95 border border-stone-600/80 shadow-md text-stone-200 text-xs font-bold transition-all cursor-pointer"
            title="Back to Menu"
          >
            <ArrowLeft className="w-4 h-4 text-sky-400" />
            <span className="tracking-wide">BACK</span>
          </button>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black tracking-wide text-stone-100 uppercase drop-shadow">
                LEVEL {levelData.id}
              </span>
              <span
                className={`text-[9px] px-1.5 py-0.5 rounded font-black uppercase tracking-wider ${
                  isFire
                    ? 'bg-rose-950/80 text-rose-300 border border-rose-600/40'
                    : 'bg-emerald-950/80 text-emerald-300 border border-emerald-600/40'
                }`}
              >
                {isFire ? 'FIRE' : 'PLANT'}
              </span>
              {levelData.destinations && levelData.destinations.length > 1 && (
                <span className="text-[9px] px-1.5 py-0.5 rounded font-black uppercase tracking-wider bg-sky-950/90 text-sky-300 border border-sky-500/50 shadow">
                  {isFire ? '2 HOUSES' : '2 FLOWERS'} ({reachedDestRows.length}/{levelData.destinations.length})
                </span>
              )}
            </div>
            <div className="text-[10px] text-stone-400 font-medium truncate max-w-[120px]">
              {levelData.title}
            </div>
          </div>
        </div>

        {/* Right: Timer, Moves Counter, Stars, and Controls */}
        <div className="flex items-center gap-1.5">
          {/* Countdown Timer */}
          <div
            className={`px-2 py-1 rounded-xl border text-center shadow-inner flex flex-col items-center justify-center min-w-[54px] transition-colors ${
              timeLeft <= 10
                ? 'bg-rose-950/80 border-rose-500/80 animate-pulse text-rose-400'
                : 'bg-stone-800/90 border-stone-700/80 text-sky-300'
            }`}
          >
            <div className="flex items-center gap-1 leading-tight">
              <Clock className={`w-2.5 h-2.5 ${timeLeft <= 10 ? 'text-rose-400 animate-spin' : 'text-sky-400'}`} />
              <span className="text-[8px] uppercase tracking-wider text-stone-400 font-extrabold leading-tight">
                TIME
              </span>
            </div>
            <span className="text-xs font-black leading-none mt-0.5">
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </span>
          </div>

          {/* Moves / Par indicator */}
          <div className="px-2 py-1 rounded-xl bg-stone-800/90 border border-stone-700/80 text-center shadow-inner">
            <span className="block text-[8px] uppercase tracking-wider text-stone-400 font-extrabold leading-tight">
              MOVES
            </span>
            <span className="text-xs font-black text-amber-400 leading-none">
              {moves}
              <span className="text-[10px] font-normal text-stone-400">/{levelData.parMoves}</span>
            </span>
          </div>

          {/* Current Star preview */}
          <div className="flex gap-0.5 px-1.5 py-1.5 rounded-xl bg-stone-800/90 border border-stone-700/80">
            {[1, 2, 3].map((starNum) => (
              <Star
                key={starNum}
                className={`w-3.5 h-3.5 ${
                  starNum <= liveStars
                    ? 'fill-amber-400 stroke-amber-500'
                    : 'fill-stone-700 stroke-stone-600'
                }`}
              />
            ))}
          </div>

          {/* Quick Restart */}
          <button
            onClick={() => {
              soundManager.playPop();
              initLevel();
            }}
            disabled={isFlowingWater}
            className="p-1.5 rounded-xl bg-stone-800/90 hover:bg-stone-700 active:scale-95 text-stone-300 border border-stone-700 cursor-pointer disabled:opacity-40"
            title="Restart"
          >
            <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
          </button>

          {/* Pause */}
          <button
            onClick={() => {
              soundManager.playPop();
              setIsPaused(true);
            }}
            className="p-1.5 rounded-xl bg-stone-800/90 hover:bg-stone-700 active:scale-95 text-stone-300 border border-stone-700 cursor-pointer"
            title="Pause"
          >
            <Pause className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Pipe Puzzle Board Area - Full Screen Centerpiece */}
      <div
        ref={boardContainerRef}
        className="flex-1 w-full flex items-center justify-center p-2 relative overflow-hidden"
      >
        {/* Floating Celebration Banner when Complete */}
        {waterReachedDest && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-2xl bg-stone-900/95 border-2 border-emerald-400 shadow-2xl shadow-emerald-500/30 flex items-center gap-2 animate-bounce">
            <span className="text-xl">{isFire ? '🚒' : '🌸'}</span>
            <span className="text-xs font-black tracking-wider text-emerald-300 uppercase">
              {isFire
                ? (levelData.destinations && levelData.destinations.length > 1 ? 'BOTH HOUSES SAVED!' : 'FIRE EXTINGUISHED!')
                : (levelData.destinations && levelData.destinations.length > 1 ? 'BOTH FLOWERS BLOOMING!' : 'PLANT SAVED & BLOOMING!')}
            </span>
          </div>
        )}

        {/* Guidance banner when partial destinations are watered */}
        {!waterReachedDest && reachedDestRows.length > 0 && levelData.destinations && levelData.destinations.length > 1 && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 px-3.5 py-1.5 rounded-2xl bg-sky-950/95 border border-sky-400/50 shadow-xl flex items-center gap-2 text-sky-200 text-xs font-black tracking-wide animate-pulse">
            <span className="text-base">💧</span>
            <span>
              {isFire
                ? `${reachedDestRows.length}/${levelData.destinations.length} Houses Saved — Connect second path to finish!`
                : `${reachedDestRows.length}/${levelData.destinations.length} Flowers Watered — Water both flowers to finish!`}
            </span>
          </div>
        )}

        <div className="flex items-center justify-center">
          {/* Water Source Inlet on the left (aligned with source row) */}
          <div
            className="flex flex-col items-center justify-around mr-0 shrink-0"
            style={{
              height: levelData.rows * tileSize,
            }}
          >
            {Array.from({ length: levelData.rows }).map((_, rIdx) => {
              const isSourceRow = rIdx === levelData.source.row;
              return (
                <div
                  key={`source-col-${rIdx}`}
                  style={{ width: tileSize * 0.85, height: tileSize }}
                  className="flex items-center justify-end"
                >
                  {isSourceRow && (
                    <WaterSourceInlet isFlowing={isFlowingWater || true} size={tileSize * 0.85} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Ancient Carved Stone Board Slab containing the Pipes */}
          <div
            className="grid gap-0 p-0 rounded-xl stone-board-slab relative shadow-2xl border-2 border-stone-700/60"
            style={{
              gridTemplateColumns: `repeat(${levelData.cols}, minmax(0, 1fr))`,
            }}
          >
            {Array.from({ length: levelData.rows }).map((_, r) =>
              Array.from({ length: levelData.cols }).map((_, c) => {
                const cell = gridCells.get(`${r},${c}`);
                if (!cell) {
                  return (
                    <div
                      key={`empty-${r}-${c}`}
                      className="stone-cell-recess"
                      style={{ width: tileSize, height: tileSize }}
                    />
                  );
                }

                return (
                  <div
                    key={`cell-wrapper-${cell.id}`}
                    className="relative flex items-center justify-center overflow-visible bg-stone-900/40"
                    style={{ width: tileSize, height: tileSize }}
                  >
                    <PipePiece
                      cell={cell}
                      size={tileSize}
                      onClick={handlePipeClick}
                      isFlowingWater={isFlowingWater}
                    />
                  </div>
                );
              })
            )}
          </div>

          {/* Destination Object & Connector on right (directly connected at destination row) */}
          <div
            className="flex flex-col items-center justify-around ml-0 shrink-0"
            style={{
              height: levelData.rows * tileSize,
            }}
          >
            {Array.from({ length: levelData.rows }).map((_, rIdx) => {
              const destRows = levelData.destinations
                ? levelData.destinations.map((d) => d.row)
                : [levelData.destination.row];
              const isDestRow = destRows.includes(rIdx);
              const destHasWater = isDestRow && reachedDestRows.includes(rIdx);

              return (
                <div
                  key={`dest-col-${rIdx}`}
                  style={{ width: tileSize * 1.55, height: tileSize }}
                  className="flex items-center justify-start"
                >
                  {isDestRow && (
                    <DestinationConnector
                      mode={levelData.mode}
                      hasWater={destHasWater}
                      isExtinguishedOrSaved={
                        (levelData.mode === 'fire' ? isExtinguished : isTreeSaved) &&
                        waterReachedDest
                      }
                      size={tileSize}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Controls Bar */}
      <div className="flex items-center justify-around p-3 bg-stone-950/90 border-t border-stone-800/80 shrink-0 z-20">
        {/* Restart Button */}
        <button
          onClick={() => {
            soundManager.playPop();
            initLevel();
          }}
          disabled={isFlowingWater}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-800/90 hover:bg-stone-700 active:scale-95 border border-stone-700 text-stone-200 text-xs font-bold transition-transform disabled:opacity-40 cursor-pointer shadow-md"
        >
          <RotateCcw className="w-4 h-4 text-emerald-400" />
          <span>Reset</span>
        </button>

        {/* Hint Button */}
        <button
          onClick={handleUseHint}
          disabled={hintsLeft <= 0 || isFlowingWater}
          className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-95 text-white text-xs font-black shadow-md shadow-amber-500/20 transition-transform disabled:opacity-40 cursor-pointer"
        >
          <Lightbulb className="w-4 h-4 fill-white" />
          <span>Hint ({hintsLeft})</span>
        </button>

        {/* Sound Quick Toggle */}
        <button
          onClick={() => {
            onToggleSound();
          }}
          className="p-2 rounded-xl bg-stone-800/90 hover:bg-stone-700 active:scale-95 border border-stone-700 text-stone-300 transition-transform cursor-pointer shadow-md"
          title="Toggle Sound"
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <VolumeX className="w-4 h-4 text-stone-400" />
          )}
        </button>
      </div>

      {/* Victory Celebration Modal */}
      {showVictory && (
        <VictoryModal
          levelId={levelData.id}
          mode={levelData.mode}
          moves={moves}
          parMoves={levelData.parMoves}
          stars={earnedStars}
          completionTime={completedTime}
          bestTime={progress.bestTimes?.[levelData.id]}
          hasNextLevel={levelData.id < 30}
          onNextLevel={onNextLevel}
          onReplay={initLevel}
          onLevelMap={onSelectLevel}
          onHome={onBackToMenu}
        />
      )}

      {/* Time's Up Modal */}
      {showTimeUp && (
        <TimeUpModal
          levelId={levelData.id}
          timeLimit={targetTime}
          moves={moves}
          onRetry={initLevel}
          onLevelMap={onSelectLevel}
          onHome={onBackToMenu}
        />
      )}

      {/* Pause Menu Modal */}
      {isPaused && (
        <PauseModal
          onResume={() => setIsPaused(false)}
          onRestart={() => {
            setIsPaused(false);
            initLevel();
          }}
          onLevelSelect={() => {
            setIsPaused(false);
            onSelectLevel();
          }}
          onHome={() => {
            setIsPaused(false);
            onBackToMenu();
          }}
          soundEnabled={soundEnabled}
          musicEnabled={musicEnabled}
          onToggleSound={onToggleSound}
          onToggleMusic={onToggleMusic}
        />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          soundEnabled={soundEnabled}
          musicEnabled={musicEnabled}
          onToggleSound={onToggleSound}
          onToggleMusic={onToggleMusic}
          onResetProgress={onResetProgress}
        />
      )}
    </div>
  );
};
