import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WelcomeSetup } from './src/screens/WelcomeSetup';
import { WelcomeDashboard } from './src/screens/WelcomeDashboard';
import { BootService } from './src/services/BootService';

const STORAGE_KEY = 'carpilot_welcome_message';

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
          // Trigger auto-speak via BootService
          await BootService.speakWelcomeMessage(message);
        } else {
          setIsSetupComplete(false);
          // First time setup - speak default message
          const defaultMessage = BootService.getDefaultMessage();
          await BootService.speakWelcomeMessage(defaultMessage);
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
      // Speak the newly saved message
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
