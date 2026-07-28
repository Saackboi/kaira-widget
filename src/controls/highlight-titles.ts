// Adds background color and outline to all h1-h6 headings.

import { PREFIX } from '../state';
import { register } from './base';
import { LANG } from '../lang';

register({
  id: 'highlightTitles',
  label: LANG.controls.highlightTitles,
  icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4v16"/><path d="M18 4v16"/><path d="M4 20h16"/><path d="M4 4h16"/></svg>',
  section: 'navigation',
  type: 'toggle',
  css: [
    `html.${PREFIX}-highlight-titles h1,`,
    `html.${PREFIX}-highlight-titles h2,`,
    `html.${PREFIX}-highlight-titles h3,`,
    `html.${PREFIX}-highlight-titles h4,`,
    `html.${PREFIX}-highlight-titles h5,`,
    `html.${PREFIX}-highlight-titles h6 {`,
    '  background-color: #fef3c7 !important;',
    '  color: #92400e !important;',
    '  outline: 2px solid #f59e0b !important;',
    '  outline-offset: 2px !important;',
    '  padding: 4px 8px !important;',
    '  border-radius: 4px !important;',
    '}',
  ].join('\n'),
  apply(on: boolean | string) {
    document.documentElement.classList.toggle(`${PREFIX}-highlight-titles`, !!on);
  },
});
