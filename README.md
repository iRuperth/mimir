# Mimir — Portfolio Template

A reusable, lightweight portfolio template with liquid glass styling, scroll-driven animations, project carousels by category, light / dark / colorblind modes, optional background music, and full English / Spanish localization. Nothing is hardcoded — fork it, edit `.env` and `config/projects.json`, and deploy.

Named after **Mímir**, the Norse god of knowledge and wisdom.

> 🇪🇸 Spanish version: [`README.es.md`](README.es.md)

---

## 1. Requirements

You need:

- **Node.js 20 or newer** — download from <https://nodejs.org>
- **pnpm** — installed via Corepack (two commands, see below)
- **Git** — download from <https://git-scm.com>

### Install pnpm (one time, any OS)

Run these two commands once. They work on macOS, Linux, and Windows:

- `corepack enable`
- `corepack prepare pnpm@latest --activate`

Verify the installation:

- `pnpm --version`

---

## 2. Start the project

Pick the section that matches your OS.

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

> **Note:** the dev server hot-reloads. Edits to `.env` require a server restart; edits to `config/projects.json`, images, and source files apply instantly.

---

## 3. Customize the site

All site content lives in **two files**:

- `.env` — your personal info, theme colors, social links.
- `config/projects.json` — categories, projects, skills, icon mapping.

You never need to touch source code to change content.

### 3.1 Personal info — edit `.env`

1. Copy the template (you already did this in section 2 with `cp` / `Copy-Item` / `copy`).
2. Open `.env` in your editor.
3. Fill in your values.

