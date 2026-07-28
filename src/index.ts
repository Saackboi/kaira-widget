import {
  PREFIX,
  pref,
  el,
  loadPrefs,
  savePrefs,
} from './state';
import { registry, type Control, type ControlSection } from './controls/base';
import { applyTextSize as applyTextSizeFn } from './controls/text-size';

import './controls/contrast';
import './controls/spacing';
import './controls/reading-guide';
import './controls/animations';
import './controls/large-cursor';

import './controls/monochrome';
import './controls/dark-contrast';
import './controls/saturation';
import './controls/dyslexia-font';
import './controls/highlight-links';
import './controls/highlight-titles';
import './controls/super-focus';
import './controls/hide-images';
import './controls/profiles';

(function () {
  'use strict';

  const currentScript = document.currentScript as HTMLScriptElement | null;
  const SITE_KEY: string = currentScript?.getAttribute('data-site-key') || '';

  /* ------------------------------------------------------------------ */
  /*  Panel open / close                                                 */
  /* ------------------------------------------------------------------ */

  function openPanel(): void {
    el.panel!.classList.add(`${PREFIX}-panel--open`);
    el.btn!.setAttribute('aria-expanded', 'true');
  }

  function closePanel(): void {
    el.panel!.classList.remove(`${PREFIX}-panel--open`);
    el.btn!.setAttribute('aria-expanded', 'false');
  }

  function togglePanel(): void {
    if (el.panel!.classList.contains(`${PREFIX}-panel--open`)) {
      closePanel();
    } else {
      openPanel();
    }
  }

  /* ------------------------------------------------------------------ */
  /*  Outside-click handler                                              */
  /* ------------------------------------------------------------------ */

  function handleOutsideClick(e: MouseEvent): void {
    if (!el.container || !el.panel) return;
    if (!el.panel.classList.contains(`${PREFIX}-panel--open`)) return;
    if (!el.container.contains(e.target as Node)) {
      closePanel();
    }
  }

  /* ------------------------------------------------------------------ */
  /*  DOM builders                                                       */
  /* ------------------------------------------------------------------ */

  function buildContainer(): HTMLDivElement {
    const c = document.createElement('div');
    c.id = `${PREFIX}-container`;
    if (SITE_KEY) c.dataset.siteKey = SITE_KEY;
    c.style.cssText = [
      'position:fixed;bottom:20px;right:20px;',
      'z-index:999999;',
      'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,sans-serif;',
    ].join('');
    return c;
  }

  function buildButton(): HTMLButtonElement {
    const b = document.createElement('button');
    b.id = `${PREFIX}-btn`;
    b.setAttribute('aria-label', 'Opciones de accesibilidad');
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

  function buildPanel(): HTMLDivElement {
    const p = document.createElement('div');
    p.id = `${PREFIX}-panel`;
    p.setAttribute('role', 'dialog');
    p.setAttribute('aria-label', 'Panel de accesibilidad');
    p.style.cssText = [
      'position:absolute;bottom:60px;right:0;width:clamp(320px,35vw,480px);max-height:min(80vh,600px);',
      'background:#fff;border-radius:14px;',
      'box-shadow:0 4px 24px rgba(0,0,0,0.15);',
      'overflow-y:auto;overflow-x:hidden;',
    ].join('');

    const header = document.createElement('div');
    header.style.cssText = [
      'display:flex;align-items:center;justify-content:space-between;',
      'padding:14px 20px;border-bottom:1px solid #e5e7eb;',
      'position:sticky;top:0;background:#fff;z-index:1;',
    ].join('');

    const title = document.createElement('span');
    title.textContent = 'Accesibilidad';
    title.style.cssText = 'font-size:16px;font-weight:600;color:#111827;';

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.setAttribute('aria-label', 'Cerrar panel');
    closeBtn.style.cssText = [
      'background:none;border:none;font-size:22px;cursor:pointer;',
      'color:#6b7280;padding:0;line-height:1;',
    ].join('');
    closeBtn.addEventListener('click', closePanel);

    header.appendChild(title);
    header.appendChild(closeBtn);
    p.appendChild(header);

    const body = document.createElement('div');
    body.style.cssText = 'padding:6px 0 8px;';
    p.appendChild(body);
    el.panelBody = body;

    return p;
  }

  const SECTION_LABELS: Record<ControlSection, string> = {
    vision: 'Visión',
    reading: 'Lectura',
    navigation: 'Navegación',
  };

  function buildTileControl(control: Control): HTMLElement {
    const tile = document.createElement('button');
    tile.setAttribute('aria-label', control.label);
    tile.style.cssText = [
      'display:flex;flex-direction:column;align-items:center;gap:4px;',
      'padding:12px 6px;border-radius:10px;border:1px solid #e5e7eb;',
      'background:#fff;cursor:pointer;transition:all 0.15s;',
      'font-family:inherit;font-size:inherit;',
      'min-width:0;',
    ].join('');

    const iconWrap = document.createElement('span');
    iconWrap.style.cssText = 'display:flex;color:#374151;width:20px;height:20px;align-items:center;justify-content:center;';
    iconWrap.innerHTML = control.icon;
    tile.appendChild(iconWrap);

    const label = document.createElement('span');
    label.textContent = control.label;
    label.style.cssText = 'font-size:11px;font-weight:500;color:#1f2937;text-align:center;line-height:1.2;';
    tile.appendChild(label);

    const stateBadge = document.createElement('span');
    stateBadge.style.cssText = [
      'font-size:9px;font-weight:600;padding:1px 6px;border-radius:4px;',
      'color:#9ca3af;background:#f3f4f6;transition:all 0.15s;',
    ].join('');
    stateBadge.textContent = 'Off';
    tile.appendChild(stateBadge);

    tile.addEventListener('mouseenter', () => {
      const key = control.id as keyof typeof pref;
      const val = pref[key];
      const wasActive = control.type === 'cycle' ? val !== 'off' : val === true || (typeof val === 'number' && val > 0);
      tile.style.background = wasActive ? '#dde3ff' : '#f3f4f6';
      tile.style.borderColor = wasActive ? '#1a1a2e' : '#d1d5db';
    });
    tile.addEventListener('mouseleave', () => {
      const key = control.id as keyof typeof pref;
      const val = pref[key];
      const isActive = control.type === 'cycle' ? val !== 'off' : val === true || (typeof val === 'number' && val > 0);
      tile.style.background = isActive ? '#eef2ff' : '#fff';
      tile.style.borderColor = isActive ? '#1a1a2e' : '#e5e7eb';
    });

    tile.addEventListener('click', () => {
      const key = control.id as keyof typeof pref;
      const current = pref[key];

      if (control.type === 'cycle') {
        if (control.cycleNext) {
          control.cycleNext();
        }
      } else {
        const newVal = !current as boolean;
        (pref as unknown as Record<string, unknown>)[key] = newVal;
        control.apply(newVal as boolean);
      }

      savePrefs();
      updateTileState(tile, stateBadge, control);
    });

    el.toggles[control.id] = { row: tile, slider: null as unknown as HTMLElement, dot: null as unknown as HTMLElement };

    return tile;
  }

  function updateTileState(tile: HTMLElement, badge: HTMLElement, control: Control): void {
    const key = control.id as keyof typeof pref;
    const val = pref[key];

    const isActive = control.type === 'cycle'
      ? val !== 'off'
      : val === true || (typeof val === 'number' && val > 0);

    if (isActive) {
      tile.style.borderColor = '#1a1a2e';
      tile.style.background = '#eef2ff';
      badge.style.background = '#1a1a2e';
      badge.style.color = '#fff';
    } else {
      tile.style.borderColor = '#e5e7eb';
      tile.style.background = '#fff';
      badge.style.background = '#f3f4f6';
      badge.style.color = '#9ca3af';
    }

    if (control.type === 'cycle') {
      badge.textContent = String(val).charAt(0).toUpperCase() + String(val).slice(1);
    } else if (typeof val === 'number' && val > 0) {
      badge.textContent = `Nv ${val}`;
    } else {
      badge.textContent = isActive ? 'On' : 'Off';
    }
  }

  function buildSection(section: ControlSection): HTMLElement | null {
    const controls = registry.filter((c) => c.section === section && c.id !== 'profiles');
    if (controls.length === 0) return null;

    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'margin-top:4px;';

    const header = document.createElement('div');
    header.style.cssText = 'display:flex;align-items:center;gap:6px;padding:10px 16px 6px;';

    const sectionTitle = document.createElement('span');
    sectionTitle.textContent = SECTION_LABELS[section];
    sectionTitle.style.cssText = 'font-size:11px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;';
    header.appendChild(sectionTitle);
    wrapper.appendChild(header);

    const grid = document.createElement('div');
    grid.style.cssText = 'display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:4px 20px;';

    // Profiles are always rendered as a full-width section first (custom buildUI)
    // For regular controls, render 4-per-row tiles
    // textSize is special — it uses buildUI
    for (const control of controls) {
      if (control.buildUI) {
        const customEl = control.buildUI()!;
        customEl.style.gridColumn = '1 / -1';
        customEl.style.marginBottom = '4px';
        grid.appendChild(customEl);
      } else {
        const tile = buildTileControl(control);
        grid.appendChild(tile);
      }
    }

    wrapper.appendChild(grid);
    return wrapper;
  }

  function buildProfilesSection(): HTMLElement | null {
    const profileControl = registry.find((c) => c.id === 'profiles');
    if (!profileControl || !profileControl.buildUI) return null;
    return profileControl.buildUI()!;
  }

  /* ------------------------------------------------------------------ */
  /*  Init                                                               */
  /* ------------------------------------------------------------------ */

  function init(): void {
    if (document.getElementById(`${PREFIX}-container`)) return;

    loadPrefs();

    el.container = buildContainer();
    el.panel = buildPanel();
    el.container.appendChild(el.panel);

    // Profiles section (full-width, always first)
    const profilesSection = buildProfilesSection();
    if (profilesSection) el.panelBody!.appendChild(profilesSection);

    // Vision, Reading, Navigation sections
    const sections: ControlSection[] = ['vision', 'reading', 'navigation'];
    for (const section of sections) {
      const sectionEl = buildSection(section);
      if (sectionEl) el.panelBody!.appendChild(sectionEl);
    }

    // Inject all styles once
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

    el.btn = buildButton();
    el.container.appendChild(el.btn);
    document.body.appendChild(el.container);

    // Apply saved preferences
    for (const control of registry) {
      const key = control.id as keyof typeof pref;
      const val = pref[key];
      if (control.id === 'textSize') {
        if (typeof val === 'number') applyTextSizeFn(val);
      } else if (val === true || val === 'low' || val === 'high' || (typeof val === 'number' && val > 0)) {
        control.apply(val as boolean & string);
      }
    }

    // Sync tile states
    for (const control of registry) {
      const ref = el.toggles[control.id];
      if (ref) {
        const badge = ref.row.querySelector<HTMLSpanElement>('span:last-of-type');
        if (badge) updateTileState(ref.row, badge, control);
      }
    }

    document.addEventListener('click', handleOutsideClick);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
