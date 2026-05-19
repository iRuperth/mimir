# Mimir — Plantilla de Portfolio

Una plantilla de portfolio reutilizable y ligera con estilo liquid glass, animaciones impulsadas por el scroll, carousels de proyectos por categoría, modos claro / oscuro / daltónico, música de fondo opcional y localización completa en inglés / español. Nada está hardcodeado — haz un fork, edita `.env` y `config/projects.json`, y despliega.

Llamado así por **Mímir**, el dios nórdico del conocimiento y la sabiduría.

> 🇬🇧 English version: [`README.md`](README.md)

---

## 1. Requisitos

Necesitas:

- **Node.js 20 o superior** — descárgalo desde <https://nodejs.org>
- **pnpm** — instalado mediante Corepack (dos comandos, ver abajo)
- **Git** — descárgalo desde <https://git-scm.com>

### Instalar pnpm (una sola vez, cualquier OS)

Ejecuta estos dos comandos una vez. Funcionan en macOS, Linux y Windows:

- `corepack enable`
- `corepack prepare pnpm@latest --activate`

Verifica la instalación:

- `pnpm --version`

---

## 2. Arrancar el proyecto

Elige la sección que corresponda a tu OS.

### macOS

- `git clone https://github.com/<your-user>/mimir.git`
- `cd mimir`
- `cp .env.example .env`
- `pnpm install`
- `pnpm dev`

Luego abre <http://localhost:5173> en tu navegador.

### Linux

- `git clone https://github.com/<your-user>/mimir.git`
- `cd mimir`
- `cp .env.example .env`
- `pnpm install`
- `pnpm dev`

Luego abre <http://localhost:5173> en tu navegador.

### Windows (PowerShell)

- `git clone https://github.com/<your-user>/mimir.git`
- `cd mimir`
- `Copy-Item .env.example .env`
- `pnpm install`
- `pnpm dev`

Luego abre <http://localhost:5173> en tu navegador.

### Windows (Command Prompt)

- `git clone https://github.com/<your-user>/mimir.git`
- `cd mimir`
- `copy .env.example .env`
- `pnpm install`
- `pnpm dev`

Luego abre <http://localhost:5173> en tu navegador.

### Con `make` (cualquier OS que tenga GNU Make instalado)

- `git clone https://github.com/<your-user>/mimir.git`
- `cd mimir`
- `cp .env.example .env`
- `make install`
- `make dev`

Luego abre <http://localhost:5173> en tu navegador.

> **Nota:** el servidor de desarrollo hace hot-reload. Las ediciones en `.env` requieren reiniciar el servidor; las ediciones en `config/projects.json`, imágenes y archivos fuente se aplican al instante.

---

## 3. Personaliza el sitio

Todo el contenido del sitio vive en **dos archivos**:

- `.env` — tu información personal, colores del tema, enlaces sociales.
- `config/projects.json` — categorías, proyectos, skills, mapeo de iconos.

Nunca necesitas tocar el código fuente para cambiar el contenido.

### 3.1 Información personal — edita `.env`

1. Copia la plantilla (ya lo hiciste en la sección 2 con `cp` / `Copy-Item` / `copy`).
2. Abre `.env` en tu editor.
3. Rellena tus valores.

| Variable group       | Qué controla                                                              |
| -------------------- | ------------------------------------------------------------------------- |
| `OWNER_*`            | Tu nombre, título, ruta del avatar, bio (en inglés y español)             |
| `DEFAULT_LANGUAGE`   | `en` o `es` (el navegador del visitante prevalece si coincide)            |
| `ANIMATIONS`         | `true` / `false` — activa o desactiva las animaciones por scroll          |
| `DEFAULT_THEME`      | `light`, `dark` o `system`                                                |
| `LIGHT_*` / `DARK_*` | Paleta de colores completa por tema                                       |
| `CB_*`               | Acentos seguros Okabe-Ito que se usan cuando el modo daltónico está activo |
| `SOCIAL_*`           | Enlaces a GitHub, LinkedIn, email, X, Instagram (vacío = oculto)          |
| `MUSIC_*`            | Interruptor de música de fondo, ruta del archivo, volumen por defecto     |

Reinicia el servidor de desarrollo después de editar `.env`.

### 3.2 Categorías — edita `config/projects.json`

Cada categoría se convierte en su propia sección de página, con un encabezado, una descripción breve, una fila de skills derivada automáticamente y una rejilla de proyectos debajo.

