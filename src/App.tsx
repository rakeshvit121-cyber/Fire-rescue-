import React, { useState, useEffect } from 'react';
import { loadUserProgress, recordLevelSuccess, resetAllProgress, saveLastPlayedLevel } from './utils/storage';
import { loadLevel, TOTAL_LEVELS } from './data/levels';
import { GameMode, LevelData, UserProgress } from './types/game';
import { soundManager } from './audio/soundManager';
import { SplashScreen } from './components/SplashScreen';
import { MainMenu } from './components/MainMenu';
import { LevelSelect } from './components/LevelSelect';
import { GameBoard } from './components/GameBoard';
import { SettingsModal } from './components/SettingsModal';

type AppScreen = 'splash' | 'menu' | 'game' | 'levels';

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('splash');
  const [progress, setProgress] = useState<UserProgress>(loadUserProgress());
  const [currentLevelId, setCurrentLevelId] = useState<number>(() => {
    const saved = loadUserProgress();
    return saved.lastPlayedLevel || saved.unlockedLevel || 1;
  });
  const [levelFilter, setLevelFilter] = useState<'all' | 'fire' | 'tree'>('all');
  const [showSettings, setShowSettings] = useState<boolean>(false);

  // Audio state
  const [soundEnabled, setSoundEnabled] = useState<boolean>(soundManager.isSoundEnabled());
  const [musicEnabled, setMusicEnabled] = useState<boolean>(soundManager.isMusicEnabled());

  // Current level data
  const [currentLevelData, setCurrentLevelData] = useState<LevelData>(() => loadLevel(1));

  // Sync level data whenever currentLevelId changes
  useEffect(() => {
    setCurrentLevelData(loadLevel(currentLevelId));
    saveLastPlayedLevel(currentLevelId);
  }, [currentLevelId]);

  const handleStartGame = (levelId?: number) => {
    const targetId = levelId ?? Math.min(progress.unlockedLevel, TOTAL_LEVELS);
    setCurrentLevelId(targetId);
    setScreen('game');
  };

  const handleFireMode = () => {
    // Find next fire level or open filtered level select
    setLevelFilter('fire');
    setScreen('levels');
  };

  const handleTreeMode = () => {
    // Find next tree level or open filtered level select
    setLevelFilter('tree');
    setScreen('levels');
  };

  const handleLevelComplete = (lvlId: number, moves: number, stars: number, completionTime?: number) => {
    const updated = recordLevelSuccess(lvlId, moves, stars, completionTime);
    setProgress({ ...updated });
  };

  const handleNextLevel = () => {
    if (currentLevelId < TOTAL_LEVELS) {
      setCurrentLevelId((prev) => prev + 1);
    } else {
      setScreen('levels');
    }
  };

  const handleToggleSound = () => {
    const newState = soundManager.toggleSound();
    setSoundEnabled(newState);
  };

  const handleToggleMusic = () => {
    const newState = soundManager.toggleMusic();
    setMusicEnabled(newState);
  };

  const handleResetProgress = () => {
    const fresh = resetAllProgress();
    setProgress({ ...fresh });
    setCurrentLevelId(1);
    setShowSettings(false);
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-black flex items-center justify-center font-sans">
      {/* Proper full-screen viewport container: 100vw x 100vh, responsive without browser-like margins */}
      <div className="w-full h-full max-w-full max-h-full bg-stone-dungeon shadow-2xl relative flex flex-col overflow-hidden">
        {screen === 'splash' && (
          <SplashScreen onStart={() => setScreen('menu')} />
        )}

        {screen === 'menu' && (
          <MainMenu
            progress={progress}
            onPlay={() => handleStartGame()}
            onFireMode={handleFireMode}
            onTreeMode={handleTreeMode}
            onLevels={() => {
              setLevelFilter('all');
              setScreen('levels');
            }}
            onSettings={() => setShowSettings(true)}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
          />
        )}

        {screen === 'levels' && (
          <LevelSelect
            progress={progress}
            onSelectLevel={(lvlId) => {
              handleStartGame(lvlId);
            }}
            onBack={() => setScreen('menu')}
            initialFilter={levelFilter}
          />
        )}

        {screen === 'game' && (
          <GameBoard
            levelData={currentLevelData}
            progress={progress}
            onLevelComplete={handleLevelComplete}
            onNextLevel={handleNextLevel}
            onBackToMenu={() => setScreen('menu')}
            onSelectLevel={() => {
              setLevelFilter('all');
              setScreen('levels');
            }}
            soundEnabled={soundEnabled}
            musicEnabled={musicEnabled}
            onToggleSound={handleToggleSound}
            onToggleMusic={handleToggleMusic}
            onResetProgress={handleResetProgress}
          />
        )}

        {/* Global Settings Modal */}
        {showSettings && (
          <SettingsModal
            onClose={() => setShowSettings(false)}
            soundEnabled={soundEnabled}
            musicEnabled={musicEnabled}
            onToggleSound={handleToggleSound}
            onToggleMusic={handleToggleMusic}
            onResetProgress={handleResetProgress}
          />
        )}
      </div>
    </div>
  );
}
