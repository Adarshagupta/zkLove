/**
 * RegistrationScreen - User registration with zero-knowledge proof generation
 * 
 * This screen handles:
 * - Selfie capture for biometric commitment
 * - Wallet connection
 * - Registration proof generation via Mopro
 * - On-chain registration
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import components
import SelfieCapture from '../components/SelfieCapture';
import WalletConnect from '../components/WalletConnect';

// Import Mopro integration
import { generateRegistrationProof } from '../mopro/registrationProof';

const RegistrationScreen = ({ navigation }) => {
  const [selfieData, setSelfieData] = useState(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [registrationInProgress, setRegistrationInProgress] = useState(false);

  // TODO: Implement selfie capture handler
  const handleSelfieCapture = (imageData) => {
    console.log('Selfie captured:', imageData);
    setSelfieData(imageData);
    // TODO: Process selfie for biometric features
    // TODO: Generate biometric commitment hash
  };

  // TODO: Implement wallet connection handler
  const handleWalletConnect = (walletAddress) => {
    console.log('Wallet connected:', walletAddress);
    setWalletConnected(true);
    // TODO: Store wallet address in state
  };

  // TODO: Implement registration process
  const handleRegistration = async () => {
    if (!selfieData || !walletConnected) {
      Alert.alert('Error', 'Please capture selfie and connect wallet first');
      return;
    }

    setRegistrationInProgress(true);

    try {
      // TODO: Generate registration proof using Mopro
      const proof = await generateRegistrationProof(selfieData);
      
      // TODO: Submit proof to smart contract
      // TODO: Store commitment hash on-chain
      
      Alert.alert('Success', 'Registration completed!');
      navigation.navigate('Profile');
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', 'Registration failed. Please try again.');
    } finally {
      setRegistrationInProgress(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Welcome to zkLove</Text>
        <Text style={styles.subtitle}>
          Privacy-first dating with zero-knowledge proofs
        </Text>

        {/* Selfie Capture Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Step 1: Capture Your Selfie</Text>
          <Text style={styles.description}>
            Your selfie will be used to generate a private biometric commitment
          </Text>
          <SelfieCapture onCapture={handleSelfieCapture} />
          {selfieData && (
            <Text style={styles.success}>✓ Selfie captured successfully</Text>
          )}
        </View>

        {/* Wallet Connection Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Step 2: Connect Your Wallet</Text>
          <Text style={styles.description}>
            Connect your wallet to interact with the zkLove smart contract
          </Text>
          <WalletConnect onConnect={handleWalletConnect} />
          {walletConnected && (
            <Text style={styles.success}>✓ Wallet connected successfully</Text>
          )}
        </View>

        {/* Registration Button */}
        <TouchableOpacity
          style={[
            styles.registerButton,
            (!selfieData || !walletConnected) && styles.disabledButton
          ]}
          onPress={handleRegistration}
          disabled={!selfieData || !walletConnected || registrationInProgress}
        >
          <Text style={styles.registerButtonText}>
            {registrationInProgress ? 'Registering...' : 'Complete Registration'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.privacyNote}>
          🔒 Your biometric data never leaves your device. Only zero-knowledge proofs are shared.
        </Text>
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
    marginBottom: 30,
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
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#6C757D',
    marginBottom: 15,
  },
  success: {
    color: '#28A745',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 10,
  },
  registerButton: {
    backgroundColor: '#FF6B9D',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: '#CED4DA',
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  privacyNote: {
    fontSize: 12,
    color: '#6C757D',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default RegistrationScreen;
