import { apiClient } from './apiClient';
import { API_ENDPOINTS, STORAGE_KEYS, DEFAULT_USER_SETTINGS } from '../constants';
import { UserSettings } from '../models/User';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: 'pt-BR' | 'en-US' | 'es-ES';
  currency: 'USD' | 'BRL' | 'EUR';
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    sound: boolean;
    vibration: boolean;
  };
  dashboard: {
    defaultView: 'overview' | 'detailed' | 'compact';
    refreshInterval: number; // in seconds
    showTutorial: boolean;
  };
  trading: {
    defaultTimeframe: '1m' | '5m' | '15m' | '1h' | '4h' | '1d';
    riskProfile: 'conservative' | 'moderate' | 'aggressive';
    favoriteSymbols: string[];
  };
}

class UserPreferencesService {
  private preferences: UserPreferences | null = null;

  /**
   * Get default preferences
   */
  private getDefaultPreferences(): UserPreferences {
    return {
      theme: DEFAULT_USER_SETTINGS.theme,
      language: DEFAULT_USER_SETTINGS.language,
      currency: DEFAULT_USER_SETTINGS.currency_preference,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      notifications: {
        email: DEFAULT_USER_SETTINGS.email_notifications,
        push: DEFAULT_USER_SETTINGS.push_notifications,
        sound: DEFAULT_USER_SETTINGS.sound_enabled,
        vibration: DEFAULT_USER_SETTINGS.vibration_enabled,
      },
      dashboard: {
        defaultView: DEFAULT_USER_SETTINGS.default_timeframe === '1h' ? 'overview' : 'detailed',
        refreshInterval: 30,
        showTutorial: true,
      },
      trading: {
        defaultTimeframe: DEFAULT_USER_SETTINGS.default_timeframe,
        riskProfile: 'moderate',
        favoriteSymbols: [],
      },
    };
  }

  /**
   * Load preferences from localStorage or API
   */
  public async loadPreferences(): Promise<UserPreferences> {
    try {
      // Try to load from API first
      const response = await apiClient.get<UserPreferences>(API_ENDPOINTS.USER.PREFERENCES);
      this.preferences = response.data!;
      
      // Save to localStorage as backup
      localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(this.preferences));
      
      return this.preferences;
    } catch (error) {
      console.warn('Failed to load preferences from API, using localStorage:', error);
      
      // Fallback to localStorage
      const savedPreferences = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
      if (savedPreferences) {
        try {
          this.preferences = JSON.parse(savedPreferences);
          return this.preferences!;
        } catch (parseError) {
          console.warn('Failed to parse saved preferences:', parseError);
        }
      }
      
      // Use defaults
      this.preferences = this.getDefaultPreferences();
      return this.preferences;
    }
  }

  /**
   * Get current preferences (cached)
   */
  public getPreferences(): UserPreferences {
    if (!this.preferences) {
      // If not loaded, return from localStorage or defaults
      const savedPreferences = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
      if (savedPreferences) {
        try {
          this.preferences = JSON.parse(savedPreferences);
          return this.preferences!;
        } catch (error) {
          console.warn('Failed to parse saved preferences:', error);
        }
      }
      this.preferences = this.getDefaultPreferences();
    }
    return this.preferences!;
  }

  /**
   * Update preferences
   */
  public async updatePreferences(updates: Partial<UserPreferences>): Promise<UserPreferences> {
    const currentPreferences = this.getPreferences();
    const updatedPreferences: UserPreferences = {
      ...currentPreferences,
      ...updates,
      // Merge nested objects
      notifications: { ...currentPreferences.notifications, ...(updates.notifications || {}) },
      dashboard: { ...currentPreferences.dashboard, ...(updates.dashboard || {}) },
      trading: { ...currentPreferences.trading, ...(updates.trading || {}) },
    };

    try {
      // Save to API
      const response = await apiClient.put<UserPreferences>(
        API_ENDPOINTS.USER.PREFERENCES,
        updatedPreferences
      );
      
      this.preferences = response.data!;
      
      // Save to localStorage as backup
      localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(this.preferences));
      
      return this.preferences!;
    } catch (error) {
      console.error('Failed to update preferences on API:', error);
      
      // Even if API fails, update locally
      this.preferences = updatedPreferences;
      localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(this.preferences));
      
      throw error; // Re-throw to let caller know about the API failure
    }
  }

  /**
   * Update theme preference
   */
  public async updateTheme(theme: UserPreferences['theme']): Promise<void> {
    await this.updatePreferences({ theme });
  }

  /**
   * Update language preference
   */
  public async updateLanguage(language: UserPreferences['language']): Promise<void> {
    await this.updatePreferences({ language });
  }

  /**
   * Update notification preferences
   */
  public async updateNotifications(notifications: Partial<UserPreferences['notifications']>): Promise<void> {
    await this.updatePreferences({ notifications: notifications as UserPreferences['notifications'] });
  }

  /**
   * Update dashboard preferences
   */
  public async updateDashboard(dashboard: Partial<UserPreferences['dashboard']>): Promise<void> {
    await this.updatePreferences({ dashboard: dashboard as UserPreferences['dashboard'] });
  }

  /**
   * Update trading preferences
   */
  public async updateTrading(trading: Partial<UserPreferences['trading']>): Promise<void> {
    await this.updatePreferences({ trading: trading as UserPreferences['trading'] });
  }

  /**
   * Add favorite symbol
   */
  public async addFavoriteSymbol(symbol: string): Promise<void> {
    const currentPreferences = this.getPreferences();
    const favoriteSymbols = [...currentPreferences.trading.favoriteSymbols];
    
    if (!favoriteSymbols.includes(symbol)) {
      favoriteSymbols.push(symbol);
      await this.updateTrading({ favoriteSymbols });
    }
  }

  /**
   * Remove favorite symbol
   */
  public async removeFavoriteSymbol(symbol: string): Promise<void> {
    const currentPreferences = this.getPreferences();
    const favoriteSymbols = currentPreferences.trading.favoriteSymbols.filter(s => s !== symbol);
    await this.updateTrading({ favoriteSymbols });
  }

  /**
   * Reset preferences to defaults
   */
  public async resetPreferences(): Promise<UserPreferences> {
    const defaultPreferences = this.getDefaultPreferences();
    return await this.updatePreferences(defaultPreferences);
  }

  /**
   * Clear cached preferences
   */
  public clearCache(): void {
    this.preferences = null;
    localStorage.removeItem(STORAGE_KEYS.PREFERENCES);
  }

  /**
   * Convert UserSettings to UserPreferences
   */
  public convertUserSettingsToPreferences(settings: UserSettings): UserPreferences {
    return {
      theme: settings.theme,
      language: 'pt-BR', // Default, as it's not in UserSettings
      currency: 'USD', // Default, as it's not in UserSettings
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      notifications: {
        email: settings.notifications_email,
        push: settings.notifications_push,
        sound: true, // Default
        vibration: true, // Default
      },
      dashboard: {
        defaultView: settings.default_view,
        refreshInterval: 30,
        showTutorial: true,
      },
      trading: {
        defaultTimeframe: settings.default_timeframe,
        riskProfile: settings.risk_profile,
        favoriteSymbols: settings.favorite_symbols,
      },
    };
  }
}

// Export singleton instance
export const userPreferencesService = new UserPreferencesService();
export default userPreferencesService;
