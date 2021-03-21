import { createGlobalStyle } from 'styled-components';
import themes from './themes';
import focus from './focus';

const GlobalStyles = createGlobalStyle`
  ${themes}
  ${focus}
`;

export default GlobalStyles;
