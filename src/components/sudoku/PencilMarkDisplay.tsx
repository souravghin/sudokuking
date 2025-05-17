"use client";

import type { SudokuCellValue } from '@/types/sudoku';
import { cn } from '@/lib/utils';

interface PencilMarkDisplayProps {
  marks: Set<SudokuCellValue>;
}

export function PencilMarkDisplay({ marks }: PencilMarkDisplayProps) {
  if (marks.size === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-3 grid-rows-3 w-full h-full p-0.5 text-sudoku-cell-pencil-text">
      {Array.from({ length: 9 }, (_, i) => i + 1).map((num) => (
        <div
          key={num}
          className={cn(
            'flex items-center justify-center text-[0.6rem] sm:text-xs leading-none',
             // Highlight if the current number is in marks
            {'opacity-100': marks.has(num as SudokuCellValue), 'opacity-0': !marks.has(num as SudokuCellValue)}
          )}
        >
          {marks.has(num as SudokuCellValue) ? num : ''}
        </div>
      ))}
    </div>
  );
}
