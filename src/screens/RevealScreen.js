/**
 * RevealScreen - Selective identity disclosure with zero-knowledge proofs
 * 
 * This screen handles:
 * - Mutual consent for identity reveal
 * - ZK proof generation for reveal authorization
 * - Gradual disclosure of personal information
 * - Aura point rewards for successful reveals
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import Mopro integration
import { generateUnlockProof, verifyMutualConsent } from '../mopro/unlockProof';

const RevealScreen = ({ navigation, route }) => {
  const { matchId } = route.params || {};
  
  const [revealSettings, setRevealSettings] = useState({
    revealName: false,
    revealPhoto: false,
    revealContact: false,
    revealSocial: false,
  });

  const [matchRevealSettings, setMatchRevealSettings] = useState(null);
  const [isProcessingReveal, setIsProcessingReveal] = useState(false);
  const [mutualConsentAchieved, setMutualConsentAchieved] = useState(false);

  // TODO: Load match information and reveal status
  useEffect(() => {
    if (matchId) {
      loadMatchRevealStatus();
    }
  }, [matchId]);

  // TODO: Implement reveal status loading
  const loadMatchRevealStatus = async () => {
    try {
      // TODO: Query smart contract for match reveal preferences
      // TODO: Check if mutual consent has been achieved
      // TODO: Load current reveal state from blockchain
      console.log('Loading reveal status for match:', matchId);
      
      // Mock data - replace with actual implementation
      setMatchRevealSettings({
        revealName: true,
        revealPhoto: false,
        revealContact: true,
        revealSocial: false,
      });
    } catch (error) {
      console.error('Error loading reveal status:', error);
    }
  };

  // TODO: Implement reveal setting updates
  const updateRevealSetting = (setting, value) => {
    setRevealSettings(prev => ({
      ...prev,
      [setting]: value,
    }));
  };

  // TODO: Implement mutual consent checking
  const checkMutualConsent = async () => {
    if (!matchRevealSettings) return false;

    // Check if both parties agree to reveal at least one piece of information
    const userWantsReveal = Object.values(revealSettings).some(Boolean);
    const matchWantsReveal = Object.values(matchRevealSettings).some(Boolean);
    
    return userWantsReveal && matchWantsReveal;
  };

  // TODO: Implement reveal process
  const initiateReveal = async () => {
    if (!matchId) {
      Alert.alert('Error', 'No match selected for reveal');
      return;
    }

    const hasConsent = await checkMutualConsent();
    if (!hasConsent) {
      Alert.alert(
        'Consent Required',
        'Both parties must agree to reveal at least one piece of information'
      );
      return;
    }

    setIsProcessingReveal(true);

    try {
      // TODO: Generate ZK proof for reveal authorization
      const unlockProof = await generateUnlockProof(revealSettings, matchId);
      
      // TODO: Verify mutual consent on-chain
      const consentVerified = await verifyMutualConsent(matchId, unlockProof);
      
      if (consentVerified) {
        // TODO: Execute selective disclosure
        // TODO: Award Aura points for successful reveal
        // TODO: Update on-chain reveal state
        
        setMutualConsentAchieved(true);
        
        Alert.alert(
          'Reveal Successful! 🎉',
          'Identity information has been exchanged. You both earned Aura points!',
          [
            { text: 'View Profile', onPress: () => navigation.navigate('Profile') },
            { text: 'Continue Matching', onPress: () => navigation.navigate('Match') },
          ]
        );
      } else {
        Alert.alert('Error', 'Mutual consent verification failed');
      }
    } catch (error) {
      console.error('Reveal error:', error);
      Alert.alert('Error', 'Failed to process reveal. Please try again.');
    } finally {
      setIsProcessingReveal(false);
    }
  };

  const renderRevealOption = (key, label, description) => (
    <View key={key} style={styles.revealOption}>
      <View style={styles.revealOptionContent}>
        <Text style={styles.revealOptionLabel}>{label}</Text>
        <Text style={styles.revealOptionDescription}>{description}</Text>
      </View>
      <Switch
        value={revealSettings[key]}
        onValueChange={(value) => updateRevealSetting(key, value)}
        trackColor={{ false: '#CED4DA', true: '#FF6B9D' }}
      />
    </View>
  );

  const renderMatchRevealStatus = (key, label) => {
    if (!matchRevealSettings) return null;
    
    return (
      <View key={key} style={styles.matchRevealItem}>
        <Text style={styles.matchRevealLabel}>{label}</Text>
        <Text style={[
          styles.matchRevealStatus,
          matchRevealSettings[key] ? styles.revealYes : styles.revealNo
        ]}>
          {matchRevealSettings[key] ? '✓ Yes' : '✗ No'}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        
        <Text style={styles.title}>Identity Reveal</Text>
        <Text style={styles.subtitle}>
          Choose what to share with your match
        </Text>

        {matchId && (
          <View style={styles.matchInfo}>
            <Text style={styles.matchInfoText}>
              Match ID: #{matchId}
            </Text>
          </View>
        )}

        {/* Your Reveal Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What would you like to reveal?</Text>
          
          {renderRevealOption(
            'revealName',
            'Real Name',
            'Share your first name with your match'
          )}
          
          {renderRevealOption(
            'revealPhoto',
            'Profile Photo',
            'Share your actual photo (not just biometric proof)'
          )}
          
          {renderRevealOption(
            'revealContact',
            'Contact Information',
            'Share phone number or email for direct communication'
          )}
          
          {renderRevealOption(
            'revealSocial',
            'Social Media',
            'Share your social media handles'
          )}
        </View>

        {/* Match's Reveal Preferences */}
        {matchRevealSettings && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your match is willing to reveal:</Text>
            
            {renderMatchRevealStatus('revealName', 'Real Name')}
            {renderMatchRevealStatus('revealPhoto', 'Profile Photo')}
            {renderMatchRevealStatus('revealContact', 'Contact Information')}
            {renderMatchRevealStatus('revealSocial', 'Social Media')}
          </View>
        )}

        {/* Consent Status */}
        <View style={[
          styles.consentStatus,
          mutualConsentAchieved ? styles.consentAchieved : styles.consentPending
        ]}>
          <Text style={styles.consentStatusText}>
            {mutualConsentAchieved 
              ? '✅ Mutual consent achieved - Information revealed!'
              : '⏳ Waiting for mutual consent...'
            }
          </Text>
        </View>

        {/* Reveal Button */}
        <TouchableOpacity
          style={[
            styles.revealButton,
            isProcessingReveal && styles.processingButton
          ]}
          onPress={initiateReveal}
          disabled={isProcessingReveal || mutualConsentAchieved}
        >
          <Text style={styles.revealButtonText}>
            {isProcessingReveal 
              ? 'Processing Reveal...' 
              : mutualConsentAchieved 
                ? 'Already Revealed'
                : '🎭 Initiate Reveal'
            }
          </Text>
        </TouchableOpacity>

        {/* Privacy Notice */}
        <View style={styles.privacyNotice}>
          <Text style={styles.privacyText}>
            🔐 Reveals are processed using zero-knowledge proofs to ensure mutual consent.
            Both parties must agree before any information is shared.
            Successful reveals earn Aura points for both participants.
          </Text>
        </View>

        {/* Navigation */}
        <View style={styles.navigationButtons}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.navigate('Match')}
          >
            <Text style={styles.navButtonText}>← Back to Matching</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.navButtonText}>Profile →</Text>
          </TouchableOpacity>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF6B9D',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
    marginBottom: 20,
  },
  matchInfo: {
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  matchInfoText: {
    fontSize: 14,
    color: '#1565C0',
    fontWeight: '500',
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
  revealOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F4',
  },
  revealOptionContent: {
    flex: 1,
    marginRight: 15,
  },
  revealOptionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#212529',
    marginBottom: 4,
  },
  revealOptionDescription: {
    fontSize: 12,
    color: '#6C757D',
  },
  matchRevealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F4',
  },
  matchRevealLabel: {
    fontSize: 16,
    color: '#212529',
  },
  matchRevealStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
  revealYes: {
    color: '#28A745',
  },
  revealNo: {
    color: '#DC3545',
  },
  consentStatus: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  consentPending: {
    backgroundColor: '#FFF3CD',
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },
  consentAchieved: {
    backgroundColor: '#D4EDDA',
    borderLeftWidth: 4,
    borderLeftColor: '#28A745',
  },
  consentStatusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  revealButton: {
    backgroundColor: '#FF6B9D',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  processingButton: {
    backgroundColor: '#CED4DA',
  },
  revealButtonText: {
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
    marginBottom: 20,
  },
  privacyText: {
    fontSize: 12,
    color: '#155724',
    lineHeight: 18,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navButton: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DEE2E6',
    flex: 0.48,
    alignItems: 'center',
  },
  navButtonText: {
    color: '#6C757D',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default RevealScreen;
