// -----------------------------------------------------------------------------
// Dark contrast mode — inverts colors for better readability in low light.
// -----------------------------------------------------------------------------

import { PREFIX } from '../state';
import { register } from './base';

register({
  id: 'darkContrast',
  label: 'Contraste Oscuro',
  icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
  section: 'vision',
  type: 'toggle',
  css: [
    `html.${PREFIX}-dark-contrast {`,
    '  filter: invert(1) hue-rotate(180deg) !important;',
    '}',
    // Un-invert images and videos so they stay natural
    `html.${PREFIX}-dark-contrast img,`,
    `html.${PREFIX}-dark-contrast video,`,
    `html.${PREFIX}-dark-contrast canvas {`,
    '  filter: invert(1) hue-rotate(180deg) !important;',
    '}',
  ].join('\n'),
  apply(on: boolean | string) {
    document.documentElement.classList.toggle(`${PREFIX}-dark-contrast`, !!on);
  },
});
