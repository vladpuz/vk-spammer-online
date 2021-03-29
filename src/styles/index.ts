import { createGlobalStyle } from 'styled-components';
import themes from './themes';
import fonts from './fonts';
import focus from './focus';
import global from './global';

const GlobalStyles = createGlobalStyle`
  ${themes}
  ${fonts}
  ${focus}
  ${global}
`;

export default GlobalStyles;
