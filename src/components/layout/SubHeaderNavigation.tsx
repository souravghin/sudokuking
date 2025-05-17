
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, Home, BarChart2, Users, HelpCircle, TrendingUp, Info, MessageSquareQuote, AlertTriangle } from 'lucide-react';
import { useAppSettings } from '@/contexts/AppSettingsContext';
import { TutorialDialog } from '@/components/modals/TutorialDialog';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getTranslatedString } from '@/lib/i18n';

export function SubHeaderNavigation() {
  const appSettings = useAppSettings();
  const router = useRouter();
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  const iconSize = "w-6 h-6"; 
  const labelSize = "text-xs"; 

  const t = (key: string) => getTranslatedString(key, appSettings.language);

  const handlePlaceholderClick = (featureName: string) => {
    // In a real app, this would navigate or open a modal
    console.log(`${featureName} clicked. Feature to be implemented.`);
    // toast({ title: featureName, description: "This feature is coming soon!" });
  };


  return (
    <>
      <nav className="bg-card border-t border-border w-full">
        <div className="container mx-auto px-2 py-1.5 flex items-stretch justify-around">
          
          <Button variant="ghost" className="h-auto p-2 rounded-md" asChild>
            <Link href="/" className="flex flex-col items-center justify-center gap-0.5 text-center">
              <Home className={`${iconSize} text-primary`} />
              <span className={labelSize}>{t('home')}</span>
            </Link>
          </Button>

          <Button variant="ghost" className="h-auto p-2 rounded-md" asChild>
            <Link href="/statistics" className="flex flex-col items-center justify-center gap-0.5 text-center">
              <BarChart2 className={`${iconSize} text-primary`} />
              <span className={labelSize}>{t('statistics')}</span>
            </Link>
          </Button>

          <Button variant="ghost" className="h-auto p-2 rounded-md" asChild>
            <Link href="/community" className="flex flex-col items-center justify-center gap-0.5 text-center">
              <Users className={`${iconSize} text-primary`} />
              <span className={labelSize}>{t('community')}</span>
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex flex-col items-center justify-center h-auto p-2 rounded-md">
                <User className={`${iconSize} text-primary`} />
                <span className={labelSize}>{t('profile')}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 mb-2 max-h-[70vh] overflow-y-auto">
              <DropdownMenuLabel>{appSettings.username || t('playerProfile')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => appSettings.setIsPremium(!appSettings.isPremium)}>
                <TrendingUp className="mr-2 h-4 w-4" />
                {appSettings.isPremium ? t('manageSubscription') : t('getPremium')}
              </DropdownMenuItem>
              {/* Statistics option removed from here */}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsTutorialOpen(true)}>
                <HelpCircle className="mr-2 h-4 w-4" />
                {t('playGuide')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePlaceholderClick("Help Center")}>
                <MessageSquareQuote className="mr-2 h-4 w-4" />
                {t('helpCenter')}
              </DropdownMenuItem>
               <DropdownMenuItem onClick={() => handlePlaceholderClick("About Sudoku King")}>
                <Info className="mr-2 h-4 w-4" />
                {t('aboutSudokuKing')}
              </DropdownMenuItem>
               {/* Community option removed from here */}
               <DropdownMenuItem onClick={() => handlePlaceholderClick("Report an Issue")}>
                <AlertTriangle className="mr-2 h-4 w-4" />
                {t('reportAnIssue')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
      <TutorialDialog open={isTutorialOpen} onOpenChange={setIsTutorialOpen} />
    </>
  );
}
