import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Share,
  Linking,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '@types/index';

type VerificationCompleteScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'VerificationComplete'
>;

type VerificationCompleteScreenRouteProp = RouteProp<
  RootStackParamList,
  'VerificationComplete'
>;

interface Props {
  navigation: VerificationCompleteScreenNavigationProp;
  route: VerificationCompleteScreenRouteProp;
}

const VerificationCompleteScreen: React.FC<Props> = ({navigation, route}) => {
  const {proofHash, transactionHash} = route.params;

  const shareVerification = async () => {
    try {
      const shareMessage = `✅ Identity Verified!\n\nMy identity has been successfully verified using zero-knowledge proof technology.\n\nProof Hash: ${proofHash.substring(0, 16)}...\nTransaction: ${transactionHash}\n\nVerified with ZK Identity Verification App`;
      
      await Share.share({
        message: shareMessage,
        title: 'Identity Verification Complete',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const viewOnBlockchain = () => {
    // This would open the blockchain explorer with the transaction hash
    const explorerUrl = `https://etherscan.io/tx/${transactionHash}`;
    Linking.openURL(explorerUrl);
  };

  const startNewVerification = () => {
    navigation.reset({
      index: 0,
      routes: [{name: 'Home'}],
    });
  };

  const copyToClipboard = (text: string, label: string) => {
    // In a real app, you'd use Clipboard from @react-native-clipboard/clipboard
    console.log(`Copied ${label}: ${text}`);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.successIcon}>
          <Text style={styles.successEmoji}>🎉</Text>
        </View>
        <Text style={styles.title}>Verification Complete!</Text>
        <Text style={styles.subtitle}>
          Your identity has been successfully verified and recorded on the blockchain
        </Text>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.sectionTitle}>Verification Details</Text>
        
        <View style={styles.detailItem}>
          <View style={styles.detailHeader}>
            <Text style={styles.detailLabel}>Proof Hash</Text>
            <TouchableOpacity
              onPress={() => copyToClipboard(proofHash, 'Proof Hash')}
              style={styles.copyButton}>
              <Text style={styles.copyText}>Copy</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.detailValue} numberOfLines={2} ellipsizeMode="middle">
            {proofHash}
          </Text>
        </View>

        <View style={styles.detailItem}>
          <View style={styles.detailHeader}>
            <Text style={styles.detailLabel}>Transaction Hash</Text>
            <TouchableOpacity
              onPress={() => copyToClipboard(transactionHash, 'Transaction Hash')}
              style={styles.copyButton}>
              <Text style={styles.copyText}>Copy</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.detailValue} numberOfLines={1} ellipsizeMode="middle">
            {transactionHash}
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Verification Time</Text>
          <Text style={styles.detailValue}>
            {new Date().toLocaleString()}
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Blockchain Network</Text>
          <Text style={styles.detailValue}>Ethereum Mainnet</Text>
        </View>
      </View>

      <View style={styles.featuresContainer}>
        <Text style={styles.sectionTitle}>What This Means</Text>
        
        <View style={styles.feature}>
          <Text style={styles.featureIcon}>🔐</Text>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Privacy Preserved</Text>
            <Text style={styles.featureDescription}>
              Your personal information remains private while proving your identity
            </Text>
          </View>
        </View>

        <View style={styles.feature}>
          <Text style={styles.featureIcon}>🔗</Text>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Blockchain Verified</Text>
            <Text style={styles.featureDescription}>
              Immutable proof stored on the blockchain for permanent verification
            </Text>
          </View>
        </View>

        <View style={styles.feature}>
          <Text style={styles.featureIcon}>✅</Text>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Instantly Verifiable</Text>
            <Text style={styles.featureDescription}>
              Anyone can verify your identity without accessing your personal data
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.blockchainButton}
          onPress={viewOnBlockchain}>
          <Text style={styles.blockchainButtonText}>View on Blockchain</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.shareButton}
          onPress={shareVerification}>
          <Text style={styles.shareButtonText}>Share Verification</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.newVerificationButton}
          onPress={startNewVerification}>
          <Text style={styles.newVerificationButtonText}>New Verification</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.certificateContainer}>
        <Text style={styles.certificateTitle}>Digital Certificate</Text>
        <View style={styles.certificate}>
          <Text style={styles.certificateHeader}>🏆 IDENTITY VERIFIED</Text>
          <Text style={styles.certificateName}>Zero-Knowledge Proof</Text>
          <Text style={styles.certificateDate}>
            Verified on {new Date().toLocaleDateString()}
          </Text>
          <Text style={styles.certificateHash}>
            Proof: {proofHash.substring(0, 16)}...
          </Text>
          <View style={styles.certificateFooter}>
            <Text style={styles.certificateFooterText}>
              Powered by ZK Identity Verification
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.nextSteps}>
        <Text style={styles.sectionTitle}>Next Steps</Text>
        <Text style={styles.nextStepText}>
          • Save your proof hash for future reference
        </Text>
        <Text style={styles.nextStepText}>
          • Share your verification status if needed
        </Text>
        <Text style={styles.nextStepText}>
          • Use this verification for secure applications
        </Text>
        <Text style={styles.nextStepText}>
          • Your verification never expires
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 20,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#dcfce7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  successEmoji: {
    fontSize: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#059669',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  detailsContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  detailItem: {
    marginBottom: 16,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 14,
    color: '#1f2937',
    fontFamily: 'monospace',
  },
  copyButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
  },
  copyText: {
    fontSize: 12,
    color: '#6366f1',
    fontWeight: '600',
  },
  featuresContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 12,
    marginTop: 2,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  actionButtons: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  blockchainButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  blockchainButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  shareButton: {
    backgroundColor: '#059669',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  shareButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  newVerificationButton: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  newVerificationButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  certificateContainer: {
    margin: 20,
  },
  certificateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  certificate: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  certificateHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 8,
  },
  certificateName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  certificateDate: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  certificateHash: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'monospace',
    marginBottom: 16,
  },
  certificateFooter: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 12,
    width: '100%',
    alignItems: 'center',
  },
  certificateFooterText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  nextSteps: {
    margin: 20,
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  nextStepText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
    paddingLeft: 8,
  },
});

export default VerificationCompleteScreen;
