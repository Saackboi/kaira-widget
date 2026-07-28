// Dims the page with a spotlight on the focused element for keyboard navigation.

import { PREFIX, el } from '../state';
import { register } from './base';
import { LANG } from '../lang';

const OVERLAY_ID = `${PREFIX}-focus-overlay`;

type MaskableStyle = CSSStyleDeclaration & { webkitMaskImage: string; maskImage: string };

function setMask(el: HTMLElement, value: string): void {
  const s = el.style as MaskableStyle;
  s.webkitMaskImage = value;
  s.maskImage = value;
}

function updateSpotlight(overlay: HTMLElement): void {
  const active = document.activeElement;
  if (!active || active === document.body || active === document.documentElement) {
    setMask(overlay, 'none');
    return;
  }
  const rect = active.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const radius = Math.max(rect.width, rect.height) * 1.5 + 60;
  const edge = radius * 0.7;
  setMask(
    overlay,
    `radial-gradient(circle ${radius}px at ${cx}px ${cy}px, transparent 0px, transparent ${edge}px, rgba(0,0,0,1) ${radius}px)`,
  );
}

register({
  id: 'superFocus',
  label: LANG.controls.superFocus,
  icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v4"/><path d="M12 18v4"/><path d="M2 12h4"/><path d="M18 12h4"/></svg>',
  section: 'navigation',
  type: 'toggle',
  css: [
    `#${OVERLAY_ID} {`,
    '  position: fixed; inset: 0; z-index: 999997;',
    '  background: rgba(0, 0, 0, 0.5);',
    '  pointer-events: none;',
    '  -webkit-mask-image: none;',
    '  mask-image: none;',
    '  transition: -webkit-mask-image 0.15s ease, mask-image 0.15s ease;',
    '}',
    `html.${PREFIX}-super-focus *:focus {`,
    '  outline: 3px solid #fbbf24 !important;',
    '  outline-offset: 3px !important;',
    '  box-shadow: 0 0 0 6px rgba(251, 191, 36, 0.3) !important;',
    '}',
  ].join('\n'),
  apply(on: boolean | string) {
    const active = !!on;
    document.documentElement.classList.toggle(`${PREFIX}-super-focus`, active);

    if (active) {
      let overlay = document.getElementById(OVERLAY_ID) as HTMLDivElement | null;
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = OVERLAY_ID;
        document.body.appendChild(overlay);
        el.focusOverlay = overlay;
      }
      overlay.style.display = 'block';

      updateSpotlight(overlay);

      if (!el.focusHandler) {
        el.focusHandler = () => {
          if (overlay) updateSpotlight(overlay);
        };
        document.addEventListener('focusin', el.focusHandler);
      }
    } else {
      if (el.focusOverlay) {
        el.focusOverlay.style.display = 'none';
        setMask(el.focusOverlay, 'none');
      }
      if (el.focusHandler) {
        document.removeEventListener('focusin', el.focusHandler);
        el.focusHandler = null;
      }
    }
  },
});
