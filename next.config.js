const withImages = require('next-images');
const withTranslate = require('next-translate');
const withPWA = require('next-pwa');

module.exports = {
  ...withImages(),
  ...withTranslate(),
  ...withPWA(),
  pwa: {
    dest: 'public',
  },
};
