import React from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import { useTheme } from 'next-themes';

const Title = styled.h1`
  color: gold;
`;

const HomePage = () => {
  const { theme, setTheme } = useTheme();

  return (
    <>
      <Head>
        <title>Спамер</title>
      </Head>
      <Title>VK-SPAMMER.ONLINE</Title>
      <div>
        <span>{`The current theme is: ${theme}`}</span>
        <button type="button" onClick={() => setTheme('light')}>Light Mode</button>
        <button type="button" onClick={() => setTheme('dark')}>Dark Mode</button>
      </div>
    </>
  );
};

export default HomePage;
