// -----------------------------------------------------------------------------
// Dyslexia-friendly font toggle — loads OpenDyslexic and applies it.
// -----------------------------------------------------------------------------

import { PREFIX } from '../state';
import { register } from './base';

const STYLE_ID = `${PREFIX}-dyslexia-font`;
const HTML_CLASS = `${PREFIX}-dyslexia-font`;

// Known icon / symbol font families to exclude from the override
const ICON_FONT_SELECTORS = [
  '.material-symbols-outlined',
  '.material-icons',
  '.fa',
  '.fab',
  '.fas',
  '.far',
  '.fal',
  '.fad',
  '.bi',
  '[class*=" icon-"]',
  '[class^="icon-"]',
];

register({
  id: 'dyslexiaFont',
  label: 'Fuente Dislexia',
  icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/></svg>',
  section: 'reading',
  type: 'toggle',
  css: [
    `html.${HTML_CLASS},`,
    `html.${HTML_CLASS} *:not(${ICON_FONT_SELECTORS.join('):not(')}) {`,
    '  font-family: "OpenDyslexic", sans-serif !important;',
    '  line-height: 1.6 !important;',
    '}',
  ].join('\n'),
  apply(on: boolean | string) {
    document.documentElement.classList.toggle(HTML_CLASS, !!on);
    const existing = document.getElementById(STYLE_ID) as HTMLStyleElement | null;

    if (on) {
      if (!existing) {
        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = [
          `@font-face {`,
          `  font-family: 'OpenDyslexic';`,
          `  src: url('https://cdn.kaira.io/fonts/OpenDyslexic-Regular.woff2') format('woff2');`,
          `  font-weight: normal;`,
          `  font-style: normal;`,
          `}`,
          `@font-face {`,
          `  font-family: 'OpenDyslexic';`,
          `  src: url('https://cdn.kaira.io/fonts/OpenDyslexic-Bold.woff2') format('woff2');`,
          `  font-weight: bold;`,
          `  font-style: normal;`,
          `}`,
          `html.${HTML_CLASS},`,
          `html.${HTML_CLASS} *:not(.material-symbols-outlined):not(.material-icons):not(.fa):not(.fab):not(.fas):not(.far):not(.fal):not(.fad):not(.bi):not([class*=" icon-"]):not([class^="icon-"]) {`,
          '  font-family: "OpenDyslexic", sans-serif !important;',
          '  line-height: 1.6 !important;',
          '}',
        ].join('\n');
        document.head.appendChild(style);
      }
    } else {
      if (existing) existing.remove();
    }
  },
});
