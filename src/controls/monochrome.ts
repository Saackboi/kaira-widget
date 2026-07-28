// -----------------------------------------------------------------------------
// Monochrome/grayscale mode — strips all color from the page.
// -----------------------------------------------------------------------------

import { PREFIX } from '../state';
import { register } from './base';

register({
  id: 'monochrome',
  label: 'Monocromo',
  icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 0 0 20z"/></svg>',
  section: 'vision',
  type: 'toggle',
  css: [
    `html.${PREFIX}-monochrome {`,
    '  filter: grayscale(1) !important;',
    '}',
  ].join('\n'),
  apply(on: boolean | string) {
    document.documentElement.classList.toggle(`${PREFIX}-monochrome`, !!on);
  },
});
