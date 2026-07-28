// -----------------------------------------------------------------------------
// Shows a floating tooltip with the image alt text while hovering over <img>
// elements, so users who cannot perceive the visual content know what the
// image conveys. Falls back to the filename when no alt is present.
// -----------------------------------------------------------------------------

import { PREFIX } from '../state';
import { register } from './base';

const TOOLTIP_ID = `${PREFIX}-img-tooltip`;

register({
  id: 'hideImages',
  label: 'Describir Imágenes',
  icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
  section: 'navigation',
  type: 'toggle',
  css: [
    `#${TOOLTIP_ID} {`,
    '  position: fixed; z-index: 999999;',
    '  background: #1f2937; color: #fff;',
    '  padding: 6px 10px; border-radius: 6px;',
    '  font-size: 13px; line-height: 1.4;',
    '  max-width: 300px; pointer-events: none;',
    '  box-shadow: 0 2px 10px rgba(0,0,0,0.3);',
    '  display: none; white-space: pre-wrap; word-break: break-word;',
    '}',
  ].join('\n'),
  apply(on: boolean | string) {
    const active = !!on;
    let tooltip = document.getElementById(TOOLTIP_ID) as HTMLDivElement | null;
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.id = TOOLTIP_ID;
      document.body.appendChild(tooltip);
    }

    if (active) {
      let prev: HTMLImageElement | null = null;

      const handler = (e: MouseEvent) => {
        if (!tooltip) return;
        const img = (e.target as HTMLElement).closest('img') as HTMLImageElement | null;

        if (img && img !== prev) {
          prev = img;
          const alt = img.getAttribute('alt') ?? '';
          tooltip.textContent = alt || '[Imagen sin descripción]';
          if (!alt) {
            const file = img.src.split('/').pop() || '';
            if (file) tooltip.textContent += ` (${file})`;
          }
          tooltip.style.display = 'block';
        } else if (!img && prev) {
          prev = null;
          tooltip.style.display = 'none';
        }

        if (tooltip.style.display === 'block') {
          let x = e.clientX + 12;
          let y = e.clientY + 12;
          if (x + 300 > window.innerWidth) x = window.innerWidth - 310;
          if (y + 100 > window.innerHeight) y = e.clientY - 60;
          tooltip.style.left = `${x}px`;
          tooltip.style.top = `${y}px`;
        }
      };

      (tooltip as unknown as Record<string, unknown>)._handler = handler;
      document.addEventListener('mousemove', handler);
    } else {
      const h = (tooltip as unknown as Record<string, unknown>)._handler as ((e: MouseEvent) => void) | undefined;
      if (h) document.removeEventListener('mousemove', h);
      tooltip.style.display = 'none';
      delete (tooltip as unknown as Record<string, unknown>)._handler;
    }
  },
});
