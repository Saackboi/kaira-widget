import { describe, it, expect, beforeAll, vi } from 'vitest';

beforeAll(async () => {
  const existing = document.getElementById('kaira-container');
  if (existing) existing.remove();
  document.documentElement.classList.remove(
    'kaira-contrast', 'kaira-paused', 'kaira-spacing',
    'kaira-monochrome', 'kaira-dark-contrast', 'kaira-saturation-low',
    'kaira-saturation-high', 'kaira-highlight-links', 'kaira-highlight-titles',
  );
  document.documentElement.classList.remove('kaira-spacing', 'kaira-text-size-1', 'kaira-text-size-2', 'kaira-text-size-3');
  localStorage.clear();

  await import('../src/index.ts');
  await new Promise((r) => setImmediate(r));
});

describe('KAIRA Widget', () => {
  it('injects the container into the DOM', () => {
    const container = document.getElementById('kaira-container');
    expect(container).not.toBeNull();
    expect(container!.style.position).toBe('fixed');
    expect(container!.style.zIndex).toBe('999999');
  });

  it('creates the floating button with correct label', () => {
    const btn = document.getElementById('kaira-btn');
    expect(btn).not.toBeNull();
    expect(btn!.getAttribute('aria-label')).toBe('Opciones de accesibilidad');
    expect(btn!.getAttribute('aria-expanded')).toBe('false');
  });

  it('creates the panel with controls', () => {
    const panel = document.getElementById('kaira-panel');
    expect(panel).not.toBeNull();
    expect(panel!.getAttribute('role')).toBe('dialog');
  });

  it('does not create a duplicate widget on re-init', async () => {
    const url = new URL('../src/index.ts', import.meta.url);
    url.searchParams.set('reinit', String(Date.now()));
    await import(/* @vite-ignore */ url.pathname + url.search);
    await new Promise((r) => setImmediate(r));

    const containers = document.querySelectorAll('#kaira-container');
    expect(containers.length).toBe(1);
  });

  it('toggles the panel open/close on button click', () => {
    const btn = document.getElementById('kaira-btn') as HTMLButtonElement;
    const panel = document.getElementById('kaira-panel') as HTMLDivElement;

    expect(panel.classList.contains('kaira-panel--open')).toBe(false);

    btn.click();
    expect(panel.classList.contains('kaira-panel--open')).toBe(true);

    btn.click();
    expect(panel.classList.contains('kaira-panel--open')).toBe(false);
  });
});

describe('Profiles', () => {
  it('renders profile tiles', () => {
    const panel = document.getElementById('kaira-panel') as HTMLDivElement;
    expect(panel.textContent).toContain('Perfiles');
    expect(panel.textContent).toContain('Convulsiones');
    expect(panel.textContent).toContain('Baja Visión');
    expect(panel.textContent).toContain('TDAH');
    expect(panel.textContent).toContain('Dislexia');
  });

  it('renders reset all button', () => {
    const panel = document.getElementById('kaira-panel') as HTMLDivElement;
    expect(panel.textContent).toContain('Restablecer todo');
  });
});

describe('Sections', () => {
  it('renders all three section headers', () => {
    const panel = document.getElementById('kaira-panel') as HTMLDivElement;
    expect(panel.textContent).toContain('Visión');
    expect(panel.textContent).toContain('Lectura');
    expect(panel.textContent).toContain('Navegación');
  });

  it('renders all control tiles', () => {
    // Controls in sections: monochrome, dark-contrast, saturation,
    // contrast, largeCursor (vision); textSize, spacing, readingGuide,
    // dyslexiaFont (reading); animations, highlightLinks, highlightTitles,
    // superFocus, hideImages (navigation)
    const panel = document.getElementById('kaira-panel') as HTMLDivElement;
    const labels = [
      'Alto Contraste', 'Agrandar Texto', 'Espaciado', 'Guía de Lectura',
      'Pausar Animaciones', 'Cursor Grande', 'Monocromo',
      'Contraste Oscuro', 'Saturación', 'Fuente Dislexia',
       'Resaltar Links', 'Resaltar Títulos', 'Super Focus', 'Describir Imágenes',
    ];
    for (const label of labels) {
      expect(panel.textContent).toContain(label);
    }
  });
});
