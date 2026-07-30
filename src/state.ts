// Shared state, preferences, element cache, and localStorage persistence.

export const PREFIX = 'kaira';

export const STORAGE_KEY = `${PREFIX}-prefs`;

export const TEXT_SIZE_LEVELS = [16, 18, 20, 22];

export type SaturationLevel = 'off' | 'low' | 'high';

// All toggleable preferences persisted to localStorage.
export interface Prefs {
  contrast: boolean;
  textSize: number;
  spacing: boolean;
  readingGuide: boolean;
  animations: boolean;
  largeCursor: boolean;
  monochrome: boolean;
  darkContrast: boolean;
  saturation: SaturationLevel;
  dyslexiaFont: boolean;
  highlightLinks: boolean;
  highlightTitles: boolean;
  superFocus: boolean;
  hideImages: boolean;
  activeProfile: string;
  lang: string;
}

// Cache of DOM element references so controls don't query the DOM repeatedly.
export interface ElementCache {
  container: HTMLDivElement | null;
  btn: HTMLButtonElement | null;
  panel: HTMLDivElement | null;
  panelBody: HTMLDivElement | null;
  panelTitle: HTMLSpanElement | null;
  closeBtn: HTMLButtonElement | null;
  backdrop: HTMLDivElement | null;
  guide: HTMLDivElement | null;
  textSizeDisplay: HTMLSpanElement | null;
  guideHandler: ((e: MouseEvent) => void) | null;
  focusOverlay: HTMLDivElement | null;
  focusHandler: ((e: FocusEvent) => void) | null;
  blurHandler: ((e: FocusEvent) => void) | null;
}

// Runtime state (modifiable). Initialized with defaults, overridden by loadPrefs().
export const pref: Prefs = {
  contrast: false,
  textSize: 0,
  spacing: false,
  readingGuide: false,
  animations: false,
  largeCursor: false,
  monochrome: false,
  darkContrast: false,
  saturation: 'off',
  dyslexiaFont: false,
  highlightLinks: false,
  highlightTitles: false,
  superFocus: false,
  hideImages: false,
  activeProfile: '',
  lang: '',
};

// Populated at runtime after DOM elements are created.
export const el: ElementCache = {
  container: null,
  btn: null,
  panel: null,
  panelBody: null,
  panelTitle: null,
  closeBtn: null,
  backdrop: null,
  guide: null,
  textSizeDisplay: null,
  guideHandler: null,
  focusOverlay: null,
  focusHandler: null,
  blurHandler: null,
};

export function savePrefs(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pref));
  } catch {
    // localStorage may be unavailable
  }
}

export function loadPrefs(): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);

    // Controls from v0.1.0
    if (typeof parsed.contrast === 'boolean') pref.contrast = parsed.contrast;
    if (typeof parsed.textSize === 'number' && parsed.textSize >= 0 && parsed.textSize < TEXT_SIZE_LEVELS.length) {
      pref.textSize = parsed.textSize;
    }
    if (typeof parsed.spacing === 'boolean') pref.spacing = parsed.spacing;
    if (typeof parsed.readingGuide === 'boolean') pref.readingGuide = parsed.readingGuide;
    if (typeof parsed.animations === 'boolean') pref.animations = parsed.animations;
    if (typeof parsed.largeCursor === 'boolean') pref.largeCursor = parsed.largeCursor;

    // New controls — safe defaults if not present
    if (typeof parsed.monochrome === 'boolean') pref.monochrome = parsed.monochrome;
    if (typeof parsed.darkContrast === 'boolean') pref.darkContrast = parsed.darkContrast;
    if (parsed.saturation === 'low' || parsed.saturation === 'high') pref.saturation = parsed.saturation;
    if (typeof parsed.dyslexiaFont === 'boolean') pref.dyslexiaFont = parsed.dyslexiaFont;
    if (typeof parsed.highlightLinks === 'boolean') pref.highlightLinks = parsed.highlightLinks;
    if (typeof parsed.highlightTitles === 'boolean') pref.highlightTitles = parsed.highlightTitles;
    if (typeof parsed.superFocus === 'boolean') pref.superFocus = parsed.superFocus;
    if (typeof parsed.hideImages === 'boolean') pref.hideImages = parsed.hideImages;
    if (typeof parsed.activeProfile === 'string') pref.activeProfile = parsed.activeProfile;
    if (typeof parsed.lang === 'string') pref.lang = parsed.lang;
  } catch {
    // Malformed data — fall back to defaults
  }
}

