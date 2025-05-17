"use client";

import type React from 'react';
import { createContext, useContext } from 'react';
import type { GameState, Position, SudokuCellValue, Difficulty as DifficultyKey, GameMode } from '@/types/sudoku';

export interface SudokuContextType extends GameState {
  startGame: (difficulty: DifficultyKey) => void;
  selectCell: (pos: Position | null) => void;
  enterNumber: (num: SudokuCellValue) => void;
  togglePencilMark: (num: SudokuCellValue) => void;
  clearCell: () => void;
  toggleGameMode: () => void;
  toggleAutoCheck: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  requestHint: () => void;
  undo: () => void;
  redo: () => void;
  resetTimer: () => void;
  loadSavedGame: () => void;
  saveGame: () => void;
  newGame: (difficulty?: DifficultyKey) => void;
}

export const SudokuContext = createContext<SudokuContextType | undefined>(undefined);

export const useSudokuContext = () => {
  const context = useContext(SudokuContext);
  if (!context) {
    throw new Error('useSudokuContext must be used within a SudokuProvider');
  }
  return context;
};

// SudokuProvider will be part of SudokuGame.tsx or useSudokuGame.ts hook which provides the value
