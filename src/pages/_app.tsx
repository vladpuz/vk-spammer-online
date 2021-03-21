import React from 'react';
import { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
import GlobalStyles from '../styles';
import 'reset.css';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <ThemeProvider>
      <GlobalStyles />
      <Component {...pageProps} />
    </ThemeProvider>
  );
};

export default MyApp;
