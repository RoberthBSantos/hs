const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Configurações adicionais para evitar problemas com módulos Node.js
config.resolver.sourceExts.push('cjs');

module.exports = config;

