// Shape of all translatable UI strings in the widget.
export interface LangPack {
  panelTitle: string;
  panelAriaLabel: string;
  btnAriaLabel: string;
  closeBtnAriaLabel: string;
  sectionVision: string;
  sectionReading: string;
  sectionNavigation: string;
  profilesTitle: string;
  profilesSubtitle: string;
  resetAll: string;
  textSizeDecrease: string;
  textSizeIncrease: string;
  tileOff: string;
  tileOn: string;
  tileLevel: string;
  noImageAlt: string;
  controls: Record<string, string>;
  profileData: Record<string, { label: string; description: string }>;
}

// English is the complete reference pack and the fallback for missing translations.
export const BASE: LangPack = {
  panelTitle: 'Accessibility',
  panelAriaLabel: 'Accessibility panel',
  btnAriaLabel: 'Accessibility options',
  closeBtnAriaLabel: 'Close panel',
  sectionVision: 'Vision',
  sectionReading: 'Reading',
  sectionNavigation: 'Navigation',
  profilesTitle: 'Profiles',
  profilesSubtitle: 'Profiles (1-click)',
  resetAll: 'Reset All',
  textSizeDecrease: 'Decrease text size',
  textSizeIncrease: 'Increase text size',
  tileOff: 'Off',
  tileOn: 'On',
  tileLevel: 'Nv',
  noImageAlt: '[Image without description]',
  controls: {
    contrast: 'High Contrast',
    textSize: 'Enlarge Text',
    spacing: 'Spacing',
    readingGuide: 'Reading Guide',
    animations: 'Pause Animations',
    largeCursor: 'Large Cursor',
    monochrome: 'Monochrome',
    darkContrast: 'Dark Contrast',
    saturation: 'Saturation',
    dyslexiaFont: 'Dyslexia Font',
    highlightLinks: 'Highlight Links',
    highlightTitles: 'Highlight Titles',
    superFocus: 'Super Focus',
    hideImages: 'Describe Images',
  },
  profileData: {
    seizure: { label: 'Seizure', description: 'Stops animations & reduces saturation' },
    lowVision: { label: 'Low Vision', description: 'High contrast + large text + cursor' },
    adhd: { label: 'ADHD', description: 'Super focus + no animations + titles' },
    dyslexia: { label: 'Dyslexia', description: 'Dyslexia font + spacing + guide' },
  },
};
