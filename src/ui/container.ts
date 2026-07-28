// Floating button, panel dialog, language selector, and open/close/outside-click handlers.

import { PREFIX, el } from '../state';
import { LANG } from '../lang';

export function isPanelOpen(): boolean {
  return el.panel!.classList.contains(`${PREFIX}-panel--open`);
}

export function openPanel(): void {
  el.panel!.classList.add(`${PREFIX}-panel--open`);
  el.btn!.setAttribute('aria-expanded', 'true');
}

export function closePanel(): void {
  el.panel!.classList.remove(`${PREFIX}-panel--open`);
  el.btn!.setAttribute('aria-expanded', 'false');
}

export function togglePanel(): void {
  if (isPanelOpen()) {
    closePanel();
  } else {
    openPanel();
  }
}

// Close the panel when clicking outside the widget container.
export function handleOutsideClick(e: MouseEvent): void {
  if (!el.container || !el.panel) return;
  if (!isPanelOpen()) return;
  if (!el.container.contains(e.target as Node)) {
    closePanel();
  }
}

// Fixed-position wrapper that holds the button and panel.
export function buildContainer(siteKey: string): HTMLDivElement {
  const c = document.createElement('div');
  c.id = `${PREFIX}-container`;
  if (siteKey) c.dataset.siteKey = siteKey;
  c.style.cssText = [
    'position:fixed;bottom:20px;right:20px;',
    'z-index:999999;',
    'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,sans-serif;',
  ].join('');
  return c;
}

// Floating accessibility icon button with hover animation.
export function buildButton(): HTMLButtonElement {
  const b = document.createElement('button');
  b.id = `${PREFIX}-btn`;
  b.setAttribute('aria-label', LANG.btnAriaLabel);
  b.setAttribute('aria-expanded', 'false');
  b.innerHTML = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24"',
    '  fill="none" stroke="currentColor" stroke-width="2"',
    '  stroke-linecap="round" stroke-linejoin="round">',
    '  <circle cx="12" cy="4" r="2"/>',
    '  <path d="M10 22l2-8 2 8"/>',
    '  <path d="M6 12h12"/>',
    '  <path d="M8 7l4 3 4-3"/>',
    '</svg>',
  ].join('');
  b.style.cssText = [
    'width:50px;height:50px;border-radius:50%;border:none;',
    'background:#1a1a2e;color:#fff;cursor:pointer;',
    'display:flex;align-items:center;justify-content:center;',
    'box-shadow:0 2px 12px rgba(0,0,0,0.25);',
    'transition:transform 0.2s ease,box-shadow 0.2s ease;',
    'margin-left:auto;',
  ].join('');

  b.addEventListener('mouseenter', () => {
    b.style.transform = 'scale(1.1)';
    b.style.boxShadow = '0 4px 16px rgba(0,0,0,0.35)';
  });
  b.addEventListener('mouseleave', () => {
    b.style.transform = 'scale(1)';
    b.style.boxShadow = '0 2px 12px rgba(0,0,0,0.25)';
  });
  b.addEventListener('click', togglePanel);
  return b;
}

// Slide-up panel dialog with sticky header, language selector, and close button.
export function buildPanel(currentLang: string, onLangChange: (code: string) => void): HTMLDivElement {
  const p = document.createElement('div');
  p.id = `${PREFIX}-panel`;
  p.setAttribute('role', 'dialog');
  p.setAttribute('aria-label', LANG.panelAriaLabel);
  p.style.cssText = [
    'position:absolute;bottom:60px;right:0;width:clamp(320px,35vw,480px);max-height:min(80vh,600px);',
    'background:#fff;border-radius:14px;',
    'box-shadow:0 4px 24px rgba(0,0,0,0.15);',
    'overflow-y:auto;overflow-x:hidden;',
  ].join('');

  const header = document.createElement('div');
  header.style.cssText = [
    'display:flex;align-items:center;padding:14px 20px;border-bottom:1px solid #e5e7eb;',
    'position:sticky;top:0;background:#fff;z-index:1;',
  ].join('');

  const title = document.createElement('span');
  title.textContent = LANG.panelTitle;
  title.style.cssText = 'font-size:16px;font-weight:600;color:#111827;';

  // Language selector dropdown.
  const langSelect = document.createElement('select');
  langSelect.style.cssText = [
    'margin:0 10px 0 auto;font-size:13px;border:1px solid #d1d5db;',
    'border-radius:4px;padding:2px 4px;background:#fff;',
    'color:#374151;cursor:pointer;font-family:inherit;',
  ].join('');
  const options = [
    { value: 'en', label: 'EN' },
    { value: 'es', label: 'ES' },
  ];
  for (const opt of options) {
    const option = document.createElement('option');
    option.value = opt.value;
    option.textContent = opt.label;
    if (opt.value === currentLang) option.selected = true;
    langSelect.appendChild(option);
  }
  langSelect.addEventListener('change', () => onLangChange(langSelect.value));

  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '&times;';
  closeBtn.setAttribute('aria-label', LANG.closeBtnAriaLabel);
  closeBtn.style.cssText = [
    'background:none;border:none;font-size:22px;cursor:pointer;',
    'color:#6b7280;padding:0;line-height:1;margin-left:4px;',
  ].join('');
  closeBtn.addEventListener('click', closePanel);

  header.appendChild(title);
  header.appendChild(langSelect);
  header.appendChild(closeBtn);
  p.appendChild(header);

  const body = document.createElement('div');
  body.style.cssText = 'padding:6px 0 8px;';
  p.appendChild(body);
  el.panelBody = body;

  return p;
}
