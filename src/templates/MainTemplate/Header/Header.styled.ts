import styled from 'styled-components';

export const Heading = styled.header`
  display: grid;
  grid-auto-flow: column;
  align-items: center;
  padding: 8px;
  background: var(--color-header);
  border: 1px solid green;
`;

export const Left = styled.div`
  display: grid;
  justify-content: flex-start;
  border: 1px solid gold;
`;

export const LogoLink = styled.a`
  display: grid;
  grid-auto-flow: column;
  border: 1px solid red;
`;

export const LogoText = styled.div`
  display: grid;
`;

export const Right = styled.div`
  display: grid;
  border: 1px solid blue;
`;
