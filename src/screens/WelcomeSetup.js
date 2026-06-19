import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { BootService } from '../services/BootService';

export const WelcomeSetup = ({ onSave }) => {
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const defaultMessage = BootService.getDefaultMessage();

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
      console.error('Error saving message:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUseDefault = async () => {
    setIsSaving(true);
    try {
      await onSave(defaultMessage);
      setMessage('');
    } catch (error) {
      Alert.alert('Error', 'Failed to save default message. Please try again.');
      console.error('Error saving default message:', error);
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
          <Text style={styles.title}>Car Pilot Welcome</Text>
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

        {/* Default Message Section */}
        <View style={styles.defaultMessageSection}>
          <Text style={styles.defaultLabel}>Default Message (if you skip):</Text>
          <View style={styles.defaultMessageBox}>
            <Text style={styles.defaultMessageText}>{defaultMessage}</Text>
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.saveButton, isSaving && styles.buttonDisabled]}
            onPress={handleSave}
            disabled={isSaving || !message.trim()}
          >
            <Text style={styles.buttonText}>Save Custom Message</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.defaultButton, isSaving && styles.buttonDisabled]}
            onPress={handleUseDefault}
            disabled={isSaving}
          >
            <Text style={styles.buttonText}>Use Default Message</Text>
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
};

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
});
