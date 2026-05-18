# Project images

Drop images for each project into its corresponding folder.

Folder naming must match the `imageFolder` field of the matching entry in
[`/config/projects.json`](../../config/projects.json), e.g.:

```
public/projects/project-1/01.jpg
public/projects/project-1/02.jpg
public/projects/project-2/01.webp
```

Supported extensions: `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`.

Files are auto-discovered at build time and shown in the project carousel
sorted alphabetically by filename.
