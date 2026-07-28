# KAIRA Widget (Saackboi/kaira-widget) — AGENTS

This repository contains the open-source accessibility widget for KAIRA. Anyone can download, modify, and adapt it. The widget is distributed as a standalone script, a browser extension, and a WordPress plugin — all built from this same codebase.

## What this project aims to do

Build a lightweight, customizable accessibility toolbar that can be embedded into any website. The goal is to make the web more inclusive by lowering the barrier for developers to add accessibility features. Every site should be able to offer font resizing, contrast adjustment, screen reader enhancements, and other accessibility tools with minimal effort.

## Current repo state

- The widget is in active development.
- `src/` contains the TypeScript source for the toolbar.
- `index.html` is a local development playground.
- Browser extension and WordPress plugin wrappers are planned but not yet implemented.

## Stack

- **Language:** Vanilla TypeScript (no framework dependencies).
- **Build:** Vite — compiles to a standalone `kaira.js` bundle.
- **Testing:** Vitest for unit and integration tests.
- **Output:** A single self-contained JavaScript file that can be loaded with a `<script>` tag, injected via browser extension, or bundled into a WordPress plugin.

## Repository structure

```
kaira-widget/
├── src/
│   ├── controls/         # Accessibility controls (toggle, cycle, custom)
│   │   ├── base.ts       # Control interface & registry
│   │   ├── profiles.ts   # One-click accessibility profiles
│   │   ├── text-size.ts
│   │   ├── contrast.ts
│   │   ├── spacing.ts
│   │   ├── reading-guide.ts
│   │   ├── animations.ts
│   │   ├── large-cursor.ts
│   │   ├── monochrome.ts
│   │   ├── dark-contrast.ts
│   │   ├── saturation.ts
│   │   ├── dyslexia-font.ts
│   │   ├── highlight-links.ts
│   │   ├── highlight-titles.ts
│   │   ├── super-focus.ts
│   │   └── hide-images.ts
│   ├── state.ts           # Shared state, preferences & localStorage
│   ├── index.ts           # Entry point
│   └── vite-env.d.ts
├── tests/
│   └── widget.test.ts
├── dist/                  # Build output (ignored by git)
├── index.html             # Local dev playground
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
├── AGENTS.md
└── README.md
```

## GitHub workflow

This repository follows the same branching model as the main KAIRA project.

### Branches

- `main` — Stable, production-ready releases. Every commit on `main` should be a release candidate.
- `develop` — Integration branch for ongoing work. Feature branches merge here.
- `feature/<name>` — New features. Created from `develop`, merged back via pull request.
- `fix/<name>` — Bug fixes. Same flow as features.
- `release/<version>` — Preparation for a new release (optional, only when coordinating multiple features).

### Pull requests

- All changes merge into `develop` first via pull request.
- PR descriptions must include a summary of what was changed and why.
- Reference issues with `closes #<issue-number>` to auto-close on merge.

### Commit rules

Every commit must follow these three rules:

1. **Atomic** — One commit = one logical change. Do not mix unrelated changes in the same commit. If you fix a bug and refactor a function in the same file, do it in two separate commits. This makes it easier to review, revert, and understand history.

2. **Semantic (Conventional Commits)** — Use the standard prefix format:
   - `feat:` — A new feature
   - `fix:` — A bug fix
   - `refactor:` — Code change that neither fixes nor adds
   - `docs:` — Documentation only
   - `style:` — Formatting, missing semicolons, etc. (no logic change)
   - `test:` — Adding or fixing tests
   - `chore:` — Build process, dependencies, tooling
   - `perf:` — Performance improvement
   
   Examples:
   ```
   feat: add font size control to toolbar
   fix: prevent contrast toggle from resetting on page load
   refactor: extract button rendering into shared component
   docs: update README with installation instructions
   ```

 3. **English only** — All commit messages, comments, PR descriptions, and documentation must be written in English. This is a public open-source project and must be accessible to an international audience.

 4. **Body explains the why** — The commit body (not just the title) should describe what changed and why, in natural English. Keep it brief but meaningful. Good:

    ```
    feat: refactor widget and add multi-language support

    index.ts was doing too many things at once. Now the UI code lives
    in its own module, styles are separate, and the language system
    is pluggable.
    ```

    Not just:

    ```
    feat: refactor widget and add multi-language support
    ```

### Code conventions

- All identifiers, comments, and documentation in English.
- Every source file starts with a short comment describing its responsibility.
- Comments explain "why" for non-obvious logic — not "what" (the code already says what).
- Keep functions small and focused on a single responsibility.
- Prefer readability over cleverness.

## Don't commit

- `node_modules/` — installed dependencies.
- `dist/` — build output.
- `.vite/` — Vite cache.
- `.env`, `.env.local`, `*.local` — local configuration or secrets.
- `.DS_Store` — macOS metadata.
- `*.tsbuildinfo` — TypeScript build info files.
- `.agents/` or similar local agent/tooling state.
