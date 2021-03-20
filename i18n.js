module.exports = {
  locales: ['en', 'ru'],
  defaultLocale: 'ru',
  pages: {},
  loadLocaleFrom: (lang, ns) => import(`./src/locales/${lang}/${ns}.json`).then((m) => m.default),
};
