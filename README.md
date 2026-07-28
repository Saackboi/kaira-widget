# KAIRA Widget

A lightweight, embeddable accessibility widget that adds a floating toolbar to any website. Users can adjust font size, contrast, spacing, and many other accessibility features with a single click.

## Quick start

Add the built script to your HTML and a floating button appears at the bottom-right corner:

```html
<script src="https://cdn.kaira.io/kaira.js" data-site-key="YOUR_SITE_KEY"></script>
```

No CSS imports or additional setup required — the widget injects everything it needs.

## Features

- **Vision** — High contrast, monochrome, dark contrast, saturation control, large cursor
- **Reading** — Text sizing (4 levels), letter/word spacing, reading guide, dyslexia-friendly font (OpenDyslexic)
- **Navigation** — Pause animations, highlight links, highlight headings, super focus (spotlight), image alt tooltips
- **Profiles** — One-click presets for seizures, low vision, ADHD, and dyslexia
- **Persistence** — All preferences saved to localStorage and restored on next visit

## Development

```bash
npm install
npm run dev      # Start Vite dev server
npm run build    # Type-check + bundle kaira.js
npm test         # Run vitest
```

The `index.html` page is a local playground where you can test all controls during development.

## Stack

- **Language:** Vanilla TypeScript (no framework dependencies)
- **Build:** Vite → standalone `kaira.js` (IIFE, minified with Terser)
- **Testing:** Vitest + jsdom
- **Output:** Single self-contained JS file (~29 KB gzipped ~7.5 KB)

## Output

`dist/kaira.js` — a self-contained IIFE bundle that can be:
- Loaded with a `<script>` tag
- Injected via browser extension
- Bundled into a WordPress plugin

## License

MIT
