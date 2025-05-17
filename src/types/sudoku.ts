import type { Difficulty as DifficultyKey } from '@/config/constants';

export type SudokuCellValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9; // 0 for empty

export interface SudokuCellData {
  value: SudokuCellValue;
  isPrefilled: boolean;
  isInvalid: boolean;
  pencilMarks: Set<SudokuCellValue>; // Store pencil marks, 0 is not used for pencil
  isHinted?: boolean; // If cell was revealed by a hint
  isSelected?: boolean; 
  isHighlighted?: boolean; // For highlighting related cells
}

export type SudokuGrid = SudokuCellData[][];
export type NakedSudokuGrid = SudokuCellValue[][];

export interface Position {
  row: number;
  col: number;
}

export type GameMode = 'pen' | 'pencil';

export interface GameState {
  difficulty: DifficultyKey | null;
  initialGrid: NakedSudokuGrid | null;
  currentGrid: SudokuGrid | null;
  solutionGrid: NakedSudokuGrid | null;
  selectedCell: Position | null;
  gameMode: GameMode;
  timer: number;
  timerActive: boolean;
  mistakes: number;
  isAutoCheckEnabled: boolean;
  isGameWon: boolean;
  isGamePaused: boolean;
  conflictingCells: Set<string>; // e.g., "0,1"
  undoStack: SudokuGrid[];
  redoStack: SudokuGrid[];
  hintsRemaining: number;
}
