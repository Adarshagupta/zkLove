const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration for React Native
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
    // Add support for additional file extensions if needed
    assetExts: ['bin', 'txt', 'jpg', 'png', 'json', 'wasm'],
    sourceExts: ['js', 'json', 'ts', 'tsx', 'jsx'],
  },
  transformer: {
    // Enable Hermes for better performance
    hermesCommand: 'hermes',
    // Add support for experimental features
    experimentalImportSupport: false,
    inlineRequires: true,
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
