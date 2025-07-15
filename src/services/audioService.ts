/**
 * Audio Service
 * Handles notification sounds and vibration feedback
 */

interface AudioConfig {
  volume: number;
  enabled: boolean;
}

interface NotificationSounds {
  info: string;
  warning: string;
  error: string;
  success: string;
}

class AudioService {
  private config: AudioConfig = {
    volume: 0.5,
    enabled: true
  };

  private sounds: NotificationSounds = {
    info: '/sounds/notification-info.mp3',
    warning: '/sounds/notification-warning.mp3',
    error: '/sounds/notification-error.mp3',
    success: '/sounds/notification-success.mp3'
  };

  /**
   * Initialize audio service
   */
  public async initialize(): Promise<void> {
    try {
      // Check if audio is supported
      if (typeof Audio === 'undefined') {
        console.warn('Audio not supported in this environment');
        this.config.enabled = false;
        return;
      }

      // Load user preferences
      const savedConfig = localStorage.getItem('priceGuard_audioConfig');
      if (savedConfig) {
        this.config = { ...this.config, ...JSON.parse(savedConfig) };
      }

    } catch (error) {
      console.error('Failed to initialize audio service:', error);
      this.config.enabled = false;
    }
  }

  /**
   * Play notification sound based on type
   */
  public async playNotificationSound(type: keyof NotificationSounds = 'info'): Promise<void> {
    if (!this.config.enabled) return;

    try {
      const audio = new Audio(this.sounds[type]);
      audio.volume = this.config.volume;
      await audio.play();
    } catch (error) {
      console.warn('Failed to play notification sound:', error);
      // Fallback to system beep if available
      this.playSystemBeep();
    }
  }

  /**
   * Trigger device vibration (mobile devices)
   */
  public vibrate(pattern: number | number[] = 200): void {
    if (!navigator.vibrate) return;

    try {
      navigator.vibrate(pattern);
    } catch (error) {
      console.warn('Vibration not supported:', error);
    }
  }

  /**
   * Play system beep as fallback
   */
  private playSystemBeep(): void {
    try {
      // Use AudioContext for a simple beep
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(this.config.volume * 0.1, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.warn('System beep not available:', error);
    }
  }

  /**
   * Update audio configuration
   */
  public updateConfig(newConfig: Partial<AudioConfig>): void {
    this.config = { ...this.config, ...newConfig };
    localStorage.setItem('priceGuard_audioConfig', JSON.stringify(this.config));
  }

  /**
   * Get current audio configuration
   */
  public getConfig(): AudioConfig {
    return { ...this.config };
  }

  /**
   * Enable/disable audio notifications
   */
  public setEnabled(enabled: boolean): void {
    this.updateConfig({ enabled });
  }

  /**
   * Set notification volume (0-1)
   */
  public setVolume(volume: number): void {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    this.updateConfig({ volume: clampedVolume });
  }

  /**
   * Test notification sound
   */
  public async testSound(type: keyof NotificationSounds = 'info'): Promise<void> {
    await this.playNotificationSound(type);
    this.vibrate([100, 50, 100]);
  }
}

// Export singleton instance
export const audioService = new AudioService();
export default audioService;
