// Section and tile builders for the accessibility panel body.

import { pref, el, savePrefs } from '../state';
import { registry, type Control, type ControlSection } from '../controls/base';
import { LANG } from '../lang';

const SECTION_LABELS: Record<ControlSection, string> = {
  vision: LANG.sectionVision,
  reading: LANG.sectionReading,
  navigation: LANG.sectionNavigation,
};

// Syncs the visual state (border, background, badge text) of a tile with pref.
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
    badge.textContent = `${LANG.tileLevel} ${val}`;
  } else {
    badge.textContent = isActive ? LANG.tileOn : LANG.tileOff;
  }
}

// Builds a single control tile (icon + label + state badge).
// Label is resolved from LANG at render time so it updates on language switch.
function buildTileControl(control: Control): HTMLElement {
  const tile = document.createElement('button');
  tile.setAttribute('aria-label', LANG.controls[control.id] || control.label);
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
  label.textContent = LANG.controls[control.id] || control.label;
  label.style.cssText = 'font-size:11px;font-weight:500;color:#1f2937;text-align:center;line-height:1.2;';
  tile.appendChild(label);

  const stateBadge = document.createElement('span');
  stateBadge.style.cssText = [
    'font-size:9px;font-weight:600;padding:1px 6px;border-radius:4px;',
    'color:#9ca3af;background:#f3f4f6;transition:all 0.15s;',
  ].join('');
  stateBadge.textContent = LANG.tileOff;
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

// Builds a labelled section grid. Controls with buildUI get full-width custom UIs,
// the rest are rendered as 4-per-row tiles.
export function buildSection(section: ControlSection): HTMLElement | null {
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

// Delegates to the profiles control's own buildUI for full-width rendering.
export function buildProfilesSection(): HTMLElement | null {
  const profileControl = registry.find((c) => c.id === 'profiles');
  if (!profileControl || !profileControl.buildUI) return null;
  return profileControl.buildUI()!;
}

// Sync every registered control's tile to match current pref state.
export function syncTileStates(): void {
  for (const control of registry) {
    const ref = el.toggles[control.id];
    if (ref) {
      const badge = ref.row.querySelector<HTMLSpanElement>('span:last-of-type');
      if (badge) updateTileState(ref.row, badge, control);
    }
  }
}
