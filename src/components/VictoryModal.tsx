import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { GameMode } from '../types/game';
import { soundManager } from '../audio/soundManager';
import { Play, RotateCcw, Home, Star, Map, Clock, Award, Sparkles } from 'lucide-react';

interface VictoryModalProps {
  levelId: number;
  mode: GameMode;
  moves: number;
  parMoves: number;
  stars: number;
  completionTime: number; // in seconds
  bestTime?: number; // in seconds
  hasNextLevel: boolean;
  onNextLevel: () => void;
  onReplay: () => void;
  onLevelMap: () => void;
  onHome: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  levelId,
  mode,
  moves,
  parMoves,
  stars,
  completionTime,
  bestTime,
  hasNextLevel,
  onNextLevel,
  onReplay,
  onLevelMap,
  onHome,
}) => {
  const [animatedStars, setAnimatedStars] = useState<number>(0);

  useEffect(() => {
    // Sound & Confetti celebration
    soundManager.playVictory();

    // Trigger confetti cannon
    const duration = stars === 3 ? 3.5 * 1000 : 2.0 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: stars === 3 ? 5 : 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#38bdf8', '#4ade80', '#f59e0b', '#ec4899', '#fde047'],
      });
      confetti({
        particleCount: stars === 3 ? 5 : 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#38bdf8', '#4ade80', '#f59e0b', '#ec4899', '#fde047'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    // Staggered star animation popping one by one
    const starTimers: NodeJS.Timeout[] = [];
    for (let i = 1; i <= stars; i++) {
      const timer = setTimeout(() => {
        setAnimatedStars(i);
        soundManager.playStar(i - 1);
      }, 400 + i * 400);
      starTimers.push(timer);
    }

    return () => {
      starTimers.forEach(clearTimeout);
    };
  }, [stars]);

  const isFire = mode === 'fire';
  const isNewBest = bestTime === undefined || completionTime <= bestTime;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 border-2 border-emerald-500/50 rounded-3xl p-6 shadow-2xl text-center transform transition-all scale-100 animate-scale-up">
        {/* Glow Accent */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-28 h-28 bg-emerald-400/25 blur-2xl rounded-full pointer-events-none" />

        {/* Mode Trophy Icon */}
        <div className="w-16 h-16 mx-auto -mt-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 border-4 border-stone-900 shadow-xl flex items-center justify-center text-3xl">
          {isFire ? '🚒' : '🌱'}
        </div>

        {/* Title */}
        <h2 className="mt-3 text-2xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-sky-300 uppercase">
          {isFire ? 'FIRE EXTINGUISHED!' : 'TREE REVIVED!'}
        </h2>
        <p className="text-stone-300 text-xs font-semibold mt-0.5">
          Level {levelId} Complete!
        </p>

        {/* 3 Stars display with staggered animation */}
        <div className="flex justify-center items-center gap-3 my-4">
          {[1, 2, 3].map((starNum) => {
            const isEarned = starNum <= animatedStars;
            return (
              <div
                key={starNum}
                className={`transition-all duration-500 transform ${
                  isEarned
                    ? 'scale-110 text-amber-400 drop-shadow-[0_0_14px_rgba(251,191,36,0.9)] animate-bounce'
                    : 'scale-90 text-stone-700'
                }`}
              >
                <Star
                  className={`w-11 h-11 ${
                    isEarned
                      ? 'fill-amber-400 stroke-amber-500 drop-shadow-md'
                      : 'fill-stone-800 stroke-stone-700'
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* 3-Star special accomplishment tag */}
        {stars === 3 && animatedStars === 3 && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-3 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-xs font-black uppercase tracking-wider animate-pulse shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>PERFECT 3 STARS!</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </div>
        )}

        {/* Comprehensive Stats Card */}
        <div className="bg-stone-950/80 rounded-2xl p-3 border border-stone-800/80 mb-5 shadow-inner">
          <div className="grid grid-cols-3 gap-2 text-center divide-x divide-stone-800">
            {/* Time */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-stone-400 uppercase tracking-wider font-bold flex items-center gap-1">
                <Clock className="w-2.5 h-2.5 text-sky-400" />
                Time
              </span>
              <span className="text-base font-black text-sky-400 mt-0.5">
                {completionTime}s
              </span>
              {isNewBest && (
                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-tighter">
                  Best!
                </span>
              )}
            </div>

            {/* Best Time */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-stone-400 uppercase tracking-wider font-bold flex items-center gap-1">
                <Award className="w-2.5 h-2.5 text-amber-400" />
                Best
              </span>
              <span className="text-base font-black text-stone-200 mt-0.5">
                {bestTime ? `${bestTime}s` : `${completionTime}s`}
              </span>
              <span className="text-[9px] text-stone-500 font-medium">Record</span>
            </div>

            {/* Moves */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-stone-400 uppercase tracking-wider font-bold">
                Moves
              </span>
              <span className="text-base font-black text-emerald-400 mt-0.5">
                {moves}
              </span>
              <span className="text-[9px] text-stone-500 font-medium">
                Par: {parMoves}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          {hasNextLevel ? (
            <button
              onClick={() => {
                soundManager.playPop();
                onNextLevel();
              }}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-sm tracking-wide shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              NEXT LEVEL
            </button>
          ) : (
            <button
              onClick={() => {
                soundManager.playPop();
                onLevelMap();
              }}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-extrabold text-sm tracking-wide shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <Award className="w-4 h-4" />
              ALL 30 LEVELS COMPLETED!
            </button>
          )}

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => {
                soundManager.playPop();
                onReplay();
              }}
              className="py-2.5 px-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs flex flex-col items-center justify-center gap-1 transition-transform active:scale-95 border border-stone-700 cursor-pointer"
              title="Retry Level"
            >
              <RotateCcw className="w-4 h-4 text-amber-400" />
              <span>Retry</span>
            </button>

            <button
              onClick={() => {
                soundManager.playPop();
                onLevelMap();
              }}
              className="py-2.5 px-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs flex flex-col items-center justify-center gap-1 transition-transform active:scale-95 border border-stone-700 cursor-pointer"
              title="Level Map"
            >
              <Map className="w-4 h-4 text-sky-400" />
              <span>Map</span>
            </button>

            <button
              onClick={() => {
                soundManager.playPop();
                onHome();
              }}
              className="py-2.5 px-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs flex flex-col items-center justify-center gap-1 transition-transform active:scale-95 border border-stone-700 cursor-pointer"
              title="Main Menu"
            >
              <Home className="w-4 h-4 text-emerald-400" />
              <span>Menu</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
