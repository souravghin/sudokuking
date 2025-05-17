export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';

interface DifficultySetting {
  name: string;
  description: string;
  filledCells: number; // Approximate or range, actual generation might vary
  maxHints: number;
}

export const DIFFICULTIES: Record<Difficulty, DifficultySetting> = {
  EASY: {
    name: 'Easy',
    description: 'Gentle puzzles to get started.',
    filledCells: 35, // More pre-filled cells
    maxHints: 5,
  },
  MEDIUM: {
    name: 'Medium',
    description: 'A balanced challenge.',
    filledCells: 30,
    maxHints: 3,
  },
  HARD: {
    name: 'Hard',
    description: 'Test your Sudoku skills.',
    filledCells: 25,
    maxHints: 2,
  },
  EXPERT: {
    name: 'Expert',
    description: 'For seasoned Sudoku masters.',
    filledCells: 20, // Fewer pre-filled cells
    maxHints: 1,
  },
};

export const GRID_SIZE = 9;
export const BOX_SIZE = 3;

export const LOCAL_STORAGE_GAME_KEY = 'sudokuKingGame';
export const LOCAL_STORAGE_STATS_KEY = 'sudokuKingStats';
