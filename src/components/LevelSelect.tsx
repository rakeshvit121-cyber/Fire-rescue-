import React, { useState, useEffect, useRef } from 'react';
import { ALL_LEVEL_TEMPLATES } from '../data/levels';
import { UserProgress } from '../types/game';
import { ArrowLeft, Star, Lock, Play, Compass, Flame, Trees, Sparkles } from 'lucide-react';
import { soundManager } from '../audio/soundManager';

interface LevelSelectProps {
  progress: UserProgress;
  onSelectLevel: (levelId: number) => void;
  onBack: () => void;
  initialFilter?: 'all' | 'fire' | 'tree';
}

export const LevelSelect: React.FC<LevelSelectProps> = ({
  progress,
  onSelectLevel,
  onBack,
  initialFilter = 'all',
}) => {
  const [filter, setFilter] = useState<'all' | 'fire' | 'tree'>(initialFilter);
  const [wigglingLevelId, setWigglingLevelId] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const currentLevelRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to current level on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentLevelRef.current) {
        currentLevelRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [filter]);

  const scrollToCurrent = () => {
    soundManager.playPop();
    if (currentLevelRef.current) {
      currentLevelRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleLevelClick = (lvlId: number) => {
    const isUnlocked = lvlId <= progress.unlockedLevel;

    if (!isUnlocked) {
      // Vibrate only on locked, no text toast!
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try {
          navigator.vibrate([60, 40, 60]);
        } catch (_) {}
      }
      soundManager.playLockedClick();
      setWigglingLevelId(lvlId);
      setTimeout(() => setWigglingLevelId(null), 400);
      return;
    }

    soundManager.playPop();
    onSelectLevel(lvlId);
  };

  const maxStars = ALL_LEVEL_TEMPLATES.length * 3;
  const currentLevelId = Math.min(progress.unlockedLevel, ALL_LEVEL_TEMPLATES.length);

  // Group levels into 3-item rows for the winding snake map
  // Row 0: [1, 2, 3] (L to R)
  // Row 1: [6, 5, 4] (R to L) -> visually rendered [6, 5, 4]
  // Row 2: [7, 8, 9] (L to R)
  // Row 3: [12, 11, 10] (R to L)
  const COLS = 3;
  const rowsCount = Math.ceil(ALL_LEVEL_TEMPLATES.length / COLS);
  const mapRows: Array<{
    rowIndex: number;
    isReversed: boolean;
    levels: typeof ALL_LEVEL_TEMPLATES;
  }> = [];

  for (let r = 0; r < rowsCount; r++) {
    const startIdx = r * COLS;
    const endIdx = Math.min(startIdx + COLS, ALL_LEVEL_TEMPLATES.length);
    const rowSlice = ALL_LEVEL_TEMPLATES.slice(startIdx, endIdx);
    const isReversed = r % 2 === 1;

    // In display order:
    // When reversed, levels should go from right to left (col 2 has startIdx, col 1 has startIdx+1, col 0 has startIdx+2)
    const displayLevels = isReversed ? [...rowSlice].reverse() : rowSlice;

    mapRows.push({
      rowIndex: r,
      isReversed,
      levels: displayLevels,
    });
  }

  return (
    <div className="w-full h-full max-w-2xl lg:max-w-3xl mx-auto flex flex-col bg-stone-dungeon text-white select-none relative overflow-hidden">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-stone-800 bg-stone-950/95 backdrop-blur z-20 shrink-0 shadow-lg">
        <button
          onClick={() => {
            soundManager.playPop();
            onBack();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 transition-transform active:scale-95 cursor-pointer border border-stone-700 shadow-md text-xs font-bold"
          title="Back to Menu"
        >
          <ArrowLeft className="w-4 h-4 text-sky-400" />
          <span>BACK</span>
        </button>

        <div className="text-center">
          <h1 className="text-base font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400 uppercase">
            LEVEL MAP
          </h1>
          <div className="text-[10px] text-stone-400 font-bold tracking-wide">
            PROGRESS: LEVEL {currentLevelId}/{ALL_LEVEL_TEMPLATES.length}
          </div>
        </div>

        {/* Total Stars Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 font-black text-xs shadow-inner">
          <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500" />
          <span>{progress.totalStars}/{maxStars}</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between px-4 py-2 bg-stone-950/80 border-b border-stone-800/80 shrink-0 z-10 gap-2">
        <div className="flex gap-1.5 flex-1 max-w-xs">
          <button
            onClick={() => {
              soundManager.playPop();
              setFilter('all');
            }}
            className={`flex-1 py-1 px-2 rounded-xl text-[11px] font-black transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-emerald-500 text-white shadow-md'
                : 'bg-stone-800/80 text-stone-400 hover:text-white'
            }`}
          >
            All ({ALL_LEVEL_TEMPLATES.length})
          </button>
          <button
            onClick={() => {
              soundManager.playPop();
              setFilter('fire');
            }}
            className={`flex-1 py-1 px-2 rounded-xl text-[11px] font-black flex items-center justify-center gap-1 transition-all cursor-pointer ${
              filter === 'fire'
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-stone-800/80 text-stone-400 hover:text-white'
            }`}
          >
            <span>🔥</span> Fire
          </button>
          <button
            onClick={() => {
              soundManager.playPop();
              setFilter('tree');
            }}
            className={`flex-1 py-1 px-2 rounded-xl text-[11px] font-black flex items-center justify-center gap-1 transition-all cursor-pointer ${
              filter === 'tree'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-stone-800/80 text-stone-400 hover:text-white'
            }`}
          >
            <span>🌱</span> Tree
          </button>
        </div>

        <button
          onClick={scrollToCurrent}
          className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-sky-950/90 border border-sky-500/40 text-sky-300 text-[10px] font-bold hover:bg-sky-900 active:scale-95 cursor-pointer shadow"
          title="Scroll to current level"
        >
          <Compass className="w-3.5 h-3.5 text-sky-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Current</span>
        </button>
      </div>

      {/* Vertically Scrolling Winding Snake Path Map */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-4 py-8 relative scroll-smooth"
      >
        <div className="max-w-md mx-auto flex flex-col gap-8 relative pb-20">
          {mapRows.map(({ rowIndex, isReversed, levels }) => {
            const hasNextRow = rowIndex < rowsCount - 1;
            // The last level number in this row in sequence
            const rowEndLevelId = (rowIndex + 1) * COLS;
            const isTurnConnected = rowEndLevelId < progress.unlockedLevel;

            return (
              <div key={`row-${rowIndex}`} className="relative flex flex-col items-center">
                {/* Horizontal Level Buttons Row */}
                <div className="w-full flex items-center justify-between relative z-10 px-2 sm:px-6">
                  {/* Background horizontal pipe behind the nodes in this row */}
                  <div className="absolute top-[32px] left-8 right-8 h-4 pointer-events-none -z-10 flex items-center">
                    <div
                      className={`w-full h-3 rounded-full transition-all duration-500 shadow-md ${
                        levels.every((l) => l.id < progress.unlockedLevel)
                          ? 'bg-gradient-to-r from-sky-400 via-cyan-300 to-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.7)]'
                          : levels.some((l) => l.id <= progress.unlockedLevel)
                          ? 'bg-gradient-to-r from-sky-500 via-stone-700 to-stone-800'
                          : 'bg-stone-800 border-y border-stone-700/60'
                      }`}
                    />
                  </div>

                  {levels.map((lvl) => {
                    const isUnlocked = lvl.id <= progress.unlockedLevel;
                    const isCompleted = lvl.id < progress.unlockedLevel;
                    const isCurrent = lvl.id === progress.unlockedLevel;
                    const stars = progress.levelStars[lvl.id] || 0;
                    const isFire = lvl.mode === 'fire';
                    const isFilteredMatch = filter === 'all' || lvl.mode === filter;
                    const isWiggling = wigglingLevelId === lvl.id;

                    return (
                      <div
                        key={lvl.id}
                        ref={isCurrent ? currentLevelRef : undefined}
                        className={`flex flex-col items-center gap-1.5 transition-all duration-300 relative ${
                          isFilteredMatch ? 'opacity-100 scale-100' : 'opacity-35 scale-90'
                        } ${isWiggling ? 'animate-wiggle' : ''}`}
                      >
                        {/* Current Level Indicator Badge */}
                        {isCurrent && (
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 font-black text-[9px] uppercase tracking-wider shadow-lg shadow-amber-400/40 animate-bounce">
                            <Play className="w-2.5 h-2.5 fill-current" />
                            <span>PLAY</span>
                          </div>
                        )}

                        {/* Level Button */}
                        <button
                          onClick={() => handleLevelClick(lvl.id)}
                          className={`w-16 h-16 sm:w-18 sm:h-18 rounded-2xl flex flex-col items-center justify-center relative transition-all active:scale-95 cursor-pointer shadow-xl border-2 ${
                            isCurrent
                              ? 'bg-gradient-to-b from-amber-500 via-amber-600 to-orange-600 border-amber-300 shadow-amber-500/50 ring-4 ring-amber-400/60 ring-offset-2 ring-offset-stone-900 animate-pulse'
                              : isCompleted
                              ? 'bg-gradient-to-b from-sky-500 via-sky-600 to-cyan-700 border-sky-300 shadow-sky-500/40 hover:brightness-110'
                              : isUnlocked
                              ? 'bg-gradient-to-b from-stone-700 via-stone-800 to-stone-900 border-stone-500 shadow-stone-800 hover:brightness-110'
                              : 'bg-gradient-to-b from-stone-900 via-stone-950 to-black border-stone-800 text-stone-600 cursor-pointer opacity-75'
                          }`}
                        >
                          {/* Inner Circular Metallic Center */}
                          <div
                            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex flex-col items-center justify-center relative shadow-inner border ${
                              isCurrent
                                ? 'bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 border-amber-200 text-stone-950 font-black'
                                : isCompleted
                                ? 'bg-gradient-to-br from-sky-200 via-cyan-400 to-sky-600 border-sky-200 text-stone-950 font-black'
                                : isUnlocked
                                ? 'bg-gradient-to-br from-stone-400 via-stone-600 to-stone-800 border-stone-400 text-white font-black'
                                : 'bg-stone-900 border-stone-800 text-stone-500'
                            }`}
                          >
                            {isUnlocked ? (
                              <>
                                <span className="text-base sm:text-lg font-black tracking-tight leading-none">
                                  {lvl.id}
                                </span>
                                <span className="text-[8px] leading-none mt-0.5">
                                  {isFire ? '🔥' : '🌱'}
                                </span>
                              </>
                            ) : (
                              <div className="flex flex-col items-center justify-center">
                                <Lock className="w-4 h-4 text-stone-500" />
                                <span className="text-[9px] font-bold text-stone-600 leading-none mt-0.5">
                                  {lvl.id}
                                </span>
                              </div>
                            )}
                          </div>
                        </button>

                        {/* Three Star Badge below each level */}
                        <div
                          className={`flex items-center gap-0.5 px-2 py-0.5 rounded-full border shadow-sm ${
                            isCompleted
                              ? 'bg-stone-900/90 border-amber-500/40'
                              : 'bg-stone-950/80 border-stone-800'
                          }`}
                        >
                          {[1, 2, 3].map((starNum) => (
                            <Star
                              key={starNum}
                              className={`w-2.5 h-2.5 ${
                                starNum <= stars
                                  ? 'fill-amber-400 stroke-amber-500 drop-shadow-sm'
                                  : 'fill-stone-800 stroke-stone-700'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Vertical Elbow Pipe Connector between Rows on Alternating Ends */}
                {hasNextRow && (
                  <div
                    className={`w-full flex relative h-8 px-6 -my-1 ${
                      isReversed ? 'justify-start' : 'justify-end'
                    }`}
                  >
                    <div
                      className={`w-7 h-10 border-4 rounded-b-2xl transition-all duration-500 ${
                        isReversed
                          ? 'border-l-4 border-b-4 border-t-0 border-r-0 rounded-bl-2xl ml-4 sm:ml-7'
                          : 'border-r-4 border-b-4 border-t-0 border-l-0 rounded-br-2xl mr-4 sm:mr-7'
                      } ${
                        isTurnConnected
                          ? 'border-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.7)]'
                          : 'border-stone-700'
                      }`}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
