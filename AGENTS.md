# AGENTS.md

## Repo

Single-package Vite + React 19 TypeScript CV builder. No tests configured.

## Commands

- Install: `npm install`
- Dev server: `npm run dev`
- Production build (also typechecks): `npm run build` (`tsc -b && vite build`)
- Typecheck only: `npx tsc -b`
- Lint: `npm run lint`
- Preview build: `npm run preview`

`npm run lint` currently reports pre-existing errors; do not treat it as a clean gate. `npm run build` is the reliable verification command.

## Architecture

- Entrypoint: `src/main.tsx` -> `src/App.tsx`.
- `App.tsx` owns global resume state through `useResumeData()` (`forms` + `layout`) and autosaves to `localStorage` key `currentResume`.
- Block system: `src/blocks/*` each call `registerBlock()`; `src/blocks/index.ts` is imported as a side effect in `App.tsx`. Add new blocks by registering a definition with `Editor` and `Render` components.
- Resume rendering: `DraggableLayout` uses `@dnd-kit` to drag sections between `left`/`right` columns. `MiniBox` renders a section; `BlockRenderer` looks up the block definition.
- Editing UI: no persistent panel. Clicking a block swaps it inline to its `BlockEditor` (WYSIWYG); section title/controls are inline. Portals target `document.body`.

## Conventions / gotchas

- TypeScript config is strict with `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`; use `import type` for type-only imports.
- Tailwind is provided by `@tailwindcss/vite`, not PostCSS config.
- Block IDs and form IDs are generated with `crypto.randomUUID()`; preserve uniqueness when cloning templates.
- `src/looks/look-colorful.css` may contain uncommitted user changes; inspect before editing it.
- `dist/` and `node_modules/` are build/dependency artifacts; do not edit.