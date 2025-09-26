module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    // Add any babel plugins needed for the project
    'react-native-reanimated/plugin', // Should be last
  ],
};
