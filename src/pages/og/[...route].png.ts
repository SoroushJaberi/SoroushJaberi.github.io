/**
 * One share image per page: /og/index.png, /og/work.png, /og/work/<id>.png …
 * A page points at its image through the `image` prop of the Base layout.
 * New case studies and posts get theirs automatically.
 */
import type { APIRoute, GetStaticPaths } from 'astro';
import { site } from '@/data/site';
import { getCaseStudies, getPosts, formatDate } from '@/lib/content';
import { renderOg, type OgCard } from '@/lib/og';

const kindLabel = { research: 'Research', engineering: 'Engineering', teaching: 'Teaching' } as const;

export const getStaticPaths: GetStaticPaths = async () => {
  const pages: Record<string, OgCard> = {
    index: {
      eyebrow: site.role,
      title: site.tagline,
      text: 'I build and evaluate machine learning systems for language, medical imaging and document retrieval.',
    },
    work: {
      eyebrow: 'Work',
      title: 'What I have built, measured and taught.',
      text: 'Language models and retrieval, Persian NLP, medical image segmentation, and an open AI course.',
    },
    research: {
      eyebrow: 'Research',
      title: 'Evidence, and what models do with it.',
      text: 'Publications, thesis, interests and academic record.',
    },
    about: {
      eyebrow: 'About',
      title: site.name,
      text: 'AI researcher and data scientist. M.Sc. candidate in Artificial Intelligence, teaching assistant, and author of The AI Path.',
    },
    contact: {
      eyebrow: 'Contact',
      title: 'Write to me.',
      text: 'PhD positions, AI and ML roles, projects, research collaboration.',
    },
  };

  for (const entry of await getCaseStudies()) {
    pages[`work/${entry.id}`] = {
      eyebrow: `${kindLabel[entry.data.kind]} · ${entry.data.period}`,
      title: entry.data.title,
      text: entry.data.finding ?? entry.data.summary,
    };
  }
  for (const post of await getPosts()) {
    pages[`writing/${post.id}`] = {
      eyebrow: `Writing · ${formatDate(post.data.published)}`,
      title: post.data.title,
      text: post.data.summary,
    };
  }

  return Object.entries(pages).map(([route, card]) => ({ params: { route }, props: { card } }));
};

export const GET: APIRoute = async ({ props }) => {
  const png = await renderOg(props.card as OgCard);
  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=604800' },
  });
};
