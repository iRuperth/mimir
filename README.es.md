<div align="center">

<img src="docs/mimirLOGO.png" alt="Logo de Mimir" width="180" />

# $\color{#A78BFA}{\textsf{Mimir}}$

**Una plantilla de portfolio open source: haz fork, rellénala y publícala.**

[![English](https://img.shields.io/badge/English-1a1a1a?style=for-the-badge)](README.md) **·** [![Español](https://img.shields.io/badge/Espa%C3%B1ol-1a1a1a?style=for-the-badge)](README.es.md)

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-1a1a1a?style=flat&logo=typescript&logoColor=white&labelColor=1a1a1a)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-1a1a1a?style=flat&logo=vite&logoColor=white&labelColor=1a1a1a)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18-1a1a1a?style=flat&logo=react&logoColor=white&labelColor=1a1a1a)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-1a1a1a?style=flat&logo=tailwindcss&logoColor=white&labelColor=1a1a1a)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer%20Motion-11-1a1a1a?style=flat&logo=framer&logoColor=white&labelColor=1a1a1a)](https://www.framer.com/motion/)
[![Embla Carousel](https://img.shields.io/badge/Embla-Carousel-1a1a1a?style=flat&labelColor=1a1a1a)](https://www.embla-carousel.com/)
[![i18next](https://img.shields.io/badge/i18next-23.x-1a1a1a?style=flat&logo=i18next&logoColor=white&labelColor=1a1a1a)](https://www.i18next.com/)
[![pnpm](https://img.shields.io/badge/pnpm-package%20mgr-1a1a1a?style=flat&logo=pnpm&logoColor=white&labelColor=1a1a1a)](https://pnpm.io/)
[![Supabase](https://img.shields.io/badge/Supabase-opcional-1a1a1a?style=flat&logo=supabase&logoColor=white&labelColor=1a1a1a)](https://supabase.com/)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-deploy-1a1a1a?style=flat&logo=github&logoColor=white&labelColor=1a1a1a)](https://pages.github.com/)
[![GNU Make](https://img.shields.io/badge/GNU%20Make-atajos-1a1a1a?style=flat&logo=gnu&logoColor=white&labelColor=1a1a1a)](https://www.gnu.org/software/make/)
[![License: MIT](https://img.shields.io/badge/License-MIT-1a1a1a?style=flat&labelColor=1a1a1a)](LICENSE)

</div>

---

## ¿Qué es Mimir?

**Mimir** es una plantilla de portfolio gratuita y open source pensada para desarrolladores, diseñadores, investigadores y estudiantes que quieren un sitio personal limpio, rápido y bilingüe **sin escribir nada de código fuente**.

Clonas el repo, editas dos archivos (`.env` y `config/projects.json`), sueltas tus imágenes en una carpeta y ya tienes un sitio listo para desplegar. Todo está construido sobre Vite + React + TypeScript, con estilo "liquid glass", animaciones impulsadas por el scroll, carousels de proyectos por categoría, temas claro / oscuro / daltónico, música de fondo opcional y soporte completo **inglés / español** desde el primer momento.

Lleva el nombre de **Mímir**, el dios nórdico del conocimiento y la sabiduría.

### ¿Por qué open source?

El objetivo de Mimir es ofrecer a la comunidad un portfolio que sea:

- **Gratis**: licencia MIT, sin atribución obligatoria.
- **Fácil de forkear**: el contenido vive en archivos de configuración, no en el árbol React.
- **Fácil de extender**: arquitectura documentada, superficie pequeña, sin magia oculta.
- **Impulsado por la comunidad**: issues, pull requests y discusiones son bienvenidos. Si añades una feature, arreglas un bug, lo traduces a un nuevo idioma o creas un nuevo tema, por favor contribuye de vuelta.

> Si construyes algo encima de Mimir, abre un issue o PR y cuéntanoslo. Cuantas más variaciones publique la comunidad, mejor será la plantilla.

---

## Lenguajes y herramientas utilizados

El bundle de producción por defecto ronda **150–200 KB gzip**. Aquí el porqué de cada pieza del stack:

| Capa             | Herramienta                                                            | Por qué                                            |
| ---------------- | ---------------------------------------------------------------------- | -------------------------------------------------- |
| Lenguaje         | **TypeScript 5**                                                       | React tipado, autocompletado en los loaders        |
| Bundler          | **Vite 5**                                                             | Servidor de dev rápido, build estático pequeño     |
| UI               | **React 18**                                                           | Modelo de componentes, hooks, suspense             |
| Estilos          | **Tailwind CSS 3** + utilidades liquid-glass propias                   | Clases utilitarias, tema mediante variables CSS    |
| Animaciones      | **Framer Motion 11**                                                   | Reveals por scroll, springs, gestos                |
| Carousel         | **embla-carousel-react** + `embla-carousel-auto-scroll`                | Carousel de imágenes accesible con auto-scroll     |
| i18n             | **i18next** + `react-i18next` + `i18next-browser-languagedetector`     | EN / ES listo, detección por navegador             |
| Backend opcional | **Supabase** (`@supabase/supabase-js`)                                 | Solo si conectas formularios / analítica           |
| Despliegue       | **GitHub Pages** vía `gh-pages` y GitHub Actions                       | Hosting público con un clic                        |
| Package manager  | **pnpm** (vía Corepack)                                                | Instalaciones rápidas, node_modules estricto       |
| Task runner      | **GNU Make**                                                           | Atajos multi-OS (`make dev`, `make build`, …)      |

---

## Bilingüe por diseño

Cada string visible en Mimir existe dos veces (una en inglés, otra en español) y el visitante puede cambiar entre ellas con un solo clic en la navbar.

- El idioma por defecto viene de `DEFAULT_LANGUAGE` en `.env`.
- La configuración regional del navegador del visitante gana si coincide con un idioma soportado.
- Los títulos, descripciones, detalles de proyectos y etiquetas de categoría usan campos pareados `_en` / `_es` en `config/projects.json`.
- Los strings de UI (botones, encabezados, tooltips) viven en `src/i18n/locales/en.json` y `src/i18n/locales/es.json`.
- Añadir un tercer idioma es un proceso de cuatro pasos: ver [Sección 3.8](#38-añadir-un-nuevo-idioma).

---

## Índice

1. [Requisitos](#1-requisitos)
2. [Arrancar el proyecto](#2-arrancar-el-proyecto)
3. [Personaliza el sitio](#3-personaliza-el-sitio)
4. [Comandos útiles](#4-comandos-útiles)
5. [Desplegar](#5-desplegar)
6. [Arquitectura](#6-arquitectura)
7. [Contribuir](#7-contribuir)
8. [Licencia](#8-licencia)

---

## 1. Requisitos

Necesitas tres cosas instaladas en tu máquina. Si ya las tienes, salta a la [Sección 2](#2-arrancar-el-proyecto).

- **Node.js 20 o superior**: descárgalo desde <https://nodejs.org>
- **pnpm**: instalado una sola vez vía Corepack (ver abajo)
- **Git**: descárgalo desde <https://git-scm.com>

### Instalar pnpm (una sola vez, cualquier OS)

Ejecuta estos dos comandos una vez. Funcionan en macOS, Linux y Windows:

- `corepack enable`
- `corepack prepare pnpm@latest --activate`

Verifica la instalación:

- `pnpm --version`

---

## 2. Arrancar el proyecto

Elige la sección que corresponda a tu OS. **Cada comando va en su propia línea**: cópialos uno a uno.

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

- `.env`: tu información personal, colores del tema, enlaces sociales.
- `config/projects.json`: categorías, proyectos, skills, mapeo de iconos.

Nunca necesitas tocar el código fuente para cambiar el contenido.

### 3.1 Información personal: edita `.env`

1. Copia la plantilla (ya lo hiciste en la Sección 2).
2. Abre `.env` en tu editor.
3. Rellena tus valores.

| Variable group       | Qué controla                                                              |
| -------------------- | ------------------------------------------------------------------------- |
| `OWNER_*`            | Tu nombre, título, ruta del avatar, bio (en inglés y español)             |
| `DEFAULT_LANGUAGE`   | `en` o `es` (el navegador del visitante prevalece si coincide)            |
| `ANIMATIONS`         | `true` / `false`: activa o desactiva las animaciones por scroll           |
| `DEFAULT_THEME`      | `light`, `dark` o `system`                                                |
| `LIGHT_*` / `DARK_*` | Paleta de colores completa por tema                                       |
| `CB_*`               | Acentos seguros Okabe-Ito que se usan cuando el modo daltónico está activo |
| `SOCIAL_*`           | Enlaces a GitHub, LinkedIn, email, X, Instagram (vacío = oculto)          |
| `MUSIC_*`            | Interruptor de música de fondo, ruta del archivo, volumen por defecto     |

Reinicia el servidor de desarrollo después de editar `.env`.

### 3.2 Categorías: edita `config/projects.json`

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

- **Añadir una categoría**: añade un nuevo objeto con un `id` único. La sección aparece automáticamente cuando al menos un proyecto usa ese `id` en su campo `category`.
- **Eliminar una categoría**: borra el objeto del array. O pon `enabled` a `false` para ocultarla sin perder los datos. Las categorías ocultas también ocultan todos los proyectos que les pertenecen.
- **Reordenar categorías**: cambia el orden de los objetos en el array.
- **Renombrar una categoría**: edita su `label_en` y `label_es`.

### 3.3 Proyectos: edita `config/projects.json`

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

- **Añadir un proyecto**: añade un nuevo objeto. Asegúrate de que:
  - `id` sea único.
  - `category` coincida con un `id` de categoría existente.
  - `imageFolder` coincida con una carpeta que crees bajo `public/projects/`.
- **Eliminar un proyecto**: borra el objeto del array. Borra también la carpeta correspondiente bajo `public/projects/` si ya no necesitas las imágenes.
- **Campos bilingües**: cada campo `_en` necesita su contraparte `_es`.
- **`details_en` / `details_es`** son opcionales. Si ambos están vacíos u omitidos, el botón Ver más sigue expandiendo el modal (revelando el carousel de imágenes, las herramientas, la descripción y los enlaces) pero no se renderizan párrafos adicionales. Añade texto largo cuando lo tengas.
- **`tools`**: cada nombre alimenta automáticamente la fila de skills por categoría y la sección global de Skills. Sin mantenimiento manual.
- **`links`**: cada enlace se renderiza como un botón glass al final de la descripción.

### 3.4 Imágenes de proyecto

Coloca los archivos de imagen en `public/projects/<imageFolder>/`:

```
public/projects/my-project/
├── 01-hero.jpg
├── 02-detail.webp
└── 03-screenshot.png
```

- **El nombre de la carpeta** debe coincidir con el campo `imageFolder` del proyecto correspondiente.
- **Los nombres de archivo** pueden ser cualquiera. Las imágenes aparecen en el carousel ordenadas alfabéticamente: usa el prefijo `01_`, `02_`, … para controlar la secuencia.
- **Formatos soportados:** `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`.
- **Añadir una imagen**: coloca el archivo en la carpeta. En modo desarrollo aparece al instante; para producción reconstruye con `pnpm build`.
- **Eliminar una imagen**: borra el archivo. El carousel se actualiza automáticamente.
- **Relación de aspecto**: el carousel se renderiza a 16:9 con `object-cover`, así que las capturas anchas y las imágenes a sangre completa quedan mejor. Cualquier imagen más estrecha será recortada.

### 3.5 Sección Skills

La sección Skills al final de la página agrupa todas las herramientas que mencionas en tus proyectos, además de las extras que listes manualmente.

Tres campos en `config/projects.json` la controlan:

**`skillGroups`**: los grupos y su orden. Etiquetas bilingües:

```json
"skillGroups": [
  { "id": "languages", "label_en": "Languages", "label_es": "Lenguajes" },
  { "id": "ai", "label_en": "AI / ML", "label_es": "IA / ML" }
]
```

**`skillGroupOf`**: mapea cada nombre de skill a su id de grupo. Las skills sin mapeo caen en un grupo "Other" generado automáticamente para que nada se pierda nunca:

```json
"skillGroupOf": {
  "Python": "languages",
  "PyTorch": "ai",
  "Cursor": "tools"
}
```

**`skillsExtra`**: skills que quieres mostrar pero alrededor de las cuales aún no has lanzado un proyecto:

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

Las skills sin archivo de icono se renderizan simplemente como texto: nada se rompe.

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

Cada comando asume que ya has ejecutado `pnpm install` (o `make install`). Cada comando está en su propia línea: cópialos uno a uno.

### Arrancar el servidor de desarrollo

- `pnpm dev`
- `make dev`

Abre el sitio en <http://localhost:5173> con hot reload.

### Build de producción

- `pnpm build`
- `make build`

Genera un sitio estático optimizado en `dist/`.

### Previsualizar el build de producción localmente

- `pnpm preview`
- `make preview`

Sirve lo que haya en `dist/` para que puedas comprobarlo antes de desplegar.

### Solo type-check (sin output de build)

- `pnpm exec tsc -b --noEmit`
- `make typecheck`

Útil en CI o como check pre-commit.

### Limpiar artefactos de build

- `rm -rf dist node_modules/.vite` (macOS / Linux)
- `Remove-Item -Recurse -Force dist, node_modules\.vite` (Windows PowerShell)
- `make clean`

### Reinstalar dependencias desde cero

- `rm -rf node_modules pnpm-lock.yaml && pnpm install` (macOS / Linux)
- `Remove-Item -Recurse -Force node_modules, pnpm-lock.yaml; pnpm install` (Windows PowerShell)

### Desplegar a GitHub Pages (manual)

- `pnpm run deploy`
- `make deploy`

---

## 5. Desplegar

### Opción A: GitHub Actions (recomendado)

1. Haz push de tu fork a `main`.
2. En tu repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Añade tu `.env` a los secrets del repo para que el build vea tus valores reales (ver más abajo).
4. El workflow en [.github/workflows/deploy.yml](.github/workflows/deploy.yml) hace el build y publica en cada push a `main`. Configura `VITE_BASE_PATH` a `/<repo-name>/` automáticamente.

Tu sitio estará en `https://<username>.github.io/<repo-name>/`.

#### Inyecta tu `.env` en el workflow

`.env` está en `.gitignore` (bien, puede contener claves de Supabase, enlaces sociales, etc.), por lo que el workflow no lo ve en build time. Para inyectarlo:

1. Abre <https://github.com/`<tu-usuario>`/`<tu-repo>`/settings/secrets/actions>.
2. Pulsa **New repository secret**.
3. **Name:** `ENV_FILE_MIMIR`.
4. **Secret:** pega el **contenido completo** de tu `.env` local (todas las líneas `VITE_*=...`).
5. Guarda.

El workflow escribe ese secret en `.env` al inicio de cada build. Si el secret no está definido, cae a `.env.example` para que el build no falle, pero el sitio mostrará contenido placeholder.

**Solo necesitas actualizar el secret cuando cambies `.env`.** Añadir un proyecto, imagen, skill o editar código fuente **no** requiere tocar el secret: esos cambios se leen de `config/projects.json`, `public/` y el árbol de fuentes, que se commitean y se hace push normalmente.

### Opción B: Manual

Ejecuta `pnpm run deploy` (o `make deploy`). Esto hace el build y publica `dist/` en la branch `gh-pages`.

> Si despliegas en una base path distinta a `/mimir/`, configura `VITE_BASE_PATH` en `.env`.

### Opción C: Cualquier host estático

Ejecuta `pnpm build` y sube el contenido de `dist/` a Netlify, Vercel, Cloudflare Pages, S3 o cualquier host estático.

---

## 6. Arquitectura

Mimir es un **sitio estático**. No hay servidor, no hay base de datos (a menos que actives Supabase). Todo lo que ves en la página viene de tres fuentes leídas en tiempo de build:

1. **Variables de entorno** (`.env`) → cargadas por Vite y expuestas bajo `import.meta.env.VITE_*`.
2. **`config/projects.json`** → importado como JSON plano y normalizado por `src/config/projects.ts`.
3. **`public/`** → servido tal cual (imágenes, iconos, audio, avatar).

### 6.1 Estructura de primer nivel

```
mimir/
├── .env.example           # plantilla: copia a .env
├── Makefile               # atajos multi-OS para install / dev / build / deploy
├── README.md              # versión en inglés
├── README.es.md           # este archivo (español)
├── index.html             # HTML de entrada de Vite
├── package.json           # scripts y dependencias
├── pnpm-lock.yaml         # árbol de dependencias bloqueado (commitealo)
├── tailwind.config.ts     # tokens de tema, puentes a variables CSS
├── vite.config.ts         # config de Vite + base path
├── tsconfig*.json         # proyectos TypeScript (app + node)
├── config/
│   └── projects.json      # categorías, proyectos, skills, overrides de iconos
├── docs/                  # logo, capturas, materiales escritos
├── public/                # archivos estáticos servidos tal cual
├── src/                   # código fuente de la aplicación
├── supabase/              # backend opcional (formularios, analítica), borrable
└── .github/workflows/     # workflow de despliegue a GitHub Pages
```

### 6.2 `public/`: assets estáticos

```
public/
├── projects/              # una carpeta por proyecto, nombre = imageFolder
│   └── <imageFolder>/
│       ├── 01-hero.jpg
│       └── 02-detail.webp
├── icons/                 # iconos de skills (nombres basados en slug)
├── audio/                 # música de fondo opcional
└── avatar.jpg             # tu avatar (referenciado desde .env)
```

Todo lo que esté en `public/` se copia tal cual al output del build. Usa rutas absolutas (p. ej. `/avatar.jpg`) para referenciar estos archivos desde `.env`.

### 6.3 `src/`: código de la aplicación

```
src/
├── main.tsx               # entrada React, monta <App /> e i18n
├── App.tsx                # layout principal, composición de secciones
├── vite-env.d.ts          # tipado de import.meta.env
├── config/                # loaders de config: leen .env y projects.json
├── components/            # componentes React, agrupados por propósito
│   ├── layout/            # navbar, footer, chrome de la página
│   ├── sections/          # hero, categorías, skills, contacto
│   ├── project/           # card de proyecto, modal, carousel
│   ├── controls/          # toggles de tema, idioma, música, daltónico
│   ├── glass/             # primitivos liquid-glass reutilizables
│   ├── motion/            # wrappers de framer-motion (reveal, parallax)
│   └── NeuralBackground.tsx  # fondo animado WebGL/SVG
├── hooks/                 # useTheme, useAudio, useMediaQuery, …
├── i18n/                  # setup de i18next + locales/ (en.json, es.json)
├── lib/                   # helpers agnósticos (supabase, fetch)
├── styles/                # globals.css + utilidades liquid-glass
└── utils/                 # funciones puras (slugify, sort, helpers de imagen)
```

#### Dónde añadir cosas

| Quieres…                                  | Edita…                                                |
| ----------------------------------------- | ----------------------------------------------------- |
| Añadir un proyecto o categoría            | `config/projects.json`                                |
| Cambiar colores, nombre, enlaces sociales | `.env`                                                |
| Añadir un nuevo string de UI              | `src/i18n/locales/en.json` y `es.json`                |
| Añadir una nueva sección a la página     | nuevo archivo en `src/components/sections/` + montarlo en `src/App.tsx` |
| Añadir un nuevo control (p. ej. tamaño)   | nuevo archivo en `src/components/controls/`           |
| Añadir un nuevo tema o variante visual    | extiende tokens en `tailwind.config.ts` + `src/styles/` |
| Añadir una nueva animación                | envuelve con helpers en `src/components/motion/`      |
| Añadir un nuevo idioma                    | sigue la [Sección 3.8](#38-añadir-un-nuevo-idioma)    |
| Conectar un formulario de contacto        | `src/lib/` (helpers de Supabase) + nueva sección      |

### 6.4 Flujo de datos

```
   .env  ──┐
           ├──►  src/config/  ──►  componentes React  ──►  HTML renderizado
projects.json ──┘                       │
                                        ├──►  i18next (strings de UI)
                                        └──►  Tailwind + vars CSS (tema)
```

- `src/config/env.ts` parsea `import.meta.env.VITE_*` en un objeto tipado.
- `src/config/projects.ts` importa `config/projects.json`, lo valida y expone helpers como `localizedProject(p, lang)` y `visibleCategories(lang)` para que los componentes nunca traten con campos bilingües crudos.
- `src/config/theme.ts` escribe variables CSS (`--bg`, `--fg`, `--accent`, …) desde `.env` para que las utilidades de Tailwind resuelvan al color correcto en cada tema.

### 6.5 Añadir una nueva sección visible: ejemplo

Supón que quieres una sección "Charlas":

1. Crea `src/components/sections/Talks.tsx`.
2. Añade strings de UI (encabezado, estado vacío) a `src/i18n/locales/en.json` y `es.json`.
3. Monta `<Talks />` en `src/App.tsx` entre dos secciones existentes.
4. (Opcional) Si la sección es data-driven, añade un nuevo array a `config/projects.json` y léelo vía un helper en `src/config/projects.ts`.

Sin router, sin lazy loading, sin librería de estado global. Una página, un árbol de render.

---

## 7. Contribuir

Mimir es open source y las contribuciones son bienvenidas.

- **Bugs y feature requests**: abre un issue con una repro clara y tu OS / navegador.
- **Pull requests**: haz fork, crea una branch desde `main`, ejecuta `pnpm exec tsc -b --noEmit` antes de push.
- **Traducciones**: añadir un tercer idioma es la contribución de mayor impacto. Sigue la [Sección 3.8](#38-añadir-un-nuevo-idioma) y abre un PR.
- **Temas**: sube un preset `themes/<nombre>.env` y lo añadimos a la documentación.
- **Discusiones**: propuestas para nuevas secciones, layouts o integraciones van en GitHub Discussions.

Al contribuir aceptas que tu contribución se libera bajo la licencia MIT del proyecto.

---

## 8. Licencia

**MIT**: haz un fork, hazlo tuyo. Sin atribución obligatoria, pero una estrella en el repo siempre se agradece.
