import { PREFIX } from '../state';
import { register } from './base';

register({
  id: 'spacing',
  label: 'Espaciado',
  icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/><polyline points="7 3 9 6 7 9"/><polyline points="17 21 15 18 17 15"/></svg>',
  section: 'reading',
  type: 'toggle',
  css: [
    `body.${PREFIX}-spacing {`,
    '  letter-spacing: 0.12em !important;',
    '  line-height: 1.8 !important;',
    '  word-spacing: 0.16em !important;',
    '}',
  ].join('\n'),
  apply(on: boolean | string) {
    document.body.classList.toggle(`${PREFIX}-spacing`, !!on);
  },
});
