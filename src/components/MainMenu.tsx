import React from 'react';
import { UserProgress } from '../types/game';
import { TOTAL_LEVELS } from '../data/levels';
import { Play, Flame, Trees, Map, Settings, Volume2, VolumeX, Star, Droplets } from 'lucide-react';
import { soundManager } from '../audio/soundManager';

interface MainMenuProps {
  progress: UserProgress;
  onPlay: () => void;
  onFireMode: () => void;
  onTreeMode: () => void;
  onLevels: () => void;
  onSettings: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  progress,
  onPlay,
  onFireMode,
  onTreeMode,
  onLevels,
  onSettings,
  soundEnabled,
  onToggleSound,
}) => {
  return (
    <div className="w-full h-full max-w-md mx-auto flex flex-col items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-[#070e1c] via-[#0a1628] to-[#040812] text-white select-none relative overflow-hidden">
      {/* Subtle background ambient glow matching uploaded artwork */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative background pipe silhouettes in the corners matching reference */}
      <div className="absolute top-0 left-0 w-24 h-24 border-l-4 border-t-4 border-slate-800/40 rounded-tl-3xl pointer-events-none" />
      <div className="absolute top-0 right-0 w-24 h-24 border-r-4 border-t-4 border-slate-800/40 rounded-tr-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-24 h-24 border-l-4 border-b-4 border-slate-800/40 rounded-bl-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-24 h-24 border-r-4 border-b-4 border-slate-800/40 rounded-br-3xl pointer-events-none" />

      {/* Top bar with audio, stars, settings */}
      <div className="w-full flex justify-between items-center z-10">
        <button
          onClick={() => {
            onToggleSound();
          }}
          className="p-2.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 hover:bg-slate-800 text-slate-300 transition-transform active:scale-95 cursor-pointer shadow-lg shadow-black/40"
          title="Toggle Sound"
        >
          {soundEnabled ? <Volume2 className="w-5 h-5 text-emerald-400" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
        </button>

        <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-amber-400/15 to-amber-500/20 border border-amber-400/40 text-amber-300 font-black text-xs shadow-inner">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span>{progress.totalStars} / {TOTAL_LEVELS * 3}</span>
        </div>

        <button
          onClick={() => {
            soundManager.playPop();
            onSettings();
          }}
          className="p-2.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 hover:bg-slate-800 text-slate-300 transition-transform active:scale-95 cursor-pointer shadow-lg shadow-black/40"
          title="Settings"
        >
          <Settings className="w-5 h-5 text-slate-300" />
        </button>
      </div>

      {/* Hero Logo Area featuring the uploaded artwork */}
      <div className="flex flex-col items-center justify-center my-auto z-10 w-full px-2">
        <div className="relative flex items-center justify-center">
          {/* Pulsing back aura */}
          <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-sky-500/20 rounded-full blur-2xl scale-110 pointer-events-none" />

          {/* Official FIRE RESCUE Logo from reference */}
          <img
            src="/fire_rescue_logo.jpg"
            alt="Fire Rescue"
            className="w-64 sm:w-72 md:w-80 h-auto max-h-[38vh] object-contain drop-shadow-[0_12px_28px_rgba(234,88,12,0.35)] rounded-2xl transition-transform hover:scale-[1.02] duration-300"
          />
        </div>

        {/* Mission subtitle badge */}
        <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-sky-500/30 text-sky-300 font-extrabold text-[11px] uppercase tracking-wider shadow">
          <Droplets className="w-3.5 h-3.5 text-sky-400" />
          <span>100 Challenging Water Missions</span>
        </div>
      </div>

      {/* Main Action Buttons */}
      <div className="w-full space-y-3 max-w-xs z-10 mb-2">
        {/* Play / Continue button with juicy 3D gradient */}
        <button
          onClick={() => {
            soundManager.playPop();
            onPlay();
          }}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-black text-lg tracking-wide shadow-xl shadow-orange-600/35 border-2 border-amber-300/60 flex items-center justify-center gap-3 transition-transform active:scale-95 cursor-pointer"
        >
          <Play className="w-6 h-6 fill-current text-white" />
          <span>PLAY LEVEL {progress.unlockedLevel}</span>
        </button>

        {/* Mode Split Buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => {
              soundManager.playPop();
              onFireMode();
            }}
            className="py-3 px-3 rounded-2xl bg-gradient-to-b from-rose-950/90 to-slate-950/90 border border-rose-500/50 hover:border-rose-400 text-rose-300 font-bold text-xs flex flex-col items-center justify-center gap-1 shadow-lg transition-transform active:scale-95 cursor-pointer"
          >
            <div className="flex items-center gap-1.5 font-black text-xs sm:text-sm text-rose-200">
              <Flame className="w-4 h-4 text-orange-400 fill-orange-500 animate-pulse" />
              FIRE RESCUE
            </div>
            <span className="text-[10px] text-rose-300/80">Save Burning Houses</span>
          </button>

          <button
            onClick={() => {
              soundManager.playPop();
              onTreeMode();
            }}
            className="py-3 px-3 rounded-2xl bg-gradient-to-b from-emerald-950/90 to-slate-950/90 border border-emerald-500/50 hover:border-emerald-400 text-emerald-300 font-bold text-xs flex flex-col items-center justify-center gap-1 shadow-lg transition-transform active:scale-95 cursor-pointer"
          >
            <div className="flex items-center gap-1.5 font-black text-xs sm:text-sm text-emerald-200">
              <Trees className="w-4 h-4 text-emerald-400" />
              TREE RESCUE
            </div>
            <span className="text-[10px] text-emerald-300/80">Water Thirsty Trees</span>
          </button>
        </div>

        {/* Level Map button */}
        <button
          onClick={() => {
            soundManager.playPop();
            onLevels();
          }}
          className="w-full py-3 px-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-black text-xs sm:text-sm flex items-center justify-center gap-2 border border-sky-500/40 shadow-lg shadow-black/50 transition-transform active:scale-95 cursor-pointer"
        >
          <Map className="w-4 h-4 text-sky-400" />
          <span>LEVEL SELECTION MAP</span>
        </button>
      </div>

      {/* Footer hint */}
      <div className="text-center text-[11px] text-slate-400 font-medium z-10 pb-1">
        Rotate pipes to connect water from source to destination
      </div>
    </div>
  );
};
