# 🔊 Audio Assets for Notifications

This directory contains audio files used for notification sounds in the PriceGuard application.

## 📁 Directory Structure

```
public/sounds/
├── notification-info.mp3     # Information notifications (optional)
├── notification-success.mp3  # Success notifications (optional)  
├── notification-warning.mp3  # Warning notifications (optional)
├── notification-error.mp3    # Error notifications (optional)
└── README.md                 # This file
```

## 🎵 Audio File Requirements

- **Format**: MP3 (recommended) or WAV
- **Duration**: 0.5-2 seconds max
- **File Size**: < 50KB each
- **Volume**: Normalized to -6dB peak

## 🚀 Usage

The audio service (`src/services/audioService.ts`) will automatically:

1. **Fallback gracefully** if audio files are not present
2. **Generate system beeps** using Web Audio API as fallback
3. **Respect user preferences** for volume and enable/disable

## 📝 Adding Audio Files

1. Place your audio files in this directory
2. Use the exact filenames shown above
3. The application will automatically detect and use them
4. Test with the notification system in the app

## 🔧 Fallback Behavior

If audio files are missing, the system will:
- Use Web Audio API to generate simple beep sounds
- Log warnings in development mode
- Continue to work without interruption

## 🎛️ Customization

To customize sounds:
1. Replace the files with your own audio
2. Keep the same filenames
3. Ensure files meet the requirements above
4. Test in both development and production

## 🔍 Debugging

To test audio functionality:
- Open browser console
- Use: `audioService.testSound('info')` 
- Check for any error messages
- Verify browser audio permissions

---

**Note**: Audio files are optional. The notification system works with or without them.
