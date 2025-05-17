
"use client";

import type React from 'react';
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

export type Language = 
  | 'en' // English
  | 'es' // Spanish
  | 'fr' // French
  | 'ur' // Urdu
  | 'mr' // Marathi
  | 'bn' // Bangla
  | 'hi' // Hindi
  | 'ta' // Tamil
  | 'kn' // Kannada
  | 'or' // Odia
  | 'gu' // Gujarati
  | 'pa' // Punjabi
  ;

export interface AppSettings {
  username: string;
  // Account
  isPremium: boolean; // For "Get Premium"
  // Gameplay
  enableTimer: boolean;
  enableMistakeLimit: boolean;
  mistakeLimitValue: number;
  highlightPeers: boolean;
  highlightSameNumbers: boolean;
  autoRemoveNotes: boolean;
  autoCompleteCells: boolean;
  showPuzzleCompletionRate: boolean;
  showScore: boolean;
  useAnimatedScore: boolean;
  lightningMode: boolean;
  showRemainingNumbers: boolean;
  enableSmartHints: boolean;
  // Sensory Feedback
  audioEffectsEnabled: boolean;
  vibrationEnabled: boolean;
  // Notifications
  notificationsEnabled: boolean;
  // Language
  language: Language;
}

interface AppSettingsContextType extends AppSettings {
  setUsername: (name: string) => void;
  setIsPremium: (isPremium: boolean) => void;
  setEnableTimer: (enabled: boolean) => void;
  setEnableMistakeLimit: (enabled: boolean) => void;
  setMistakeLimitValue: (limit: number) => void;
  setHighlightPeers: (enabled: boolean) => void;
  setHighlightSameNumbers: (enabled: boolean) => void;
  setAutoRemoveNotes: (enabled: boolean) => void;
  setAutoCompleteCells: (enabled: boolean) => void;
  setShowPuzzleCompletionRate: (show: boolean) => void;
  setShowScore: (show: boolean) => void;
  setUseAnimatedScore: (use: boolean) => void;
  setLightningMode: (enabled: boolean) => void;
  setShowRemainingNumbers: (show: boolean) => void;
  setEnableSmartHints: (enabled: boolean) => void;
  setAudioEffectsEnabled: (enabled: boolean) => void;
  setVibrationEnabled: (enabled: boolean) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setLanguage: (language: Language) => void;
  saveSettings: () => void;
  loadSettings: () => void;
}

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined);

const LOCAL_STORAGE_APP_SETTINGS_KEY = 'sudokuKingAppSettings';

const defaultSettings: AppSettings = {
  username: 'Player',
  isPremium: false,
  enableTimer: true,
  enableMistakeLimit: false,
  mistakeLimitValue: 5,
  highlightPeers: true,
  highlightSameNumbers: true,
  autoRemoveNotes: true,
  autoCompleteCells: false,
  showPuzzleCompletionRate: true,
  showScore: true,
  useAnimatedScore: true,
  lightningMode: false,
  showRemainingNumbers: true,
  enableSmartHints: true,
  audioEffectsEnabled: true,
  vibrationEnabled: true,
  notificationsEnabled: true,
  language: 'en', // Default language
};

