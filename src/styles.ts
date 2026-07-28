// Collects all CSS from base styles and control-level rules into one <style> tag.

import { PREFIX } from './state';
import { registry } from './controls/base';

export function injectStyles(): void {
  const style = document.createElement('style');
  style.textContent = [
    `#${PREFIX}-panel { display:none; }`,
    `#${PREFIX}-panel.${PREFIX}-panel--open {`,
    '  display:block;',
    `  animation:${PREFIX}SlideUp 0.25s ease;`,
    '}',
    `@keyframes ${PREFIX}SlideUp {`,
    '  from { opacity:0; transform:translateY(8px); }',
    '  to   { opacity:1; transform:translateY(0); }',
    '}',
    '',
    ...registry.filter((c) => c.css).map((c) => c.css!),
  ].join('\n');
  document.head.appendChild(style);
}
