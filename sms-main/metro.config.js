const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add .xz as a valid asset extension
config.resolver.assetExts.push('xz');

module.exports = config;
