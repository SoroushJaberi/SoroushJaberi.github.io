/**
 * RSS feed for the writing section, at /rss.xml.
 * It is generated only once there is at least one published post, so the
 * site never serves an empty feed.
 */
import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { site } from '@/data/site';
import { getPosts } from '@/lib/content';

export async function getStaticPaths() {
  const posts = await getPosts();
  return posts.length > 0 ? [{ params: { feed: 'rss' } }] : [];
}

export const GET: APIRoute = async (context) => {
  const posts = await getPosts();
  return rss({
    title: `${site.name} — Writing`,
    description: site.description,
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.summary,
      pubDate: post.data.published,
      link: `/writing/${post.id}/`,
    })),
  });
};
