/**
 * ProfileScreen - User profile management with privacy controls
 * 
 * This screen handles:
 * - Profile information display
 * - Privacy settings for selective disclosure
 * - Aura points display
 * - Navigation to other features
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProfileScreen = ({ navigation }) => {
  const [profile, setProfile] = useState({
    auraPoints: 0,
    matchesFound: 0,
    identityReveals: 0,
  });

  const [privacySettings, setPrivacySettings] = useState({
    allowMatching: true,
    showAuraPublicly: false,
    allowIdentityReveal: true,
  });

  // TODO: Load user profile data from blockchain
  useEffect(() => {
    loadProfileData();
  }, []);

  // TODO: Implement profile data loading
  const loadProfileData = async () => {
    try {
      // TODO: Fetch user's on-chain data
      // TODO: Get current Aura points
      // TODO: Get match statistics
      console.log('Loading profile data...');
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  // TODO: Implement privacy settings update
  const updatePrivacySetting = async (setting, value) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: value,
    }));

    try {
      // TODO: Update privacy settings on-chain
      // TODO: Generate proof for privacy preference updates
      console.log(`Updated ${setting} to ${value}`);
    } catch (error) {
      console.error('Error updating privacy setting:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
          <Text style={styles.welcomeText}>Welcome to zkLove!</Text>
          <Text style={styles.addressText}>
            {/* TODO: Display connected wallet address */}
            0x1234...5678
          </Text>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{profile.auraPoints}</Text>
            <Text style={styles.statLabel}>Aura Points</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{profile.matchesFound}</Text>
            <Text style={styles.statLabel}>Matches Found</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{profile.identityReveals}</Text>
            <Text style={styles.statLabel}>Reveals</Text>
          </View>
        </View>

        {/* Privacy Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy Settings</Text>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Allow Matching</Text>
            <Switch
              value={privacySettings.allowMatching}
              onValueChange={(value) => updatePrivacySetting('allowMatching', value)}
              trackColor={{ false: '#CED4DA', true: '#FF6B9D' }}
            />
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Show Aura Publicly</Text>
            <Switch
              value={privacySettings.showAuraPublicly}
              onValueChange={(value) => updatePrivacySetting('showAuraPublicly', value)}
              trackColor={{ false: '#CED4DA', true: '#FF6B9D' }}
            />
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Allow Identity Reveal</Text>
            <Switch
              value={privacySettings.allowIdentityReveal}
              onValueChange={(value) => updatePrivacySetting('allowIdentityReveal', value)}
              trackColor={{ false: '#CED4DA', true: '#FF6B9D' }}
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Match')}
          >
            <Text style={styles.actionButtonText}>🔍 Find Matches</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Aura')}
          >
            <Text style={styles.actionButtonText}>✨ View Aura</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Reveal')}
          >
            <Text style={styles.actionButtonText}>🎭 Reveal Identity</Text>
          </TouchableOpacity>
        </View>

        {/* Privacy Notice */}
        <View style={styles.privacyNotice}>
          <Text style={styles.privacyText}>
            🔐 All interactions use zero-knowledge proofs to protect your privacy.
            Your personal data never leaves your device.
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF6B9D',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 32,
    color: '#FFFFFF',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 5,
  },
  addressText: {
    fontSize: 14,
    color: '#6C757D',
    fontFamily: 'monospace',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B9D',
  },
  statLabel: {
    fontSize: 12,
    color: '#6C757D',
    marginTop: 5,
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F4',
  },
  settingLabel: {
    fontSize: 16,
    color: '#212529',
  },
  actionsContainer: {
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: '#FF6B9D',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  privacyNotice: {
    backgroundColor: '#E8F5E8',
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#28A745',
  },
  privacyText: {
    fontSize: 12,
    color: '#155724',
    lineHeight: 18,
  },
});

export default ProfileScreen;
