
"use client";

import type { SudokuCellData, SudokuCellValue } from '@/types/sudoku';
import { cn } from '@/lib/utils';
import { useSudokuContext } from '@/contexts/SudokuContext';
import { PencilMarkDisplay } from './PencilMarkDisplay';

interface CellProps {
  cellData: SudokuCellData;
  rowIndex: number;
  colIndex: number;
}

export function Cell({ cellData, rowIndex, colIndex }: CellProps) {
  const { selectedCell, selectCell, gameMode, conflictingCells } = useSudokuContext();
  
  const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
  const isHighlighted = selectedCell ? 
    (selectedCell.row === rowIndex || selectedCell.col === colIndex || 
    (Math.floor(selectedCell.row / 3) === Math.floor(rowIndex / 3) && Math.floor(selectedCell.col / 3) === Math.floor(colIndex / 3)))
    : false;
  
  // A cell is considered "actually invalid" if the game logic has marked it as invalid 
  // AND it's part of the currently identified conflicting cells.
  // This ensures that the visual highlight for conflicts is applied.
  const isActuallyInvalid = cellData.isInvalid && conflictingCells.has(`${rowIndex},${colIndex}`);

  const handleClick = () => {
    selectCell({ row: rowIndex, col: colIndex });
  };

  // Determine cell background with precedence
  let cellBgClass: string;

  if (isActuallyInvalid) {
    cellBgClass = 'bg-sudoku-cell-invalid-bg'; // Highlight for conflicting/duplicate numbers
  } else if (cellData.isHinted) {
    cellBgClass = 'bg-green-500/20'; 
  } else if (isSelected) {
    cellBgClass = 'bg-sudoku-cell-selected-bg';
  } else if (cellData.isPrefilled) {
    // Prefilled cells get their specific orange background.
    cellBgClass = 'bg-sudoku-cell-prefilled-bg'; 
  } else if (isHighlighted) {
    cellBgClass = 'bg-sudoku-cell-highlight-bg';
  } else {
    cellBgClass = 'bg-sudoku-cell-bg'; 
  }

  // Determine text color
  let textColorClass = 'text-sudoku-cell-user-text'; // Default for user input (blue)
  if (cellData.isPrefilled) {
    // Prefilled cells get orange text.
    textColorClass = 'text-sudoku-cell-prefilled-text font-semibold';
  }
  if (isActuallyInvalid) {
    textColorClass = 'text-sudoku-cell-invalid-text font-bold'; // Text color for conflicting numbers
  } else if (cellData.isHinted) {
    textColorClass = 'text-green-700 dark:text-green-400 font-semibold';
  }

  // Box borders
  const borderClasses = [
    rowIndex % 3 === 2 && rowIndex !== 8 ? 'border-b-2 border-sudoku-box-border' : 'border-b border-sudoku-cell-border',
    colIndex % 3 === 2 && colIndex !== 8 ? 'border-r-2 border-sudoku-box-border' : 'border-r border-sudoku-cell-border',
    rowIndex === 0 ? 'border-t-2 border-sudoku-box-border' : 'border-t border-sudoku-cell-border',
    colIndex === 0 ? 'border-l-2 border-sudoku-box-border' : 'border-l border-sudoku-cell-border',
  ];
  
  return (
    <div
      className={cn(
        'aspect-square flex items-center justify-center cursor-pointer select-none transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-ring focus:z-10',
        cellBgClass,
        textColorClass,
        ...borderClasses,
        {'opacity-70': cellData.isPrefilled && gameMode === 'pencil' } 
      )}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key >= '1' && e.key <= '9') {
          // Handled by SudokuGame keydown listener
        } else if (e.key === 'Backspace' || e.key === 'Delete') {
          // Handled by SudokuGame keydown listener
        }
      }}
      tabIndex={0} 
      role="gridcell"
      aria-selected={isSelected}
      aria-readonly={cellData.isPrefilled}
      aria-invalid={cellData.isInvalid} // Exposing the invalid state for accessibility
    >
      {cellData.value !== 0 ? (
        <span className="text-2xl md:text-3xl">{cellData.value}</span>
      ) : (
        <PencilMarkDisplay marks={cellData.pencilMarks} />
      )}
    </div>
  );
}
