// One-click accessibility profiles that toggle multiple controls at once.

import { pref, el, savePrefs } from '../state';
import { register, registry } from './base';
import { applyTextSize } from './text-size';
import { LANG } from '../lang';

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

const profileTiles = new Map<string, HTMLElement>();

function updateProfileTiles(): void {
  for (const [id, tile] of profileTiles) {
    const isActive = pref.activeProfile === id;
    tile.style.borderColor = isActive ? '#1a1a2e' : '#e5e7eb';
    tile.style.background = isActive ? '#eef2ff' : '#fff';
  }
}

// Syncs all registered control tiles to match current pref state and updates profile highlights.
function syncTiles(): void {
  for (const control of registry) {
    const ref = el.toggles[control.id];
    if (!ref) continue;
    const key = control.id as keyof typeof pref;
    const val = pref[key];
    const badge = ref.row.querySelector<HTMLSpanElement>('span:last-of-type');
    if (!badge) continue;

    const isActive = control.type === 'cycle'
      ? val !== 'off'
      : val === true || (typeof val === 'number' && val > 0);

    ref.row.style.borderColor = isActive ? '#1a1a2e' : '#e5e7eb';
    ref.row.style.background = isActive ? '#eef2ff' : '#fff';
    badge.style.background = isActive ? '#1a1a2e' : '#f3f4f6';
    badge.style.color = isActive ? '#fff' : '#9ca3af';

    if (control.type === 'cycle') {
      badge.textContent = String(val).charAt(0).toUpperCase() + String(val).slice(1);
    } else if (typeof val === 'number' && val > 0) {
      badge.textContent = `Nv ${val}`;
    } else {
      badge.textContent = isActive ? 'On' : 'Off';
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
    if (control.id === 'saturation') {
      control.apply('off');
    } else {
      control.apply(false);
    }
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
      } else {
        control.apply(val);
      }
    } else {
      control.apply(false);
    }
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

    // Profiles header
    const header = document.createElement('div');
    header.style.cssText = 'display:flex;align-items:center;gap:8px;padding:12px 16px 8px;';
    const headerIcon = document.createElement('span');
    headerIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v2"/><path d="M12 21v2"/><path d="M4.22 4.22l1.42 1.42"/><path d="M18.36 18.36l1.42 1.42"/><path d="M1 12h2"/><path d="M21 12h2"/><path d="M4.22 19.78l1.42-1.42"/><path d="M18.36 5.64l1.42-1.42"/></svg>';
    headerIcon.style.cssText = 'display:flex;color:#6b7280;';
    const headerTitle = document.createElement('span');
    headerTitle.textContent = LANG.profilesSubtitle;
    headerTitle.style.cssText = 'font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;';
    header.appendChild(headerIcon);
    header.appendChild(headerTitle);
    container.appendChild(header);

    // Profile tiles grid
    const grid = document.createElement('div');
    grid.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:4px 16px 12px;';

    for (const profile of profiles) {
      const tile = document.createElement('button');
      tile.setAttribute('aria-label', profile.label);
      tile.dataset.profileId = profile.id;
      tile.style.cssText = [
        'display:flex;flex-direction:column;align-items:center;gap:4px;',
        'padding:12px 8px;border-radius:10px;border:1px solid #e5e7eb;',
        'background:#fff;cursor:pointer;transition:all 0.15s;',
        'font-family:inherit;',
      ].join('');
      tile.innerHTML = [
        `<span style="display:flex;color:#374151;">${profile.icon}</span>`,
        `<span style="font-size:12px;font-weight:600;color:#1f2937;">${profile.label}</span>`,
        `<span style="font-size:10px;color:#9ca3af;text-align:center;">${profile.description}</span>`,
      ].join('');

      profileTiles.set(profile.id, tile);

      tile.addEventListener('mouseenter', () => {
        const isActive = pref.activeProfile === profile.id;
        tile.style.background = isActive ? '#dde3ff' : '#f3f4f6';
        tile.style.borderColor = isActive ? '#1a1a2e' : '#d1d5db';
      });
      tile.addEventListener('mouseleave', () => {
        const isActive = pref.activeProfile === profile.id;
        tile.style.background = isActive ? '#eef2ff' : '#fff';
        tile.style.borderColor = isActive ? '#1a1a2e' : '#e5e7eb';
      });
      tile.addEventListener('click', () => applyProfile(profile));

      grid.appendChild(tile);
    }

    updateProfileTiles();

    container.appendChild(grid);

    // Reset all button
    const resetBtn = document.createElement('button');
    resetBtn.textContent = LANG.resetAll;
    resetBtn.style.cssText = [
      'display:block;width:calc(100% - 32px);margin:0 16px 12px;',
      'padding:10px;border-radius:8px;border:1px solid #fca5a5;',
      'background:#fef2f2;color:#dc2626;cursor:pointer;',
      'font-size:13px;font-weight:600;font-family:inherit;',
      'transition:all 0.15s;',
    ].join('');
    resetBtn.addEventListener('mouseenter', () => {
      resetBtn.style.background = '#fee2e2';
    });
    resetBtn.addEventListener('mouseleave', () => {
      resetBtn.style.background = '#fef2f2';
    });
    resetBtn.addEventListener('click', resetAll);

    container.appendChild(resetBtn);

    return container;
  },
});
