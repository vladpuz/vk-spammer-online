import React from 'react';
import Head from 'next/head';
import MainTemplate from '../templates/MainTemplate/MainTemplate';

const HomePage = () => {
  return (
    <MainTemplate>
      <Head>
        <title>Спамер</title>
      </Head>
      <h1>Спамер</h1>
    </MainTemplate>
  );
};

export default HomePage;
