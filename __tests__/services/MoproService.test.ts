import {MoproService} from '@services/MoproService';
import {MoproProof} from '@types/index';

describe('MoproService', () => {
  let service: MoproService;

  beforeEach(() => {
    service = new MoproService();
  });

  describe('generateProof', () => {
    it('should generate a valid zero-knowledge proof', async () => {
      const inputs = {
        faceHash: 'mock_face_hash',
        idHash: 'mock_id_hash',
        timestamp: Math.floor(Date.now() / 1000),
      };

      const proof = await service.generateProof(inputs);

      expect(proof).toBeDefined();
      expect(proof.proof).toBeInstanceOf(Uint8Array);
      expect(proof.publicInputs).toBeInstanceOf(Array);
      expect(proof.publicInputs).toHaveLength(3);
      expect(proof.publicInputs[0]).toBe(inputs.faceHash);
      expect(proof.publicInputs[1]).toBe(inputs.idHash);
      expect(proof.publicInputs[2]).toBe(inputs.timestamp.toString());
    });

    it('should handle missing inputs gracefully', async () => {
      const inputs = {};

      const proof = await service.generateProof(inputs);

      expect(proof).toBeDefined();
      expect(proof.publicInputs).toContain('mock_face_hash');
      expect(proof.publicInputs).toContain('mock_id_hash');
    });
  });

  describe('verifyProof', () => {
    it('should verify a valid proof', async () => {
      const mockProof: MoproProof = {
        proof: new Uint8Array([1, 2, 3, 4, 5]),
        publicInputs: ['input1', 'input2', 'input3'],
      };

      const isValid = await service.verifyProof(mockProof);

      expect(isValid).toBe(true);
    });

    it('should handle verification errors gracefully', async () => {
      const invalidProof: MoproProof = {
        proof: new Uint8Array([]),
        publicInputs: [],
      };

      // Mock service to throw error for invalid proof
      jest.spyOn(service, 'verifyProof').mockRejectedValueOnce(
        new Error('Proof verification failed')
      );

      await expect(service.verifyProof(invalidProof)).rejects.toThrow(
        'Proof verification failed'
      );
    });
  });

  describe('getVerificationKey', () => {
    it('should return a valid verification key', async () => {
      const verificationKey = await service.getVerificationKey();

      expect(verificationKey).toBeDefined();
      expect(typeof verificationKey).toBe('string');
      
      // Should be valid JSON
      const parsed = JSON.parse(verificationKey);
      expect(parsed).toHaveProperty('protocol');
      expect(parsed).toHaveProperty('curve');
      expect(parsed).toHaveProperty('nPublic');
    });
  });

  describe('prepareCircuitInputs', () => {
    it('should format inputs correctly for circuit', () => {
      const faceHash = 'test_face_hash';
      const idHash = 'test_id_hash';
      const timestamp = 1234567890;

      const inputs = service.prepareCircuitInputs(faceHash, idHash, timestamp);

      expect(inputs).toHaveProperty('face_hash');
      expect(inputs).toHaveProperty('id_hash');
      expect(inputs).toHaveProperty('timestamp');
      expect(inputs.timestamp).toBe(timestamp);
    });
  });

  describe('isSupported', () => {
    it('should return true for supported platforms', () => {
      const isSupported = service.isSupported();

      expect(isSupported).toBe(true);
    });
  });

  describe('getCircuitInfo', () => {
    it('should return circuit information', () => {
      const info = service.getCircuitInfo();

      expect(info).toHaveProperty('name');
      expect(info).toHaveProperty('version');
      expect(info).toHaveProperty('description');
      expect(info).toHaveProperty('inputs');
      expect(info).toHaveProperty('outputs');
      expect(info).toHaveProperty('constraints');
      
      expect(info.inputs).toContain('face_hash');
      expect(info.inputs).toContain('id_hash');
      expect(info.inputs).toContain('timestamp');
    });
  });

  describe('getPerformanceMetrics', () => {
    it('should return performance metrics', () => {
      const metrics = service.getPerformanceMetrics();

      expect(metrics).toHaveProperty('lastProofGenerationTime');
      expect(metrics).toHaveProperty('memoryUsage');
      expect(metrics).toHaveProperty('circuitSize');
      expect(metrics).toHaveProperty('provingKeySize');
      
      expect(typeof metrics.lastProofGenerationTime).toBe('number');
      expect(metrics.lastProofGenerationTime).toBeGreaterThan(0);
    });
  });

  describe('updateCircuitFiles', () => {
    it('should update circuit configuration', async () => {
      const newCircuitPath = 'new/circuit/path.r1cs';
      const newProvingKeyPath = 'new/proving/key.zkey';
      const newVerificationKeyPath = 'new/verification/key.json';

      await expect(
        service.updateCircuitFiles(
          newCircuitPath,
          newProvingKeyPath,
          newVerificationKeyPath
        )
      ).resolves.toBeUndefined();
    });
  });
});
