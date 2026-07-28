// Text sizing control with + / - buttons and 4 levels [16, 18, 20, 22]px.

import { TEXT_SIZE_LEVELS, pref, el, savePrefs } from '../state';
import { register } from './base';
import { LANG } from '../lang';
import { textSizeHTML } from '../ui/templates';

export function applyTextSize(level: number): void {
  if (level === 0) {
    document.documentElement.style.removeProperty('font-size');
  } else {
    document.documentElement.style.fontSize = `${TEXT_SIZE_LEVELS[level] ?? 16}px`;
  }
}

function changeTextSize(delta: number): void {
  let next = pref.textSize + delta;
  if (next < 0) next = TEXT_SIZE_LEVELS.length - 1;
  if (next >= TEXT_SIZE_LEVELS.length) next = 0;
  pref.textSize = next;
  applyTextSize(pref.textSize);
  syncUI();
  savePrefs();
}

function syncUI(): void {
  if (!el.textSizeDisplay) return;
  el.textSizeDisplay.textContent =
    pref.textSize > 0 ? `${pref.textSize}/${TEXT_SIZE_LEVELS.length - 1}` : 'Off';
}

register({
  id: 'textSize',
  label: LANG.controls.textSize,
  icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/></svg>',
  section: 'reading',
  type: 'toggle',
  apply(_on: boolean | string) { /* text-size uses custom UI, not this toggle */ },
  buildUI() {
    const display = pref.textSize > 0 ? `${pref.textSize}/${TEXT_SIZE_LEVELS.length - 1}` : 'Off';
    const html = textSizeHTML(
      this.icon,
      LANG.controls.textSize,
      LANG.textSizeDecrease,
      LANG.textSizeIncrease,
      display,
    );
    const row = document.createElement('div');
    row.innerHTML = html;

    const minus = row.querySelector('.kw-tsize-btn:first-child') as HTMLButtonElement;
    const plus = row.querySelector('.kw-tsize-btn:last-child') as HTMLButtonElement;
    el.textSizeDisplay = row.querySelector('.kw-tsize-disp') as HTMLSpanElement;

    minus.addEventListener('click', () => changeTextSize(-1));
    plus.addEventListener('click', () => changeTextSize(1));

    return row.firstElementChild as HTMLElement;
  },
});
