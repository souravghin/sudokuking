
"use client";

import { useEffect, useCallback } from 'react';
import { GameBoard } from './GameBoard';
import { NumberPad } from './NumberPad';
import { ControlBar } from './ControlBar';
// TimerDisplay is removed as its functionality moves to PageHeader
import { useSudokuGameLogic } from '@/hooks/useSudokuGameLogic';
import { SudokuContext, type SudokuContextType } from '@/contexts/SudokuContext';
import type { Difficulty as DifficultyKey, SudokuCellValue } from '@/types/sudoku';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DIFFICULTIES } from '@/config/constants';
import { Smile } from 'lucide-react'; // Frown icon seems unused
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
// import { useGameDisplayInfo } from '@/contexts/GameDisplayInfoContext'; // No longer needed here

interface SudokuGameProps {
  difficulty: DifficultyKey;
}

export function SudokuGame({ difficulty }: SudokuGameProps) {
  const gameLogic = useSudokuGameLogic(difficulty);
  // const { setTimer, setMistakes, setIsGameActive } = useGameDisplayInfo(); // Managed by useSudokuGameLogic hook

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (gameLogic.isGamePaused || gameLogic.isGameWon) return;

    const { key } = event;
    if (key >= '1' && key <= '9') {
      if (gameLogic.gameMode === 'pen') {
        gameLogic.enterNumber(parseInt(key, 10) as SudokuCellValue);
      } else {
        gameLogic.togglePencilMark(parseInt(key, 10) as SudokuCellValue);
      }
    } else if (key === 'Backspace' || key === 'Delete') {
      gameLogic.clearCell();
    } else if (key.toLowerCase() === 'p') {
      gameLogic.toggleGameMode();
    } else if (key.toLowerCase() === 'h') {
      gameLogic.requestHint();
    } else if (key.toLowerCase() === 'v') {
      gameLogic.toggleAutoCheck();
    } else if (event.ctrlKey || event.metaKey) {
      if (key.toLowerCase() === 'z') {
        gameLogic.undo();
        event.preventDefault();
      } else if (key.toLowerCase() === 'y') {
        gameLogic.redo();
        event.preventDefault();
      }
    }
  }, [gameLogic]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
  
  // The useSudokuGameLogic hook now handles its own setup, including interaction with GameDisplayInfoContext.
  // So, explicit calls to setIsGameActive, setTimer, setMistakes are not needed directly in this component.

  if (!gameLogic.currentGrid || !gameLogic.difficulty) { // Added check for gameLogic.difficulty
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Loading Sudoku King...</CardTitle>
            <CardDescription>Preparing your moment of zen.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-2">
              <div className="h-8 bg-muted rounded"></div>
              <div className="h-48 bg-muted rounded"></div>
              <div className="h-16 bg-muted rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // The difficulty name is now derived within useSudokuGameLogic for the GameDisplayInfoContext
  // or can be retrieved here if needed for the win dialog.
  const currentDifficultyName = DIFFICULTIES[gameLogic.difficulty].name;

  return (
    <SudokuContext.Provider value={gameLogic as SudokuContextType}>
      {/* Use flex-1 to grow, justify-between to push board up and controls down, py-2 for small vertical padding */}
      <div className="flex flex-col items-center justify-between w-full flex-1 py-2">
        
        <GameBoard />
        
        {/* mt-2 for small margin above controls, space-y-2 for spacing between ControlBar and NumberPad */}
        <div className="w-full max-w-xl mt-2 space-y-2">
          <ControlBar />
          <NumberPad />
        </div>

        <Dialog open={gameLogic.isGameWon}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-center text-3xl text-primary">
                <Smile className="w-16 h-16 mx-auto mb-4 text-green-500" />
                Congratulations!
              </DialogTitle>
              <DialogDescription className="text-center text-lg">
                You've successfully solved the {currentDifficultyName} puzzle.
                <br />
                Time: {Math.floor(gameLogic.timer / 60)}m {gameLogic.timer % 60}s
                <br />
                Mistakes: {gameLogic.mistakes}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-center gap-2">
              <Button onClick={() => gameLogic.newGame(gameLogic.difficulty!)}>Play Again ({currentDifficultyName})</Button>
              <Button variant="outline" asChild>
                <Link href="/">Choose Difficulty</Link>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={gameLogic.isGamePaused && !gameLogic.isGameWon}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-center text-2xl">Game Paused</DialogTitle>
                </DialogHeader>
                <DialogFooter className="sm:justify-center">
                    <Button onClick={gameLogic.resumeGame} size="lg">Resume Game</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

      </div>
    </SudokuContext.Provider>
  );
}
