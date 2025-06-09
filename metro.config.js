const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.resolver = {
  ...config.resolver,
  sourceExts: [...config.resolver.sourceExts, 'cjs', 'mjs'],
  unstable_enablePackageExports: false,
  extraNodeModules: {
    ...config.resolver.extraNodeModules,
    'firebase/app': path.resolve(__dirname, 'node_modules/firebase/app'),
    'firebase/auth': path.resolve(__dirname, 'node_modules/firebase/auth'),
    'firebase/firestore': path.resolve(__dirname, 'node_modules/firebase/firestore'),
  },
};

config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
};

module.exports = config;