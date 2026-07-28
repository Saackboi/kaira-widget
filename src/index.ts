// Entry point. Self-registers all controls, builds the widget DOM, and restores prefs.

import { pref, el, savePrefs, loadPrefs } from './state';
import { registry } from './controls/base';
import { applyTextSize } from './controls/text-size';
import { LANG, setLang } from './lang';
import { injectStyles } from './styles';
import { buildContainer, buildButton, buildPanel, handleOutsideClick } from './ui/container';
import { buildSection, buildProfilesSection, syncTileStates } from './ui/section';

// Side-effect imports — each file calls register() on import.
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
  const currentScript = document.currentScript as HTMLScriptElement | null;
  const SITE_KEY: string = currentScript?.getAttribute('data-site-key') || '';
  const API_BASE = 'https://api.kaira.io';

  // Default theme CSS custom properties for the shadow host.
  const DEFAULT_THEME: Record<string, string> = {
    'kw-accent': '#8b7355',
    'kw-accent-dark': '#705b42',
    'kw-accent-rgb': '139, 115, 85',
    'kw-bg': '#ffffff',
    'kw-title': '#111827',
    'kw-text': '#1f2937',
    'kw-text-secondary': '#4b5563',
    'kw-icon': '#374151',
    'kw-subtle': '#6b7280',
    'kw-border': '#e5e7eb',
    'kw-border-strong': '#d1d5db',
    'kw-hover-bg': '#fafaf9',
    'kw-on-bg': '#f7f5f0',
    'kw-on-hover-bg': '#efece4',
    'kw-muted-bg': '#f3f4f6',
    'kw-danger-bg': '#fef2f2',
    'kw-danger-border': '#fecaca',
    'kw-danger-hover': '#fee2e2',
    'kw-danger-text': '#dc2626',
    logo: '',
  };

  function applyDefaultTheme(host: HTMLElement): void {
    for (const [key, value] of Object.entries(DEFAULT_THEME)) {
      host.style.setProperty(`--${key}`, value);
    }
  }

  function fetchTheme(host: HTMLElement): void {
    if (!SITE_KEY) return;
    fetch(`${API_BASE}/widget/theme?siteKey=${encodeURIComponent(SITE_KEY)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((theme) => {
        if (!theme) return;
        for (const [key, value] of Object.entries(theme)) {
          host.style.setProperty(`--kw-${key}`, value as string);
        }
        if (theme.logo && el.container) {
          const existing = el.container.querySelector('.kw-logo');
          if (existing) {
            const img = document.createElement('img');
            img.className = 'kw-logo';
            img.src = theme.logo as string;
            img.alt = 'Logo';
            existing.replaceWith(img);
          }
        }
      })
      .catch(() => { /* fall back to defaults */ });
  }

  function rebuildPanelBody(): void {
    el.panelBody!.innerHTML = '';
    const profilesSection = buildProfilesSection();
    if (profilesSection) el.panelBody!.appendChild(profilesSection);
    const sections: Array<'vision' | 'reading' | 'navigation'> = ['vision', 'reading', 'navigation'];
    for (const section of sections) {
      const sectionEl = buildSection(section);
      if (sectionEl) el.panelBody!.appendChild(sectionEl);
    }

    syncTileStates();
  }

  function handleLangChange(code: string): void {
    if (code === (pref.lang || (navigator.language.startsWith('es') ? 'es' : 'en'))) return;
    setLang(code);
    pref.lang = code;
    savePrefs();
    if (el.btn) el.btn.setAttribute('aria-label', LANG.btnAriaLabel);
    if (el.panel) el.panel.setAttribute('aria-label', LANG.panelAriaLabel);
    if (el.panelTitle) el.panelTitle.textContent = LANG.panelTitle;
    if (el.closeBtn) el.closeBtn.setAttribute('aria-label', LANG.closeBtnAriaLabel);
    rebuildPanelBody();
  }

  function init(): void {
    if (document.getElementById('kaira-host')) return;

    loadPrefs();

    // Apply saved language, fall back to browser detection.
    const initialLang = pref.lang || (navigator.language.startsWith('es') ? 'es' : 'en');
    if (initialLang !== 'en') setLang(initialLang);

    // Shadow DOM isolates widget from host site CSS (e.g. Reddit aggressive resets).
    const host = document.createElement('div');
    host.id = 'kaira-host';
    document.body.appendChild(host);
    applyDefaultTheme(host);
    fetchTheme(host);
    const logoUrl = host.style.getPropertyValue('--kw-logo-src') || undefined;
    const root = host.attachShadow({ mode: 'open' });

    el.container = buildContainer(SITE_KEY);
    el.panel = buildPanel(initialLang, handleLangChange, logoUrl);
    el.container.appendChild(el.panel);

    rebuildPanelBody();
    injectStyles(root);

    el.btn = buildButton();
    el.container.appendChild(el.btn);
    root.appendChild(el.container);

    // Re-apply any previously saved preferences.
    for (const control of registry) {
      const key = control.id as keyof typeof pref;
      const val = pref[key];
      if (control.id === 'textSize') {
        if (typeof val === 'number') applyTextSize(val);
      } else if (val === true || val === 'low' || val === 'high' || (typeof val === 'number' && val > 0)) {
        control.apply(val as boolean & string);
      }
    }

    syncTileStates();
    document.addEventListener('click', handleOutsideClick);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
