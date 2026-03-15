import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

import { ColorScheme, Colors, ThemeColors } from '@/constants/theme';

const STORAGE_KEY = '@theme_preference';

interface ThemeContextValue {
  scheme: ColorScheme;
  colors: ThemeColors;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useSystemColorScheme() ?? 'light';
  const [scheme, setScheme] = useState<ColorScheme>(systemScheme);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored === 'light' || stored === 'dark') {
        setScheme(stored);
      }
      setHydrated(true);
    });
  }, []);

  const toggleTheme = useCallback(() => {
    setScheme((prev) => {
      const next: ColorScheme = prev === 'light' ? 'dark' : 'light';
      AsyncStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  if (!hydrated) return null;

  return (
    <ThemeContext.Provider value={{ scheme, colors: Colors[scheme], toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useAppTheme must be used inside ThemeProvider');
  return ctx;
}
