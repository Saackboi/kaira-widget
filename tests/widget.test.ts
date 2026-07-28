import { describe, it, expect, beforeAll } from 'vitest';

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
    expect(btn!.getAttribute('aria-label')).toBe('Accessibility options');
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
    expect(panel.textContent).toContain('Profiles');
    expect(panel.textContent).toContain('Seizure');
    expect(panel.textContent).toContain('Low Vision');
    expect(panel.textContent).toContain('ADHD');
    expect(panel.textContent).toContain('Dyslexia');
  });

  it('renders reset all button', () => {
    const panel = document.getElementById('kaira-panel') as HTMLDivElement;
    expect(panel.textContent).toContain('Reset All');
  });
});

describe('Sections', () => {
  it('renders all three section headers', () => {
    const panel = document.getElementById('kaira-panel') as HTMLDivElement;
    expect(panel.textContent).toContain('Vision');
    expect(panel.textContent).toContain('Reading');
    expect(panel.textContent).toContain('Navigation');
  });

  it('renders all control tiles', () => {
    const panel = document.getElementById('kaira-panel') as HTMLDivElement;
    const labels = [
      'High Contrast', 'Enlarge Text', 'Spacing', 'Reading Guide',
      'Pause Animations', 'Large Cursor', 'Monochrome',
      'Dark Contrast', 'Saturation', 'Dyslexia Font',
       'Highlight Links', 'Highlight Titles', 'Super Focus', 'Describe Images',
    ];
    for (const label of labels) {
      expect(panel.textContent).toContain(label);
    }
  });
});