| Variable group       | What it controls                                                |
| -------------------- | --------------------------------------------------------------- |
| `OWNER_*`            | Your name, title, avatar path, bio (English and Spanish)        |
| `DEFAULT_LANGUAGE`   | `en` or `es` (visitor's browser still wins when it matches)     |
| `ANIMATIONS`         | `true` / `false` — toggle scroll-driven animations              |
| `DEFAULT_THEME`      | `light`, `dark`, or `system`                                    |
| `LIGHT_*` / `DARK_*` | Full color palette per theme                                    |
| `CB_*`               | Okabe-Ito safe accents used when colorblind mode is on          |
| `SOCIAL_*`           | Links to GitHub, LinkedIn, email, X, Instagram (empty = hidden) |
| `MUSIC_*`            | Background music toggle, file path, default volume              |

Restart the dev server after editing `.env`.

### 3.2 Categories — edit `config/projects.json`

Each category becomes its own page section, with a heading, a short description, an auto-derived skills row, and a project grid below.

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

- **Add a category** — append a new object with a unique `id`. The section appears automatically when at least one project uses that `id` in its `category` field.
- **Remove a category** — delete the object from the array. Or set `enabled` to `false` to hide it without losing the data. Hidden categories also hide every project that belongs to them.
- **Reorder categories** — change the order of the objects in the array.
- **Rename a category** — edit its `label_en` and `label_es`.

### 3.3 Projects — edit `config/projects.json`

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

- **Add a project** — append a new object. Make sure:
  - `id` is unique.
  - `category` matches an existing category `id`.
  - `imageFolder` matches a folder you create under `public/projects/`.
- **Remove a project** — delete the object from the array. Also delete the corresponding folder under `public/projects/` if you no longer need the images.
- **Bilingual fields** — every `_en` field needs a matching `_es` counterpart.
- **`details_en` / `details_es`** are optional. If both are empty or omitted, the Show more button still expands the modal (revealing the image carousel, tools, description, and links) but no extra paragraphs render. Drop in long-form copy whenever you have it.
- **`tools`** — each name automatically feeds the per-category skills row and the global Skills section. No manual upkeep.
- **`links`** — each link is rendered as a glass button at the end of the description.

### 3.4 Project images

Drop image files into `public/projects/<imageFolder>/`:

```
public/projects/my-project/
├── 01-hero.jpg
├── 02-detail.webp
└── 03-screenshot.png
```

- **Folder name** must match the `imageFolder` field of the corresponding project.
- **File names** can be anything. Images appear in the carousel sorted alphabetically — prefix with `01_`, `02_`, … to control the sequence.
- **Supported formats:** `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`.
- **Add an image** — drop the file in the folder. In dev mode it appears instantly; for production rebuild with `pnpm build`.
- **Remove an image** — delete the file. The carousel updates automatically.
- **Aspect ratio** — the carousel renders at 16:9 with `object-cover`, so wide screenshots and full-bleed shots look best. Anything narrower will be cropped.

### 3.5 Skills section

The Skills section at the end of the page groups every tool you mention across your projects, plus any extras you list manually.

Three fields in `config/projects.json` control it:

**`skillGroups`** — the buckets and their order. Bilingual labels:

```json
"skillGroups": [
  { "id": "languages", "label_en": "Languages", "label_es": "Lenguajes" },
  { "id": "ai", "label_en": "AI / ML", "label_es": "IA / ML" }
]
```

**`skillGroupOf`** — maps each skill name to its bucket id. Skills with no mapping fall into an auto-generated "Other" bucket so nothing is ever lost:

```json
"skillGroupOf": {
  "Python": "languages",
  "PyTorch": "ai",
  "Cursor": "tools"
}
```

**`skillsExtra`** — skills you want to display but haven't shipped a project around yet:

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

Skills with no icon file just render as text — nothing breaks.

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

Every command assumes you have already run `pnpm install` (or `make install`).

### Start the dev server

- macOS / Linux: `pnpm dev`
- Windows: `pnpm dev`
- Make: `make dev`

### Production build

- macOS / Linux: `pnpm build`
- Windows: `pnpm build`
- Make: `make build`

### Preview the production build locally

- macOS / Linux: `pnpm preview`
- Windows: `pnpm preview`
- Make: `make preview`

### Type-check only (no build output)

- macOS / Linux: `pnpm exec tsc -b --noEmit`
- Windows: `pnpm exec tsc -b --noEmit`
- Make: `make typecheck`

### Clean build artifacts

- macOS / Linux: `rm -rf dist node_modules/.vite`
- Windows (PowerShell): `Remove-Item -Recurse -Force dist, node_modules\.vite`
- Make: `make clean`

### Deploy to GitHub Pages

- macOS / Linux: `pnpm run deploy`
- Windows: `pnpm run deploy`
- Make: `make deploy`

---

## 5. Deploy

### Option A — GitHub Actions (recommended)

1. Push your fork to `main`.
2. In your repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. The workflow in [.github/workflows/deploy.yml](.github/workflows/deploy.yml) builds and publishes on every push. It sets `VITE_BASE_PATH` to `/<repo-name>/` automatically.

Your site will be at `https://<username>.github.io/<repo-name>/`.

### Option B — Manual

Run `pnpm run deploy` (or `make deploy`). This builds and pushes `dist/` to the `gh-pages` branch.

> If you deploy to a base path different from `/mimir/`, set `VITE_BASE_PATH` in `.env`.

---

## 6. Stack

- **Vite 5** + **React 18** + **TypeScript** — static build, small bundle
- **Tailwind CSS** — utility classes, theme via CSS variables
- **Framer Motion** — scroll-driven animations
- **embla-carousel-react** — accessible image carousel
- **i18next** — internationalization

Target bundle size: 150–200 KB gzip.

---

## 7. Project layout

```
mimir/
├── .env.example           # template (copy to .env)
├── config/
│   └── projects.json      # categories, projects, skills, icon mapping
├── public/
│   ├── projects/          # project images, one folder per project
│   ├── icons/             # skill icons (slug-based filenames)
│   ├── audio/             # optional background music
│   └── avatar.jpg         # your avatar
├── src/
│   ├── config/            # env / theme / projects loaders
│   ├── components/        # ui (layout, sections, project, controls, glass)
│   ├── hooks/             # useTheme, useAudio, etc.
│   ├── i18n/              # translations
│   └── styles/            # globals + liquid glass utilities
└── .github/workflows/     # GitHub Pages deploy workflow
```

---

## License

MIT — fork it, make it yours.
