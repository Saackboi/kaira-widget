import { PREFIX } from '../state';
import { register } from './base';
import { LANG } from '../lang';

register({
  id: 'largeCursor',
  label: LANG.controls.largeCursor,
  icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3l14 9-7 2-3 7z"/></svg>',
  section: 'vision',
  type: 'toggle',
  css: [
    `html.${PREFIX}-large-cursor,`,
    `html.${PREFIX}-large-cursor *,`,
    `html.${PREFIX}-large-cursor *::before,`,
    `html.${PREFIX}-large-cursor *::after {`,
    '  cursor: url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'32\' viewBox=\'0 0 32 32\'%3E%3Cpolygon points=\'4,3 4,26 11,19 18,28 21,25 14,16 25,16\' fill=\'%23000\' stroke=\'%23fff\' stroke-width=\'2\' stroke-linejoin=\'round\'/%3E%3C/svg%3E") 4 3, auto !important;',
    '}',
  ].join('\n'),
  apply(on: boolean | string) {
    document.documentElement.classList.toggle(`${PREFIX}-large-cursor`, !!on);
  },
});
