# Skill icons

Drop icon files here for each tool you list in `config/projects.json`.

## Naming convention

Filename = **slugified tool name** + extension. Slugging rules:

- lowercase
- spaces, `.` and `/` become `-`
- `++` becomes `pp` (e.g. `c++` → `cpp`)
- `#` becomes `sharp` (e.g. `c#` → `csharp`)
- any other non-alphanumeric character is dropped

Examples:

| Tool name in JSON | Filename                |
| ----------------- | ----------------------- |
| `React`           | `react.svg`             |
| `Node.js`         | `node-js.svg`           |
| `PostgreSQL`      | `postgresql.svg`        |
| `GitHub Actions`  | `github-actions.svg`    |
| `Next.js`         | `next-js.svg`           |
| `C++`             | `cpp.svg`               |

Supported extensions: `.svg`, `.png`, `.webp`, `.jpg`, `.jpeg`. SVG is
recommended (sharp at any size, theme-friendly).

## Overrides

If the natural slug is awkward, map the tool to a custom slug under
`skillIcons` in [`/config/projects.json`](../../config/projects.json):

```json
"skillIcons": {
  "Node.js": "nodejs",
  "C++": "cpp",
  "tree-sitter": "tree-sitter"
}
```

Then name the file after the override (e.g. `nodejs.svg`).

## Where to grab icons

- [Devicon](https://devicon.dev/) — SVGs for languages and frameworks
- [Simple Icons](https://simpleicons.org/) — brand SVGs (2400+)
- [Tabler Icons](https://tabler.io/icons) — general-purpose icons

Tools without an icon file just render as text — nothing breaks.
