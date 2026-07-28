// Section and tile building logic. Visual layer is in styles.css + templates.ts.

import { pref, el, savePrefs } from '../state';
import { registry, type Control, type ControlSection } from '../controls/base';
import { LANG } from '../lang';
import { tileHTML, sectionHTML } from './templates';

const SECTION_LABELS: Record<ControlSection, string> = {
  vision: LANG.sectionVision,
  reading: LANG.sectionReading,
  navigation: LANG.sectionNavigation,
};

// Read current state from pref, return [active, badgeText].
function tileState(control: Control): [boolean, string] {
  const key = control.id as keyof typeof pref;
  const val = pref[key];
  const active = control.type === 'cycle'
    ? val !== 'off'
    : val === true || (typeof val === 'number' && val > 0);
  let badge = '';
  if (control.type === 'cycle') {
    badge = String(val).charAt(0).toUpperCase() + String(val).slice(1);
  } else if (typeof val === 'number' && val > 0) {
    badge = `${LANG.tileLevel} ${val}`;
  } else {
    badge = active ? LANG.tileOn : LANG.tileOff;
  }
  return [active, badge];
}

// Toggle tile classes and badge text to match current pref.
function updateTileDOM(tile: Element, badge: Element, control: Control): void {
  const key = control.id as keyof typeof pref;
  const val = pref[key];
  const active = control.type === 'cycle'
    ? val !== 'off'
    : val === true || (typeof val === 'number' && val > 0);
  tile.classList.toggle('is-on', active);
  badge.classList.toggle('is-on', active);
  if (control.type === 'cycle') {
    badge.textContent = String(val).charAt(0).toUpperCase() + String(val).slice(1);
  } else if (typeof val === 'number' && val > 0) {
    badge.textContent = `${LANG.tileLevel} ${val}`;
  } else {
    badge.textContent = active ? LANG.tileOn : LANG.tileOff;
  }
}

// Handle tile click: toggle pref, apply control, sync visual.
function bindTile(tile: HTMLElement, control: Control): void {
  tile.addEventListener('click', () => {
    const key = control.id as keyof typeof pref;
    if (control.type === 'cycle') {
      if (control.cycleNext) control.cycleNext();
    } else {
      const newVal = !pref[key] as boolean;
      (pref as unknown as Record<string, unknown>)[key] = newVal;
      control.apply(newVal as boolean);
    }
    savePrefs();
    updateTileDOM(tile, tile.querySelector('.kw-tile-badge')!, control);
  });
}

export function buildSection(section: ControlSection): HTMLElement | null {
  const controls = registry.filter((c) => c.section === section && c.id !== 'profiles');
  if (controls.length === 0) return null;

  const tilesHtml = controls.map((c) => {
    const id = LANG.controls[c.id] || c.label;
    const [active, badge] = tileState(c);
    return tileHTML(c.id, c.icon, id, badge, active);
  }).join('');

  const wrapper = document.createElement('div');
  wrapper.innerHTML = sectionHTML(SECTION_LABELS[section], tilesHtml);

  // Bind events after DOM insertion.
  const tileEls = wrapper.querySelectorAll('.kw-tile');
  tileEls.forEach((t, i) => bindTile(t as HTMLElement, controls[i]));

  // Full-width for custom buildUI controls.
  controls.forEach((c, i) => {
    if (c.buildUI) {
      const custom = c.buildUI()!;
      (tileEls[i] as HTMLElement).replaceWith(custom);
      custom.style.gridColumn = '1 / -1';
      custom.style.marginBottom = '4px';
    }
  });

  return wrapper;
}

export function buildProfilesSection(): HTMLElement | null {
  const ctrl = registry.find((c) => c.id === 'profiles');
  if (!ctrl || !ctrl.buildUI) return null;
  return ctrl.buildUI()!;
}

// Sync every registered control tile to match current pref state.
export function syncTileStates(): void {
  for (const control of registry) {
    if (!el.container) continue;
    const tile = el.container.querySelector(`[data-control="${control.id}"]`);
    if (!tile) continue;
    const badge = tile.querySelector('.kw-tile-badge');
    if (badge) updateTileDOM(tile, badge, control);
  }
}
