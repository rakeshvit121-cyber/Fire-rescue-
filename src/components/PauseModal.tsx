import React from 'react';
import { soundManager } from '../audio/soundManager';
import { Play, RotateCcw, Home, Volume2, VolumeX, Music, Map } from 'lucide-react';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onLevelSelect: () => void;
  onHome: () => void;
  soundEnabled: boolean;
  musicEnabled: boolean;
  onToggleSound: () => void;
  onToggleMusic: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onLevelSelect,
  onHome,
  soundEnabled,
  musicEnabled,
  onToggleSound,
  onToggleMusic,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xs bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-2xl text-center">
        <h2 className="text-2xl font-black text-white tracking-wider uppercase mb-5">
          GAME PAUSED
        </h2>

        {/* Audio controls row */}
        <div className="flex justify-center gap-3 mb-6">
          <button
            onClick={() => {
              onToggleSound();
            }}
            className={`p-3 rounded-2xl border transition-all cursor-pointer ${
              soundEnabled
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                : 'bg-slate-700/50 border-slate-600 text-slate-400'
            }`}
            title="Toggle Sound Effects"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          <button
            onClick={() => {
              onToggleMusic();
            }}
            className={`p-3 rounded-2xl border transition-all cursor-pointer ${
              musicEnabled
                ? 'bg-sky-500/20 border-sky-500 text-sky-400'
                : 'bg-slate-700/50 border-slate-600 text-slate-400'
            }`}
            title="Toggle Ambient Music"
          >
            <Music className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={onResume}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-extrabold text-base tracking-wide flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-md cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current" />
            RESUME
          </button>

          <button
            onClick={onRestart}
            className="w-full py-3 px-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-100 font-bold text-sm flex items-center justify-center gap-2 transition-transform active:scale-95 border border-slate-600 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Restart Level
          </button>

          <button
            onClick={onLevelSelect}
            className="w-full py-3 px-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-100 font-bold text-sm flex items-center justify-center gap-2 transition-transform active:scale-95 border border-slate-600 cursor-pointer"
          >
            <Map className="w-4 h-4 text-sky-400" />
            Level Map
          </button>

          <button
            onClick={onHome}
            className="w-full py-3 px-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold text-sm flex items-center justify-center gap-2 transition-transform active:scale-95 border border-slate-600 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            Main Menu
          </button>
        </div>
      </div>
    </div>
  );
};
