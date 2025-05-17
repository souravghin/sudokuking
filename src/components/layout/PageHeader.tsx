
"use client";

import Link from 'next/link';
import { Brain, Cog, Sun, Moon, Clock, Languages, Bell } from 'lucide-react'; // Added Bell
import { Button } from '@/components/ui/button';
import { SettingsDialog } from '@/components/settings/SettingsDialog';
import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useGameDisplayInfo } from '@/contexts/GameDisplayInfoContext';
import { formatTime } from '@/lib/formatTime';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useAppSettings, type Language } from '@/contexts/AppSettingsContext';
import { languageNameMap, getTranslatedString } from '@/lib/i18n';


export default function PageHeader() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { theme, toggleTheme, mounted: themeMounted } = useTheme();
  const { timer, mistakes, isGameActive } = useGameDisplayInfo();
  const { language, setLanguage } = useAppSettings(); // Removed notificationsEnabled as it's not directly used here
  const t = (key: string) => getTranslatedString(key, language);

  const logoTextColor = "text-primary"; // For "Sudoku King" text
  const logoIconColor = "text-amber-500 dark:text-amber-400"; // Golden color for Brain icon
  const logoIconSize = "w-9 h-9";

  if (!themeMounted) {
    return (
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold hover:opacity-80 transition-opacity">
            <Brain className={cn(logoIconSize, logoIconColor)} />
            <span className={logoTextColor}>Sudoku King</span>
          </Link>
          <div className="flex items-center gap-2">
             <div className="w-10 h-10 bg-muted rounded-md animate-pulse"></div>
             <div className="w-10 h-10 bg-muted rounded-md animate-pulse"></div>
             <div className="w-10 h-10 bg-muted rounded-md animate-pulse"></div>
             <div className="w-10 h-10 bg-muted rounded-md animate-pulse"></div> {/* Placeholder for Bell icon */}
          </div>
        </div>
      </header>
    );
  }

  const ThemeIcon = () => {
    if (theme === 'dark' || theme === 'blue') return <Moon className="w-5 h-5" />;
    return <Sun className="w-5 h-5" />;
  };

  const availableLanguages = Object.keys(languageNameMap) as Language[];

  // Placeholder function for notification click
  const handleNotificationClick = () => {
    // In a real app, this would open a notification panel or similar
    console.log("Notification icon clicked. Feature to be implemented.");
    // For now, we can use a toast to indicate it's a placeholder
    // import { useToast } from "@/hooks/use-toast"; // would be needed
    // const { toast } = useToast();
    // toast({ title: "Notifications", description: "Notification panel coming soon!" });
  };

  return (
    <>
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold hover:opacity-80 transition-opacity">
            <Brain className={cn(logoIconSize, logoIconColor)} />
            <span className={logoTextColor}>Sudoku King</span>
          </Link>

          {isGameActive && (
            <div className="flex items-center gap-3 sm:gap-4 text-sm text-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                <span className="font-medium">{formatTime(timer)}</span>
              </div>
              <span className="font-medium">{t('mistakes')}: {mistakes}</span>
            </div>
          )}

          {!isGameActive && <div className="flex-grow"></div>}

          <TooltipProvider>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" aria-label={t('changeLanguageTooltip')}>
                        <Languages className="w-5 h-5" />
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t('changeLanguageTooltip')}</p>
                  </TooltipContent>
                </Tooltip>
                <DropdownMenuContent align="end" className="max-h-96 overflow-y-auto">
                  <DropdownMenuLabel>{t('selectLanguageLabel')}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup value={language} onValueChange={(value) => setLanguage(value as Language)}>
                    {availableLanguages.map((langCode) => (
                       <DropdownMenuRadioItem key={langCode} value={langCode}>
                         {languageNameMap[langCode]}
                       </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={toggleTheme} aria-label={t('toggleThemeTooltip')}>
                    <ThemeIcon />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t('toggleThemeTooltip')}</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handleNotificationClick} aria-label={t('notificationsTooltip')}>
                    <Bell className="w-5 h-5" />
                    {/* Optional: Add a badge if notificationsEnabled and there are unread notifications */}
                    {/* {notificationsEnabled && <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-primary ring-2 ring-card" />} */}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t('notificationsTooltip')}</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={() => setIsSettingsOpen(true)} aria-label={t('appSettingsTooltip')}>
                    <Cog className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t('appSettingsTooltip')}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>
      </header>
      <SettingsDialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </>
  );
}
