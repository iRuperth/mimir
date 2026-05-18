# Mimir — Portfolio Template

A reusable, lightweight portfolio template with **liquid glass** styling, Apple-style scroll animations, project carousels by category, light/dark/colorblind modes, optional background music, and full English/Spanish localization. Nothing is hardcoded — fork it, edit `.env` and `config/projects.json`, and deploy.

Named after **Mímir**, the Norse god of knowledge and wisdom.

---

## Quick start

```bash
git clone <your-fork> mimir
cd mimir
cp .env.example .env       # edit your values
pnpm install
pnpm dev                   # http://localhost:5173
```

> Requires [pnpm](https://pnpm.io/) (`corepack enable && corepack prepare pnpm@latest --activate`).

## Make it yours

### 1. Personal info & theme — edit `.env`

Open `.env` and tweak:

| Group        | What it controls                                                  |
| ------------ | ----------------------------------------------------------------- |
| `OWNER_*`    | Your name, title, avatar path, bio (EN and ES)                    |
| `DEFAULT_LANGUAGE` | `en` or `es` (browser detection still applies for visitors) |
| `ANIMATIONS` | `true` / `false` — toggle scroll-driven animations                |
| `DEFAULT_THEME` | `light` / `dark` / `system`                                    |
| `LIGHT_*` / `DARK_*` | Full color palette per theme                            |
| `CB_*`       | Okabe-Ito safe accents used when colorblind mode is enabled       |
| `SOCIAL_*`   | Links to GitHub, LinkedIn, email, X, Instagram (empty = hidden)   |
| `MUSIC_*`    | Background music toggle, file path, default volume               |

### 2. Projects — edit `config/projects.json`

Each project has bilingual fields (`_en` / `_es`), a category, tools, links, and an `imageFolder`:

```json
{
  "id": "my-project",
  "category": "ai",
  "title_en": "My Project",
  "title_es": "Mi Proyecto",
  "description_en": "...",
  "description_es": "...",
  "tools": ["React", "Python"],
  "links": [{ "label": "GitHub", "url": "https://..." }],
  "imageFolder": "my-project"
}
```

Add or rename categories in the `categories` array — categories with no projects are auto-hidden.

### 3. Project images

Drop images into `public/projects/<imageFolder>/`:

```
public/projects/my-project/01.jpg
public/projects/my-project/02.webp
```

They are auto-discovered at build time and shown in the carousel sorted alphabetically.
Supported: `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`.

### 4. Background music (optional)

1. Drop an audio file in `public/audio/`, e.g. `track.mp3`.
2. Set `VITE_MUSIC_FILE=/audio/track.mp3` in `.env`.
3. Set `VITE_MUSIC_ENABLED=true` to show the toggle in the navbar.

The audio starts paused; visitors enable it with the switch.

### 5. Add a new language

1. Add `src/i18n/locales/<code>.json` (copy `en.json`).
2. Register it in `src/i18n/index.ts` (`resources` and `supportedLngs`).
3. Add matching `title_<code>`, `description_<code>`, `label_<code>` fields in `config/projects.json`.
4. Update `localizedProject` and `visibleCategories` in `src/config/projects.ts`.

---

## Deploy to GitHub Pages

### Option A — GitHub Actions (recommended)

1. Push to `main`.
2. In your repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. The workflow in [.github/workflows/deploy.yml](.github/workflows/deploy.yml) builds and publishes on every push. It sets `VITE_BASE_PATH` to `/<repo-name>/` automatically.

Your site will be at `https://<username>.github.io/<repo-name>/`.

### Option B — Manual

```bash
pnpm run deploy
```

This builds and pushes `dist/` to the `gh-pages` branch.

> **Note:** if you deploy to a different base path than `/mimir/`, set `VITE_BASE_PATH` in `.env`.

---

## Scripts

| Command         | What it does                               |
| --------------- | ------------------------------------------ |
| `pnpm dev`      | Start Vite dev server with hot reload      |
| `pnpm build`    | Type-check and build to `dist/`            |
| `pnpm preview`  | Preview the production build locally       |
| `pnpm run deploy` | Build and publish to the `gh-pages` branch |

---

## Stack

- **Vite 5** + **React 18** + **TypeScript** — static build, small bundle
- **Tailwind CSS** — utility classes, theme via CSS variables
- **Framer Motion** — scroll-driven animations
- **embla-carousel-react** — accessible image carousel
- **i18next** — internationalization

Target bundle: ~150–200 KB gzip.

---

## Project layout

```
mimir/
├── .env.example           # template (copy to .env)
├── config/
│   └── projects.json      # project metadata
├── public/
│   ├── projects/          # project images, one folder per project
│   ├── audio/             # optional background music
│   └── avatar.jpg         # your avatar
├── src/
│   ├── config/            # env/theme/projects loaders
│   ├── components/        # ui (layout, sections, project, controls, glass)
│   ├── hooks/             # useTheme, useAudio
│   ├── i18n/              # translations
│   └── styles/            # globals + liquid glass utilities
└── .github/workflows/     # GitHub Pages deploy
```

---

## License

MIT — fork it, make it yours.
