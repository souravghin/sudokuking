
"use client";

import { Button } from '@/components/ui/button';
import type { SudokuCellValue } from '@/types/sudoku';
import { useSudokuContext } from '@/contexts/SudokuContext';
// Eraser icon is no longer needed
import { cn } from '@/lib/utils'; // Import cn utility

export function NumberPad() {
  const { enterNumber, togglePencilMark, gameMode } = useSudokuContext(); // Removed clearCell

  const handleNumberClick = (num: SudokuCellValue) => {
    if (gameMode === 'pen') {
      enterNumber(num);
    } else {
      togglePencilMark(num);
    }
  };

  // Define a base style for the buttons - h-10 w-10 for consistency with ControlBar icon buttons
  const buttonBaseStyle = "h-10 w-10 text-lg font-semibold border-2 rounded-md flex items-center justify-center";
  const orangeButtonStyle = "border-orange-500 text-orange-600 hover:bg-orange-100 hover:text-orange-700 dark:border-orange-400 dark:text-orange-400 dark:hover:bg-orange-900 dark:hover:text-orange-300 focus:ring-orange-400 focus:ring-offset-0";
  // Eraser button style is no longer needed

  return (
    <div className="flex flex-row flex-wrap justify-center items-center gap-1.5 p-2 bg-card rounded-lg shadow-md">
      {Array.from({ length: 9 }, (_, i) => i + 1).map((num) => (
        <Button
          key={num}
          variant="outline" // Using outline for border
          className={cn(buttonBaseStyle, orangeButtonStyle)}
          onClick={() => handleNumberClick(num as SudokuCellValue)}
          aria-label={`Enter number ${num}${gameMode === 'pencil' ? ' as pencil mark' : ''}`}
        >
          {num}
        </Button>
      ))}
      {/* Eraser button removed from here */}
    </div>
  );
}
