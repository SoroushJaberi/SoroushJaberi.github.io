/**
 * Queries shared by pages. Keeping them here means "which entries count, in
 * what order" is decided once.
 */
import { getCollection, type CollectionEntry } from 'astro:content';

export type Work = CollectionEntry<'work'>;
export type Publication = CollectionEntry<'publications'>;
export type Post = CollectionEntry<'writing'>;

const byOrder = (a: { data: { order: number } }, b: { data: { order: number } }) => a.data.order - b.data.order;

/** All published work, in display order. */
export async function getWork(): Promise<Work[]> {
  const all = await getCollection('work', ({ data }) => !data.draft);
  return all.sort(byOrder);
}

/** Entries with a full case-study page. */
export async function getCaseStudies(): Promise<Work[]> {
  return (await getWork()).filter((entry) => entry.data.page);
}

/** Entries shown on the home page. */
export async function getFeatured(): Promise<Work[]> {
  return (await getWork()).filter((entry) => entry.data.featured);
}

export async function getPublications(): Promise<Publication[]> {
  return (await getCollection('publications')).sort(byOrder);
}

// Astro warns on every query of an empty collection, so look for files first.
const postFiles = import.meta.glob('/src/content/writing/**/*.{md,mdx}');

/** Published posts, newest first. */
export async function getPosts(): Promise<Post[]> {
  if (Object.keys(postFiles).length === 0) return [];
  const all = await getCollection('writing', ({ data }) => !data.draft);
  return all.sort((a, b) => b.data.published.valueOf() - a.data.published.valueOf());
}

export const statusLabel: Record<Publication['data']['status'], string> = {
  published: 'Published',
  preprint: 'Preprint',
  'under-review': 'Under review',
  'in-preparation': 'In preparation',
  'independent-study': 'Independent study',
};

export const formatDate = (date: Date) =>
  date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
