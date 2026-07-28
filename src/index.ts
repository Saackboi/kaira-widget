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

  function rebuildPanelBody(): void {
    el.panelBody!.innerHTML = '';
    el.toggles = {};
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
    rebuildPanelBody();
  }

  function init(): void {
    if (document.getElementById('kaira-container')) return;

    loadPrefs();

    // Apply saved language, fall back to browser detection.
    const initialLang = pref.lang || (navigator.language.startsWith('es') ? 'es' : 'en');
    if (initialLang !== 'en') setLang(initialLang);

    el.container = buildContainer(SITE_KEY);
    el.panel = buildPanel(initialLang, handleLangChange);
    el.container.appendChild(el.panel);

    rebuildPanelBody();
    injectStyles();

    el.btn = buildButton();
    el.container.appendChild(el.btn);
    document.body.appendChild(el.container);

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