export function AppSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [mounted, setMounted] = useState(false);

  const loadSettings = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedSettings = localStorage.getItem(LOCAL_STORAGE_APP_SETTINGS_KEY);
        if (storedSettings) {
          const parsedSettings = JSON.parse(storedSettings);
          // Ensure all keys from defaultSettings are present, to avoid issues with old localStorage formats
          const completeSettings = { ...defaultSettings, ...parsedSettings };
          setSettings(completeSettings);
        } else {
          setSettings(defaultSettings);
        }
      } catch (error) {
        console.warn('Could not load app settings from localStorage.', error);
        setSettings(defaultSettings);
      }
    }
  }, []);
  
  useEffect(() => {
    setMounted(true);
    loadSettings();
  }, [loadSettings]);


  const saveSettings = useCallback(() => {
    if (mounted && typeof window !== 'undefined') {
      try {
        localStorage.setItem(LOCAL_STORAGE_APP_SETTINGS_KEY, JSON.stringify(settings));
      } catch (error) {
        console.warn('Could not save app settings to localStorage.', error);
      }
    }
  }, [settings, mounted]);

  useEffect(() => {
    if (mounted) { 
      saveSettings();
    }
  }, [settings, mounted, saveSettings]);


  const setUsername = useCallback((name: string) => setSettings(s => ({ ...s, username: name })), []);
  const setIsPremium = useCallback((isPremium: boolean) => setSettings(s => ({ ...s, isPremium })), []);
  const setEnableTimer = useCallback((enabled: boolean) => setSettings(s => ({ ...s, enableTimer: enabled })), []);
  const setEnableMistakeLimit = useCallback((enabled: boolean) => setSettings(s => ({ ...s, enableMistakeLimit: enabled })), []);
  const setMistakeLimitValue = useCallback((limit: number) => setSettings(s => ({ ...s, mistakeLimitValue: limit })), []);
  const setHighlightPeers = useCallback((enabled: boolean) => setSettings(s => ({ ...s, highlightPeers: enabled })), []);
  const setHighlightSameNumbers = useCallback((enabled: boolean) => setSettings(s => ({...s, highlightSameNumbers: enabled })), []);
  const setAutoRemoveNotes = useCallback((enabled: boolean) => setSettings(s => ({ ...s, autoRemoveNotes: enabled })), []);
  const setAutoCompleteCells = useCallback((enabled: boolean) => setSettings(s => ({ ...s, autoCompleteCells: enabled })), []);
  const setShowPuzzleCompletionRate = useCallback((show: boolean) => setSettings(s => ({ ...s, showPuzzleCompletionRate: show })), []);
  const setShowScore = useCallback((show: boolean) => setSettings(s => ({...s, showScore: show})), []);
  const setUseAnimatedScore = useCallback((use: boolean) => setSettings(s => ({ ...s, useAnimatedScore: use })), []);
  const setLightningMode = useCallback((enabled: boolean) => setSettings(s => ({...s, lightningMode: enabled})), []);
  const setShowRemainingNumbers = useCallback((show: boolean) => setSettings(s => ({ ...s, showRemainingNumbers: show })), []);
  const setEnableSmartHints = useCallback((enabled: boolean) => setSettings(s => ({ ...s, enableSmartHints: enabled })), []);
  const setAudioEffectsEnabled = useCallback((enabled: boolean) => setSettings(s => ({ ...s, audioEffectsEnabled: enabled })), []);
  const setVibrationEnabled = useCallback((enabled: boolean) => setSettings(s => ({ ...s, vibrationEnabled: enabled })), []);
  const setNotificationsEnabled = useCallback((enabled: boolean) => setSettings(s => ({ ...s, notificationsEnabled: enabled })), []);
  const setLanguage = useCallback((language: Language) => setSettings(s => ({ ...s, language })), []);

  const value = useMemo(() => ({
    ...settings,
    setUsername,
    setIsPremium,
    setEnableTimer,
    setEnableMistakeLimit,
    setMistakeLimitValue,
    setHighlightPeers,
    setHighlightSameNumbers,
    setAutoRemoveNotes,
    setAutoCompleteCells,
    setShowPuzzleCompletionRate,
    setShowScore,
    setUseAnimatedScore,
    setLightningMode,
    setShowRemainingNumbers,
    setEnableSmartHints,
    setAudioEffectsEnabled,
    setVibrationEnabled,
    setNotificationsEnabled,
    setLanguage,
    saveSettings,
    loadSettings,
  }), [settings, setUsername, setIsPremium, setEnableTimer, setEnableMistakeLimit, setMistakeLimitValue, setHighlightPeers, setHighlightSameNumbers, setAutoRemoveNotes, setAutoCompleteCells, setShowPuzzleCompletionRate, setShowScore, setUseAnimatedScore, setLightningMode, setShowRemainingNumbers, setEnableSmartHints, setAudioEffectsEnabled, setVibrationEnabled, setNotificationsEnabled, setLanguage, saveSettings, loadSettings]);

  return <AppSettingsContext.Provider value={value}>{children}</AppSettingsContext.Provider>;
}

export function useAppSettings() {
  const context = useContext(AppSettingsContext);
  if (context === undefined) {
    throw new Error('useAppSettings must be used within an AppSettingsProvider');
  }
  return context;
}

    