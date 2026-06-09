import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { AppColors, getColors } from '../utils/colors';

interface ThemeContextType {
  isDark: boolean;
  colors: AppColors;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDark, setIsDark] = useState(false);
  const colors = getColors(isDark);

  const toggleTheme = useCallback(() => {
    setIsDark(prev => !prev);
  }, []);

  const value = useMemo(
    () => ({ isDark, colors, toggleTheme }),
    [isDark, colors, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
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