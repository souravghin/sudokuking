"use client";

import { useSudokuContext } from '@/contexts/SudokuContext';
import { Cell } from './Cell';
import { Skeleton } from '@/components/ui/skeleton';
import { GRID_SIZE } from '@/config/constants';

export function GameBoard() {
  const { currentGrid } = useSudokuContext();

  if (!currentGrid) {
    // Skeleton loader for the board
    return (
      <div className="grid grid-cols-9 aspect-square w-full max-w-xl mx-auto shadow-lg rounded-lg overflow-hidden border-2 border-sudoku-box-border">
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => (
          <Skeleton key={index} className="aspect-square rounded-none bg-muted/50" />
        ))}
      </div>
    );
  }

  return (
    <div 
      className="grid grid-cols-9 aspect-square w-full max-w-xl mx-auto shadow-xl rounded-lg overflow-hidden border-2 border-sudoku-box-border"
      role="grid"
      aria-label="Sudoku puzzle grid"
    >
      {currentGrid.map((row, rowIndex) =>
        row.map((cellData, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            cellData={cellData}
            rowIndex={rowIndex}
            colIndex={colIndex}
          />
        ))
      )}
    </div>
  );
}
