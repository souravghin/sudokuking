
"use client";

import type React from 'react';
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

export type Theme = 'light' | 'dark' | 'pink' | 'blue';

interface ThemeContextProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void; // This will toggle between light/dark for simplicity in header
  lightThemeBackground: string | null;
  darkThemeBackground: string | null;
  pinkThemeBackground: string | null;
  blueThemeBackground: string | null;
  setLightThemeBackground: (image: string | null) => void;
  setDarkThemeBackground: (image: string | null) => void;
  setPinkThemeBackground: (image: string | null) => void;
  setBlueThemeBackground: (image: string | null) => void;
  clearLightThemeBackground: () => void;
  clearDarkThemeBackground: () => void;
  clearPinkThemeBackground: () => void;
  clearBlueThemeBackground: () => void;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [theme, setThemeState] = useState<Theme>('dark'); // Default to dark theme
  const [lightThemeBackground, setLightBgState] = useState<string | null>(null);
  const [darkThemeBackground, setDarkBgState] = useState<string | null>(null);
  const [pinkThemeBackground, setPinkBgState] = useState<string | null>(null);
  const [blueThemeBackground, setBlueBgState] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    try {
      const storedTheme = localStorage.getItem('sudokuKingTheme') as Theme | null;
      const storedLightBg = localStorage.getItem('sudokuKingLightBg');
      const storedDarkBg = localStorage.getItem('sudokuKingDarkBg');
      const storedPinkBg = localStorage.getItem('sudokuKingPinkBg');
      const storedBlueBg = localStorage.getItem('sudokuKingBlueBg');

      if (storedTheme) {
        setThemeState(storedTheme);
      } else {
        setThemeState('dark'); // Default
      }
      if (storedLightBg) setLightBgState(storedLightBg);
      if (storedDarkBg) setDarkBgState(storedDarkBg);
      if (storedPinkBg) setPinkBgState(storedPinkBg);
      if (storedBlueBg) setBlueBgState(storedBlueBg);

    } catch (error) {
      console.warn('Could not access localStorage for theming.', error);
      setThemeState('dark');
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.classList.remove('light', 'dark', 'pink', 'blue');
      document.documentElement.classList.add(theme);
      try {
        localStorage.setItem('sudokuKingTheme', theme);
      } catch (error) {
        console.warn('Could not save theme to localStorage.', error);
      }
    }
  }, [theme, mounted]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    // Simple toggle for header button, switches between light and dark
    setThemeState(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);

  const createBgSetter = (setter: React.Dispatch<React.SetStateAction<string | null>>, key: string) => 
    useCallback((image: string | null) => {
      setter(image);
      if (mounted) {
        try {
          if (image) localStorage.setItem(key, image);
          else localStorage.removeItem(key);
        } catch (error) {
          console.warn(`Could not save ${key} to localStorage.`, error);
        }
      }
    }, [mounted, setter, key]);

  const setLightThemeBackground = createBgSetter(setLightBgState, 'sudokuKingLightBg');
  const setDarkThemeBackground = createBgSetter(setDarkBgState, 'sudokuKingDarkBg');
  const setPinkThemeBackground = createBgSetter(setPinkBgState, 'sudokuKingPinkBg');
  const setBlueThemeBackground = createBgSetter(setBlueBgState, 'sudokuKingBlueBg');

  const createBgClearer = (setter: (image: string | null) => void) => 
    useCallback(() => {
      setter(null);
    }, [setter]);

  const clearLightThemeBackground = createBgClearer(setLightThemeBackground);
  const clearDarkThemeBackground = createBgClearer(setDarkThemeBackground);
  const clearPinkThemeBackground = createBgClearer(setPinkThemeBackground);
  const clearBlueThemeBackground = createBgClearer(setBlueThemeBackground);

  const value = useMemo(() => ({
    theme,
    setTheme,
    toggleTheme,
    lightThemeBackground,
    darkThemeBackground,
    pinkThemeBackground,
    blueThemeBackground,
    setLightThemeBackground,
    setDarkThemeBackground,
    setPinkThemeBackground,
    setBlueThemeBackground,
    clearLightThemeBackground,
    clearDarkThemeBackground,
    clearPinkThemeBackground,
    clearBlueThemeBackground,
    mounted,
  }), [
    theme, setTheme, toggleTheme, 
    lightThemeBackground, darkThemeBackground, pinkThemeBackground, blueThemeBackground,
    setLightThemeBackground, setDarkThemeBackground, setPinkThemeBackground, setBlueThemeBackground,
    clearLightThemeBackground, clearDarkThemeBackground, clearPinkThemeBackground, clearBlueThemeBackground,
    mounted
  ]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
