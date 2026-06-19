import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  Alert,
  Share,
} from 'react-native';
import { BootService } from '../services/BootService';

export const WelcomeDashboard = ({ savedMessage, onReset }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = async () => {
    setIsSpeaking(true);
    try {
      await BootService.speakWelcomeMessage(savedMessage);
    } catch (error) {
      Alert.alert('Error', 'Failed to speak message');
      console.error('Error speaking message:', error);
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
      'Reset Setup?',
      'Are you sure you want to clear your saved message and reconfigure?',
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'Reset',
          onPress: () => {
            onReset();
          },
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
        <Text style={styles.title}>Car Pilot Welcome</Text>
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
        <Text style={styles.sectionTitle}>Current Welcome Message</Text>
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
          Every time the app opens, your welcome message will be automatically spoken using text-to-speech technology.
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
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    backgroundColor: '#000000',
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
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
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
  footerText: {
    fontSize: 12,
    color: '#666666',
  },
});
