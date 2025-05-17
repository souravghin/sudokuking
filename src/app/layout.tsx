
import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { GameDisplayInfoProvider } from '@/contexts/GameDisplayInfoContext';
import { AppSettingsProvider } from '@/contexts/AppSettingsContext'; // Import AppSettingsProvider
import React from 'react';
import { ThemedBody } from '@/components/layout/ThemedBody';
import PWAInstallHandler from '@/components/PWAInstallHandler'; // Import PWAInstallHandler

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Sudoku King',
  description: 'A calming Sudoku experience by Firebase Studio',
  manifest: '/manifest.json', // Link to manifest
  applicationName: "Sudoku King",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Sudoku King",
  },
  formatDetection: {
    telephone: false,
  },
  // themeColor: "#F97316", // Already in manifest, but can be here too
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider>
      <AppSettingsProvider>
        <GameDisplayInfoProvider>
          <html lang="en" suppressHydrationWarning className="h-full overflow-hidden">
            <head>
              {/* Standard PWA meta tags */}
              <meta name="application-name" content="Sudoku King" />
              <meta name="apple-mobile-web-app-capable" content="yes" />
              <meta name="apple-mobile-web-app-status-bar-style" content="default" />
              <meta name="apple-mobile-web-app-title" content="Sudoku King" />
              <meta name="format-detection" content="telephone=no" />
              <meta name="mobile-web-app-capable" content="yes" />
              <meta name="msapplication-config" content="/browserconfig.xml" /> 
              <meta name="msapplication-TileColor" content="#F97316" />
              <meta name="msapplication-tap-highlight" content="no" />
              <meta name="theme-color" content="#F97316" />

              <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />
              {/* You would need to create an /icons directory in /public and add these images */}
              {/* <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" /> */}
              {/* <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" /> */}
            </head>
            <ThemedBody fontVariable={inter.variable}>
              {children}
              <PWAInstallHandler />
            </ThemedBody>
          </html>
        </GameDisplayInfoProvider>
      </AppSettingsProvider>
    </ThemeProvider>
  );
}
