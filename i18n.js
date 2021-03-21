module.exports = {
  locales: ['en', 'ru'],
  defaultLocale: 'ru',
  pages: {
    '*': ['common'],
  },
  loadLocaleFrom: (lang, ns) => import(`./src/locales/${lang}/${ns}.json`).then((m) => m.default),
};
