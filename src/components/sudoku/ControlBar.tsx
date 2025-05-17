
"use client";

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useSudokuContext } from '@/contexts/SudokuContext';
import { Lightbulb, Pencil, CheckSquare, Square, Pause, Play, Save, FolderOpen, FilePlus } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { cn } from '@/lib/utils';
import { useAppSettings } from '@/contexts/AppSettingsContext'; // Import AppSettingsContext
import { getTranslatedString } from '@/lib/i18n'; // Import translation utility

export function ControlBar() {
  const {
    requestHint,
    hintsRemaining,
    toggleGameMode,
    gameMode,
    toggleAutoCheck,
    isAutoCheckEnabled,
    isGamePaused,
    pauseGame,
    resumeGame,
    newGame,
    saveGame,
    loadSavedGame,
    difficulty,
  } = useSudokuContext();
  const { language } = useAppSettings();
  const t = (key: string) => getTranslatedString(key, language);


  const iconBaseClass = "w-6 h-6"; 
  const iconColor = "text-orange-600 dark:text-orange-500";

  return (
    <TooltipProvider>
      <div className="flex flex-wrap justify-center gap-2 p-2 bg-card rounded-lg shadow-md">
        <AlertDialog>
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="icon" disabled={!difficulty}>
                  <FilePlus className={cn(iconBaseClass, iconColor)} />
                </Button>
              </AlertDialogTrigger>
            </TooltipTrigger>
            <TooltipContent><p>{t('newGameTooltip')}</p></TooltipContent>
          </Tooltip>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('newGameDialogTitle')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('newGameDialogDescription')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('cancelButton')}</AlertDialogCancel>
              <AlertDialogAction onClick={() => newGame()}>{t('newGameButton')}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={toggleGameMode}>
              <Pencil className={cn(iconBaseClass, iconColor, gameMode === 'pencil' && 'text-primary')} />
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>{t('togglePenPencilTooltip')}</p></TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={requestHint} disabled={hintsRemaining <= 0}>
              <Lightbulb className={cn(iconBaseClass, iconColor)} />
              {hintsRemaining > 0 && <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full px-1">{hintsRemaining}</span>}
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>{t('hintTooltip', { count: hintsRemaining })}</p></TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={toggleAutoCheck}>
              {isAutoCheckEnabled ? <CheckSquare className={cn(iconBaseClass, iconColor)} /> : <Square className={cn(iconBaseClass, iconColor)} />}
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>{t('autoCheckTooltip', { status: isAutoCheckEnabled ? t('onStatus') : t('offStatus') })}</p></TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={isGamePaused ? resumeGame : pauseGame}>
              {isGamePaused ? <Play className={cn(iconBaseClass, iconColor)} /> : <Pause className={cn(iconBaseClass, iconColor)} />}
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>{isGamePaused ? t('resumeGameTooltip') : t('pauseGameTooltip')}</p></TooltipContent>
        </Tooltip>
         <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={saveGame} disabled={!difficulty}>
              <Save className={cn(iconBaseClass, iconColor)} />
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>{t('saveGameTooltip')}</p></TooltipContent>
        </Tooltip>
         <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={loadSavedGame}>
              <FolderOpen className={cn(iconBaseClass, iconColor)} />
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>{t('loadGameTooltip')}</p></TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
