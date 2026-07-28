// Adds underline, blue color, and background to every <a> element.

import { PREFIX } from '../state';
import { register } from './base';
import { LANG } from '../lang';

register({
  id: 'highlightLinks',
  label: LANG.controls.highlightLinks,
  icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
  section: 'navigation',
  type: 'toggle',
  css: [
    `html.${PREFIX}-highlight-links a {`,
    '  text-decoration: underline !important;',
    '  text-decoration-color: #2563eb !important;',
    '  text-decoration-thickness: 2px !important;',
    '  color: #1d4ed8 !important;',
    '  background-color: #eff6ff !important;',
    '  padding: 0 2px !important;',
    '  border-radius: 2px !important;',
    '}',
  ].join('\n'),
  apply(on: boolean | string) {
    document.documentElement.classList.toggle(`${PREFIX}-highlight-links`, !!on);
  },
});
