
import type { NakedSudokuGrid, SudokuCellValue, SudokuGrid, Position } from '@/types/sudoku';
import { GRID_SIZE, BOX_SIZE, DIFFICULTIES, type Difficulty as DifficultyKey } from '@/config/constants';

// --- Sudoku Generation Logic ---

function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function isSafe(grid: NakedSudokuGrid, row: number, col: number, num: SudokuCellValue): boolean {
  if (num === 0) return true; // 0 is always "safe" as it represents an empty cell

  // Check row
  for (let c = 0; c < GRID_SIZE; c++) {
    if (grid[row][c] === num) {
      return false;
    }
  }

  // Check column
  for (let r = 0; r < GRID_SIZE; r++) {
    if (grid[r][col] === num) {
      return false;
    }
  }

  // Check 3x3 box
  const boxStartRow = row - (row % BOX_SIZE);
  const boxStartCol = col - (col % BOX_SIZE);
  for (let r = 0; r < BOX_SIZE; r++) {
    for (let c = 0; c < BOX_SIZE; c++) {
      if (grid[boxStartRow + r][boxStartCol + c] === num) {
        return false;
      }
    }
  }
  return true;
}

function findEmptyLocation(grid: NakedSudokuGrid, position: { row: number, col: number }): boolean {
  for (position.row = 0; position.row < GRID_SIZE; position.row++) {
    for (position.col = 0; position.col < GRID_SIZE; position.col++) {
      if (grid[position.row][position.col] === 0) {
        return true;
      }
    }
  }
  return false;
}

function solveSudoku(grid: NakedSudokuGrid): boolean {
  const position = { row: 0, col: 0 };

  if (!findEmptyLocation(grid, position)) {
    return true; // Grid is filled
  }

  const { row, col } = position;
  const numbers: SudokuCellValue[] = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]) as SudokuCellValue[];

  for (const num of numbers) {
    if (isSafe(grid, row, col, num)) {
      grid[row][col] = num;
      if (solveSudoku(grid)) {
        return true;
      }
      grid[row][col] = 0; // Backtrack
    }
  }
  return false;
}

function generateFullRandomSolution(): NakedSudokuGrid {
  const grid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0)) as NakedSudokuGrid;
  solveSudoku(grid); // Fills the grid with a solution
  return grid;
}

function createPuzzleFromSolution(solution: NakedSudokuGrid, cellsToKeep: number): NakedSudokuGrid {
  const puzzle = solution.map(row => [...row]) as NakedSudokuGrid; // Deep copy
  let cellsToRemove = GRID_SIZE * GRID_SIZE - cellsToKeep;

  // Create a list of all cell coordinates
  const allCells: Position[] = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      allCells.push({ row: r, col: c });
    }
  }
  shuffleArray(allCells); // Shuffle to remove cells randomly

  let removedCount = 0;
  for (const cellPos of allCells) {
    if (removedCount >= cellsToRemove) break;
    if (puzzle[cellPos.row][cellPos.col] !== 0) {
      puzzle[cellPos.row][cellPos.col] = 0;
      removedCount++;
    }
  }
  return puzzle;
}

export function generateSudokuPuzzle(difficulty: DifficultyKey): { puzzle: NakedSudokuGrid, solution: NakedSudokuGrid } {
  const solution = generateFullRandomSolution();
  const cellsToKeep = DIFFICULTIES[difficulty]?.filledCells || DIFFICULTIES.MEDIUM.filledCells; // Fallback
  const puzzle = createPuzzleFromSolution(solution, cellsToKeep);
  return { puzzle, solution };
}

// --- Existing Utility Functions ---

export function createInitialGrid(puzzle: NakedSudokuGrid): SudokuGrid {
  return puzzle.map(row =>
    row.map(value => ({
      value,
      isPrefilled: value !== 0,
      isInvalid: false,
      pencilMarks: new Set<SudokuCellValue>(),
      isHinted: false, // Ensure isHinted is initialized
    }))
  );
}

export function checkConflicts(grid: SudokuGrid, row: number, col: number, num: SudokuCellValue): Set<string> {
  const conflicting = new Set<string>();
  if (num === 0) return conflicting;

  for (let c = 0; c < GRID_SIZE; c++) {
    if (c !== col && grid[row][c].value === num) {
      conflicting.add(`${row},${c}`);
    }
  }
  for (let r = 0; r < GRID_SIZE; r++) {
    if (r !== row && grid[r][col].value === num) {
      conflicting.add(`${r},${col}`);
    }
  }
  const boxStartRow = Math.floor(row / BOX_SIZE) * BOX_SIZE;
  const boxStartCol = Math.floor(col / BOX_SIZE) * BOX_SIZE;
  for (let r = boxStartRow; r < boxStartRow + BOX_SIZE; r++) {
    for (let c = boxStartCol; c < boxStartCol + BOX_SIZE; c++) {
      if ((r !== row || c !== col) && grid[r][c].value === num) {
        conflicting.add(`${r},${c}`);
      }
    }
  }
  if (conflicting.size > 0) conflicting.add(`${row},${col}`); // Also add the current cell if it causes conflict
  return conflicting;
}


export function calculateCandidates(grid: SudokuGrid, row: number, col: number): Set<SudokuCellValue> {
  const candidates = new Set<SudokuCellValue>();
  if (grid[row][col].value !== 0) {
    return candidates; // Only calculate for empty cells
  }

  for (let numVal = 1; numVal <= 9; numVal++) {
    const num = numVal as SudokuCellValue;
    let isPossible = true;
    // Check row
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[row][c].value === num) {
        isPossible = false;
        break;
      }
    }
    if (!isPossible) continue;

    // Check column
    for (let r = 0; r < GRID_SIZE; r++) {
      if (grid[r][col].value === num) {
        isPossible = false;
        break;
      }
    }
    if (!isPossible) continue;

    // Check 3x3 box
    const boxStartRow = Math.floor(row / BOX_SIZE) * BOX_SIZE;
    const boxStartCol = Math.floor(col / BOX_SIZE) * BOX_SIZE;
    for (let r = boxStartRow; r < boxStartRow + BOX_SIZE; r++) {
      for (let c = boxStartCol; c < boxStartCol + BOX_SIZE; c++) {
        if (grid[r][c].value === num) {
          isPossible = false;
          break;
        }
      }
      if (!isPossible) break;
    }

    if (isPossible) {
      candidates.add(num);
    }
  }
  return candidates;
}


export function isBoardComplete(grid: SudokuGrid): boolean {
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c].value === 0 || grid[r][c].isInvalid) {
        return false;
      }
    }
  }
  return true;
}

export function isBoardCorrect(grid: SudokuGrid, solution: NakedSudokuGrid): boolean {
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c].value !== solution[r][c]) {
        return false;
      }
    }
  }
  return true;
}

export function deepCopyGrid(grid: SudokuGrid): SudokuGrid {
  return grid.map(row => 
    row.map(cell => ({
      ...cell,
      pencilMarks: new Set(cell.pencilMarks)
    }))
  );
}
