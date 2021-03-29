import { css } from 'styled-components';

const themes = css`
  [data-theme="light"] {
    --color-header: #24292e;
    --color-header-text: #fff;
    --color-text-hover: #bebfc1;
    --color-bg-primary: #fff;
    --color-bg-secondary: #f6f8fa;
    --color-border: #e1e4e8;
    --color-text-primary: #24292e;
    --color-text-secondary: #586069;
    --color-link: #0366d6;
  }

  [data-theme="dark"] {
    --color-header: #161b22;
    --color-header-text: #f0f6fc;
    --color-text-hover: #f0f6fcb3;
    --color-bg-primary: #0d1117;
    --color-bg-secondary: #161b22;
    --color-border: #30363d;
    --color-text-primary: #c9d1d9;
    --color-text-secondary: #8b949e;
    --color-link: #58a6ff;
  }
`;

export default themes;
