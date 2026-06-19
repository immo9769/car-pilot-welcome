// Car Pilot Welcome - Expo Snack Version
// Online Demo: exp://exp.host/@immo.king/welcomestreo
// 
// Features:
// - Auto-speak welcome message on app open
// - First-time setup for custom messages
// - AsyncStorage for persistence
// - Dark theme UI
// - TTS functionality

import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Share,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';

const STORAGE_KEY = 'carpilot_welcome_message';
const DEFAULT_MESSAGE = 'Welcome Captain. All systems are operational. Have a safe journey.';

// ============================================
// BOOT SERVICE - Text-to-Speech & Logic
// ============================================
const BootService = {
  getDefaultMessage: () => DEFAULT_MESSAGE,
  
  speakWelcomeMessage: async (message) => {
    try {
      await Speech.stop();
      await Speech.speak(message, {
        language: 'en',
        pitch: 1.0,
        rate: 0.9,
        onDone: () => console.log('✅ Welcome message spoken'),
        onError: (error) => console.error('❌ Speech error:', error),
      });
    } catch (error) {
      console.error('Error in speakWelcomeMessage:', error);
    }
  },
  
  stopSpeech: async () => {
    try {
      await Speech.stop();
    } catch (error) {
      console.error('Error stopping speech:', error);
    }
  },
};

// ============================================
// WELCOME SETUP SCREEN
// ============================================
function WelcomeSetup({ onSave }) {
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!message.trim()) {
      Alert.alert('Empty Message', 'Please enter a welcome message or use the default.');
      return;
    }
    setIsSaving(true);
    try {
      await onSave(message.trim());
      setMessage('');
    } catch (error) {
      Alert.alert('Error', 'Failed to save message. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUseDefault = async () => {
    setIsSaving(true);
    try {
      await onSave(DEFAULT_MESSAGE);
      setMessage('');
    } catch (error) {
      Alert.alert('Error', 'Failed to save default message.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🚗 Car Pilot Welcome</Text>
          <Text style={styles.subtitle}>First Time Setup</Text>
        </View>

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionText}>
            Welcome! Let's set up your custom welcome message. This message will be automatically spoken every time the app starts.
          </Text>
        </View>

        {/* Input Section */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>Enter Your Welcome Message</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Type your custom welcome message here..."
            placeholderTextColor="#666666"
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={4}
            maxLength={500}
            editable={!isSaving}
          />
          <Text style={styles.charCount}>{message.length}/500</Text>
        </View>

        {/* Default Message */}
        <View style={styles.defaultMessageSection}>
          <Text style={styles.defaultLabel}>Default Message:</Text>
          <View style={styles.defaultMessageBox}>
            <Text style={styles.defaultMessageText}>"{DEFAULT_MESSAGE}"</Text>
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.saveButton, isSaving && styles.buttonDisabled]}
            onPress={handleSave}
            disabled={isSaving || !message.trim()}
          >
            <Text style={styles.buttonText}>💾 Save Custom Message</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.defaultButton, isSaving && styles.buttonDisabled]}
            onPress={handleUseDefault}
            disabled={isSaving}
          >
            <Text style={styles.buttonText}>✅ Use Default Message</Text>
          </TouchableOpacity>
        </View>

        {/* Footer Info */}
        <View style={styles.footerInfo}>
          <Text style={styles.footerText}>
            💡 Tip: Keep your message concise and clear for better audio playback.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ============================================
