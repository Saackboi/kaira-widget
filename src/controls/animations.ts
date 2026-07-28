import { PREFIX } from '../state';
import { register } from './base';
import { LANG } from '../lang';

register({
  id: 'animations',
  label: LANG.controls.animations,
  icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>',
  section: 'navigation',
  type: 'toggle',
  css: [
    `html.${PREFIX}-paused *,`,
    `html.${PREFIX}-paused *::before,`,
    `html.${PREFIX}-paused *::after {`,
    '  animation: none !important;',
    '  transition: none !important;',
    '}',
  ].join('\n'),
  apply(on: boolean | string) {
    document.documentElement.classList.toggle(`${PREFIX}-paused`, !!on);
  },
});
