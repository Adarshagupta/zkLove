import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Camera} from 'expo-camera';
import {RootStackParamList, FaceData} from '@types/index';
import {FaceVerificationService} from '@services/FaceVerificationService';

type FaceVerificationScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'FaceVerification'
>;

interface Props {
  navigation: FaceVerificationScreenNavigationProp;
}

const FaceVerificationScreen: React.FC<Props> = ({navigation}) => {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [capturedFace, setCapturedFace] = useState<FaceData | null>(null);
  
  const camera = useRef<Camera>(null);
  const faceService = new FaceVerificationService();

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      Alert.alert('Error', 'Failed to request camera permission');
    }
  };

  const captureFace = async () => {
    if (!camera.current) return;

    try {
      setIsCapturing(true);
      const photo = await camera.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });

      setIsProcessing(true);
      const faceData = await faceService.detectFace(photo.uri);
      
      if (faceData.confidence > 0.8) {
        setCapturedFace(faceData);
        Alert.alert(
          'Face Captured',
          'Face successfully detected and verified!',
          [
            {
              text: 'Retake',
              style: 'cancel',
              onPress: () => setCapturedFace(null),
            },
            {
              text: 'Continue',
              onPress: () => navigation.navigate('IDVerification'),
            },
          ]
        );
      } else {
        Alert.alert(
          'Face Not Detected',
          'Please ensure your face is clearly visible and try again.',
          [{text: 'OK'}]
        );
      }
    } catch (error) {
      console.error('Error capturing face:', error);
      Alert.alert('Error', 'Failed to capture face. Please try again.');
    } finally {
      setIsCapturing(false);
      setIsProcessing(false);
    }
  };

  const retakeFace = () => {
    setCapturedFace(null);
  };

  if (!hasPermission) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Camera permission is required for face verification
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestCameraPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Face Verification</Text>
        <Text style={styles.subtitle}>
          Position your face in the center of the frame
        </Text>
      </View>

      <View style={styles.cameraContainer}>
        <Camera
          ref={camera}
          style={styles.camera}
          type={Camera.Constants.Type.front}
          ratio="16:9"
        />
        <View style={styles.overlay}>
          <View style={styles.faceFrame} />
        </View>
      </View>

      <View style={styles.controls}>
        {isProcessing ? (
          <View style={styles.processingContainer}>
            <ActivityIndicator size="large" color="#6366f1" />
            <Text style={styles.processingText}>Processing face...</Text>
          </View>
        ) : (
          <>
            {capturedFace ? (
              <View style={styles.successContainer}>
                <Text style={styles.successText}>✓ Face verified successfully!</Text>
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[styles.button, styles.retakeButton]}
                    onPress={retakeFace}>
                    <Text style={styles.retakeButtonText}>Retake</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.continueButton]}
                    onPress={() => navigation.navigate('IDVerification')}>
                    <Text style={styles.continueButtonText}>Continue</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.captureButton, isCapturing && styles.capturingButton]}
                onPress={captureFace}
                disabled={isCapturing}>
                <Text style={styles.captureButtonText}>
                  {isCapturing ? 'Capturing...' : 'Capture Face'}
                </Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>

      <View style={styles.instructions}>
        <Text style={styles.instructionTitle}>Instructions:</Text>
        <Text style={styles.instructionText}>• Look directly at the camera</Text>
        <Text style={styles.instructionText}>• Ensure good lighting</Text>
        <Text style={styles.instructionText}>• Remove glasses if possible</Text>
        <Text style={styles.instructionText}>• Keep face within the frame</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    padding: 20,
    backgroundColor: '#ffffff',
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
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceFrame: {
    width: 250,
    height: 300,
    borderWidth: 3,
    borderColor: '#6366f1',
    borderRadius: 125,
    backgroundColor: 'transparent',
  },
  controls: {
    backgroundColor: '#ffffff',
    padding: 20,
    minHeight: 100,
    justifyContent: 'center',
  },
  captureButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: 'center',
  },
  capturingButton: {
    backgroundColor: '#9ca3af',
  },
  captureButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  processingContainer: {
    alignItems: 'center',
  },
  processingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6b7280',
  },
  successContainer: {
    alignItems: 'center',
  },
  successText: {
    fontSize: 18,
    color: '#059669',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  retakeButton: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  retakeButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  continueButton: {
    backgroundColor: '#059669',
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  instructions: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  permissionText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: '#6b7280',
  },
  permissionButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FaceVerificationScreen;
