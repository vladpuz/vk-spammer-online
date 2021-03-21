import { css } from 'styled-components';

const themes = css`
  [data-theme="light"] {
    --color: #000;
    --background: #fff;
  }

  [data-theme="dark"] {
    --color: #fff;
    --background: #000;
  }

  body {
    color: var(--color);
    background: var(--background);
  }
`;

export default themes;
