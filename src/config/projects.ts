import data from '@config/projects.json';

export interface CategoryDef {
  id: string;
  enabled?: boolean;
  label_en: string;
  label_es: string;
  description_en: string;
  description_es: string;
}

export interface SkillEntry {
  name: string;
  count: number;
  icon: string | null;
}

export interface SkillGroupDef {
  id: string;
  label_en: string;
  label_es: string;
}

export interface SkillGroupResult {
  id: string;
  label: string;
  skills: SkillEntry[];
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
  details_en?: string;
  details_es?: string;
  tools: string[];
  links: ProjectLink[];
  imageFolder: string;
  images: string[];
}

/* Project images — drop files in public/projects/<imageFolder>/, they
   get auto-discovered and grouped by folder. */
const imageModules = import.meta.glob(
  '/public/projects/*/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}',
  { eager: true, query: '?url', import: 'default' },
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

/* Skill icons — drop SVG/PNG files in public/icons/, named by the
   slugified tool name (e.g. "Node.js" → node-js.svg). The map below
   in projects.json (skillIcons) lets a tool name override its slug
   when the natural one is awkward (e.g. "C++" → cpp). */
const iconModules = import.meta.glob(
  '/public/icons/*.{svg,png,webp,jpg,jpeg,SVG,PNG,WEBP,JPG,JPEG}',
  { eager: true, query: '?url', import: 'default' },
) as Record<string, string>;

const iconsBySlug: Record<string, string> = {};
for (const [absPath, url] of Object.entries(iconModules)) {
  const match = absPath.match(/\/icons\/([^/]+)\.[^./]+$/);
  if (!match) continue;
  iconsBySlug[match[1].toLowerCase()] = url;
}

const slugify = (s: string): string =>
  s
    .toLowerCase()
    .replace(/\+\+/g, 'pp')
    .replace(/#/g, 'sharp')
    .replace(/[\s./]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/^-+|-+$/g, '');

const skillIconOverrides = (data as { skillIcons?: Record<string, string> }).skillIcons ?? {};
const skillsExtra = (data as { skillsExtra?: string[] }).skillsExtra ?? [];
const skillGroups: SkillGroupDef[] = (data as { skillGroups?: SkillGroupDef[] }).skillGroups ?? [];
const skillGroupOf = (data as { skillGroupOf?: Record<string, string> }).skillGroupOf ?? {};

export const iconForSkill = (name: string): string | null => {
  const override = skillIconOverrides[name];
  const slug = (override ?? slugify(name)).toLowerCase();
  return iconsBySlug[slug] ?? null;
};

/* Categories with enabled !== false are visible. Setting enabled: false
   in the JSON hides the entire section AND any projects that belong to
   it — no need to delete data to temporarily hide a category. */
export const categories: CategoryDef[] = (data.categories as CategoryDef[]).filter(
  (c) => c.enabled !== false,
);

const enabledCategoryIds = new Set(categories.map((c) => c.id));

export const projects: ProjectDef[] = (data.projects as Omit<ProjectDef, 'images'>[])
  .filter((p) => enabledCategoryIds.has(p.category))
  .map((p) => ({
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
  details: (lang === 'es' ? p.details_es : p.details_en) ?? '',
  tools: p.tools,
  links: p.links,
  images: p.images,
});

export const localizedCategory = (c: CategoryDef, lang: 'en' | 'es') => ({
  id: c.id,
  label: lang === 'es' ? c.label_es : c.label_en,
  description: lang === 'es' ? c.description_es : c.description_en,
});

/* Auto-derive skills used in a single category from its projects' tools,
   ranked by how many projects use each one. */
export const skillsForCategory = (categoryId: string): SkillEntry[] => {
  const counts = new Map<string, number>();
  for (const p of projects) {
    if (p.category !== categoryId) continue;
    for (const t of p.tools) {
      counts.set(t, (counts.get(t) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count, icon: iconForSkill(name) }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
};

/* All skills across every visible project, plus any extras listed in
   projects.json (skillsExtra) — useful for languages or tools that
   don't yet have a project to back them up. */
export const allSkills = (): SkillEntry[] => {
  const counts = new Map<string, number>();
  for (const p of projects) {
    for (const t of p.tools) {
      counts.set(t, (counts.get(t) ?? 0) + 1);
    }
  }
  for (const extra of skillsExtra) {
    if (!counts.has(extra)) counts.set(extra, 0);
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count, icon: iconForSkill(name) }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
};

/* Skills grouped into buckets defined under skillGroups in the JSON.
   Each skill is placed via skillGroupOf[name]; anything unmapped falls
   into an auto-generated "Other" bucket so nothing is lost. Group order
   follows the JSON definition; within a group skills are sorted
   alphabetically (count is preserved on the entry but not shown). */
export const groupedSkills = (lang: 'en' | 'es'): SkillGroupResult[] => {
  const all = allSkills();
  const byGroup = new Map<string, SkillEntry[]>();

  for (const s of all) {
    const groupId = skillGroupOf[s.name] ?? 'other';
    const arr = byGroup.get(groupId) ?? [];
    arr.push(s);
    byGroup.set(groupId, arr);
  }

  for (const arr of byGroup.values()) {
    arr.sort((a, b) => a.name.localeCompare(b.name));
  }

  const result: SkillGroupResult[] = [];
  for (const g of skillGroups) {
    const skills = byGroup.get(g.id);
    if (!skills || skills.length === 0) continue;
    result.push({
      id: g.id,
      label: lang === 'es' ? g.label_es : g.label_en,
      skills,
    });
    byGroup.delete(g.id);
  }

  const orphan = byGroup.get('other');
  if (orphan && orphan.length > 0) {
    result.push({
      id: 'other',
      label: lang === 'es' ? 'Otros' : 'Other',
      skills: orphan,
    });
    byGroup.delete('other');
  }

  // Any non-empty group not declared in skillGroups (shouldn't happen
  // unless skillGroupOf references unknown ids) — still surface them so
  // the user notices the misconfiguration instead of silently dropping.
  for (const [id, skills] of byGroup.entries()) {
    if (skills.length === 0) continue;
    result.push({ id, label: id, skills });
  }

  return result;
};
