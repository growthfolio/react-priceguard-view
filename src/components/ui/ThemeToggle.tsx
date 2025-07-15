import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface ThemeToggleProps {
  variant?: 'button' | 'dropdown' | 'compact';
  className?: string;
}

/**
 * Theme Toggle Component
 * Allows users to switch between light, dark, and system themes
 */
export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  variant = 'button',
  className = ''
}) => {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const themes = [
    { key: 'light', label: 'Claro', icon: Sun },
    { key: 'dark', label: 'Escuro', icon: Moon },
    { key: 'system', label: 'Sistema', icon: Monitor },
  ] as const;

  if (variant === 'compact') {
    return (
      <button
        onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
        className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${className}`}
        title={`Trocar para tema ${resolvedTheme === 'dark' ? 'claro' : 'escuro'}`}
      >
        {resolvedTheme === 'dark' ? (
          <Sun size={18} className="text-yellow-500" />
        ) : (
          <Moon size={18} className="text-gray-600" />
        )}
      </button>
    );
  }

  if (variant === 'dropdown') {
    return (
      <div className={`space-y-1 ${className}`}>
        {themes.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTheme(key)}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              theme === key
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
            }`}
          >
            <Icon size={16} />
            <span>{label}</span>
            {theme === key && (
              <span className="ml-auto">
                <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
              </span>
            )}
          </button>
        ))}
      </div>
    );
  }

  // Default button variant with dropdown
  return (
    <div className={`relative group ${className}`}>
      <button
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        title="Alterar tema"
      >
        {resolvedTheme === 'dark' ? (
          <Moon size={18} className="text-gray-600 dark:text-gray-400" />
        ) : (
          <Sun size={18} className="text-yellow-500" />
        )}
      </button>
      
      {/* Dropdown */}
      <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="p-2">
          {themes.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTheme(key)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                theme === key
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <Icon size={16} />
              <span>{label}</span>
              {theme === key && (
                <span className="ml-auto">
                  <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThemeToggle;
