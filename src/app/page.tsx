
"use client"; // Added to use hooks

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DIFFICULTIES, type Difficulty } from '@/config/constants';
import { Brain } from 'lucide-react';
import { useAppSettings } from '@/contexts/AppSettingsContext'; // Import useAppSettings
import { getTranslatedString } from '@/lib/i18n'; // Import translation utility
import { cn } from '@/lib/utils'; // Import cn

export default function HomePage() {
  const { language } = useAppSettings(); // Get current language
  const t = (key: string) => getTranslatedString(key, language); // Translation helper

  const logoIconColor = "text-amber-500 dark:text-amber-400";

  // Map difficulty keys to translation keys
  const difficultyTranslationKeys: Record<Difficulty, { nameKey: string, descriptionKey: string }> = {
    EASY: { nameKey: 'difficultyEasyName', descriptionKey: 'difficultyEasyDescription' },
    MEDIUM: { nameKey: 'difficultyMediumName', descriptionKey: 'difficultyMediumDescription' },
    HARD: { nameKey: 'difficultyHardName', descriptionKey: 'difficultyHardDescription' },
    EXPERT: { nameKey: 'difficultyExpertName', descriptionKey: 'difficultyExpertDescription' },
  };

  return (
    // Added container mx-auto and padding here for this specific page
    <div className="container mx-auto px-4 flex-1 flex flex-col items-center justify-center">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-4">
            <Brain className={cn("w-12 h-12", logoIconColor)} />
          </div>
          <CardTitle className="text-4xl font-bold text-primary">Sudoku King</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Mind Over Numbers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 pt-0">
          {Object.entries(DIFFICULTIES).map(([key, originalDetails]) => {
            const difficultyKey = key as Difficulty;
            const translationKeys = difficultyTranslationKeys[difficultyKey];
            return (
              <Button
                key={key}
                variant="outline"
                className="w-full justify-start text-left group transition-all duration-200 ease-in-out hover:shadow-lg hover:-translate-y-0.5 hover:border-primary hover:bg-primary/10 items-start h-auto px-4 py-3"
                asChild
              >
                <Link href={`/play/${key.toLowerCase()}`}>
                  <div className="flex flex-col">
                    <span className="text-xl font-bold group-hover:text-primary transition-colors duration-200">{t(translationKeys.nameKey)}</span>
                    <span className="text-xs text-muted-foreground mt-1">{t(translationKeys.descriptionKey)}</span>
                  </div>
                </Link>
              </Button>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
