/**
 * MatchScreen - Privacy-preserving matching with zero-knowledge proofs
 * 
 * This screen handles:
 * - Anonymous matching based on encrypted preferences
 * - ZK proof generation for compatibility checks
 * - Match discovery without revealing identities
 * - Aura-based matching algorithms
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import Mopro integration
import { generateMatchProof, verifyMatchCompatibility } from '../mopro/matchProof';

const MatchScreen = ({ navigation }) => {
  const [isSearching, setIsSearching] = useState(false);
  const [potentialMatches, setPotentialMatches] = useState([]);
  const [matchPreferences, setMatchPreferences] = useState({
    ageRange: [18, 35],
    interests: [],
    auraThreshold: 50,
  });

  // TODO: Load user preferences and start matching
  useEffect(() => {
    loadMatchPreferences();
  }, []);

  // TODO: Implement preference loading
  const loadMatchPreferences = async () => {
    try {
      // TODO: Load encrypted preferences from local storage
      // TODO: Decrypt preferences using user's private key
      console.log('Loading match preferences...');
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  // TODO: Implement privacy-preserving matching
  const startMatching = async () => {
    setIsSearching(true);
    setPotentialMatches([]);

    try {
      // TODO: Generate ZK proof for matching preferences
      const matchProof = await generateMatchProof(matchPreferences);
      
      // TODO: Submit proof to smart contract for matching
      // TODO: Query blockchain for compatible users
      // TODO: Use Aura points for enhanced matching

      // Simulate finding matches (replace with actual implementation)
      setTimeout(() => {
        const mockMatches = [
          {
            id: '1',
            auraScore: 85,
            compatibilityScore: 92,
            commonInterests: 3,
            isVerified: true,
          },
          {
            id: '2', 
            auraScore: 72,
            compatibilityScore: 88,
            commonInterests: 2,
            isVerified: true,
          },
          {
            id: '3',
            auraScore: 91,
            compatibilityScore: 76,
            commonInterests: 4,
            isVerified: false,
          },
        ];

        setPotentialMatches(mockMatches);
        setIsSearching(false);
      }, 3000);

    } catch (error) {
      console.error('Matching error:', error);
      Alert.alert('Error', 'Failed to find matches. Please try again.');
      setIsSearching(false);
    }
  };

  // TODO: Implement match selection and proof verification
  const selectMatch = async (matchId) => {
    try {
      // TODO: Generate proof for match selection
      // TODO: Verify compatibility with selected match
      const isCompatible = await verifyMatchCompatibility(matchId);
      
      if (isCompatible) {
        Alert.alert(
          'Match Found! 💕',
          'You have a compatible match! Would you like to proceed to reveal?',
          [
            { text: 'Not Now', style: 'cancel' },
            { 
              text: 'Proceed', 
              onPress: () => navigation.navigate('Reveal', { matchId })
            },
          ]
        );
      } else {
        Alert.alert('No Match', 'Compatibility verification failed.');
      }
    } catch (error) {
      console.error('Match selection error:', error);
      Alert.alert('Error', 'Failed to verify match compatibility.');
    }
  };

  const renderMatchCard = (match) => (
    <View key={match.id} style={styles.matchCard}>
      <View style={styles.matchHeader}>
        <Text style={styles.matchTitle}>Anonymous Match #{match.id}</Text>
        {match.isVerified && <Text style={styles.verifiedBadge}>✓ Verified</Text>}
      </View>
      
      <View style={styles.matchStats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{match.auraScore}</Text>
          <Text style={styles.statLabel}>Aura Score</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{match.compatibilityScore}%</Text>
          <Text style={styles.statLabel}>Compatibility</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{match.commonInterests}</Text>
          <Text style={styles.statLabel}>Common Interests</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.selectButton}
        onPress={() => selectMatch(match.id)}
      >
        <Text style={styles.selectButtonText}>Select Match</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        
        <Text style={styles.title}>Find Your Match</Text>
        <Text style={styles.subtitle}>
          Anonymous matching powered by zero-knowledge proofs
        </Text>

        {/* Matching Controls */}
        <View style={styles.controlsSection}>
          <TouchableOpacity
            style={[styles.searchButton, isSearching && styles.searchingButton]}
            onPress={startMatching}
            disabled={isSearching}
          >
            {isSearching ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.searchButtonText}>🔍 Start Matching</Text>
            )}
          </TouchableOpacity>

          {/* TODO: Add preference controls */}
          <TouchableOpacity style={styles.preferencesButton}>
            <Text style={styles.preferencesButtonText}>⚙️ Edit Preferences</Text>
          </TouchableOpacity>
        </View>

        {/* Matching Status */}
        {isSearching && (
          <View style={styles.searchingContainer}>
            <Text style={styles.searchingText}>
              🔐 Generating zero-knowledge proofs for anonymous matching...
            </Text>
            <Text style={styles.searchingSubtext}>
              This may take a few moments while we preserve your privacy
            </Text>
          </View>
        )}

        {/* Match Results */}
        {potentialMatches.length > 0 && (
          <View style={styles.resultsSection}>
            <Text style={styles.resultsTitle}>
              Found {potentialMatches.length} Compatible Matches
            </Text>
            {potentialMatches.map(renderMatchCard)}
          </View>
        )}

        {/* No Matches State */}
        {!isSearching && potentialMatches.length === 0 && (
          <View style={styles.noMatchesContainer}>
            <Text style={styles.noMatchesText}>💫</Text>
            <Text style={styles.noMatchesTitle}>No matches yet</Text>
            <Text style={styles.noMatchesSubtext}>
              Try adjusting your preferences or increase your Aura score
            </Text>
          </View>
        )}

        {/* Privacy Notice */}
        <View style={styles.privacyNotice}>
          <Text style={styles.privacyText}>
            🔒 Your identity remains completely anonymous until you choose to reveal.
            All matching uses zero-knowledge proofs to protect your privacy.
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
  controlsSection: {
    marginBottom: 30,
  },
  searchButton: {
    backgroundColor: '#FF6B9D',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  searchingButton: {
    backgroundColor: '#CED4DA',
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  preferencesButton: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF6B9D',
  },
  preferencesButtonText: {
    color: '#FF6B9D',
    fontSize: 16,
    fontWeight: '600',
  },
  searchingContainer: {
    backgroundColor: '#FFF3CD',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },
  searchingText: {
    fontSize: 16,
    color: '#856404',
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 8,
  },
  searchingSubtext: {
    fontSize: 14,
    color: '#856404',
    textAlign: 'center',
  },
  resultsSection: {
    marginBottom: 20,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 15,
  },
  matchCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  matchTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
  },
  verifiedBadge: {
    fontSize: 12,
    color: '#28A745',
    fontWeight: '500',
  },
  matchStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B9D',
  },
  statLabel: {
    fontSize: 12,
    color: '#6C757D',
    marginTop: 4,
  },
  selectButton: {
    backgroundColor: '#28A745',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  noMatchesContainer: {
    alignItems: 'center',
    padding: 40,
  },
  noMatchesText: {
    fontSize: 48,
    marginBottom: 15,
  },
  noMatchesTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 8,
  },
  noMatchesSubtext: {
    fontSize: 14,
    color: '#6C757D',
    textAlign: 'center',
  },
  privacyNotice: {
    backgroundColor: '#E3F2FD',
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  privacyText: {
    fontSize: 12,
    color: '#1565C0',
    lineHeight: 18,
  },
});

export default MatchScreen;
