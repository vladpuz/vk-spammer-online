import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import LogoImage from '../../../assets/images/logo.png';
import { Heading, Left, Right, LogoLink, LogoText } from './Header.styled';

const Header = () => {
  return (
    <Heading>
      <Link href="/">
        <Left>
          <LogoLink>
            <Image
              src={LogoImage}
              alt="Надпись VK"
              height={50}
              width={70}
            />
            <LogoText>
              <span>VK-SPAMER.ONLINE</span>
              <span>БЕСПЛАТНЫЙ СПАМЕР ДЛЯ ВК</span>
            </LogoText>
          </LogoLink>
        </Left>
      </Link>
      <Right>
        Right
      </Right>
    </Heading>
  );
};

export default Header;
