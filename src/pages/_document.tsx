import React from 'react';
import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () => originalRenderPage({
        enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
      });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html>
        <Head>
          <meta name="description" content="Бесплатный спамер для Вконтакте в окне вашего браузера! Доступна рассылка по личным сообщениям, беседам, стенам, комментариям, обсуждениям." />
          <meta name="keywords" content="спам, спамер, рассылка, вк, вконтакте, бесплатный, онлайн, реклама, spam, spammer, vk, vkontakte, vk-spammer.online, вк-спамер-онлайн" />
          <meta name="theme-color" content="#000000" />
          <meta property="og:type" content="Спамер" />
          <meta property="og:title" content="VK-SPAMMER.ONLINE — Бесплатный спамер для вк" />
          <meta property="og:description" content="Бесплатный спамер для Вконтакте в окне вашего браузера! Доступна рассылка по личным сообщениям, беседам, стенам, коментариям, обсуждениям." />
          <meta property="og:url" content="https://vladislav-puzyrev.github.io/vk-spammer-online/" />
          <meta property="og:image" content="/snippet.png" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" href="/logo192.png" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
