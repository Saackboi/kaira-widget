import { PREFIX } from '../state';
import { register } from './base';
import { LANG } from '../lang';

register({
  id: 'contrast',
  label: LANG.controls.contrast,
  icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 0 20z"/></svg>',
  section: 'vision',
  type: 'toggle',
  css: [
    `html.${PREFIX}-contrast {`,
    '  filter: contrast(1.5) !important;',
    '}',
  ].join('\n'),
  apply(on: boolean | string) {
    document.documentElement.classList.toggle(`${PREFIX}-contrast`, !!on);
  },
});
