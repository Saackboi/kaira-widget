// Panel open/close + click-outside logic, DOM builders.
// All visual styles are in ui/styles.ts.

import { PREFIX, el } from '../state';
import { LANG } from '../lang';

export function isPanelOpen(): boolean {
  return el.panel!.classList.contains(`${PREFIX}-panel--open`);
}

export function openPanel(): void {
  el.panel!.classList.add(`${PREFIX}-panel--open`);
  el.btn!.setAttribute('aria-expanded', 'true');
  el.btn!.classList.add('is-hidden');
  if (el.backdrop) { el.backdrop.style.opacity = '1'; el.backdrop.style.pointerEvents = 'auto'; }
}

export function closePanel(): void {
  el.panel!.classList.remove(`${PREFIX}-panel--open`);
  el.btn!.setAttribute('aria-expanded', 'false');
  el.btn!.classList.remove('is-hidden');
  if (el.backdrop) { el.backdrop.style.opacity = '0'; el.backdrop.style.pointerEvents = 'none'; }
}

export function togglePanel(): void {
  if (isPanelOpen()) { closePanel(); } else { openPanel(); }
}

export function handleOutsideClick(e: MouseEvent): void {
  if (!el.container || !el.panel) return;
  if (!isPanelOpen()) return;
  const host = document.getElementById('kaira-host');
  if (host && host.contains(e.target as Node)) return;
  closePanel();
}

const logoMarkup = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 160" class="kw-logo">',
  '  <defs><linearGradient id="kg" x1="0%" y1="0%" x2="0%" y2="100%">',
  '    <stop offset="30%" stop-color="#1a1a1a"/>',
  '    <stop offset="100%" stop-color="#8b7355"/>',
  '  </linearGradient></defs>',
  '  <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="Cinzel,serif" font-weight="900" font-size="90" letter-spacing="18" fill="url(#kg)">K A I R A</text>',
  '</svg>',
].join('\n');

export function buildContainer(siteKey: string): HTMLDivElement {
  const c = document.createElement('div');
  c.id = `${PREFIX}-container`;
  if (siteKey) c.dataset.siteKey = siteKey;
  return c;
}

export function buildButton(): HTMLButtonElement {
  const b = document.createElement('button');
  b.id = `${PREFIX}-btn`;
  b.setAttribute('aria-label', LANG.btnAriaLabel);
  b.setAttribute('aria-expanded', 'false');
  b.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="4" r="2"/><path d="M10 22l2-8 2 8"/><path d="M6 12h12"/><path d="M8 7l4 3 4-3"/></svg>';
  b.addEventListener('click', togglePanel);
  return b;
}

export function buildPanel(currentLang: string, onLangChange: (code: string) => void, logoUrl?: string): HTMLDivElement {
  const p = document.createElement('div');
  p.id = `${PREFIX}-panel`;
  p.setAttribute('role', 'dialog');
  p.setAttribute('aria-label', LANG.panelAriaLabel);

  // Header.
  const hdr = document.createElement('div');
  hdr.className = 'kw-hdr';

  const logo = logoUrl
    ? (() => { const img = document.createElement('img'); img.className = 'kw-logo'; img.src = logoUrl; img.alt = 'Logo'; return img; })()
    : new DOMParser().parseFromString(logoMarkup, 'image/svg+xml').documentElement as unknown as SVGElement;

  const tw = document.createElement('div');
  tw.className = 'kw-hdr-wrap';

  const title = document.createElement('span');
  title.className = 'kw-title';
  title.textContent = LANG.panelTitle;
  el.panelTitle = title;

  tw.appendChild(logo);
  tw.appendChild(title);

  // Language selector.
  const sel = document.createElement('select');
  sel.className = 'kw-lang';
  for (const o of [{ v: 'en', t: 'EN' }, { v: 'es', t: 'ES' }]) {
    const opt = document.createElement('option');
    opt.value = o.v; opt.textContent = o.t;
    if (o.v === currentLang) opt.selected = true;
    sel.appendChild(opt);
  }
  sel.addEventListener('change', () => onLangChange(sel.value));

  const cb = document.createElement('button');
  cb.className = 'kw-close';
  cb.innerHTML = '&times;';
  cb.setAttribute('aria-label', LANG.closeBtnAriaLabel);
  cb.addEventListener('click', closePanel);
  el.closeBtn = cb;

  hdr.appendChild(tw);
  hdr.appendChild(sel);
  hdr.appendChild(cb);
  p.appendChild(hdr);

  // Body.
  const body = document.createElement('div');
  body.className = 'kw-body';
  p.appendChild(body);
  el.panelBody = body;

  return p;
}
