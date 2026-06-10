<div align="center">

<img src="docs/mimirLOGO.png" alt="Mimir logo" width="180" />

# $\color{#A78BFA}{\textsf{Mimir}}$

**An open-source portfolio template: fork it, fill it, ship it.**

[![English](https://img.shields.io/badge/English-1a1a1a?style=for-the-badge)](README.md) **·** [![Español](https://img.shields.io/badge/Espa%C3%B1ol-1a1a1a?style=for-the-badge)](README.es.md)

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-1a1a1a?style=flat&logo=typescript&logoColor=white&labelColor=1a1a1a)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-1a1a1a?style=flat&logo=vite&logoColor=white&labelColor=1a1a1a)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18-1a1a1a?style=flat&logo=react&logoColor=white&labelColor=1a1a1a)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-1a1a1a?style=flat&logo=tailwindcss&logoColor=white&labelColor=1a1a1a)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer%20Motion-11-1a1a1a?style=flat&logo=framer&logoColor=white&labelColor=1a1a1a)](https://www.framer.com/motion/)
[![Embla Carousel](https://img.shields.io/badge/Embla-Carousel-1a1a1a?style=flat&labelColor=1a1a1a)](https://www.embla-carousel.com/)
[![i18next](https://img.shields.io/badge/i18next-23.x-1a1a1a?style=flat&logo=i18next&logoColor=white&labelColor=1a1a1a)](https://www.i18next.com/)
[![pnpm](https://img.shields.io/badge/pnpm-package%20mgr-1a1a1a?style=flat&logo=pnpm&logoColor=white&labelColor=1a1a1a)](https://pnpm.io/)
[![Supabase](https://img.shields.io/badge/Supabase-optional-1a1a1a?style=flat&logo=supabase&logoColor=white&labelColor=1a1a1a)](https://supabase.com/)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-deploy-1a1a1a?style=flat&logo=github&logoColor=white&labelColor=1a1a1a)](https://pages.github.com/)
[![GNU Make](https://img.shields.io/badge/GNU%20Make-shortcuts-1a1a1a?style=flat&logo=gnu&logoColor=white&labelColor=1a1a1a)](https://www.gnu.org/software/make/)
[![License: MIT](https://img.shields.io/badge/License-MIT-1a1a1a?style=flat&labelColor=1a1a1a)](LICENSE)

</div>

---

## What is Mimir?

**Mimir** is a free, open-source portfolio template built for developers, designers, researchers and students who want a clean, fast, bilingual personal site **without writing any source code**.

You clone the repo, edit two files (`.env` and `config/projects.json`), drop your images into a folder, and you have a deployable site. The whole thing is built on top of Vite + React + TypeScript with a "liquid glass" visual style, scroll-driven animations, project carousels per category, light / dark / colorblind themes, optional background music and full **English / Spanish** support out of the box.

It is named after **Mímir**, the Norse god of knowledge and wisdom.

### Why open source?

The goal of Mimir is to give the community a portfolio that is:

- **Free to use**: MIT licensed, no attribution required.
- **Easy to fork**: content lives in config files, not in the React tree.
- **Easy to extend**: well-documented architecture, small surface area, no hidden magic.
- **Community-driven**: issues, pull requests and discussions are welcome. If you add a feature, fix a bug, translate it into a new language or build a new theme, please contribute it back.

> If you build something on top of Mimir, open an issue or PR and tell us about it. The more variations the community ships, the better the template gets.

---

## Languages and tools used

The default production bundle is around **150–200 KB gzip**. Here's why each piece is in the stack:

| Layer            | Tool                                                                  | Why                                                |
| ---------------- | --------------------------------------------------------------------- | -------------------------------------------------- |
| Language         | **TypeScript 5**                                                      | Type-safe React, autocomplete in config loaders    |
| Bundler          | **Vite 5**                                                            | Fast dev server, small static build                |
| UI               | **React 18**                                                          | Component model, hooks, suspense                   |
| Styles           | **Tailwind CSS 3** + custom liquid-glass utilities                    | Utility classes, theme via CSS variables           |
| Animations       | **Framer Motion 11**                                                  | Scroll-driven reveals, springs, gestures           |
| Carousel         | **embla-carousel-react** + `embla-carousel-auto-scroll`               | Accessible image carousel with auto-scroll         |
| i18n             | **i18next** + `react-i18next` + `i18next-browser-languagedetector`    | Drop-in EN / ES, browser detection                 |
| Optional backend | **Supabase** (`@supabase/supabase-js`)                                | Only used if you wire up forms / analytics         |
| Deploy           | **GitHub Pages** via `gh-pages` and GitHub Actions                    | One-click public hosting                           |
| Package manager  | **pnpm** (via Corepack)                                               | Fast installs, strict node_modules                 |
| Task runner      | **GNU Make**                                                          | Cross-OS shortcuts (`make dev`, `make build`, …)   |

---

## Bilingual by design

Every visible string in Mimir exists twice (once in English, once in Spanish) and the visitor can switch between them with a single click in the navbar.

- The default language comes from `DEFAULT_LANGUAGE` in `.env`.
- The visitor's browser locale wins if it matches a supported language.
- Project titles, descriptions, details and category labels use paired `_en` / `_es` fields in `config/projects.json`.
- UI strings (buttons, section headers, tooltips) live in `src/i18n/locales/en.json` and `src/i18n/locales/es.json`.
- Adding a third language is a four-step process: see [Section 3.8](#38-add-a-new-language).

---

## Table of contents

1. [Requirements](#1-requirements)
2. [Start the project](#2-start-the-project)
3. [Customize the site](#3-customize-the-site)
4. [Useful commands](#4-useful-commands)
5. [Deploy](#5-deploy)
6. [Architecture](#6-architecture)
7. [Contributing](#7-contributing)
8. [License](#8-license)

---

## 1. Requirements

You need three things installed on your machine. If you already have them, skip to [Section 2](#2-start-the-project).

- **Node.js 20 or newer**: download from <https://nodejs.org>
- **pnpm**: installed once via Corepack (see below)
- **Git**: download from <https://git-scm.com>

### Install pnpm (one time, any OS)

Run these two commands once. They work on macOS, Linux and Windows:

- `corepack enable`
- `corepack prepare pnpm@latest --activate`

Verify the installation:

- `pnpm --version`

---

## 2. Start the project

Pick the section that matches your OS. **Every command goes on its own line**, so copy them one by one.

### macOS

- `git clone https://github.com/<your-user>/mimir.git`
- `cd mimir`
- `cp .env.example .env`
- `pnpm install`
- `pnpm dev`

Then open <http://localhost:5173> in your browser.

### Linux

- `git clone https://github.com/<your-user>/mimir.git`
- `cd mimir`
- `cp .env.example .env`
- `pnpm install`
- `pnpm dev`

Then open <http://localhost:5173> in your browser.

### Windows (PowerShell)

- `git clone https://github.com/<your-user>/mimir.git`
- `cd mimir`
- `Copy-Item .env.example .env`
- `pnpm install`
- `pnpm dev`

Then open <http://localhost:5173> in your browser.

### Windows (Command Prompt)

- `git clone https://github.com/<your-user>/mimir.git`
- `cd mimir`
- `copy .env.example .env`
- `pnpm install`
- `pnpm dev`

Then open <http://localhost:5173> in your browser.

### With `make` (any OS that has GNU Make installed)

- `git clone https://github.com/<your-user>/mimir.git`
- `cd mimir`
- `cp .env.example .env`
- `make install`
- `make dev`

Then open <http://localhost:5173> in your browser.

> **Note:** the dev server hot-reloads. Edits to `.env` require a server restart; edits to `config/projects.json`, images and source files apply instantly.

---

## 3. Customize the site

All site content lives in **two files**:

- `.env`: your personal info, theme colors, social links.
- `config/projects.json`: categories, projects, skills, icon mapping.

You never need to touch source code to change content.

### 3.1 Personal info (edit `.env`)

1. Copy the template (you already did this in Section 2).
2. Open `.env` in your editor.
3. Fill in your values.

| Variable group       | What it controls                                                |
| -------------------- | --------------------------------------------------------------- |
| `OWNER_*`            | Your name, title, avatar path, bio (English and Spanish)        |
| `DEFAULT_LANGUAGE`   | `en` or `es` (visitor's browser still wins when it matches)     |
| `ANIMATIONS`         | `true` / `false`, toggle scroll-driven animations              |
| `DEFAULT_THEME`      | `light`, `dark`, or `system`                                    |
| `LIGHT_*` / `DARK_*` | Full color palette per theme                                    |
| `CB_*`               | Okabe-Ito safe accents used when colorblind mode is on          |
| `SOCIAL_*`           | Links to GitHub, LinkedIn, email, X, Instagram (empty = hidden) |
| `MUSIC_*`            | Background music toggle, file path, default volume              |

Restart the dev server after editing `.env`.

### 3.2 Categories (edit `config/projects.json`)

Each category becomes its own page section, with a heading, a short description, an auto-derived skills row and a project grid below.

Categories live in the `"categories"` array at the top of `config/projects.json`. Each entry looks like this:

```json
{
  "id": "ai",
  "enabled": true,
  "label_en": "AI Development",
  "label_es": "Desarrollo IA",
  "description_en": "Designing and shipping AI systems end to end…",
  "description_es": "Diseño y despliegue de sistemas con IA…"
}
```

- **Add a category**: append a new object with a unique `id`. The section appears automatically when at least one project uses that `id` in its `category` field.
- **Remove a category**: delete the object from the array. Or set `enabled` to `false` to hide it without losing the data. Hidden categories also hide every project that belongs to them.
- **Reorder categories**: change the order of the objects in the array.
- **Rename a category**: edit its `label_en` and `label_es`.

### 3.3 Projects (edit `config/projects.json`)

Each project lives in the `"projects"` array. Each entry looks like this:

```json
{
  "id": "my-project",
  "category": "ai",
  "title_en": "My Project",
  "title_es": "Mi Proyecto",
  "description_en": "Short summary in English.",
  "description_es": "Resumen corto en español.",
  "details_en": "Optional longer explanation shown when the visitor clicks Show more.",
  "details_es": "Explicación más larga opcional, mostrada al hacer clic en Ver más.",
  "tools": ["React", "Python"],
  "links": [{ "label": "GitHub", "url": "https://github.com/you/my-project" }],
  "imageFolder": "my-project"
}
```

- **Add a project**: append a new object. Make sure:
  - `id` is unique.
  - `category` matches an existing category `id`.
  - `imageFolder` matches a folder you create under `public/projects/`.
- **Remove a project**: delete the object from the array. Also delete the corresponding folder under `public/projects/` if you no longer need the images.
- **Bilingual fields**: every `_en` field needs a matching `_es` counterpart.
- **`details_en` / `details_es`** are optional. If both are empty or omitted, the Show more button still expands the modal (revealing the image carousel, tools, description and links) but no extra paragraphs render. Drop in long-form copy whenever you have it.
- **`tools`**: each name automatically feeds the per-category skills row and the global Skills section. No manual upkeep.
- **`links`**: each link is rendered as a glass button at the end of the description.

### 3.4 Project images

Drop image files into `public/projects/<imageFolder>/`:

```
public/projects/my-project/
├── 01-hero.jpg
├── 02-detail.webp
└── 03-screenshot.png
```

- **Folder name** must match the `imageFolder` field of the corresponding project.
- **File names** can be anything. Images appear in the carousel sorted alphabetically, so prefix with `01_`, `02_`, … to control the sequence.
- **Supported formats:** `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`.
- **Add an image**: drop the file in the folder. In dev mode it appears instantly; for production rebuild with `pnpm build`.
- **Remove an image**: delete the file. The carousel updates automatically.
- **Aspect ratio**: the carousel renders at 16:9 with `object-cover`, so wide screenshots and full-bleed shots look best. Anything narrower will be cropped.

### 3.5 Skills section

The Skills section at the end of the page groups every tool you mention across your projects, plus any extras you list manually.

Three fields in `config/projects.json` control it:

**`skillGroups`**: the buckets and their order. Bilingual labels:

```json
"skillGroups": [
  { "id": "languages", "label_en": "Languages", "label_es": "Lenguajes" },
  { "id": "ai", "label_en": "AI / ML", "label_es": "IA / ML" }
]
```

**`skillGroupOf`**: maps each skill name to its bucket id. Skills with no mapping fall into an auto-generated "Other" bucket so nothing is ever lost:

```json
"skillGroupOf": {
  "Python": "languages",
  "PyTorch": "ai",
  "Cursor": "tools"
}
```

**`skillsExtra`**: skills you want to display but haven't shipped a project around yet:

```json
"skillsExtra": ["Rust", "Cursor", "Figma"]
```

Skills used in projects (`tools[]`) and skills in `skillsExtra` are deduplicated and merged automatically.

### 3.6 Skill icons (optional)

Drop SVG (or PNG / WebP) icons into `public/icons/`, named after the slugified skill name:

```
public/icons/react.svg
public/icons/node-js.svg   ← "Node.js"
public/icons/cpp.svg       ← "C++"
```

Slug rules: lowercase; spaces, `.` and `/` become `-`; `++` becomes `pp`; `#` becomes `sharp`.

If the natural slug is awkward, add an override under `"skillIcons"` in `config/projects.json`:

```json
"skillIcons": {
  "Node.js": "nodejs",
  "Apollo Federation": "apollo"
}
```

Skills with no icon file just render as text, and nothing breaks.

Suggested sources: [Devicon](https://devicon.dev/) and [Simple Icons](https://simpleicons.org/). See [`public/icons/README.md`](public/icons/README.md) for the full details.

### 3.7 Background music (optional)

1. Drop an audio file in `public/audio/`, e.g. `track.mp3`.
2. In `.env`, set `VITE_MUSIC_FILE=/audio/track.mp3`.
3. In `.env`, set `VITE_MUSIC_ENABLED=true` to show the toggle in the navbar.

The audio always starts paused; the visitor decides whether to enable it.

### 3.8 Add a new language

1. Create `src/i18n/locales/<code>.json` (copy `en.json` as a starting point).
2. Register it in `src/i18n/index.ts` (`resources` and `supportedLngs`).
3. For every entry in `config/projects.json`, add the matching `title_<code>`, `description_<code>`, `details_<code>`, `label_<code>` fields.
4. Update `localizedProject` and `visibleCategories` in `src/config/projects.ts` to read the new fields.

---

## 4. Useful commands

Every command assumes you have already run `pnpm install` (or `make install`). Each command is on its own line, so copy them one by one.

### Start the dev server

- `pnpm dev`
- `make dev`

Opens the site at <http://localhost:5173> with hot reload.

### Production build

- `pnpm build`
- `make build`

Outputs an optimized static site to `dist/`.

### Preview the production build locally

- `pnpm preview`
- `make preview`

Serves whatever is in `dist/` so you can sanity-check before deploying.

### Type-check only (no build output)

- `pnpm exec tsc -b --noEmit`
- `make typecheck`

Useful in CI or as a pre-commit check.

### Clean build artifacts

- `rm -rf dist node_modules/.vite` (macOS / Linux)
- `Remove-Item -Recurse -Force dist, node_modules\.vite` (Windows PowerShell)
- `make clean`

### Reinstall dependencies from scratch

- `rm -rf node_modules pnpm-lock.yaml && pnpm install` (macOS / Linux)
- `Remove-Item -Recurse -Force node_modules, pnpm-lock.yaml; pnpm install` (Windows PowerShell)

### Deploy to GitHub Pages (manual)

- `pnpm run deploy`
- `make deploy`

---

## 5. Deploy

### Option A: GitHub Actions (recommended)

1. Push your fork to `main`.
2. In your repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Add your `.env` to repository secrets so the build sees your real values (see below).
4. The workflow in [.github/workflows/deploy.yml](.github/workflows/deploy.yml) builds and publishes on every push to `main`. It sets `VITE_BASE_PATH` to `/<repo-name>/` automatically.

Your site will be at `https://<username>.github.io/<repo-name>/`.

#### Provide your `.env` to the workflow

`.env` is gitignored (good, since it may hold Supabase keys, social links, etc.), so the workflow can't see it at build time. To inject it:

1. Open <https://github.com/`<your-user>`/`<your-repo>`/settings/secrets/actions>.
2. Click **New repository secret**.
3. **Name:** `ENV_FILE_MIMIR`.
4. **Secret:** paste the **full contents** of your local `.env` file (every `VITE_*=...` line).
5. Save.

The workflow writes that secret to `.env` at the start of every build. If the secret isn't set, it falls back to `.env.example` so the build doesn't break, but the site will show placeholder content.

**You only need to update the secret when you change `.env`.** Adding a project, image, skill or editing source code does **not** require touching the secret; those changes are read from `config/projects.json`, `public/`, and the source tree, which are committed and pushed normally.

### Option B: Manual

Run `pnpm run deploy` (or `make deploy`). This builds and pushes `dist/` to the `gh-pages` branch.

> If you deploy to a base path different from `/mimir/`, set `VITE_BASE_PATH` in `.env`.

### Option C: Any static host

Run `pnpm build` and upload the contents of `dist/` to Netlify, Vercel, Cloudflare Pages, S3, or any static host.

---

## 6. Architecture

Mimir is a **static site**. There is no server, no database (unless you opt in to Supabase). Everything you see on the page comes from three sources read at build time:

1. **Environment variables** (`.env`) → loaded by Vite and exposed under `import.meta.env.VITE_*`.
2. **`config/projects.json`** → imported as plain JSON and normalized by `src/config/projects.ts`.
3. **`public/`** → served verbatim (images, icons, audio, avatar).

### 6.1 Top-level layout

```
mimir/
├── .env.example           # template, copy to .env
├── Makefile               # cross-OS shortcuts for install / dev / build / deploy
├── README.md              # this file (English)
├── README.es.md           # Spanish version
├── index.html             # Vite entry HTML
├── package.json           # scripts and dependencies
├── pnpm-lock.yaml         # locked dependency tree (commit this)
├── tailwind.config.ts     # theme tokens, CSS variable bridges
├── vite.config.ts         # Vite + base path config
├── tsconfig*.json         # TypeScript projects (app + node)
├── config/
│   └── projects.json      # categories, projects, skills, icon overrides
├── docs/                  # logo, screenshots, written assets
├── public/                # static files served as-is
├── src/                   # application source
├── supabase/              # optional backend (forms, analytics), safe to delete
└── .github/workflows/     # GitHub Pages deploy workflow
```

### 6.2 `public/` (static assets)

```
public/
├── projects/              # one folder per project, name = imageFolder
│   └── <imageFolder>/
│       ├── 01-hero.jpg
│       └── 02-detail.webp
├── icons/                 # skill icons (slug-based filenames)
├── audio/                 # optional background music
└── avatar.jpg             # your avatar (referenced from .env)
```

Anything in `public/` is copied straight to the build output. Use absolute paths (e.g. `/avatar.jpg`) to reference these files from `.env`.

### 6.3 `src/` (application code)

```
src/
├── main.tsx               # React entry, mounts <App /> and i18n
├── App.tsx                # top-level layout, section composition
├── vite-env.d.ts          # typed import.meta.env
├── config/                # config loaders, read .env and projects.json
├── components/            # React components, grouped by purpose
│   ├── layout/            # navbar, footer, page chrome
│   ├── sections/          # hero, categories, skills, contact
│   ├── project/           # project card, modal, carousel
│   ├── controls/          # theme, language, music, colorblind toggles
│   ├── glass/             # reusable liquid-glass primitives
│   ├── motion/            # framer-motion wrappers (reveal, parallax)
│   └── NeuralBackground.tsx  # animated WebGL/SVG backdrop
├── hooks/                 # useTheme, useAudio, useMediaQuery, …
├── i18n/                  # i18next setup + locales/ (en.json, es.json)
├── lib/                   # framework-agnostic helpers (supabase, fetch)
├── styles/                # globals.css + liquid-glass utilities
└── utils/                 # pure functions (slugify, sort, image helpers)
```

#### Where to add things

| You want to…                            | Edit…                                              |
| --------------------------------------- | -------------------------------------------------- |
| Add a project or category               | `config/projects.json`                             |
| Change colors, name, social links       | `.env`                                             |
| Add a new UI string                     | `src/i18n/locales/en.json` and `es.json`           |
| Add a new section to the page          | new file in `src/components/sections/` + mount it in `src/App.tsx` |
| Add a new control (e.g. font-size)      | new file in `src/components/controls/`             |
| Add a new theme or visual variant       | extend tokens in `tailwind.config.ts` + `src/styles/` |
| Add a new animation                     | wrap with helpers in `src/components/motion/`      |
| Add a new language                      | follow [Section 3.8](#38-add-a-new-language)       |
| Wire a contact form                     | `src/lib/` (Supabase helpers) + new section        |

### 6.4 Data flow

```
   .env  ──┐
           ├──►  src/config/  ──►  React components  ──►  rendered HTML
projects.json ──┘                       │
                                        ├──►  i18next (UI strings)
                                        └──►  Tailwind + CSS vars (theme)
```

- `src/config/env.ts` parses `import.meta.env.VITE_*` into a typed object.
- `src/config/projects.ts` imports `config/projects.json`, validates it, and exposes helpers like `localizedProject(p, lang)` and `visibleCategories(lang)` so components never deal with raw bilingual fields.
- `src/config/theme.ts` writes CSS variables (`--bg`, `--fg`, `--accent`, …) from `.env` so Tailwind utilities resolve to the right color in every theme.

### 6.5 Adding a new visible section (example)

Say you want a "Talks" section:

1. Create `src/components/sections/Talks.tsx`.
2. Add UI strings (heading, empty state) to `src/i18n/locales/en.json` and `es.json`.
3. Mount `<Talks />` in `src/App.tsx` between two existing sections.
4. (Optional) If the section is data-driven, add a new array to `config/projects.json` and read it via a helper in `src/config/projects.ts`.

No router, no lazy loading, no global state library. One page, one render tree.

---

## 7. Contributing

Mimir is open source and contributions are welcome.

- **Bugs and feature requests**: open an issue with a clear repro and your OS / browser.
- **Pull requests**: fork, branch off `main`, run `pnpm exec tsc -b --noEmit` before pushing.
- **Translations**: adding a third language is the highest-leverage contribution. Follow [Section 3.8](#38-add-a-new-language) and open a PR.
- **Themes**: drop a `themes/<name>.env` preset and we'll add it to the docs.
- **Discussions**: proposals for new sections, layouts or integrations go in GitHub Discussions.

By contributing you agree that your contribution is released under the project's MIT license.

---

## 8. License

**MIT**: fork it, make it yours. No attribution required, but a star on the repo is always appreciated.
