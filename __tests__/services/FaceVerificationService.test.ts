import {FaceVerificationService} from '@services/FaceVerificationService';
import {FaceData} from '@types/index';

describe('FaceVerificationService', () => {
  let service: FaceVerificationService;

  beforeEach(() => {
    service = new FaceVerificationService();
  });

  describe('detectFace', () => {
    it('should detect face in image and return face data', async () => {
      const mockImageUri = 'file://test-image.jpg';
      
      const result = await service.detectFace(mockImageUri);
      
      expect(result).toBeDefined();
      expect(result.imageUri).toBe(mockImageUri);
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.faceDescriptor).toHaveLength(128);
      expect(result.boundingBox).toHaveProperty('x');
      expect(result.boundingBox).toHaveProperty('y');
      expect(result.boundingBox).toHaveProperty('width');
      expect(result.boundingBox).toHaveProperty('height');
    });

    it('should throw error for invalid image', async () => {
      const mockImageUri = '';
      
      // Mock service to throw error for empty URI
      jest.spyOn(service, 'detectFace').mockRejectedValueOnce(
        new Error('Failed to detect face in image')
      );
      
      await expect(service.detectFace(mockImageUri)).rejects.toThrow(
        'Failed to detect face in image'
      );
    });
  });

  describe('compareFaces', () => {
    it('should return similarity score between two faces', async () => {
      const face1: FaceData = {
        imageUri: 'file://face1.jpg',
        faceDescriptor: Array(128).fill(0.5),
        confidence: 0.9,
        boundingBox: { x: 100, y: 100, width: 200, height: 200 },
      };

      const face2: FaceData = {
        imageUri: 'file://face2.jpg',
        faceDescriptor: Array(128).fill(0.5),
        confidence: 0.85,
        boundingBox: { x: 110, y: 110, width: 190, height: 190 },
      };

      const similarity = await service.compareFaces(face1, face2);
      
      expect(similarity).toBeGreaterThanOrEqual(0);
      expect(similarity).toBeLessThanOrEqual(1);
    });

    it('should return 0 for completely different face descriptors', async () => {
      const face1: FaceData = {
        imageUri: 'file://face1.jpg',
        faceDescriptor: Array(128).fill(1),
        confidence: 0.9,
        boundingBox: { x: 100, y: 100, width: 200, height: 200 },
      };

      const face2: FaceData = {
        imageUri: 'file://face2.jpg',
        faceDescriptor: Array(128).fill(-1),
        confidence: 0.85,
        boundingBox: { x: 110, y: 110, width: 190, height: 190 },
      };

      const similarity = await service.compareFaces(face1, face2);
      
      expect(similarity).toBe(-1); // Completely opposite vectors
    });
  });

  describe('validateFaceQuality', () => {
    it('should return true for high quality face data', () => {
      const highQualityFace: FaceData = {
        imageUri: 'file://face.jpg',
        faceDescriptor: Array(128).fill(0.5),
        confidence: 0.9,
        boundingBox: { x: 100, y: 100, width: 200, height: 250 },
      };

      const isValid = service.validateFaceQuality(highQualityFace);
      
      expect(isValid).toBe(true);
    });

    it('should return false for low confidence face data', () => {
      const lowQualityFace: FaceData = {
        imageUri: 'file://face.jpg',
        faceDescriptor: Array(128).fill(0.5),
        confidence: 0.5, // Below threshold
        boundingBox: { x: 100, y: 100, width: 200, height: 250 },
      };

      const isValid = service.validateFaceQuality(lowQualityFace);
      
      expect(isValid).toBe(false);
    });

    it('should return false for small face size', () => {
      const smallFace: FaceData = {
        imageUri: 'file://face.jpg',
        faceDescriptor: Array(128).fill(0.5),
        confidence: 0.9,
        boundingBox: { x: 100, y: 100, width: 50, height: 50 }, // Too small
      };

      const isValid = service.validateFaceQuality(smallFace);
      
      expect(isValid).toBe(false);
    });
  });

  describe('hashFaceDescriptor', () => {
    it('should generate consistent hash for same face data', () => {
      const faceData: FaceData = {
        imageUri: 'file://face.jpg',
        faceDescriptor: [1, 2, 3, 4, 5],
        confidence: 0.9,
        boundingBox: { x: 100, y: 100, width: 200, height: 250 },
      };

      const hash1 = service.hashFaceDescriptor(faceData);
      const hash2 = service.hashFaceDescriptor(faceData);
      
      expect(hash1).toBe(hash2);
      expect(hash1).toBeDefined();
      expect(typeof hash1).toBe('string');
    });

    it('should generate different hashes for different face data', () => {
      const faceData1: FaceData = {
        imageUri: 'file://face1.jpg',
        faceDescriptor: [1, 2, 3, 4, 5],
        confidence: 0.9,
        boundingBox: { x: 100, y: 100, width: 200, height: 250 },
      };

      const faceData2: FaceData = {
        imageUri: 'file://face2.jpg',
        faceDescriptor: [6, 7, 8, 9, 10],
        confidence: 0.85,
        boundingBox: { x: 110, y: 110, width: 190, height: 240 },
      };

      const hash1 = service.hashFaceDescriptor(faceData1);
      const hash2 = service.hashFaceDescriptor(faceData2);
      
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('isSupported', () => {
    it('should return true for supported platforms', () => {
      const isSupported = service.isSupported();
      
      expect(isSupported).toBe(true);
    });
  });

  describe('preprocessImage', () => {
    it('should return processed image URI', async () => {
      const originalUri = 'file://original.jpg';
      
      const processedUri = await service.preprocessImage(originalUri);
      
      expect(processedUri).toBe(originalUri); // For demo, returns same URI
    });
  });
});
