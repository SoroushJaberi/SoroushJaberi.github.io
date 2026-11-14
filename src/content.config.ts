/**
 * Content collections. Adding a project, a publication or an article means
 * adding one file under src/content/ — the schemas below validate it at build
 * time, so a missing field is a build error, not a broken page.
 */
import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

const link = z.object({
  label: z.string(),
  href: z.string(),
});

/** Projects, studies and courses. One .mdx file each in src/content/work/. */
const work = defineCollection({
  loader: glob({ base: './src/content/work', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    /** One sentence: what it is. Used in lists, meta description, share card. */
    summary: z.string(),
    /** One sentence: what came out of it. Shown under the title in lists. */
    finding: z.string().optional(),
    kind: z.enum(['research', 'engineering', 'teaching']),
    /** Display period, e.g. "2026" or "2022 – 2023". */
    period: z.string(),
    /** Sort key: the year the work was last active. */
    year: z.number().int(),
    status: z.string().optional(),
    role: z.string().optional(),
    tags: z.array(z.string()).default([]),
    links: z.array(link).default([]),
    /** "At a glance" rows shown beside the case study. */
    facts: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
    /** Up to three headline numbers, shown large on the home page reel. */
    stats: z.array(z.object({ value: z.string(), label: z.string() })).max(3).default([]),
    /** Small drawing shown next to the entry in lists. */
    glyph: z.enum(['conflict', 'fusion', 'unet', 'path', 'retrieval', 'none']).default('none'),
    /** Featured entries appear on the home page, in `order`. */
    featured: z.boolean().default(false),
    order: z.number().default(100),
    /** false = listed only, with a link to the repository; no case-study page. */
    page: z.boolean().default(true),
    draft: z.boolean().default(false),
    updated: z.coerce.date().optional(),
  }),
});

/** Papers and manuscripts. All in one file: src/content/publications.yaml. */
const publications = defineCollection({
  loader: file('./src/content/publications.yaml'),
  schema: z.object({
    title: z.string(),
    authors: z.array(z.string()),
    venue: z.string(),
    status: z.enum(['published', 'preprint', 'under-review', 'in-preparation', 'independent-study']),
    year: z.number().int(),
    summary: z.string(),
    doi: z.string().optional(),
    url: z.string().url().optional(),
    code: z.string().url().optional(),
    /** id of a related entry in the work collection. */
    work: z.string().optional(),
    bibtex: z.string().optional(),
    order: z.number().default(100),
  }),
});

/** Articles and notes. Empty for now; the section appears with the first post. */
const writing = defineCollection({
  loader: glob({ base: './src/content/writing', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    published: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { work, publications, writing };
