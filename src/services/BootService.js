/**
 * BootService
 * 
 * This module handles the boot-related operations for Car Pilot Welcome.
 * 
 * FUTURE INTEGRATION (Android Car Stereo):
 * - This service will be extended to support Android BOOT_COMPLETED receiver
 * - When the car stereo powers on, a native Android broadcast receiver will trigger
 * - The receiver will call native code that invokes this service
 * - Location: android/app/src/main/AndroidManifest.xml will register the receiver
 * - Location: android/app/src/main/java/com/carpilot/BootReceiver.java (to be created)
 * 
 * CURRENT BEHAVIOR (Mobile Testing):
 * - Speaks the welcome message automatically when the app starts
 * - Loads saved message from AsyncStorage
 * - Falls back to default message if none exists
 */

import * as Speech from 'expo-speech';

// Default welcome message - used as fallback
const DEFAULT_MESSAGE = 'Welcome Captain. All systems are operational. Have a safe journey.';

/**
 * Get the default welcome message
 * @returns {string} Default message
 */
export const getDefaultMessage = () => DEFAULT_MESSAGE;

/**
 * Speak the welcome message using Text-to-Speech
 * @param {string} message - Message to speak
 * @returns {Promise<void>}
 */
export const speakWelcomeMessage = async (message) => {
  try {
    // Stop any ongoing speech first
    await Speech.stop();

    // Configure and speak the message
    await Speech.speak(message, {
      language: 'en',
      pitch: 1.0,
      rate: 0.9, // Slightly slower for clarity
      onDone: () => {
        console.log('Welcome message spoken');
      },
      onError: (error) => {
        console.error('Speech error:', error);
      },
    });
  } catch (error) {
    console.error('Error in speakWelcomeMessage:', error);
  }
};

/**
 * Stop current speech playback
 * @returns {Promise<void>}
 */
export const stopSpeech = async () => {
  try {
    await Speech.stop();
  } catch (error) {
    console.error('Error stopping speech:', error);
  }
};

/**
 * FUTURE: Handle boot event from Android BOOT_COMPLETED
 * This will be called when the car stereo powers on
 * 
 * Implementation will involve:
 * 1. Native Android module that listens to BOOT_COMPLETED
 * 2. Bridge to React Native via react-native modules
 * 3. Call this function from native code
 * 
 * @param {string} message - Message to speak on boot
 * @returns {Promise<void>}
 */
export const handleBootComplete = async (message) => {
  // TODO: This will be fully integrated in the native Android layer
  console.log('Boot complete event received');
  await speakWelcomeMessage(message);
};

/**
 * Export all functions as BootService object
 */
const BootService = {
  getDefaultMessage,
  speakWelcomeMessage,
  stopSpeech,
  handleBootComplete,
};

export default BootService;
