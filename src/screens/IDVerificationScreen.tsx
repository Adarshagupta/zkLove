import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import DocumentPicker from 'react-native-document-picker';
import * as ImagePicker from 'expo-image-picker';
import {RootStackParamList, IDDocument} from '@types/index';
import {IDVerificationService} from '@services/IDVerificationService';

type IDVerificationScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'IDVerification'
>;

interface Props {
  navigation: IDVerificationScreenNavigationProp;
}

const IDVerificationScreen: React.FC<Props> = ({navigation}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [extractedData, setExtractedData] = useState<IDDocument | null>(null);
  const [documentType, setDocumentType] = useState<'passport' | 'drivers_license' | 'national_id'>('passport');
  
  const idService = new IDVerificationService();

  const showImagePicker = () => {
    Alert.alert(
      'Select ID Document',
      'Choose how you want to add your ID document',
      [
        {text: 'Camera', onPress: openCamera},
        {text: 'Gallery', onPress: openGallery},
        {text: 'Cancel', style: 'cancel'},
      ]
    );
  };

  const openCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const openGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const processDocument = async () => {
    if (!selectedImage) {
      Alert.alert('Error', 'Please select an ID document first');
      return;
    }

    try {
      setIsProcessing(true);
      const documentData = await idService.extractData(selectedImage);
      
      if (documentData.confidence > 0.7) {
        setExtractedData(documentData);
        Alert.alert(
          'Document Processed',
          'ID document successfully verified!',
          [
            {
              text: 'Retake',
              style: 'cancel',
              onPress: () => {
                setSelectedImage(null);
                setExtractedData(null);
              },
            },
            {
              text: 'Continue',
              onPress: () => navigation.navigate('ProofGeneration', {
                faceData: '', // This would come from previous screen
                idData: documentData,
              }),
            },
          ]
        );
      } else {
        Alert.alert(
          'Document Not Clear',
          'Please ensure the document is clearly visible and try again.',
          [{text: 'OK'}]
        );
      }
    } catch (error) {
      console.error('Error processing document:', error);
      Alert.alert('Error', 'Failed to process document. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const DocumentTypeSelector = () => (
    <View style={styles.documentTypeContainer}>
      <Text style={styles.sectionTitle}>Document Type</Text>
      <View style={styles.documentTypeButtons}>
        <TouchableOpacity
          style={[
            styles.documentTypeButton,
            documentType === 'passport' && styles.selectedDocumentType,
          ]}
          onPress={() => setDocumentType('passport')}>
          <Text style={[
            styles.documentTypeText,
            documentType === 'passport' && styles.selectedDocumentTypeText,
          ]}>
            Passport
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.documentTypeButton,
            documentType === 'drivers_license' && styles.selectedDocumentType,
          ]}
          onPress={() => setDocumentType('drivers_license')}>
          <Text style={[
            styles.documentTypeText,
            documentType === 'drivers_license' && styles.selectedDocumentTypeText,
          ]}>
            Driver's License
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.documentTypeButton,
            documentType === 'national_id' && styles.selectedDocumentType,
          ]}
          onPress={() => setDocumentType('national_id')}>
          <Text style={[
            styles.documentTypeText,
            documentType === 'national_id' && styles.selectedDocumentTypeText,
          ]}>
            National ID
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const ExtractedDataDisplay = () => {
    if (!extractedData) return null;

    return (
      <View style={styles.extractedDataContainer}>
        <Text style={styles.sectionTitle}>Extracted Information</Text>
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>First Name:</Text>
          <Text style={styles.dataValue}>{extractedData.extractedData.firstName}</Text>
        </View>
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Last Name:</Text>
          <Text style={styles.dataValue}>{extractedData.extractedData.lastName}</Text>
        </View>
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Date of Birth:</Text>
          <Text style={styles.dataValue}>{extractedData.extractedData.dateOfBirth}</Text>
        </View>
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Document Number:</Text>
          <Text style={styles.dataValue}>{extractedData.extractedData.documentNumber}</Text>
        </View>
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Expiry Date:</Text>
          <Text style={styles.dataValue}>{extractedData.extractedData.expiryDate}</Text>
        </View>
        {extractedData.extractedData.nationality && (
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>Nationality:</Text>
            <Text style={styles.dataValue}>{extractedData.extractedData.nationality}</Text>
          </View>
        )}
        <View style={styles.confidenceContainer}>
          <Text style={styles.confidenceLabel}>
            Confidence: {Math.round(extractedData.confidence * 100)}%
          </Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>ID Document Verification</Text>
        <Text style={styles.subtitle}>
          Upload a clear photo of your government-issued ID
        </Text>
      </View>

      <DocumentTypeSelector />

      <View style={styles.uploadContainer}>
        {selectedImage ? (
          <View style={styles.imageContainer}>
            <Image source={{uri: selectedImage}} style={styles.selectedImage} />
            <TouchableOpacity
              style={styles.changeImageButton}
              onPress={showImagePicker}>
              <Text style={styles.changeImageText}>Change Image</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={showImagePicker}>
            <Text style={styles.uploadIcon}>📄</Text>
            <Text style={styles.uploadText}>Select ID Document</Text>
            <Text style={styles.uploadSubtext}>
              Camera or Gallery
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {selectedImage && !extractedData && (
        <TouchableOpacity
          style={[styles.processButton, isProcessing && styles.processingButton]}
          onPress={processDocument}
          disabled={isProcessing}>
          {isProcessing ? (
            <View style={styles.processingContainer}>
              <ActivityIndicator size="small" color="#ffffff" />
              <Text style={styles.processButtonText}>Processing...</Text>
            </View>
          ) : (
            <Text style={styles.processButtonText}>Process Document</Text>
          )}
        </TouchableOpacity>
      )}

      <ExtractedDataDisplay />

      {extractedData && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.retakeButton]}
            onPress={() => {
              setSelectedImage(null);
              setExtractedData(null);
            }}>
            <Text style={styles.retakeButtonText}>Retake</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.continueButton]}
            onPress={() => navigation.navigate('ProofGeneration', {
              faceData: '', // This would come from previous screen
              idData: extractedData,
            })}>
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.tips}>
        <Text style={styles.tipsTitle}>Tips for best results:</Text>
        <Text style={styles.tipText}>• Ensure document is well-lit</Text>
        <Text style={styles.tipText}>• Avoid shadows and glare</Text>
        <Text style={styles.tipText}>• Keep document flat and straight</Text>
        <Text style={styles.tipText}>• Include all corners of the document</Text>
        <Text style={styles.tipText}>• Use high resolution image</Text>
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
  documentTypeContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  documentTypeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  documentTypeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  selectedDocumentType: {
    borderColor: '#6366f1',
    backgroundColor: '#eef2ff',
  },
  documentTypeText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
    textAlign: 'center',
  },
  selectedDocumentTypeText: {
    color: '#6366f1',
  },
  uploadContainer: {
    padding: 20,
  },
  uploadButton: {
    backgroundColor: '#ffffff',
    padding: 40,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  uploadText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  uploadSubtext: {
    fontSize: 14,
    color: '#6b7280',
  },
  imageContainer: {
    alignItems: 'center',
  },
  selectedImage: {
    width: 300,
    height: 200,
    borderRadius: 12,
    resizeMode: 'contain',
  },
  changeImageButton: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
  },
  changeImageText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '600',
  },
  processButton: {
    backgroundColor: '#6366f1',
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  processingButton: {
    backgroundColor: '#9ca3af',
  },
  processingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  processButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  extractedDataContainer: {
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
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  dataLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '600',
  },
  dataValue: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '500',
  },
  confidenceContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
  confidenceLabel: {
    fontSize: 16,
    color: '#059669',
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  actionButton: {
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
  tips: {
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
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
});

export default IDVerificationScreen;
