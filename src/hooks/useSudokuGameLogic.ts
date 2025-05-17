
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { SudokuGrid, Position, SudokuCellValue, GameState, Difficulty as DifficultyKey, GameMode } from '@/types/sudoku';
import { generateSudokuPuzzle, createInitialGrid, checkConflicts, isBoardComplete, isBoardCorrect, calculateCandidates, deepCopyGrid } from '@/lib/sudoku-logic';
import { DIFFICULTIES, GRID_SIZE, LOCAL_STORAGE_GAME_KEY } from '@/config/constants';
import { useToast } from '@/hooks/use-toast';
import { useGameDisplayInfo } from '@/contexts/GameDisplayInfoContext'; 

const initialGameState: GameState = {
  difficulty: null,
  initialGrid: null,
  currentGrid: null,
  solutionGrid: null,
  selectedCell: null,
  gameMode: 'pen',
  timer: 0,
  timerActive: false,
  mistakes: 0,
  isAutoCheckEnabled: true,
  isGameWon: false,
  isGamePaused: false,
  conflictingCells: new Set<string>(),
  undoStack: [],
  redoStack: [],
  hintsRemaining: 0,
};

export function useSudokuGameLogic(initialDifficulty?: DifficultyKey) {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const { toast } = useToast();
  const { 
    setTimer: setDisplayTimer, 
    setMistakes: setDisplayMistakes, 
    setIsGameActive 
  } = useGameDisplayInfo();

  useEffect(() => {
    if (gameState.difficulty && gameState.timerActive) {
      setIsGameActive(true);
    }
    return () => {
      setIsGameActive(false);
      setDisplayTimer(0);
      setDisplayMistakes(0);
    };
  }, [gameState.difficulty, gameState.timerActive, setIsGameActive, setDisplayTimer, setDisplayMistakes]);
  
  useEffect(() => {
    setDisplayTimer(gameState.timer);
  }, [gameState.timer, setDisplayTimer]);

  useEffect(() => {
    setDisplayMistakes(gameState.mistakes);
  }, [gameState.mistakes, setDisplayMistakes]);

  const updateGridAndHistory = useCallback((newGrid: SudokuGrid, newConflictingCells?: Set<string>) => {
    setGameState(prev => {
      const currentUndoStack = prev.currentGrid ? [...prev.undoStack, deepCopyGrid(prev.currentGrid)] : prev.undoStack;
      return {
        ...prev,
        currentGrid: newGrid,
        conflictingCells: newConflictingCells !== undefined ? newConflictingCells : prev.conflictingCells,
        undoStack: currentUndoStack.slice(-20), // Keep a reasonable undo history
        redoStack: [] 
      };
    });
  }, []);
  
  const startGame = useCallback((difficulty: DifficultyKey) => {
    const { puzzle, solution } = generateSudokuPuzzle(difficulty);
    const newGrid = createInitialGrid(puzzle);
    const difficultyName = DIFFICULTIES[difficulty].name;

    setGameState({
      ...initialGameState,
      difficulty,
      initialGrid: puzzle,
      currentGrid: newGrid,
      solutionGrid: solution,
      timerActive: true,
      hintsRemaining: DIFFICULTIES[difficulty].maxHints,
      undoStack: [deepCopyGrid(newGrid)],
    });
    setIsGameActive(true);
    toast({ title: `${difficultyName} puzzle started!`, description: "Good luck!"});
  }, [toast, setIsGameActive]);

  const newGame = useCallback((difficulty?: DifficultyKey) => {
    const diffToStart = difficulty || gameState.difficulty || 'EASY';
    startGame(diffToStart);
  }, [startGame, gameState.difficulty]);

  useEffect(() => {
    if (initialDifficulty) {
      startGame(initialDifficulty);
    }
  }, [initialDifficulty, startGame]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (gameState.timerActive && !gameState.isGamePaused && !gameState.isGameWon) {
      intervalId = setInterval(() => {
        setGameState(prev => ({ ...prev, timer: prev.timer + 1 }));
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [gameState.timerActive, gameState.isGamePaused, gameState.isGameWon]);

  const selectCell = useCallback((pos: Position | null) => {
    setGameState(prev => ({ ...prev, selectedCell: pos }));
  }, []);

  const performValidation = useCallback((grid: SudokuGrid, row: number, col: number, num: SudokuCellValue) => {
    let newMistakes = gameState.mistakes;
    const finalConflictSet = new Set<string>();

    const duplicateConflicts = checkConflicts(grid, row, col, num);
    duplicateConflicts.forEach(c => finalConflictSet.add(c));

    let isSolutionMismatch = false;
    if (num !== 0 && gameState.solutionGrid && num !== gameState.solutionGrid[row][col]) {
      if (!grid[row][col].isPrefilled) newMistakes++;
      isSolutionMismatch = true;
    }

    if (isSolutionMismatch) {
      finalConflictSet.add(`${row},${col}`);
    }
    
    const updatedGrid = grid.map((rArray, rIdx) =>
      rArray.map((cell, cIdx) => {
        const shouldMarkInvalid = gameState.isAutoCheckEnabled && finalConflictSet.has(`${rIdx},${cIdx}`);
        return { 
          ...cell, 
          isInvalid: cell.isPrefilled ? false : shouldMarkInvalid 
        };
      })
    );

    return { updatedGrid, conflicts: finalConflictSet, newMistakes };
  }, [gameState.isAutoCheckEnabled, gameState.solutionGrid, gameState.mistakes]);

  const enterNumber = useCallback((num: SudokuCellValue) => {
    if (!gameState.currentGrid || !gameState.selectedCell || gameState.isGameWon || gameState.isGamePaused) return;
    const { row, col } = gameState.selectedCell;
    if (gameState.currentGrid[row][col].isPrefilled) return;

    const newGrid = deepCopyGrid(gameState.currentGrid);
    newGrid[row][col].value = num;
    newGrid[row][col].pencilMarks.clear(); 
    newGrid[row][col].isHinted = false; // Entering a number clears hint status

    const { updatedGrid, conflicts, newMistakes } = performValidation(newGrid, row, col, num);
    
    updateGridAndHistory(updatedGrid, conflicts);
    setGameState(prev => ({ ...prev, mistakes: newMistakes }));

    if (isBoardComplete(updatedGrid) && isBoardCorrect(updatedGrid, gameState.solutionGrid!)) {
      setGameState(prev => ({ ...prev, isGameWon: true, timerActive: false }));
      toast({ title: "Congratulations!", description: "You solved the puzzle!" });
    }
  }, [gameState.currentGrid, gameState.selectedCell, gameState.isGameWon, gameState.isGamePaused, gameState.solutionGrid, performValidation, updateGridAndHistory, toast]);

  const togglePencilMark = useCallback((num: SudokuCellValue) => {
    if (!gameState.currentGrid || !gameState.selectedCell || num === 0 || gameState.isGameWon || gameState.isGamePaused) return;
    const { row, col } = gameState.selectedCell;
    if (gameState.currentGrid[row][col].isPrefilled || gameState.currentGrid[row][col].value !== 0) return; 

    const newGrid = deepCopyGrid(gameState.currentGrid);
    const cellPencilMarks = newGrid[row][col].pencilMarks;
    if (cellPencilMarks.has(num)) {
      cellPencilMarks.delete(num);
    } else {
      cellPencilMarks.add(num);
    }
    updateGridAndHistory(newGrid);
  }, [gameState.currentGrid, gameState.selectedCell, gameState.isGameWon, gameState.isGamePaused, updateGridAndHistory]);

  const clearCell = useCallback(() => {
    if (!gameState.currentGrid || !gameState.selectedCell || gameState.isGameWon || gameState.isGamePaused) return;
    const { row, col } = gameState.selectedCell;
    if (gameState.currentGrid[row][col].isPrefilled) return;

    const newGrid = deepCopyGrid(gameState.currentGrid);
    newGrid[row][col].value = 0;
    newGrid[row][col].pencilMarks.clear();
    newGrid[row][col].isInvalid = false; 
    newGrid[row][col].isHinted = false;

    let allConflicts = new Set<string>();
    if (gameState.isAutoCheckEnabled) {
      for(let r=0; r<GRID_SIZE; r++) {
        for(let c=0; c<GRID_SIZE; c++) {
          if(newGrid[r][c].value !== 0) {
            const cellConflicts = checkConflicts(newGrid, r, c, newGrid[r][c].value);
            cellConflicts.forEach(conf => allConflicts.add(conf));
             if (gameState.solutionGrid && newGrid[r][c].value !== gameState.solutionGrid[r][c]) {
                allConflicts.add(`${r},${c}`);
            }
          }
        }
      }
    }
    
    const validatedGrid = newGrid.map((rVal, rIdx) => rVal.map((cVal, cIdx) => ({
      ...cVal,
      isInvalid: gameState.isAutoCheckEnabled && !cVal.isPrefilled ? allConflicts.has(`${rIdx},${cIdx}`) : false
    })));

    updateGridAndHistory(validatedGrid, allConflicts);
  }, [gameState.currentGrid, gameState.selectedCell, gameState.isGameWon, gameState.isGamePaused, gameState.isAutoCheckEnabled, gameState.solutionGrid, updateGridAndHistory]);
  
  const toggleGameMode = useCallback(() => {
    setGameState(prev => ({ ...prev, gameMode: prev.gameMode === 'pen' ? 'pencil' : 'pen' }));
  }, []);

  const toggleAutoCheck = useCallback(() => {
    setGameState(prev => {
      const newAutoCheckState = !prev.isAutoCheckEnabled;
      let currentGrid = prev.currentGrid ? deepCopyGrid(prev.currentGrid) : null;
      let currentConflicts = new Set<string>();

      if (currentGrid) {
        if (newAutoCheckState && prev.solutionGrid) { 
          for(let r=0; r<GRID_SIZE; r++) {
            for(let c=0; c<GRID_SIZE; c++) {
              if(currentGrid[r][c].value !== 0 && !currentGrid[r][c].isPrefilled) {
                const cellConflicts = checkConflicts(currentGrid, r, c, currentGrid[r][c].value);
                cellConflicts.forEach(conf => currentConflicts.add(conf));
                if (prev.solutionGrid[r][c] !== currentGrid[r][c].value) {
                    currentConflicts.add(`${r},${c}`);
                }
              }
            }
          }
        }
        currentGrid = currentGrid.map((rVal, rIdx) => rVal.map((cVal, cIdx) => ({
          ...cVal,
          isInvalid: newAutoCheckState && !cVal.isPrefilled ? currentConflicts.has(`${rIdx},${cIdx}`) : false
        })));
      }
      return { ...prev, isAutoCheckEnabled: newAutoCheckState, currentGrid, conflictingCells: currentConflicts };
    });
  }, []);

  const pauseGame = useCallback(() => setGameState(prev => ({ ...prev, isGamePaused: true, timerActive: false })), []);
  const resumeGame = useCallback(() => setGameState(prev => ({ ...prev, isGamePaused: false, timerActive: !prev.isGameWon })), []);
  
  const requestHint = useCallback(() => {
    if (!gameState.currentGrid || !gameState.solutionGrid || gameState.hintsRemaining <= 0 || gameState.isGameWon || gameState.isGamePaused) return;

    if (!gameState.selectedCell) {
      toast({ title: "Hint", description: "Please select an empty cell to show possible numbers.", variant: "default" });
      return;
    }

    const { row, col } = gameState.selectedCell;
    if (gameState.currentGrid[row][col].value !== 0) {
      toast({ title: "Hint", description: "Please select an empty cell to show possible numbers.", variant: "default" });
      return;
    }

    const candidates = calculateCandidates(gameState.currentGrid, row, col);

    if (candidates.size > 0) {
      const newGrid = deepCopyGrid(gameState.currentGrid);
      newGrid[row][col].pencilMarks = candidates;
      // Optionally, mark the cell as having had its candidates shown by a hint
      // newGrid[row][col].isHinted = true; // Or a new flag like `candidatesHintUsed = true`
      
      updateGridAndHistory(newGrid, gameState.conflictingCells); // Keep existing conflicts, this hint doesn't change values
      setGameState(prev => ({ ...prev, hintsRemaining: prev.hintsRemaining - 1 }));
      toast({ title: "Hint Used", description: `Possible numbers shown for the selected cell. ${gameState.hintsRemaining - 1} hints left.` });
    } else {
      toast({ title: "No Candidates", description: "No possible numbers found for this cell (it might be part of a conflict or the puzzle is unsolvable with current entries)." });
    }
  }, [gameState.currentGrid, gameState.solutionGrid, gameState.hintsRemaining, gameState.isGameWon, gameState.isGamePaused, gameState.selectedCell, updateGridAndHistory, toast]);

  const undo = useCallback(() => {
    if (gameState.undoStack.length <= 1) return; 
    
    setGameState(prev => {
      const newUndoStack = [...prev.undoStack];
      newUndoStack.pop(); 
      const prevStateGrid = newUndoStack[newUndoStack.length -1]; 

      const newRedoStack = prev.currentGrid ? [deepCopyGrid(prev.currentGrid), ...prev.redoStack].slice(0, 20) : prev.redoStack;
      
      let allConflicts = new Set<string>();
       if(prevStateGrid && gameState.isAutoCheckEnabled && prev.solutionGrid) {
          for(let r=0; r<GRID_SIZE; r++) {
            for(let c=0; c<GRID_SIZE; c++) {
              if(prevStateGrid[r][c].value !== 0 && !prevStateGrid[r][c].isPrefilled) {
                const cellConflicts = checkConflicts(prevStateGrid, r, c, prevStateGrid[r][c].value);
                cellConflicts.forEach(conf => allConflicts.add(conf));
                 if (prev.solutionGrid[r][c] !== prevStateGrid[r][c].value) {
                    allConflicts.add(`${r},${c}`);
                }
              }
            }
          }
       }
      const validatedPrevState = prevStateGrid ? prevStateGrid.map((rVal, rIdx) => rVal.map((cVal, cIdx) => ({
        ...cVal,
        isInvalid: gameState.isAutoCheckEnabled && !cVal.isPrefilled ? allConflicts.has(`${rIdx},${cIdx}`) : false
      }))) : null;

      return {
        ...prev,
        currentGrid: validatedPrevState,
        conflictingCells: allConflicts,
        undoStack: newUndoStack,
        redoStack: newRedoStack,
      };
    });
  }, [gameState.undoStack, gameState.isAutoCheckEnabled, gameState.solutionGrid]);

  const redo = useCallback(() => {
    if (gameState.redoStack.length === 0) return;

    setGameState(prev => {
      const newRedoStack = [...prev.redoStack];
      const nextStateGrid = newRedoStack.shift();
      const newUndoStack = prev.currentGrid ? [...prev.undoStack, deepCopyGrid(prev.currentGrid)].slice(-20) : prev.undoStack;

      let allConflicts = new Set<string>();
       if(nextStateGrid && gameState.isAutoCheckEnabled && prev.solutionGrid) {
          for(let r=0; r<GRID_SIZE; r++) {
            for(let c=0; c<GRID_SIZE; c++) {
              if(nextStateGrid[r][c].value !== 0 && !nextStateGrid[r][c].isPrefilled) {
                const cellConflicts = checkConflicts(nextStateGrid, r, c, nextStateGrid[r][c].value);
                cellConflicts.forEach(conf => allConflicts.add(conf));
                 if (prev.solutionGrid[r][c] !== nextStateGrid[r][c].value) {
                    allConflicts.add(`${r},${c}`);
                }
              }
            }
          }
       }
      const validatedNextState = nextStateGrid ? nextStateGrid.map((rVal, rIdx) => rVal.map((cVal, cIdx) => ({
        ...cVal,
        isInvalid: gameState.isAutoCheckEnabled && !cVal.isPrefilled ? allConflicts.has(`${rIdx},${cIdx}`) : false
      }))) : null;

      return {
        ...prev,
        currentGrid: validatedNextState,
        conflictingCells: allConflicts,
        undoStack: newUndoStack,
        redoStack: newRedoStack,
      };
    });
  }, [gameState.redoStack, gameState.isAutoCheckEnabled, gameState.solutionGrid]);
  
  const resetTimer = useCallback(() => setGameState(prev => ({...prev, timer: 0})), []);

  const saveGame = useCallback(() => {
    if (!gameState.difficulty) {
      toast({ title: "Cannot Save", description: "Start a game before saving.", variant: "destructive" });
      return;
    }
    try {
      const gameToSave = {
        difficulty: gameState.difficulty,
        initialGrid: gameState.initialGrid,
        currentGridFull: gameState.currentGrid, 
        solutionGrid: gameState.solutionGrid,
        selectedCell: gameState.selectedCell,
        gameMode: gameState.gameMode,
        timer: gameState.timer,
        mistakes: gameState.mistakes,
        isAutoCheckEnabled: gameState.isAutoCheckEnabled,
        hintsRemaining: gameState.hintsRemaining,
        undoStack: gameState.undoStack, 
        redoStack: gameState.redoStack,
        conflictingCells: Array.from(gameState.conflictingCells), // Convert Set to Array for JSON
      };
      localStorage.setItem(LOCAL_STORAGE_GAME_KEY, JSON.stringify(gameToSave));
      toast({ title: "Game Saved!" });
    } catch (error) {
      console.error("Failed to save game:", error);
      toast({ title: "Error", description: "Could not save game.", variant: "destructive" });
    }
  }, [gameState, toast]);

  const loadSavedGame = useCallback(() => {
    try {
      const savedGameString = localStorage.getItem(LOCAL_STORAGE_GAME_KEY);
      if (savedGameString) {
        const savedData = JSON.parse(savedGameString);
        
        const rehydrateGrid = (grid: SudokuGrid | null): SudokuGrid | null => {
          if (!grid) return null;
          return grid.map(row => row.map(cell => ({
            ...cell,
            pencilMarks: new Set(cell.pencilMarks || []) 
          })));
        };

        const rehydratedCurrentGrid = rehydrateGrid(savedData.currentGridFull);
        const rehydratedUndoStack = savedData.undoStack?.map(rehydrateGrid).filter(Boolean) as SudokuGrid[] || [];
        const rehydratedRedoStack = savedData.redoStack?.map(rehydrateGrid).filter(Boolean) as SudokuGrid[] || [];
        const loadedConflictingCells = new Set<string>(savedData.conflictingCells || []);


        if (savedData.initialGrid && rehydratedCurrentGrid && savedData.solutionGrid && savedData.difficulty) {
          let currentConflicts = loadedConflictingCells;
          let validatedLoadedGrid = rehydratedCurrentGrid;

          if (savedData.isAutoCheckEnabled && savedData.solutionGrid) {
            currentConflicts = new Set<string>(); // Recalculate based on current auto-check state
             for(let r=0; r<GRID_SIZE; r++) {
              for(let c=0; c<GRID_SIZE; c++) {
                if(rehydratedCurrentGrid[r][c].value !== 0 && !rehydratedCurrentGrid[r][c].isPrefilled) {
                  const cellConflicts = checkConflicts(rehydratedCurrentGrid, r, c, rehydratedCurrentGrid[r][c].value);
                  cellConflicts.forEach(conf => currentConflicts.add(conf));
                  if (savedData.solutionGrid[r][c] !== rehydratedCurrentGrid[r][c].value) {
                      currentConflicts.add(`${r},${c}`);
                  }
                }
              }
            }
             validatedLoadedGrid = rehydratedCurrentGrid.map((rVal, rIdx) => rVal.map((cVal, cIdx) => ({
                ...cVal,
                isInvalid: !cVal.isPrefilled ? currentConflicts.has(`${rIdx},${cIdx}`) : false
            })));
          } else {
            // If auto-check is off, ensure no cells are marked invalid from saved state
            validatedLoadedGrid = rehydratedCurrentGrid.map(row => row.map(cell => ({ ...cell, isInvalid: false })));
            currentConflicts = new Set<string>();
          }

          setGameState(prev => ({
            ...prev,
            difficulty: savedData.difficulty,
            initialGrid: savedData.initialGrid,
            currentGrid: validatedLoadedGrid,
            solutionGrid: savedData.solutionGrid,
            selectedCell: savedData.selectedCell,
            gameMode: savedData.gameMode,
            timer: savedData.timer,
            timerActive: true, 
            mistakes: savedData.mistakes,
            isAutoCheckEnabled: savedData.isAutoCheckEnabled,
            hintsRemaining: savedData.hintsRemaining,
            undoStack: rehydratedUndoStack.length > 0 ? rehydratedUndoStack : (validatedLoadedGrid ? [deepCopyGrid(validatedLoadedGrid)] : []),
            redoStack: rehydratedRedoStack,
            conflictingCells: currentConflicts,
            isGameWon: false, 
            isGamePaused: false, 
          }));
          setIsGameActive(true); 
          toast({ title: "Game Loaded!" });
        } else {
          toast({ title: "No Saved Game", description: "No valid saved game found.", variant: "destructive" });
          if (initialDifficulty) startGame(initialDifficulty); 
        }
      } else {
         toast({ title: "No Saved Game", description: "Start a new game." });
         if (initialDifficulty) startGame(initialDifficulty);
      }
    } catch (error) {
      console.error("Failed to load game:", error);
      toast({ title: "Error", description: "Could not load game.", variant: "destructive" });
      if (initialDifficulty) startGame(initialDifficulty);
    }
  }, [toast, startGame, initialDifficulty, setIsGameActive]);

  return {
    ...gameState,
    startGame,
    selectCell,
    enterNumber,
    togglePencilMark,
    clearCell,
    toggleGameMode,
    toggleAutoCheck,
    pauseGame,
    resumeGame,
    requestHint,
    undo,
    redo,
    resetTimer,
    loadSavedGame,
    saveGame,
    newGame,
  };
}
