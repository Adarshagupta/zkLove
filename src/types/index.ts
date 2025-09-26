// Navigation types
export type RootStackParamList = {
  Home: undefined;
  FaceVerification: undefined;
  IDVerification: undefined;
  ProofGeneration: {
    faceData: string;
    idData: IDDocument;
  };
  VerificationComplete: {
    proofHash: string;
    transactionHash: string;
  };
};

// Face verification types
export interface FaceData {
  imageUri: string;
  faceDescriptor: number[];
  confidence: number;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

// ID document types
export interface IDDocument {
  type: 'passport' | 'drivers_license' | 'national_id';
  imageUri: string;
  extractedData: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    documentNumber: string;
    expiryDate: string;
    nationality?: string;
    address?: string;
  };
  confidence: number;
}

// Zero-knowledge proof types
export interface ZKProof {
  proof: string;
  publicSignals: string[];
  verificationKey: string;
}

// Blockchain types
export interface VerificationContract {
  address: string;
  abi: any[];
}

export interface TransactionResult {
  hash: string;
  blockNumber: number;
  gasUsed: string;
  status: 'success' | 'failed';
}

// Mopro types
export interface MoproConfig {
  circuitPath: string;
  provingKeyPath: string;
  verificationKeyPath: string;
}

export interface MoproProof {
  proof: Uint8Array;
  publicInputs: string[];
}

// App state types
export interface AppState {
  isLoading: boolean;
  currentStep: 'face' | 'id' | 'proof' | 'complete';
  faceVerificationData?: FaceData;
  idVerificationData?: IDDocument;
  zkProof?: ZKProof;
  transactionResult?: TransactionResult;
  error?: string;
}

// Service types
export interface Web3Service {
  connect(): Promise<void>;
  submitProof(proof: ZKProof): Promise<TransactionResult>;
  verifyProof(proofHash: string): Promise<boolean>;
}

export interface FaceVerificationService {
  detectFace(imageUri: string): Promise<FaceData>;
  compareFaces(face1: FaceData, face2: FaceData): Promise<number>;
}

export interface IDVerificationService {
  extractData(imageUri: string): Promise<IDDocument>;
  validateDocument(document: IDDocument): Promise<boolean>;
}

export interface MoproService {
  generateProof(inputs: any): Promise<MoproProof>;
  verifyProof(proof: MoproProof): Promise<boolean>;
}
