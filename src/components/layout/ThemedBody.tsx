
"use client";

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import PageHeader from '@/components/layout/PageHeader';
import { SubHeaderNavigation } from '@/components/layout/SubHeaderNavigation';
import { Toaster } from "@/components/ui/toaster";
import { usePathname } from 'next/navigation'; // Import usePathname

interface ThemedBodyProps {
  children: React.ReactNode;
  fontVariable: string;
}

export function ThemedBody({ children, fontVariable }: ThemedBodyProps) {
  const { theme, lightThemeBackground, darkThemeBackground, pinkThemeBackground, blueThemeBackground, mounted } = useTheme();
  const pathname = usePathname(); // Get current pathname

  const isGamePage = pathname.startsWith('/play/'); // Check if it's a game page
  
  const bodyStyle: React.CSSProperties = {};

  if (mounted) { 
    let currentBg = null;
    if (theme === 'light') currentBg = lightThemeBackground;
    else if (theme === 'dark') currentBg = darkThemeBackground;
    else if (theme === 'pink') currentBg = pinkThemeBackground;
    else if (theme === 'blue') currentBg = blueThemeBackground;

    if (currentBg) {
      bodyStyle.backgroundImage = `url(${currentBg})`;
      bodyStyle.backgroundSize = 'cover';
      bodyStyle.backgroundPosition = 'center';
      bodyStyle.backgroundAttachment = 'fixed';
      bodyStyle.backgroundRepeat = 'no-repeat';
    }
  }
  
  const pageHeaderHeight = "65px"; 

  return (
    <body 
      className={cn(
        "font-sans antialiased flex flex-col h-full overflow-hidden",
        fontVariable
      )} 
      style={{...bodyStyle, '--page-header-height': pageHeaderHeight} as React.CSSProperties}
    >
      <PageHeader />
      {/* Removed container mx-auto from main, it will now be full-width. Child pages manage their own containers. */}
      <main className="flex flex-col flex-grow w-full">
        {children}
      </main>
      {!isGamePage && <SubHeaderNavigation />} {/* Conditionally render SubHeaderNavigation */}
      <Toaster />
    </body>
  );
}
