import React from 'react';
import { RotateCcw, Map, Home, Clock } from 'lucide-react';
import { soundManager } from '../audio/soundManager';

interface TimeUpModalProps {
  levelId: number;
  timeLimit: number;
  moves: number;
  onRetry: () => void;
  onLevelMap: () => void;
  onHome: () => void;
}

export const TimeUpModal: React.FC<TimeUpModalProps> = ({
  levelId,
  timeLimit,
  moves,
  onRetry,
  onLevelMap,
  onHome,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 border-2 border-rose-500/50 rounded-3xl p-6 shadow-2xl text-center transform transition-all scale-100 animate-scale-up">
        {/* Glow Accent */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-rose-500/20 blur-2xl rounded-full pointer-events-none" />

        {/* Alarm Clock Icon */}
        <div className="w-16 h-16 mx-auto -mt-12 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 border-4 border-stone-900 shadow-xl flex items-center justify-center text-white shadow-rose-500/30 animate-pulse">
          <Clock className="w-8 h-8 stroke-[2.5]" />
        </div>

        {/* Title */}
        <h2 className="mt-3 text-2xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-amber-300 to-rose-400 uppercase">
          TIME'S UP!
        </h2>
        <p className="text-stone-300 text-xs font-semibold mt-1">
          The water ran out of time on Level {levelId}!
        </p>

        {/* Stats card */}
        <div className="bg-stone-950/70 rounded-2xl p-3 border border-stone-800 flex justify-around items-center my-4">
          <div className="text-center">
            <span className="block text-[10px] text-stone-400 uppercase tracking-wider font-bold">
              Time Allowed
            </span>
            <span className="text-base font-black text-rose-400">{timeLimit}s</span>
          </div>
          <div className="w-px h-8 bg-stone-800" />
          <div className="text-center">
            <span className="block text-[10px] text-stone-400 uppercase tracking-wider font-bold">
              Moves Made
            </span>
            <span className="text-base font-black text-amber-400">{moves}</span>
          </div>
        </div>

        <p className="text-stone-400 text-[11px] mb-5">
          Rotate faster to connect the pipeline and earn stars!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={() => {
              soundManager.playPop();
              onRetry();
            }}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-white font-extrabold text-sm tracking-wider shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            TRY AGAIN
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => {
                soundManager.playPop();
                onLevelMap();
              }}
              className="flex-1 py-3 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-transform active:scale-95 border border-stone-700 cursor-pointer"
            >
              <Map className="w-4 h-4 text-sky-400" />
              Level Map
            </button>
            <button
              onClick={() => {
                soundManager.playPop();
                onHome();
              }}
              className="flex-1 py-3 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-transform active:scale-95 border border-stone-700 cursor-pointer"
            >
              <Home className="w-4 h-4 text-emerald-400" />
              Main Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
