/**
 * Site-wide identity. Everything that appears in more than one place
 * (name, links, navigation, default descriptions) lives here.
 */

export const site = {
  name: 'Soroush Jaberi',
  /** The name in Persian script, shown beside the Latin form. */
  nameFa: 'سروش جابری',
  role: 'AI researcher & data scientist',
  /** One sentence used as the default meta description and share text. */
  description:
    'Soroush Jaberi is an AI researcher and data scientist. He builds and evaluates machine learning systems for language, medical imaging and document retrieval, and teaches AI in the open.',
  tagline: 'Machine learning that holds up when you check it.',
  email: 'jaberi.soroush@gmail.com',
  cv: '/Soroush-Jaberi-CV.pdf',
  repo: 'https://github.com/SoroushJaberi/SoroushJaberi.github.io',
  locale: 'en',
} as const;

export const links = {
  github: 'https://github.com/SoroushJaberi',
  linkedin: 'https://www.linkedin.com/in/soroush-jaberi/',
  youtube: 'https://www.youtube.com/@soroush.jaberi',
} as const;

/** Profiles, in the order they appear in the footer and on the contact page. */
export const profiles = [
  { label: 'GitHub', href: links.github, handle: 'SoroushJaberi' },
  { label: 'LinkedIn', href: links.linkedin, handle: 'soroush-jaberi' },
  { label: 'YouTube', href: links.youtube, handle: '@soroush.jaberi' },
] as const;

export type NavItem = { label: string; href: string };

/**
 * Primary navigation. "Writing" is added automatically by the header once the
 * writing collection contains a published post, so it is not listed here.
 */
export const nav: NavItem[] = [
  { label: 'Work', href: '/work/' },
  { label: 'Research', href: '/research/' },
  { label: 'About', href: '/about/' },
  { label: 'Contact', href: '/contact/' },
];

/** Builds a mailto: link with a prefilled subject. */
export function mailto(subject?: string): string {
  return subject
    ? `mailto:${site.email}?subject=${encodeURIComponent(subject)}`
    : `mailto:${site.email}`;
}
