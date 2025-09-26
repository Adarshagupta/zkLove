import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList, ZKProof, TransactionResult} from '@types/index';
import {MoproService} from '@services/MoproService';
import {Web3Service} from '@services/Web3Service';

type ProofGenerationScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ProofGeneration'
>;

type ProofGenerationScreenRouteProp = RouteProp<
  RootStackParamList,
  'ProofGeneration'
>;

interface Props {
  navigation: ProofGenerationScreenNavigationProp;
  route: ProofGenerationScreenRouteProp;
}

enum ProofStage {
  PREPARING = 'preparing',
  GENERATING_PROOF = 'generating_proof',
  SUBMITTING_TO_BLOCKCHAIN = 'submitting_to_blockchain',
  COMPLETED = 'completed',
  ERROR = 'error',
}

const ProofGenerationScreen: React.FC<Props> = ({navigation, route}) => {
  const [currentStage, setCurrentStage] = useState<ProofStage>(ProofStage.PREPARING);
  const [progress, setProgress] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>('Preparing verification data...');
  const [zkProof, setZkProof] = useState<ZKProof | null>(null);
  const [transactionResult, setTransactionResult] = useState<TransactionResult | null>(null);

  const {faceData, idData} = route.params;
  const moproService = new MoproService();
  const web3Service = new Web3Service();

  useEffect(() => {
    startProofGeneration();
  }, []);

  const startProofGeneration = async () => {
    try {
      // Stage 1: Prepare data
      setCurrentStage(ProofStage.PREPARING);
      setProgress(10);
      setStatusMessage('Preparing verification data...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Stage 2: Generate ZK proof
      setCurrentStage(ProofStage.GENERATING_PROOF);
      setProgress(30);
      setStatusMessage('Generating zero-knowledge proof...');
      
      const proofInputs = {
        faceHash: hashFaceData(faceData),
        idHash: hashIdData(idData),
        timestamp: Math.floor(Date.now() / 1000),
      };

      const moproProof = await moproService.generateProof(proofInputs);
      setProgress(60);

      // Convert Mopro proof to our ZK proof format
      const zkProof: ZKProof = {
        proof: Buffer.from(moproProof.proof).toString('hex'),
        publicSignals: moproProof.publicInputs,
        verificationKey: await moproService.getVerificationKey(),
      };

      setZkProof(zkProof);
      setStatusMessage('Proof generated successfully!');
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Stage 3: Submit to blockchain
      setCurrentStage(ProofStage.SUBMITTING_TO_BLOCKCHAIN);
      setProgress(80);
      setStatusMessage('Submitting proof to blockchain...');

      await web3Service.connect();
      const txResult = await web3Service.submitProof(zkProof);
      setTransactionResult(txResult);
      setProgress(100);

      // Stage 4: Completed
      setCurrentStage(ProofStage.COMPLETED);
      setStatusMessage('Verification completed successfully!');
      
      setTimeout(() => {
        navigation.navigate('VerificationComplete', {
          proofHash: zkProof.proof,
          transactionHash: txResult.hash,
        });
      }, 2000);

    } catch (error) {
      console.error('Proof generation error:', error);
      setCurrentStage(ProofStage.ERROR);
      setStatusMessage('Failed to generate proof. Please try again.');
      
      Alert.alert(
        'Verification Failed',
        'There was an error generating your verification proof. Please try again.',
        [
          {
            text: 'Retry',
            onPress: () => startProofGeneration(),
          },
          {
            text: 'Go Back',
            style: 'cancel',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    }
  };

  const hashFaceData = (faceData: string): string => {
    // In a real implementation, this would use a proper hash function
    // For demo purposes, we'll use a simple hash
    return Buffer.from(faceData).toString('base64').substring(0, 32);
  };

  const hashIdData = (idData: any): string => {
    // In a real implementation, this would hash the ID data properly
    const dataString = JSON.stringify({
      firstName: idData.extractedData.firstName,
      lastName: idData.extractedData.lastName,
      dateOfBirth: idData.extractedData.dateOfBirth,
      documentNumber: idData.extractedData.documentNumber,
    });
    return Buffer.from(dataString).toString('base64').substring(0, 32);
  };

  const getStageIcon = (stage: ProofStage): string => {
    switch (stage) {
      case ProofStage.PREPARING:
        return '📋';
      case ProofStage.GENERATING_PROOF:
        return '🔐';
      case ProofStage.SUBMITTING_TO_BLOCKCHAIN:
        return '🔗';
      case ProofStage.COMPLETED:
        return '✅';
      case ProofStage.ERROR:
        return '❌';
      default:
        return '⏳';
    }
  };

  const getProgressColor = (): string => {
    if (currentStage === ProofStage.ERROR) return '#ef4444';
    if (currentStage === ProofStage.COMPLETED) return '#059669';
    return '#6366f1';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Generating Verification Proof</Text>
        <Text style={styles.subtitle}>
          Creating zero-knowledge proof and submitting to blockchain
        </Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.iconContainer}>
          <Text style={styles.stageIcon}>{getStageIcon(currentStage)}</Text>
        </View>

        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${progress}%`,
                  backgroundColor: getProgressColor(),
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>{progress}%</Text>
        </View>

        <Text style={styles.statusMessage}>{statusMessage}</Text>

        {currentStage !== ProofStage.ERROR && currentStage !== ProofStage.COMPLETED && (
          <ActivityIndicator
            size="large"
            color={getProgressColor()}
            style={styles.spinner}
          />
        )}
      </View>

      <View style={styles.stagesContainer}>
        <Text style={styles.stagesTitle}>Process Steps:</Text>
        
        <View style={styles.stageItem}>
          <Text style={styles.stageNumber}>1</Text>
          <View style={styles.stageContent}>
            <Text style={[
              styles.stageText,
              currentStage === ProofStage.PREPARING && styles.activeStageText,
              progress > 10 && styles.completedStageText,
            ]}>
              Prepare verification data
            </Text>
          </View>
          {progress > 10 && <Text style={styles.checkmark}>✓</Text>}
        </View>

        <View style={styles.stageItem}>
          <Text style={styles.stageNumber}>2</Text>
          <View style={styles.stageContent}>
            <Text style={[
              styles.stageText,
              currentStage === ProofStage.GENERATING_PROOF && styles.activeStageText,
              progress > 60 && styles.completedStageText,
            ]}>
              Generate zero-knowledge proof
            </Text>
          </View>
          {progress > 60 && <Text style={styles.checkmark}>✓</Text>}
        </View>

        <View style={styles.stageItem}>
          <Text style={styles.stageNumber}>3</Text>
          <View style={styles.stageContent}>
            <Text style={[
              styles.stageText,
              currentStage === ProofStage.SUBMITTING_TO_BLOCKCHAIN && styles.activeStageText,
              progress > 90 && styles.completedStageText,
            ]}>
              Submit proof to blockchain
            </Text>
          </View>
          {progress > 90 && <Text style={styles.checkmark}>✓</Text>}
        </View>

        <View style={styles.stageItem}>
          <Text style={styles.stageNumber}>4</Text>
          <View style={styles.stageContent}>
            <Text style={[
              styles.stageText,
              currentStage === ProofStage.COMPLETED && styles.activeStageText,
              currentStage === ProofStage.COMPLETED && styles.completedStageText,
            ]}>
              Verification complete
            </Text>
          </View>
          {currentStage === ProofStage.COMPLETED && <Text style={styles.checkmark}>✓</Text>}
        </View>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>What's happening?</Text>
        <Text style={styles.infoText}>
          We're creating a cryptographic proof that verifies your identity without
          revealing your personal information. This proof will be stored on the
          blockchain for permanent verification.
        </Text>
      </View>
    </View>
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
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
  },
  progressContainer: {
    padding: 40,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#eef2ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  stageIcon: {
    fontSize: 40,
  },
  progressBarContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressBarBackground: {
    width: '100%',
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statusMessage: {
    fontSize: 18,
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 20,
  },
  spinner: {
    marginTop: 10,
  },
  stagesContainer: {
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
  stagesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  stageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stageNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e5e7eb',
    color: '#6b7280',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 12,
  },
  stageContent: {
    flex: 1,
  },
  stageText: {
    fontSize: 14,
    color: '#6b7280',
  },
  activeStageText: {
    color: '#6366f1',
    fontWeight: '600',
  },
  completedStageText: {
    color: '#059669',
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 16,
    color: '#059669',
    marginLeft: 8,
  },
  infoContainer: {
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
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
});

export default ProofGenerationScreen;
