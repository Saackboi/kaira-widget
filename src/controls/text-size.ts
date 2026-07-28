// Text sizing control with + / - buttons and 4 levels [16, 18, 20, 22]px.

import { TEXT_SIZE_LEVELS, pref, el, savePrefs } from '../state';
import { register } from './base';
import { LANG } from '../lang';

export function applyTextSize(level: number): void {
  if (level === 0) {
    document.documentElement.style.removeProperty('font-size');
  } else {
    const size = TEXT_SIZE_LEVELS[level] ?? 16;
    document.documentElement.style.fontSize = `${size}px`;
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
    const row = document.createElement('div');
    row.style.cssText = [
      'display:flex;align-items:center;justify-content:space-between;',
      'padding:10px 16px;',
    ].join('');

    const labelWrap = document.createElement('span');
    labelWrap.style.cssText = 'display:flex;align-items:center;gap:10px;font-size:14px;color:#374151;';
    const iconSpan = document.createElement('span');
    iconSpan.style.cssText = 'width:20px;height:20px;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:#374151;';
    iconSpan.innerHTML = this.icon;
    labelWrap.appendChild(iconSpan);
    const textSpan = document.createElement('span');
    textSpan.textContent = LANG.controls.textSize;
    labelWrap.appendChild(textSpan);

    const controls = document.createElement('div');
    controls.style.cssText = 'display:flex;align-items:center;gap:6px;';

    const minusBtn = document.createElement('button');
    minusBtn.textContent = '\u2212';
    minusBtn.setAttribute('aria-label', LANG.textSizeDecrease);
    const btnBaseStyle = [
      'width:30px;height:30px;border-radius:6px;border:1px solid #d1d5db;',
      'background:#fff;cursor:pointer;font-size:16px;font-weight:600;',
      'display:flex;align-items:center;justify-content:center;color:#374151;',
    ].join('');
    minusBtn.style.cssText = btnBaseStyle;

    const display = document.createElement('span');
    display.style.cssText = 'min-width:36px;text-align:center;font-size:13px;font-weight:500;color:#6b7280;';
    el.textSizeDisplay = display;

    const plusBtn = document.createElement('button');
    plusBtn.textContent = '+';
    plusBtn.setAttribute('aria-label', LANG.textSizeIncrease);
    plusBtn.style.cssText = btnBaseStyle;

    minusBtn.addEventListener('click', () => changeTextSize(-1));
    plusBtn.addEventListener('click', () => changeTextSize(1));

    controls.appendChild(minusBtn);
    controls.appendChild(display);
    controls.appendChild(plusBtn);

    row.appendChild(labelWrap);
    row.appendChild(controls);

    syncUI();
    return row;
  },
});
