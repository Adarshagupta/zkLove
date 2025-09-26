import 'react-native-gesture-handler/jestSetup';

// Mock react-native modules
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock react-native-vision-camera
jest.mock('react-native-vision-camera', () => ({
  Camera: {
    requestCameraPermission: jest.fn(() => Promise.resolve('authorized')),
    getCameraDevice: jest.fn(),
  },
  useCameraDevices: jest.fn(() => ({
    front: { id: 'front' },
    back: { id: 'back' },
  })),
}));

// Mock react-native-image-picker
jest.mock('react-native-image-picker', () => ({
  launchCamera: jest.fn(),
  launchImageLibrary: jest.fn(),
}));

// Mock react-native-document-picker
jest.mock('react-native-document-picker', () => ({
  pick: jest.fn(),
  types: {
    images: 'images',
  },
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock NetInfo
jest.mock('@react-native-community/netinfo', () => ({
  fetch: jest.fn(() => Promise.resolve({ isConnected: true })),
  addEventListener: jest.fn(),
}));

// Mock react-navigation
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    reset: jest.fn(),
  }),
  useRoute: () => ({
    params: {},
  }),
}));

// Mock ethers
jest.mock('ethers', () => ({
  ethers: {
    JsonRpcProvider: jest.fn(),
    Wallet: {
      createRandom: jest.fn(() => ({
        connect: jest.fn(),
        getAddress: jest.fn(() => Promise.resolve('0x123')),
      })),
    },
    Contract: jest.fn(),
    formatEther: jest.fn(() => '1.0'),
  },
}));

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Setup fake timers
beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
  jest.clearAllMocks();
});

// Set NODE_ENV for testing
process.env.NODE_ENV = 'test';

// Increase timeout for longer running tests
jest.setTimeout(10000);
