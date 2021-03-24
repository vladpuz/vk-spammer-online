import { css } from 'styled-components';

const focus = css`
  *:focus {
    outline: none;
  }

  *:focus-visible {
    outline: var(--color) auto 5px;
  }
`;

export default focus;
