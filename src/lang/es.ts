import type { LangPack } from './en';

// Spanish partial pack. Undefined keys fall back to English (BASE).
export const ES: Partial<LangPack> = {
  panelTitle: 'Accesibilidad',
  panelAriaLabel: 'Panel de accesibilidad',
  btnAriaLabel: 'Opciones de accesibilidad',
  closeBtnAriaLabel: 'Cerrar panel',
  sectionVision: 'Visión',
  sectionReading: 'Lectura',
  sectionNavigation: 'Navegación',
  profilesTitle: 'Perfiles',
  profilesSubtitle: 'Perfiles (1 clic)',
  resetAll: 'Restablecer todo',
  textSizeDecrease: 'Reducir texto',
  textSizeIncrease: 'Agrandar texto',
  noImageAlt: '[Imagen sin descripción]',
  controls: {
    contrast: 'Alto Contraste',
    textSize: 'Agrandar Texto',
    spacing: 'Espaciado',
    readingGuide: 'Guía de Lectura',
    animations: 'Pausar Animaciones',
    largeCursor: 'Cursor Grande',
    monochrome: 'Monocromo',
    darkContrast: 'Contraste Oscuro',
    saturation: 'Saturación',
    dyslexiaFont: 'Fuente Dislexia',
    highlightLinks: 'Resaltar Links',
    highlightTitles: 'Resaltar Títulos',
    hideImages: 'Describir Imágenes',
  },
  profileData: {
    seizure: { label: 'Convulsiones', description: 'Detiene animaciones y reduce saturación' },
    lowVision: { label: 'Baja Visión', description: 'Alto contraste + texto grande + cursor' },
    adhd: { label: 'TDAH', description: 'Super focus + sin animaciones + títulos' },
    dyslexia: { label: 'Dislexia', description: 'Fuente dislexia + espaciado + guía' },
  },
};
