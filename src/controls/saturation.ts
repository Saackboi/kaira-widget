// -----------------------------------------------------------------------------
// Saturation control — three states: off, low, high.
// -----------------------------------------------------------------------------

import { PREFIX, pref } from '../state';
import { register, registry } from './base';
import type { SaturationLevel } from '../state';

const LEVELS: SaturationLevel[] = ['off', 'low', 'high'];

const CSS_CLASSES: Record<SaturationLevel, string> = {
  off: '',
  low: `${PREFIX}-saturation-low`,
  high: `${PREFIX}-saturation-high`,
};

register({
  id: 'saturation',
  label: 'Saturación',
  icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>',
  section: 'vision',
  type: 'cycle',
  css: [
    `html.${PREFIX}-saturation-low {`,
    '  filter: saturate(0.3) !important;',
    '}',
    `html.${PREFIX}-saturation-high {`,
    '  filter: saturate(2) !important;',
    '}',
  ].join('\n'),
  apply(level: boolean | string) {
    const current = typeof level === 'string' ? level as SaturationLevel : level ? 'low' : 'off';
    for (const cls of [CSS_CLASSES.low, CSS_CLASSES.high]) {
      document.documentElement.classList.remove(cls);
    }
    if (CSS_CLASSES[current]) {
      document.documentElement.classList.add(CSS_CLASSES[current]);
    }
  },
  cycleNext() {
    const idx = LEVELS.indexOf(pref.saturation);
    const next = LEVELS[(idx + 1) % LEVELS.length];
    pref.saturation = next;
    const control = registry.find(c => c.id === 'saturation');
    if (control) control.apply(next);
  },
});