// WELCOME DASHBOARD SCREEN
// ============================================
function WelcomeDashboard({ savedMessage, onReset }) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = async () => {
    setIsSpeaking(true);
    try {
      await BootService.speakWelcomeMessage(savedMessage);
    } catch (error) {
      Alert.alert('Error', 'Failed to speak message');
    } finally {
      setIsSpeaking(false);
    }
  };

  const handleStop = async () => {
    try {
      await BootService.stopSpeech();
      setIsSpeaking(false);
    } catch (error) {
      console.error('Error stopping speech:', error);
    }
  };

  const handleReset = () => {
    Alert.alert(
      '🔄 Reset Setup?',
      'Are you sure you want to clear your saved message and reconfigure?',
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'Reset',
          onPress: () => onReset(),
          style: 'destructive',
        },
      ]
    );
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Car Pilot Welcome Message:\n\n"${savedMessage}"`,
        title: 'My Car Pilot Welcome Message',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🚗 Car Pilot Welcome</Text>
        <Text style={styles.subtitle}>Dashboard</Text>
      </View>

      {/* Status Card */}
      <View style={styles.statusCard}>
        <View style={styles.statusIndicator}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>Ready</Text>
        </View>
        <Text style={styles.statusDescription}>Your welcome message is set and ready to speak</Text>
      </View>

      {/* Current Message Section */}
      <View style={styles.messageSection}>
        <Text style={styles.sectionTitle}>📢 Current Welcome Message</Text>
        <View style={styles.messageBox}>
          <Text style={styles.messageText}>{savedMessage}</Text>
        </View>
        <Text style={styles.messageInfo}>
          This message is automatically spoken when the app starts.
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.primaryButton, isSpeaking && styles.buttonActive]}
          onPress={isSpeaking ? handleStop : handleSpeak}
        >
          <Text style={styles.buttonText}>
            {isSpeaking ? '🔊 Stop' : '🔉 Test Speak'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleShare}
        >
          <Text style={styles.buttonText}>📤 Share</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dangerButton}
          onPress={handleReset}
        >
          <Text style={styles.buttonText}>🔄 Reset Setup</Text>
        </TouchableOpacity>
      </View>

      {/* Info Section */}
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>ℹ️ About Auto-Speak</Text>
        <Text style={styles.infoText}>
          Every time the app opens, your welcome message will be automatically spoken.
        </Text>
        <Text style={styles.infoText}>
          In the future, this feature will support automatic triggering when your car stereo boots up.
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Car Pilot Welcome • v1.0.0</Text>
      </View>
    </ScrollView>
  );
}

// ============================================
// MAIN APP COMPONENT
// ============================================
export default function App() {
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [savedMessage, setSavedMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize app on startup
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Load saved message from storage
        const message = await AsyncStorage.getItem(STORAGE_KEY);
        setSavedMessage(message);

        if (message) {
          setIsSetupComplete(true);
          // Auto-speak saved message
          await BootService.speakWelcomeMessage(message);
        } else {
          setIsSetupComplete(false);
          // First time - speak default message
          await BootService.speakWelcomeMessage(DEFAULT_MESSAGE);
        }
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  const handleSaveMessage = async (message) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, message);
      setSavedMessage(message);
      setIsSetupComplete(true);
      // Speak newly saved message
      await BootService.speakWelcomeMessage(message);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  const handleResetSetup = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setSavedMessage(null);
      setIsSetupComplete(false);
    } catch (error) {
      console.error('Error resetting setup:', error);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={{ marginTop: 16, color: '#FFFFFF', fontSize: 16 }}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {isSetupComplete ? (
        <WelcomeDashboard
          savedMessage={savedMessage}
          onReset={handleResetSetup}
        />
      ) : (
        <WelcomeSetup onSave={handleSaveMessage} />
      )}
    </SafeAreaView>
  );
}

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: '600',
  },
  instructionsContainer: {
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    padding: 16,
    marginBottom: 30,
    borderLeftWidth: 4,
    borderLeftColor: '#4A90E2',
  },
  instructionText: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 22,
  },
  inputSection: {
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: '#1A1A1A',
    borderWidth: 1.5,
    borderColor: '#4A90E2',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 14,
    textAlignVertical: 'top',
    minHeight: 100,
  },
  charCount: {
    fontSize: 12,
    color: '#888888',
    marginTop: 8,
    textAlign: 'right',
  },
  defaultMessageSection: {
    marginBottom: 30,
  },
  defaultLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  defaultMessageBox: {
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    padding: 14,
    borderLeftWidth: 3,
    borderLeftColor: '#50C878',
  },
  defaultMessageText: {
    fontSize: 13,
    color: '#AAAAAA',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    backgroundColor: '#4A90E2',
  },
  defaultButton: {
    backgroundColor: '#50C878',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  footerInfo: {
    marginTop: 30,
    padding: 12,
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
  },
  footerText: {
    fontSize: 12,
    color: '#999999',
    lineHeight: 18,
  },
  statusCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 30,
    borderLeftWidth: 4,
    borderLeftColor: '#50C878',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#50C878',
    marginRight: 10,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#50C878',
  },
  statusDescription: {
    fontSize: 13,
    color: '#AAAAAA',
    lineHeight: 20,
  },
  messageSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  messageBox: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#4A90E2',
    marginBottom: 12,
  },
  messageText: {
    fontSize: 15,
    color: '#FFFFFF',
    lineHeight: 24,
  },
  messageInfo: {
    fontSize: 12,
    color: '#888888',
    fontStyle: 'italic',
  },
  actionButtons: {
    gap: 12,
    marginBottom: 30,
  },
  primaryButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonActive: {
    backgroundColor: '#FF6B6B',
  },
  secondaryButton: {
    backgroundColor: '#666666',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dangerButton: {
    backgroundColor: '#E74C3C',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoSection: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 30,
    borderLeftWidth: 3,
    borderLeftColor: '#FFB700',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFB700',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 13,
    color: '#AAAAAA',
    lineHeight: 20,
    marginBottom: 8,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
});
