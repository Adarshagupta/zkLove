/**
 * AuraScreen - Aura points tracking and gamification
 * 
 * This screen handles:
 * - Aura points display and history
 * - Achievement tracking
 * - Reputation system visualization
 * - Social proof mechanisms
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const AuraScreen = ({ navigation }) => {
  const [auraData, setAuraData] = useState({
    totalPoints: 0,
    currentLevel: 1,
    pointsToNextLevel: 100,
    achievements: [],
    recentActivity: [],
  });

  const [auraHistory, setAuraHistory] = useState([]);

  // TODO: Load aura data from blockchain
  useEffect(() => {
    loadAuraData();
    loadAuraHistory();
  }, []);

  // TODO: Implement aura data loading
  const loadAuraData = async () => {
    try {
      // TODO: Query smart contract for user's Aura points
      // TODO: Calculate current level and progress
      // TODO: Load achievement data
      console.log('Loading aura data...');

      // Mock data - replace with actual implementation
      setAuraData({
        totalPoints: 1250,
        currentLevel: 3,
        pointsToNextLevel: 250,
        achievements: [
          { id: 'first_match', name: 'First Match', points: 100, unlocked: true },
          { id: 'first_reveal', name: 'First Reveal', points: 200, unlocked: true },
          { id: 'popular', name: 'Popular Profile', points: 300, unlocked: false },
          { id: 'trusted', name: 'Trusted Member', points: 500, unlocked: false },
        ],
        recentActivity: [
          { type: 'reveal', points: 150, date: '2024-01-15', description: 'Successful reveal with Match #42' },
          { type: 'match', points: 75, date: '2024-01-14', description: 'New match found' },
          { type: 'verification', points: 100, date: '2024-01-13', description: 'Profile verification bonus' },
        ],
      });
    } catch (error) {
      console.error('Error loading aura data:', error);
    }
  };

  // TODO: Implement aura history loading
  const loadAuraHistory = async () => {
    try {
      // TODO: Load historical aura point transactions
      // TODO: Format data for visualization
      console.log('Loading aura history...');

      // Mock data - replace with actual implementation
      setAuraHistory([
        { date: '2024-01-10', points: 950 },
        { date: '2024-01-11', points: 1000 },
        { date: '2024-01-12', points: 1050 },
        { date: '2024-01-13', points: 1150 },
        { date: '2024-01-14', points: 1225 },
        { date: '2024-01-15', points: 1250 },
      ]);
    } catch (error) {
      console.error('Error loading aura history:', error);
    }
  };

  // Calculate level progress
  const getLevelProgress = () => {
    const currentLevelBase = (auraData.currentLevel - 1) * 500;
    const progressInLevel = auraData.totalPoints - currentLevelBase;
    const levelSize = 500; // Points needed per level
    return (progressInLevel / levelSize) * 100;
  };

  // Get aura level title
  const getAuraTitle = (level) => {
    const titles = {
      1: '🌱 Newcomer',
      2: '🌸 Blooming',
      3: '✨ Radiant',
      4: '🌟 Luminous',
      5: '💫 Stellar',
      6: '🔥 Legendary',
    };
    return titles[level] || `🏆 Master (Level ${level})`;
  };

  const renderAchievement = (achievement) => (
    <View
      key={achievement.id}
      style={[
        styles.achievementCard,
        achievement.unlocked ? styles.achievementUnlocked : styles.achievementLocked
      ]}
    >
      <Text style={styles.achievementName}>{achievement.name}</Text>
      <Text style={styles.achievementPoints}>+{achievement.points} Aura</Text>
      <Text style={[
        styles.achievementStatus,
        achievement.unlocked ? styles.statusUnlocked : styles.statusLocked
      ]}>
        {achievement.unlocked ? '✓ Unlocked' : '🔒 Locked'}
      </Text>
    </View>
  );

  const renderActivityItem = (activity, index) => (
    <View key={index} style={styles.activityItem}>
      <View style={styles.activityIcon}>
        <Text style={styles.activityEmoji}>
          {activity.type === 'reveal' ? '🎭' : 
           activity.type === 'match' ? '💕' : 
           activity.type === 'verification' ? '✅' : '⭐'}
        </Text>
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityDescription}>{activity.description}</Text>
        <Text style={styles.activityDate}>{activity.date}</Text>
      </View>
      <View style={styles.activityPoints}>
        <Text style={styles.activityPointsText}>+{activity.points}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Aura Header */}
        <View style={styles.auraHeader}>
          <Text style={styles.title}>Your Aura</Text>
          <Text style={styles.subtitle}>
            Build your reputation through authentic connections
          </Text>
        </View>

        {/* Current Level Display */}
        <View style={styles.levelCard}>
          <Text style={styles.levelTitle}>{getAuraTitle(auraData.currentLevel)}</Text>
          <Text style={styles.totalPoints}>{auraData.totalPoints.toLocaleString()} Aura Points</Text>
          
          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { width: `${getLevelProgress()}%` }
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {auraData.pointsToNextLevel} points to Level {auraData.currentLevel + 1}
            </Text>
          </View>
        </View>

        {/* Achievements Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.achievementsContainer}>
              {auraData.achievements.map(renderAchievement)}
            </View>
          </ScrollView>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {auraData.recentActivity.map(renderActivityItem)}
        </View>

        {/* Aura Benefits */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aura Benefits</Text>
          <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>🎯</Text>
              <Text style={styles.benefitText}>Higher Aura = Better Match Priority</Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>🔒</Text>
              <Text style={styles.benefitText}>Enhanced Privacy Features</Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>⚡</Text>
              <Text style={styles.benefitText}>Faster Proof Generation</Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>🏆</Text>
              <Text style={styles.benefitText}>Exclusive Achievement Badges</Text>
            </View>
          </View>
        </View>

        {/* How to Earn Aura */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How to Earn Aura</Text>
          <View style={styles.earnList}>
            <Text style={styles.earnItem}>• Complete successful matches (+75 points)</Text>
            <Text style={styles.earnItem}>• Reveal identity mutually (+150 points)</Text>
            <Text style={styles.earnItem}>• Verify your profile (+100 points)</Text>
            <Text style={styles.earnItem}>• Maintain positive interactions (+25 points)</Text>
            <Text style={styles.earnItem}>• Unlock achievements (varies)</Text>
          </View>
        </View>

        {/* Navigation Buttons */}
        <View style={styles.navigationButtons}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.navigate('Match')}
          >
            <Text style={styles.navButtonText}>🔍 Find Matches</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.navButtonText}>👤 Profile</Text>
          </TouchableOpacity>
        </View>

        {/* TODO: Add aura history chart */}
        <View style={styles.chartPlaceholder}>
          <Text style={styles.chartPlaceholderText}>
            📈 Aura History Chart
          </Text>
          <Text style={styles.chartPlaceholderSubtext}>
            TODO: Implement interactive chart showing aura growth over time
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
  auraHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF6B9D',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
  },
  levelCard: {
    backgroundColor: '#FFFFFF',
    padding: 25,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  levelTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 10,
  },
  totalPoints: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF6B9D',
    marginBottom: 20,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E9ECEF',
    borderRadius: 4,
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF6B9D',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#6C757D',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 15,
  },
  achievementsContainer: {
    flexDirection: 'row',
    paddingRight: 20,
  },
  achievementCard: {
    width: 140,
    padding: 15,
    borderRadius: 12,
    marginRight: 12,
    alignItems: 'center',
  },
  achievementUnlocked: {
    backgroundColor: '#D4EDDA',
    borderWidth: 2,
    borderColor: '#28A745',
  },
  achievementLocked: {
    backgroundColor: '#F8F9FA',
    borderWidth: 2,
    borderColor: '#DEE2E6',
  },
  achievementName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  achievementPoints: {
    fontSize: 12,
    color: '#FF6B9D',
    fontWeight: '500',
    marginBottom: 8,
  },
  achievementStatus: {
    fontSize: 11,
    fontWeight: '500',
  },
  statusUnlocked: {
    color: '#28A745',
  },
  statusLocked: {
    color: '#6C757D',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  activityEmoji: {
    fontSize: 20,
  },
  activityContent: {
    flex: 1,
  },
  activityDescription: {
    fontSize: 14,
    color: '#212529',
    marginBottom: 4,
  },
  activityDate: {
    fontSize: 12,
    color: '#6C757D',
  },
  activityPoints: {
    alignItems: 'center',
  },
  activityPointsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#28A745',
  },
  benefitsList: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  benefitText: {
    fontSize: 14,
    color: '#212529',
  },
  earnList: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  earnItem: {
    fontSize: 14,
    color: '#212529',
    marginBottom: 8,
    lineHeight: 20,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  navButton: {
    backgroundColor: '#FF6B9D',
    padding: 16,
    borderRadius: 12,
    flex: 0.48,
    alignItems: 'center',
  },
  navButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  chartPlaceholder: {
    backgroundColor: '#F8F9FA',
    padding: 30,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#DEE2E6',
    borderStyle: 'dashed',
  },
  chartPlaceholderText: {
    fontSize: 18,
    color: '#6C757D',
    marginBottom: 8,
  },
  chartPlaceholderSubtext: {
    fontSize: 12,
    color: '#ADB5BD',
    textAlign: 'center',
  },
});

export default AuraScreen;
