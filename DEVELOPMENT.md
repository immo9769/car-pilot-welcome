# Development Guide

## Getting Started

### 1. Setup Development Environment

```bash
# Install Node.js (v14+)
# Install Expo CLI globally
npm install -g expo-cli

# Clone repository
git clone https://github.com/immo9769/car-pilot-welcome.git
cd car-pilot-welcome

# Install dependencies
npm install
```

### 2. Start Development Server

```bash
npm start
# or
npx expo start
```

This opens the Expo DevTools in your terminal.

### 3. Test on Device

**Option A: Physical Device**
- Install Expo Go app (App Store or Google Play)
- Scan QR code from terminal with your device
- App will load over LAN

**Option B: Android Emulator**
- Start Android Emulator
- Press `a` in terminal
- App will load in emulator

**Option C: iOS Simulator (macOS only)**
- Start iOS Simulator (`open -a Simulator`)
- Press `i` in terminal
- App will load in simulator

**Option D: Web**
- Press `w` in terminal
- App will open in browser (note: TTS may not work on all browsers)

## Project Structure Breakdown

### `App.js`
Main entry point. Handles:
- Checking if setup is complete
- Loading saved message from AsyncStorage
- Calling BootService to speak message
- Routing between Setup and Dashboard screens

### `src/services/BootService.js`
Core business logic for:
- Text-to-speech operations
- Loading/speaking messages
- Default message fallback
- Future Android boot integration hooks

### `src/screens/WelcomeSetup.js`
First-time setup UI with:
- Text input for custom message
- Character counter
- Default message preview
- Save/Use Default buttons

### `src/screens/WelcomeDashboard.js`
Main dashboard with:
- Current message display
- Test speak button
- Share functionality
- Reset setup option
- Info section

## Code Style Guidelines

### Components
- Use functional components with React Hooks only
- Use `useEffect` for side effects
- Separate UI logic into presentational components

### State Management
- Use `useState` for component state
- Use `useEffect` for lifecycle management
- Keep state as local as possible

### Storage
- Use AsyncStorage for persistent data
- Always use try-catch blocks for async operations
- Clear errors in console for debugging

### Styling
- Use `StyleSheet.create()` for all styles
- Maintain dark theme (black #000000, blue #4A90E2, green #50C878)
- Use consistent spacing (multiples of 4px or 8px)

## Testing

### Manual Testing Checklist

- [ ] First launch shows setup screen
- [ ] Message saves to AsyncStorage
- [ ] Message speaks on app open
- [ ] Message speaks when "Test Speak" tapped
- [ ] Message stops when "Stop" tapped
- [ ] Share functionality works
- [ ] Reset clears saved message
- [ ] Default message works as fallback
- [ ] App handles no saved message gracefully
- [ ] UI looks good on various screen sizes

### Console Debugging

Open Expo DevTools (press `d` in terminal) and select:
- **Remote JS Debugger** - Use browser console for logs
- Check for any TTS errors
- Verify AsyncStorage operations

### Testing TTS Functionality

```javascript
// Test direct speech
import * as Speech from 'expo-speech';

Speech.speak('Hello World', {
  language: 'en',
  pitch: 1.0,
  rate: 0.9,
});
```

## Modifying the App

### Change Welcome Message
Edit `src/services/BootService.js` line ~15:
```javascript
const DEFAULT_MESSAGE = 'Your new message here';
```

### Change Speech Settings
Edit `src/services/BootService.js` in `speakWelcomeMessage()`:
```javascript
await Speech.speak(message, {
  language: 'en',      // Change language
  pitch: 1.0,          // 0.5-2.0
  rate: 0.9,           // 0.5-1.5
});
```

### Change Color Scheme
Edit color values in component StyleSheets:
- `#000000` - Black background
- `#4A90E2` - Primary blue
- `#50C878` - Success green
- `#E74C3C` - Error red

### Add New Features

1. Create new component in `src/screens/` or `src/components/`
2. Import in `App.js`
3. Add conditional rendering based on app state
4. Test thoroughly

## Building for Production

### Web Build
```bash
expo export --platform web
# Output in dist/ folder
```

### Android APK
```bash
eas build --platform android --profile preview
# or
eas build --platform android --profile production
```

### iOS
```bash
eas build --platform ios
```

## Future: Android Car Stereo Integration

### Files to Create
1. `android/app/src/main/java/com/carpilot/BootReceiver.java`
   - Listen for BOOT_COMPLETED broadcast
   - Trigger BootService

2. `android/app/src/main/java/com/carpilot/BootModule.java`
   - React Native native module
   - Bridge to BootReceiver

3. Update `android/app/src/main/AndroidManifest.xml`
   - Register BootReceiver
   - Add permissions

4. Update `src/services/BootService.js`
   - Implement `handleBootComplete()`
   - Add native module integration

### Integration Steps
1. Run `expo prebuild --clean` to generate native folders
2. Add BootReceiver and BootModule
3. Register in AndroidManifest
4. Test on physical Android device
5. Build production APK

## Debugging Tips

### TTS Not Working
```javascript
// Add logging in BootService
console.log('Attempting to speak:', message);
Speech.speak(message, {
  onDone: () => console.log('Speech done'),
  onError: (error) => console.error('Speech error:', error),
});
```

### AsyncStorage Issues
```javascript
// Check what's stored
import AsyncStorage from '@react-native-async-storage/async-storage';
const value = await AsyncStorage.getItem('carpilot_welcome_message');
console.log('Stored value:', value);
```

### UI Not Updating
- Check useState dependencies
- Verify useEffect cleanup
- Use React DevTools to inspect component tree

### Memory Leaks
- Cancel TTS on component unmount
- Clear AsyncStorage listeners
- Remove event listeners in useEffect cleanup

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [expo-speech](https://docs.expo.dev/versions/latest/sdk/speech/)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)

## Support

For development issues:
1. Check console logs
2. Review error messages
3. Check GitHub issues
4. Open new issue with reproduction steps

---

Happy coding! 🚗💻
