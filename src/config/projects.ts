import data from '@config/projects.json';

export interface CategoryDef {
  id: string;
  label_en: string;
  label_es: string;
}

export interface ProjectLink {
  label: string;
  url: string;
}

export interface ProjectDef {
  id: string;
  category: string;
  title_en: string;
  title_es: string;
  description_en: string;
  description_es: string;
  tools: string[];
  links: ProjectLink[];
  imageFolder: string;
  images: string[];
}

const imageModules = import.meta.glob(
  '/public/projects/*/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}',
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>;

const imagesByFolder: Record<string, string[]> = {};
for (const [absPath, url] of Object.entries(imageModules)) {
  const match = absPath.match(/\/projects\/([^/]+)\/([^/]+)$/);
  if (!match) continue;
  const folder = match[1];
  imagesByFolder[folder] ??= [];
  imagesByFolder[folder].push(url);
}
for (const arr of Object.values(imagesByFolder)) arr.sort();

export const categories: CategoryDef[] = data.categories;

export const projects: ProjectDef[] = data.projects.map((p) => ({
  ...p,
  images: imagesByFolder[p.imageFolder] ?? [],
}));

export const visibleCategories = (lang: 'en' | 'es') =>
  categories
    .filter((c) => projects.some((p) => p.category === c.id))
    .map((c) => ({ id: c.id, label: lang === 'es' ? c.label_es : c.label_en }));

export const localizedProject = (p: ProjectDef, lang: 'en' | 'es') => ({
  id: p.id,
  category: p.category,
  title: lang === 'es' ? p.title_es : p.title_en,
  description: lang === 'es' ? p.description_es : p.description_en,
  tools: p.tools,
  links: p.links,
  images: p.images,
});
