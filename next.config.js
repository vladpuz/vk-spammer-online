const withPWA = require('next-pwa');
const withTranslate = require('next-translate');
const withImages = require('next-images');

const env = process.env.NODE_ENV;

module.exports = {
  ...withPWA(),
  ...withTranslate(),
  ...withImages(),
  pwa: {
    dest: 'public',
    disable: env === 'development',
  },
};
