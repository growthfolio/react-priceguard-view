import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { THEMES, STORAGE_KEYS, DEFAULT_USER_SETTINGS } from '../constants';
import { useAuth } from './AuthContext';
import { userSettingsService } from '../services/userSettingsService';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isSystemTheme: boolean;
}

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Custom hook to use theme context
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

/**
 * Theme Provider Component
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  defaultTheme = DEFAULT_USER_SETTINGS.theme 
}) => {
  const { user } = useAuth();
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('dark');

  // Get resolved theme (handles 'system' theme)
  const resolvedTheme: 'light' | 'dark' = theme === 'system' ? systemTheme : theme;
  const isSystemTheme = theme === 'system';

  /**
   * Listen to system theme changes
   */
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    // Set initial system theme
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');

    // Listen for changes
    mediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, []);

  /**
   * Apply theme to document
   */
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark');
    
    // Add current theme class
    root.classList.add(resolvedTheme);
    
    // Update meta theme color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', resolvedTheme === 'dark' ? '#1a1a1a' : '#ffffff');
    }
  }, [resolvedTheme]);

  /**
   * Load theme from localStorage or user settings
   */
  useEffect(() => {
    const loadTheme = async () => {
      try {
        // If user is authenticated, try to load from user settings
        if (user?.settings?.theme) {
          setThemeState(user.settings.theme);
          return;
        }

        // Fallback to localStorage
        const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
        if (savedTheme && Object.values(THEMES).includes(savedTheme as Theme)) {
          setThemeState(savedTheme as Theme);
          return;
        }

        // Use default theme
        setThemeState(defaultTheme);
      } catch (error) {
        console.warn('Failed to load theme:', error);
        setThemeState(defaultTheme);
      }
    };

    loadTheme();
  }, [user, defaultTheme]);

  /**
   * Set theme and persist it
   */
  const setTheme = useCallback(async (newTheme: Theme) => {
    try {
      setThemeState(newTheme);
      
      // Save to localStorage
      localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
      
      // If user is authenticated, save to user settings
      if (user) {
        await userSettingsService.updateSettings({
          theme: newTheme
        });
      }
    } catch (error) {
      console.error('Failed to save theme:', error);
      // Still update local state even if persistence fails
      setThemeState(newTheme);
    }
  }, [user]);

  /**
   * Toggle between light and dark themes
   */
  const toggleTheme = useCallback(() => {
    if (theme === 'system') {
      // If system theme, toggle to opposite of current system preference
      setTheme(systemTheme === 'dark' ? 'light' : 'dark');
    } else {
      // Toggle between light and dark
      setTheme(theme === 'dark' ? 'light' : 'dark');
    }
  }, [theme, systemTheme, setTheme]);

  const value: ThemeContextType = {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    isSystemTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