Las categorías viven en el array `"categories"` al principio de `config/projects.json`. Cada entrada tiene este aspecto:

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

- **Añadir una categoría** — añade un nuevo objeto con un `id` único. La sección aparece automáticamente cuando al menos un proyecto usa ese `id` en su campo `category`.
- **Eliminar una categoría** — borra el objeto del array. O pon `enabled` a `false` para ocultarla sin perder los datos. Las categorías ocultas también ocultan todos los proyectos que les pertenecen.
- **Reordenar categorías** — cambia el orden de los objetos en el array.
- **Renombrar una categoría** — edita su `label_en` y `label_es`.

### 3.3 Proyectos — edita `config/projects.json`

Cada proyecto vive en el array `"projects"`. Cada entrada tiene este aspecto:

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

- **Añadir un proyecto** — añade un nuevo objeto. Asegúrate de que:
  - `id` sea único.
  - `category` coincida con un `id` de categoría existente.
  - `imageFolder` coincida con una carpeta que crees bajo `public/projects/`.
- **Eliminar un proyecto** — borra el objeto del array. Borra también la carpeta correspondiente bajo `public/projects/` si ya no necesitas las imágenes.
- **Campos bilingües** — cada campo `_en` necesita su contraparte `_es`.
- **`details_en` / `details_es`** son opcionales. Si ambos están vacíos u omitidos, el botón Ver más sigue expandiendo el modal (revelando el carousel de imágenes, las herramientas, la descripción y los enlaces) pero no se renderizan párrafos adicionales. Añade texto largo cuando lo tengas.
- **`tools`** — cada nombre alimenta automáticamente la fila de skills por categoría y la sección global de Skills. Sin mantenimiento manual.
- **`links`** — cada enlace se renderiza como un botón glass al final de la descripción.

### 3.4 Imágenes de proyecto

Coloca los archivos de imagen en `public/projects/<imageFolder>/`:

```
public/projects/my-project/
├── 01-hero.jpg
├── 02-detail.webp
└── 03-screenshot.png
```

- **El nombre de la carpeta** debe coincidir con el campo `imageFolder` del proyecto correspondiente.
- **Los nombres de archivo** pueden ser cualquiera. Las imágenes aparecen en el carousel ordenadas alfabéticamente — usa el prefijo `01_`, `02_`, … para controlar la secuencia.
- **Formatos soportados:** `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`.
- **Añadir una imagen** — coloca el archivo en la carpeta. En modo desarrollo aparece al instante; para producción reconstruye con `pnpm build`.
- **Eliminar una imagen** — borra el archivo. El carousel se actualiza automáticamente.
- **Relación de aspecto** — el carousel se renderiza a 16:9 con `object-cover`, así que las capturas anchas y las imágenes a sangre completa quedan mejor. Cualquier imagen más estrecha será recortada.

### 3.5 Sección Skills

La sección Skills al final de la página agrupa todas las herramientas que mencionas en tus proyectos, además de las extras que listes manualmente.

Tres campos en `config/projects.json` la controlan:

**`skillGroups`** — los grupos y su orden. Etiquetas bilingües:

```json
"skillGroups": [
  { "id": "languages", "label_en": "Languages", "label_es": "Lenguajes" },
  { "id": "ai", "label_en": "AI / ML", "label_es": "IA / ML" }
]
```

**`skillGroupOf`** — mapea cada nombre de skill a su id de grupo. Las skills sin mapeo caen en un grupo "Other" generado automáticamente para que nada se pierda nunca:

```json
"skillGroupOf": {
  "Python": "languages",
  "PyTorch": "ai",
  "Cursor": "tools"
}
```

**`skillsExtra`** — skills que quieres mostrar pero alrededor de las cuales aún no has lanzado un proyecto:

```json
"skillsExtra": ["Rust", "Cursor", "Figma"]
```

Las skills usadas en proyectos (`tools[]`) y las skills en `skillsExtra` se deduplican y fusionan automáticamente.

### 3.6 Iconos de skills (opcional)

Coloca iconos SVG (o PNG / WebP) en `public/icons/`, nombrados según el nombre de la skill slugificado:

```
public/icons/react.svg
public/icons/node-js.svg   ← "Node.js"
public/icons/cpp.svg       ← "C++"
```

Reglas del slug: minúsculas; los espacios, `.` y `/` se convierten en `-`; `++` se convierte en `pp`; `#` se convierte en `sharp`.

Si el slug natural resulta incómodo, añade un override bajo `"skillIcons"` en `config/projects.json`:

