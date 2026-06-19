# Car Pilot Welcome

An Expo-based React Native application that automatically speaks a custom welcome message when the app starts. Designed for eventual deployment on Android car stereos with boot-time auto-speech capability.

## Features

✅ **First Launch Setup** - User enters custom welcome message on first run  
✅ **Auto-Speak** - Message automatically spoken when app opens  
✅ **AsyncStorage Persistence** - Message saved locally and persists across sessions  
✅ **Text-to-Speech (TTS)** - Natural voice using `expo-speech`  
✅ **Dark Theme UI** - Modern, car-friendly interface  
✅ **Test/Control** - Play, stop, and share welcome messages from dashboard  
✅ **Fallback Logic** - Default message if custom message not set  
✅ **Modular Architecture** - Ready for Android car stereo integration  

## Project Structure

```
car-pilot-welcome/
├── App.js                          # Main entry point with initialization
├── app.json                        # Expo configuration
├── package.json                    # Dependencies
├── babel.config.js                 # Babel setup
├── src/
│   ├── screens/
│   │   ├── WelcomeSetup.js        # First-time setup screen
│   │   └── WelcomeDashboard.js    # Main dashboard with controls
│   └── services/
│       └── BootService.js         # Text-to-speech and boot logic
├── assets/                         # Placeholder for app icons
└── README.md                       # This file
```

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- Android or iOS device with Expo Go app, or use an emulator

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/immo9769/car-pilot-welcome.git
   cd car-pilot-welcome
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the Expo development server:**
   ```bash
   npm start
   # or
   npx expo start
   ```

4. **Run on device/emulator:**
   - **Android:** Press `a` in the terminal or scan the QR code with Expo Go
   - **iOS:** Press `i` in the terminal or scan the QR code with Expo Go
   - **Web:** Press `w` in the terminal

### Testing on Physical Device

1. Download **Expo Go** from App Store or Google Play
2. Scan the QR code displayed in terminal
3. App will load and automatically speak the welcome message

## Usage

### First Launch
1. App starts and shows setup screen
2. Enter your custom welcome message (or use default)
3. Tap "Save Custom Message" or "Use Default Message"
4. Message is saved and automatically spoken

### Subsequent Launches
1. App opens and automatically speaks the saved message
2. Dashboard displays saved message
3. Use "Test Speak" to manually trigger message
4. Use "Reset Setup" to change the welcome message

## Architecture for Future Android Car Stereo

The project is structured to support future Android car stereo integration:

### Current Flow (Mobile)
```
App Start
  ↓
Load saved message from AsyncStorage
  ↓
Trigger BootService.speakWelcomeMessage()
  ↓
TTS speaks message (expo-speech)
```

### Future Flow (Car Stereo - BOOT_COMPLETED)
```
Car Powers On
  ↓
Android BOOT_COMPLETED broadcast received
  ↓
Native Android receiver triggers
  ↓
Bridge to React Native (BootService.handleBootComplete)
  ↓
TTS speaks message
```

### Future Files to Add
- `android/app/src/main/java/com/carpilot/BootReceiver.java` - Broadcast receiver
- `android/app/src/main/AndroidManifest.xml` - Register BOOT_COMPLETED receiver
- `android/app/src/main/java/com/carpilot/BootModule.java` - Native bridge module

All hooks for these integrations are already in place via `BootService.js`.

## Configuration

### Default Message
Edit `src/services/BootService.js`:
```javascript
const DEFAULT_MESSAGE = 'Welcome Captain. All systems are operational. Have a safe journey.';
```

### Speech Rate
Adjust speech rate in `BootService.speakWelcomeMessage()`:
```javascript
rate: 0.9  // 0.5 (slow) to 1.5 (fast)
```

### Language
Change speech language in `BootService.speakWelcomeMessage()`:
```javascript
language: 'en'  // 'es', 'fr', 'de', etc.
```

## Dependencies

- **react** (18.2.0) - UI library
- **react-native** (0.73.6) - Native mobile framework
- **expo** (^50.0.0) - Development platform
- **expo-speech** (^12.0.0) - Text-to-speech engine
- **@react-native-async-storage/async-storage** (^1.21.0) - Local storage

## Storage

Messages are stored using AsyncStorage with key: `carpilot_welcome_message`

To reset storage programmatically:
```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';
await AsyncStorage.removeItem('carpilot_welcome_message');
```

## Troubleshooting

### Message not speaking on startup
- Check device volume is not muted
- Verify TTS permissions are granted (Android)
- Check browser console for errors

### Message not saving
- Verify AsyncStorage is not disabled
- Check device storage space
- Review console logs for errors

### App not loading
- Clear Expo cache: `expo start --clear`
- Delete `node_modules` and reinstall: `npm install`
- Verify Expo CLI is up to date

## Future Enhancements

- [ ] Multiple welcome messages with scheduling
- [ ] Voice customization (pitch, speed, language)
- [ ] Integration with car navigation system
- [ ] Custom notification sounds
- [ ] Analytics and usage tracking
- [ ] Native Android car stereo APK
- [ ] iOS CarPlay support
- [ ] Message templates

## Build for Android Car Stereo

When ready to deploy to actual car stereo:

```bash
# Build APK
eas build --platform android --profile preview

# Or build locally
npx react-native run-android --variant release
```

Additional native Android code will be required for BOOT_COMPLETED receiver.

## License

MIT License - feel free to use and modify

## Support

For issues and questions, please open an issue on GitHub.

---

**Car Pilot Welcome** • Turning your car into a smart co-pilot 🚗
