// One-click accessibility profiles. Logic only — visual layer: styles.css + templates.ts.

import { pref, el, savePrefs } from '../state';
import { register, registry } from './base';
import { applyTextSize } from './text-size';
import { LANG } from '../lang';
import { profileTileHTML } from '../ui/templates';

interface Profile {
  id: string;
  label: string;
  icon: string;
  description: string;
  toggles: Record<string, boolean | string | number>;
}

const profiles: Profile[] = [
  {
    id: 'seizure',
    get label() { return LANG.profileData.seizure.label; },
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
    get description() { return LANG.profileData.seizure.description; },
    toggles: { animations: true, saturation: 'low' },
  },
  {
    id: 'lowVision',
    get label() { return LANG.profileData.lowVision.label; },
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>',
    get description() { return LANG.profileData.lowVision.description; },
    toggles: { contrast: true, textSize: 2, largeCursor: true },
  },
  {
    id: 'adhd',
    get label() { return LANG.profileData.adhd.label; },
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>',
    get description() { return LANG.profileData.adhd.description; },
    toggles: { animations: true, highlightTitles: true, highlightLinks: true },
  },
  {
    id: 'dyslexia',
    get label() { return LANG.profileData.dyslexia.label; },
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
    get description() { return LANG.profileData.dyslexia.description; },
    toggles: { dyslexiaFont: true, spacing: true, readingGuide: true },
  },
];

// Highlight the active profile tile.
function updateProfileTiles(): void {
  if (!el.container) return;
  el.container.querySelectorAll('.kw-prof-tile').forEach((t) => {
    const el = t as HTMLElement;
    el.classList.toggle('is-on', el.dataset.profile === pref.activeProfile);
  });
}

// Sync all registered control tiles to match current pref state.
function syncTiles(): void {
  for (const control of registry) {
    if (!el.container) continue;
    const tile = el.container.querySelector(`[data-control="${control.id}"]`) as HTMLElement | null;
    if (!tile) continue;
    const key = control.id as keyof typeof pref;
    const val = pref[key];
    const active = control.type === 'cycle'
      ? val !== 'off'
      : val === true || (typeof val === 'number' && val > 0);
    tile.classList.toggle('is-on', active);
    const badge = tile.querySelector('.kw-tile-badge');
    if (!badge) continue;
    badge.classList.toggle('is-on', active);
    if (control.type === 'cycle') {
      badge.textContent = String(val).charAt(0).toUpperCase() + String(val).slice(1);
    } else if (typeof val === 'number' && val > 0) {
      badge.textContent = `Nv ${val}`;
    } else {
      badge.textContent = active ? 'On' : 'Off';
    }
  }
  updateProfileTiles();
}

// Disables every control and clears the active profile.
function resetAll(): void {
  const p = pref as unknown as Record<string, unknown>;
  for (const key of Object.keys(pref) as (keyof typeof pref)[]) {
    if (key === 'saturation') p[key] = 'off';
    else if (typeof pref[key] === 'boolean') p[key] = false;
    else if (typeof pref[key] === 'number') p[key] = 0;
  }
  pref.activeProfile = '';
  for (const control of registry) {
    if (control.id === 'saturation') { control.apply('off'); }
    else { control.apply(false); }
    if (control.syncUI && control.type !== 'cycle') control.syncUI();
  }
  applyTextSize(0);
  syncTiles();
  savePrefs();
}

// Resets all controls, then applies the selected profile's toggles.
function applyProfile(profile: Profile): void {
  const p = pref as unknown as Record<string, unknown>;
  for (const key of Object.keys(pref) as (keyof typeof pref)[]) {
    if (key === 'saturation') p[key] = 'off';
    else if (typeof pref[key] === 'boolean') p[key] = false;
    else if (typeof pref[key] === 'number') p[key] = 0;
  }
  for (const [key, value] of Object.entries(profile.toggles)) {
    p[key] = value;
  }
  for (const control of registry) {
    const val = profile.toggles[control.id];
    if (val !== undefined) {
      if (typeof val === 'number') {
        (pref as unknown as Record<string, number>)[control.id] = val;
        if (control.id === 'textSize') applyTextSize(val);
      } else { control.apply(val); }
    } else { control.apply(false); }
    if (control.syncUI && control.type !== 'cycle') control.syncUI();
  }
  pref.activeProfile = profile.id;
  syncTiles();
  savePrefs();
}

register({
  id: 'profiles',
  label: LANG.profilesTitle,
  icon: '',
  section: 'vision',
  type: 'custom',
  apply() {},
  buildUI() {
    const container = document.createElement('div');

    // Profiles header.
    const hdr = document.createElement('div');
    hdr.className = 'kw-prof-hdr';
    const hIcon = document.createElement('span');
    hIcon.className = 'kw-prof-hdr-icon';
    hIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v2"/><path d="M12 21v2"/><path d="M4.22 4.22l1.42 1.42"/><path d="M18.36 18.36l1.42 1.42"/><path d="M1 12h2"/><path d="M21 12h2"/><path d="M4.22 19.78l1.42-1.42"/><path d="M18.36 5.64l1.42-1.42"/></svg>';
    const hTitle = document.createElement('span');
    hTitle.className = 'kw-prof-hdr-title';
    hTitle.textContent = LANG.profilesSubtitle;
    hdr.appendChild(hIcon);
    hdr.appendChild(hTitle);
    container.appendChild(hdr);

    // Profile tiles grid.
    const grid = document.createElement('div');
    grid.className = 'kw-prof-grid';
    const tilesHtml = profiles
      .map((p) => profileTileHTML(p.id, p.icon, p.label, p.description, pref.activeProfile === p.id))
      .join('');
    grid.innerHTML = tilesHtml;
    grid.querySelectorAll('.kw-prof-tile').forEach((tile, i) => {
      tile.addEventListener('click', () => applyProfile(profiles[i]));
    });
    container.appendChild(grid);

    // Reset all button.
    const resetBtn = document.createElement('button');
    resetBtn.className = 'kw-reset';
    resetBtn.textContent = LANG.resetAll;
    resetBtn.addEventListener('click', resetAll);
    container.appendChild(resetBtn);

    return container;
  },
});