```json
"skillIcons": {
  "Node.js": "nodejs",
  "Apollo Federation": "apollo"
}
```

Las skills sin archivo de icono se renderizan simplemente como texto — nada se rompe.

Fuentes sugeridas: [Devicon](https://devicon.dev/) y [Simple Icons](https://simpleicons.org/). Consulta [`public/icons/README.md`](public/icons/README.md) para todos los detalles.

### 3.7 Música de fondo (opcional)

1. Coloca un archivo de audio en `public/audio/`, p. ej. `track.mp3`.
2. En `.env`, pon `VITE_MUSIC_FILE=/audio/track.mp3`.
3. En `.env`, pon `VITE_MUSIC_ENABLED=true` para mostrar el interruptor en la navbar.

El audio siempre arranca en pausa; el visitante decide si activarlo.

### 3.8 Añadir un nuevo idioma

1. Crea `src/i18n/locales/<code>.json` (copia `en.json` como punto de partida).
2. Regístralo en `src/i18n/index.ts` (`resources` y `supportedLngs`).
3. Para cada entrada en `config/projects.json`, añade los campos `title_<code>`, `description_<code>`, `details_<code>`, `label_<code>` correspondientes.
4. Actualiza `localizedProject` y `visibleCategories` en `src/config/projects.ts` para leer los nuevos campos.

---

## 4. Comandos útiles

Cada comando asume que ya has ejecutado `pnpm install` (o `make install`).

### Arrancar el servidor de desarrollo

- macOS / Linux: `pnpm dev`
- Windows: `pnpm dev`
- Make: `make dev`

### Build de producción

- macOS / Linux: `pnpm build`
- Windows: `pnpm build`
- Make: `make build`

### Previsualizar el build de producción localmente

- macOS / Linux: `pnpm preview`
- Windows: `pnpm preview`
- Make: `make preview`

### Solo type-check (sin output de build)

- macOS / Linux: `pnpm exec tsc -b --noEmit`
- Windows: `pnpm exec tsc -b --noEmit`
- Make: `make typecheck`

### Limpiar artefactos de build

- macOS / Linux: `rm -rf dist node_modules/.vite`
- Windows (PowerShell): `Remove-Item -Recurse -Force dist, node_modules\.vite`
- Make: `make clean`

### Desplegar en GitHub Pages

- macOS / Linux: `pnpm run deploy`
- Windows: `pnpm run deploy`
- Make: `make deploy`

---

## 5. Desplegar

### Opción A — GitHub Actions (recomendado)

1. Haz push de tu fork a `main`.
2. En tu repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. El workflow en [.github/workflows/deploy.yml](.github/workflows/deploy.yml) hace el build y publica en cada push. Configura `VITE_BASE_PATH` a `/<repo-name>/` automáticamente.

Tu sitio estará en `https://<username>.github.io/<repo-name>/`.

### Opción B — Manual

Ejecuta `pnpm run deploy` (o `make deploy`). Esto hace el build y publica `dist/` en la branch `gh-pages`.

> Si despliegas en una base path distinta a `/mimir/`, configura `VITE_BASE_PATH` en `.env`.

---

## 6. Stack

- **Vite 5** + **React 18** + **TypeScript** — build estático, bundle pequeño
- **Tailwind CSS** — clases utilitarias, tema mediante variables CSS
- **Framer Motion** — animaciones impulsadas por el scroll
- **embla-carousel-react** — carousel de imágenes accesible
- **i18next** — internacionalización

Tamaño objetivo del bundle: 150–200 KB gzip.

---

## 7. Estructura del proyecto

```
mimir/
├── .env.example           # plantilla (copia a .env)
├── config/
│   └── projects.json      # categorías, proyectos, skills, mapeo de iconos
├── public/
│   ├── projects/          # imágenes de proyectos, una carpeta por proyecto
│   ├── icons/             # iconos de skills (nombres basados en slug)
│   ├── audio/             # música de fondo opcional
│   └── avatar.jpg         # tu avatar
├── src/
│   ├── config/            # cargadores de env / tema / proyectos
│   ├── components/        # ui (layout, secciones, proyecto, controles, glass)
│   ├── hooks/             # useTheme, useAudio, etc.
│   ├── i18n/              # traducciones
│   └── styles/            # globals + utilidades liquid glass
└── .github/workflows/     # workflow de despliegue a GitHub Pages
```

---

## Licencia

MIT — haz un fork, hazlo tuyo.
