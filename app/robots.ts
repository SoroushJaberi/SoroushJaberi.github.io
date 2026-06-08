import { MetadataRoute } from 'next';

const siteUrl = 'https://soroushjaberi.github.io';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
