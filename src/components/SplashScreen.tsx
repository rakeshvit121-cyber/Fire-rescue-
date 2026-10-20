import React from 'react';
import { Droplets, Flame, Trees, Play } from 'lucide-react';
import { soundManager } from '../audio/soundManager';

interface SplashScreenProps {
  onStart: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onStart }) => {
  const handleStart = () => {
    soundManager.playPop();
    onStart();
  };

  return (
    <div
      onClick={handleStart}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between p-8 bg-stone-dungeon text-white select-none cursor-pointer"
    >
      {/* Top Badge */}
      <div className="pt-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300 font-extrabold text-xs tracking-wider uppercase">
          <Droplets className="w-4 h-4 text-sky-400 fill-sky-400 animate-pulse" />
          <span>HTML5 Mobile Puzzle</span>
        </div>
      </div>

      {/* Center Artwork & Logo */}
      <div className="flex flex-col items-center text-center my-auto">
        <div className="relative mb-4">
          {/* Pulsing ring aura */}
          <div className="absolute inset-0 bg-orange-500/20 blur-3xl rounded-full scale-125 animate-pulse" />

          {/* Official FIRE RESCUE Logo from reference */}
          <img
            src="/fire_rescue_logo.jpg"
            alt="Fire Rescue"
            className="w-64 sm:w-72 h-auto max-h-[40vh] object-contain drop-shadow-[0_15px_35px_rgba(234,88,12,0.4)] rounded-2xl animate-float"
          />
        </div>

        <p className="text-sm sm:text-base font-extrabold text-amber-300 drop-shadow">
          Connect the Pipes • Save the Day!
        </p>

        {/* Missions Preview */}
        <div className="flex gap-3 mt-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 font-bold text-xs">
            <span>🔥</span> Fire Rescue
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 font-bold text-xs">
            <span>🌲</span> Tree Rescue
          </div>
        </div>
      </div>

      {/* Bottom Tap to Start Prompt */}
      <div className="pb-6 flex flex-col items-center gap-3">
        <button
          onClick={handleStart}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 text-white font-black text-lg tracking-wider shadow-xl shadow-teal-500/30 flex items-center gap-2 animate-bounce cursor-pointer"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>TAP TO PLAY</span>
        </button>
        <span className="text-xs text-slate-500 font-medium">
          30 Handcrafted Missions • 100% Solvable
        </span>
      </div>
    </div>
  );
};
