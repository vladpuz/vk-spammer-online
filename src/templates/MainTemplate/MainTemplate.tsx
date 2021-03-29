import React, { FC } from 'react';
import Footer from './Footer/Footer';
import Header from './Header/Header';
import { Page } from './MainTemplate.styled';

const MainTemplate: FC = ({ children }) => {
  return (
    <Page>
      <Header />
      <main>
        {children}
      </main>
      <Footer />
    </Page>
  );
};

export default MainTemplate;
