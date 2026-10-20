import React, { useState } from 'react';
import { Volume2, VolumeX, Music, RotateCcw, X, HelpCircle, Check, AlertTriangle } from 'lucide-react';
import { soundManager } from '../audio/soundManager';

interface SettingsModalProps {
  onClose: () => void;
  soundEnabled: boolean;
  musicEnabled: boolean;
  onToggleSound: () => void;
  onToggleMusic: () => void;
  onResetProgress: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  onClose,
  soundEnabled,
  musicEnabled,
  onToggleSound,
  onToggleMusic,
  onResetProgress,
}) => {
  const [activeTab, setActiveTab] = useState<'settings' | 'guide'>('settings');
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md max-h-[90vh] bg-slate-800 border border-slate-700 rounded-3xl p-5 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-white tracking-wide">
              {activeTab === 'settings' ? 'SETTINGS' : 'HOW TO PLAY'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex gap-2 my-3 p-1 bg-slate-900 rounded-xl">
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Audio & Data
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'guide'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Guide & Rules
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-sm">
          {activeTab === 'settings' ? (
            <div className="space-y-4">
              {/* Sound FX row */}
              <div className="flex items-center justify-between p-3.5 bg-slate-700/60 rounded-2xl border border-slate-600/40">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                    {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="font-bold text-white">Sound Effects</div>
                    <div className="text-xs text-slate-400">Pipes, water flow, and fanfare</div>
                  </div>
                </div>
                <button
                  onClick={onToggleSound}
                  className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer ${
                    soundEnabled ? 'bg-emerald-500' : 'bg-slate-600'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-1 ${
                      soundEnabled ? 'left-6' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {/* Music row */}
              <div className="flex items-center justify-between p-3.5 bg-slate-700/60 rounded-2xl border border-slate-600/40">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-400">
                    <Music className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-white">Ambient Music</div>
                    <div className="text-xs text-slate-400">Gentle relaxing melody</div>
                  </div>
                </div>
                <button
                  onClick={onToggleMusic}
                  className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer ${
                    musicEnabled ? 'bg-sky-500' : 'bg-slate-600'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-1 ${
                      musicEnabled ? 'left-6' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {/* Reset Progress Section */}
              <div className="pt-2">
                {!confirmReset ? (
                  <button
                    onClick={() => setConfirmReset(true)}
                    className="w-full py-3 px-4 rounded-xl bg-rose-950/40 hover:bg-rose-900/40 text-rose-300 border border-rose-800/60 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset All Saved Progress
                  </button>
                ) : (
                  <div className="p-3 bg-rose-950/80 border border-rose-600 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 text-rose-300 font-bold text-xs">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      Clear all 30 levels and earned stars?
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          onResetProgress();
                          setConfirmReset(false);
                          soundManager.playPop();
                        }}
                        className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold cursor-pointer"
                      >
                        Yes, Reset
                      </button>
                      <button
                        onClick={() => setConfirmReset(false)}
                        className="flex-1 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs font-bold cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-3.5 text-slate-300">
              <div className="p-3 bg-slate-900/70 rounded-xl border border-slate-700/60 space-y-2">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <span>🎯</span> Objective
                </div>
                <p className="text-xs leading-relaxed text-slate-300">
                  Tap pipe tiles to rotate them 90° clockwise. Form a continuous, leak-free pipeline from the water source to extinguish burning houses or water thirsty trees.
                </p>
              </div>

              <div className="p-3 bg-slate-900/70 rounded-xl border border-slate-700/60 space-y-2.5">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <span>🔧</span> Pipe Types
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-slate-800 rounded-lg border border-slate-700 flex items-center gap-2">
                    <span className="text-xl">┃</span>
                    <div>
                      <div className="font-bold text-white">Straight</div>
                      <div className="text-[10px] text-slate-400">2 opposite sides</div>
                    </div>
                  </div>
                  <div className="p-2 bg-slate-800 rounded-lg border border-slate-700 flex items-center gap-2">
                    <span className="text-xl">┗</span>
                    <div>
                      <div className="font-bold text-white">Elbow / Corner</div>
                      <div className="text-[10px] text-slate-400">90-degree turn</div>
                    </div>
                  </div>
                  <div className="p-2 bg-slate-800 rounded-lg border border-slate-700 flex items-center gap-2">
                    <span className="text-xl">┣</span>
                    <div>
                      <div className="font-bold text-white">T-Junction</div>
                      <div className="text-[10px] text-slate-400">3-way splitter</div>
                    </div>
                  </div>
                  <div className="p-2 bg-slate-800 rounded-lg border border-slate-700 flex items-center gap-2">
                    <span className="text-xl">╋</span>
                    <div>
                      <div className="font-bold text-white">Cross</div>
                      <div className="text-[10px] text-slate-400">All 4 directions</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-900/70 rounded-xl border border-slate-700/60 space-y-1.5">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <span>⭐</span> Star Ratings
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Earn 3 stars by completing the pipeline within par moves. Water only travels when neighbor openings line up perfectly!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Done button */}
        <div className="pt-3 border-t border-slate-700">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-sm transition-transform active:scale-95 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
