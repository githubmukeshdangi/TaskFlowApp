import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
type ThemeMode = 'light' | 'dark';
type ThemeColors = {
  background: string;
  card: string;
  text: string;
  secondaryText: string;
  border: string;
  primary: string;
  danger: string;
  tabBar: string;
};
type ThemeContextType = {
  theme: ThemeMode;
  colors: ThemeColors;
  toggleTheme: () => void;
  isDark: boolean;
  isThemeLoaded: boolean;
};
const THEME_STORAGE_KEY = '@taskflow_theme';
const lightColors: ThemeColors = {
  background: '#F8FAFC',
  card: '#FFFFFF',
  text: '#0F172A',
  secondaryText: '#64748B',
  border: '#E2E8F0',
  primary: '#2563EB',
  danger: '#DC2626',
  tabBar: '#FFFFFF',
};
const darkColors: ThemeColors = {
  background: '#0F172A',
  card: '#1E293B',
  text: '#F8FAFC',
  secondaryText: '#CBD5E1',
  border: '#334155',
  primary: '#60A5FA',
  danger: '#F87171',
  tabBar: '#1E293B',
};
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme === 'light' || savedTheme === 'dark') {
          setTheme(savedTheme);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      } finally {
        setIsThemeLoaded(true);
      }
    };
    loadTheme();
  }, []);
  const toggleTheme = () => {
    setTheme((currentTheme) => {
      const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
      AsyncStorage.setItem(THEME_STORAGE_KEY, nextTheme).catch((error) => console.error('Error saving theme:', error));
      return nextTheme;
    });
  };
  const colors = theme === 'dark' ? darkColors : lightColors;
  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme, isDark: theme === 'dark', isThemeLoaded }}>
      {isThemeLoaded ? children : null}
    </ThemeContext.Provider>
  );
};
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};