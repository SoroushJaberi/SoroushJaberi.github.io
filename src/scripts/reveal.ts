/**
 * Scroll reveals.
 *
 * Content is visible by default. This script only "arms" (hides, pending
 * reveal) elements that are still below the fold when it runs, then shows
 * them as they scroll in. If it never runs, nothing is ever hidden.
 *
 * Two hooks:
 *   [data-reveal]  fades and rises into place (styles in global.css)
 *   [data-draw]    a figure that animates from its empty state; each figure
 *                  styles its own `.armed` / `.is-in` states
 */

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduce && 'IntersectionObserver' in window) {
  const targets = document.querySelectorAll<HTMLElement>('[data-reveal], [data-draw]');
  const fold = window.innerHeight;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
  );

  for (const el of targets) {
    // Already on screen: leave it alone rather than flash it out and back in.
    if (el.getBoundingClientRect().top < fold * 0.92) continue;
    el.classList.add('armed');
    observer.observe(el);
  }
}

export {};
