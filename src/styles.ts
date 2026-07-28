import { registry } from './controls/base';
import widgetCSS from './ui/styles.css?raw';

export function injectStyles(root: ShadowRoot): void {
  if (document.getElementById('kaira-styles-global')) return;

  const font = document.createElement('link');
  font.rel = 'stylesheet';
  font.href = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@900&display=swap';
  document.head.appendChild(font);

  const style = document.createElement('style');
  style.textContent = widgetCSS;
  root.appendChild(style);

  const global = document.createElement('style');
  global.id = 'kaira-styles-global';
  global.textContent = registry.filter((c) => c.css).map((c) => c.css!).join('\n');
  document.head.appendChild(global);
}
