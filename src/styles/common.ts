import { css } from 'styled-components';

export const visuallyHidden = css`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  border: 0;
`;

export const buttonReset = css`
  padding: 0;
  margin: 0;
  font: inherit;
  color: inherit;
  text-align: inherit;
  cursor: pointer;
  background: none;
  border: none;
`;

export const linkReset = css`
  color: inherit;
  text-decoration: none;
`;
