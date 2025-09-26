import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '@types/index';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<Props> = ({navigation}) => {
  const startVerification = () => {
    navigation.navigate('FaceVerification');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Text style={styles.iconText}>🔐</Text>
          </View>
          <Text style={styles.title}>Zero-Knowledge Identity Verification</Text>
          <Text style={styles.subtitle}>
            Secure, private, and decentralized identity verification using
            zero-knowledge proofs and blockchain technology
          </Text>
        </View>

        <View style={styles.featuresContainer}>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>👤</Text>
            <Text style={styles.featureTitle}>Face Verification</Text>
            <Text style={styles.featureDescription}>
              Biometric face recognition with privacy-preserving technology
            </Text>
          </View>

          <View style={styles.feature}>
            <Text style={styles.featureIcon}>📄</Text>
            <Text style={styles.featureTitle}>ID Document Verification</Text>
            <Text style={styles.featureDescription}>
              Automated extraction and validation of government-issued IDs
            </Text>
          </View>

          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🔗</Text>
            <Text style={styles.featureTitle}>Blockchain Proof</Text>
            <Text style={styles.featureDescription}>
              Immutable verification records stored on-chain with zero-knowledge
              proofs
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.startButton} onPress={startVerification}>
          <Text style={styles.startButtonText}>Start Verification</Text>
        </TouchableOpacity>

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>How it works:</Text>
          <Text style={styles.infoStep}>1. Capture your face for biometric verification</Text>
          <Text style={styles.infoStep}>2. Upload and verify your government ID</Text>
          <Text style={styles.infoStep}>3. Generate zero-knowledge proof</Text>
          <Text style={styles.infoStep}>4. Submit proof to blockchain</Text>
          <Text style={styles.infoStep}>5. Receive verification certificate</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconText: {
    fontSize: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  featuresContainer: {
    marginBottom: 40,
  },
  feature: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  startButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#6366f1',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  infoStep: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
    paddingLeft: 8,
  },
});

export default HomeScreen;
