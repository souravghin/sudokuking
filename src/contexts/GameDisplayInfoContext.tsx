
"use client";

import type React from 'react';
import { createContext, useContext, useState, useMemo } from 'react';

interface GameDisplayInfoState {
  timer: number;
  mistakes: number;
  isGameActive: boolean;
}

interface GameDisplayInfoContextType extends GameDisplayInfoState {
  setTimer: (timer: number) => void;
  setMistakes: (mistakes: number) => void;
  setIsGameActive: (isActive: boolean) => void;
}

const GameDisplayInfoContext = createContext<GameDisplayInfoContextType | undefined>(undefined);

export function GameDisplayInfoProvider({ children }: { children: React.ReactNode }) {
  const [timer, setTimer] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);

  const value = useMemo(() => ({
    timer,
    mistakes,
    isGameActive,
    setTimer,
    setMistakes,
    setIsGameActive,
  }), [timer, mistakes, isGameActive]);

  return (
    <GameDisplayInfoContext.Provider value={value}>
      {children}
    </GameDisplayInfoContext.Provider>
  );
}

export function useGameDisplayInfo() {
  const context = useContext(GameDisplayInfoContext);
  if (context === undefined) {
    throw new Error('useGameDisplayInfo must be used within a GameDisplayInfoProvider');
  }
  return context;
}
