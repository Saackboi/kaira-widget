import { describe, it, expect, beforeAll } from 'vitest';

function getWidgetRoot(): ShadowRoot | null {
  const host = document.getElementById('kaira-host');
  return host?.shadowRoot ?? null;
}

beforeAll(async () => {
  const existing = document.getElementById('kaira-host');
  if (existing) existing.remove();
  document.documentElement.classList.remove(
    'kaira-contrast', 'kaira-paused', 'kaira-spacing',
    'kaira-monochrome', 'kaira-dark-contrast', 'kaira-saturation-low',
    'kaira-saturation-high', 'kaira-highlight-links', 'kaira-highlight-titles',
  );
  localStorage.clear();

  await import('../src/index.ts');
  await new Promise((r) => setImmediate(r));
});

describe('KAIRA Widget', () => {
  it('injects the container into the shadow DOM', () => {
    const root = getWidgetRoot();
    expect(root).not.toBeNull();
    const container = root!.getElementById('kaira-container');
    expect(container).not.toBeNull();
  });

  it('creates the floating button with correct label', () => {
    const root = getWidgetRoot()!;
    const btn = root.getElementById('kaira-btn') as HTMLButtonElement;
    expect(btn).not.toBeNull();
    expect(btn.getAttribute('aria-label')).toBe('Accessibility options');
    expect(btn.getAttribute('aria-expanded')).toBe('false');
  });

  it('creates the panel with controls', () => {
    const root = getWidgetRoot()!;
    const panel = root.getElementById('kaira-panel') as HTMLDivElement;
    expect(panel).not.toBeNull();
    expect(panel.getAttribute('role')).toBe('dialog');
  });

  it('does not create a duplicate widget on re-init', async () => {
    const url = new URL('../src/index.ts', import.meta.url);
    url.searchParams.set('reinit', String(Date.now()));
    await import(/* @vite-ignore */ url.pathname + url.search);
    await new Promise((r) => setImmediate(r));

    const hosts = document.querySelectorAll('#kaira-host');
    expect(hosts.length).toBe(1);
  });

  it('toggles the panel open/close on button click', () => {
    const root = getWidgetRoot()!;
    const btn = root.getElementById('kaira-btn') as HTMLButtonElement;
    const panel = root.getElementById('kaira-panel') as HTMLDivElement;

    expect(panel.classList.contains('kaira-panel--open')).toBe(false);

    btn.click();
    expect(panel.classList.contains('kaira-panel--open')).toBe(true);

    btn.click();
    expect(panel.classList.contains('kaira-panel--open')).toBe(false);
  });
});

describe('Profiles', () => {
  it('renders profile tiles', () => {
    const root = getWidgetRoot()!;
    const panel = root.getElementById('kaira-panel') as HTMLDivElement;
    expect(panel.textContent).toContain('Profiles');
    expect(panel.textContent).toContain('Seizure');
    expect(panel.textContent).toContain('Low Vision');
    expect(panel.textContent).toContain('ADHD');
    expect(panel.textContent).toContain('Dyslexia');
  });

  it('renders reset all button', () => {
    const root = getWidgetRoot()!;
    const panel = root.getElementById('kaira-panel') as HTMLDivElement;
    expect(panel.textContent).toContain('Reset All');
  });
});

describe('Sections', () => {
  it('renders all three section headers', () => {
    const root = getWidgetRoot()!;
    const panel = root.getElementById('kaira-panel') as HTMLDivElement;
    expect(panel.textContent).toContain('Vision');
    expect(panel.textContent).toContain('Reading');
    expect(panel.textContent).toContain('Navigation');
  });

  it('renders all control tiles', () => {
    const root = getWidgetRoot()!;
    const panel = root.getElementById('kaira-panel') as HTMLDivElement;
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
