'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * SmoothScroll — Lenis inertial scrolling for the whole document, wired to
 * GSAP's ticker so Lenis and ScrollTrigger share a single clock (the
 * canonical integration — without it, scroll-triggered tweens freeze when
 * momentum stops). Disabled under prefers-reduced-motion (native scroll).
 *
 * Also delegates in-page anchor clicks (a[href^="#"]) to Lenis so every
 * jump is smooth, and exposes the instance on window.__lenis for the menu.
 */
declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    window.__lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Recompute scroll limits once lazy content (WebGL canvas, fonts) settles,
    // otherwise Lenis can cache a stale max-scroll and clamp scrollTo().
    const resize = () => {
      lenis.resize();
      ScrollTrigger.refresh();
    };
    const raf = requestAnimationFrame(resize);
    const t1 = window.setTimeout(resize, 600);
    const t2 = window.setTimeout(resize, 1600);
    window.addEventListener('load', resize);

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return;
      const anchor = (e.target as HTMLElement)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      const href = anchor?.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: 0 });
      history.pushState(null, '', href);
    };
    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('click', onClick);
      window.removeEventListener('load', resize);
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
      gsap.ticker.remove(tick);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return null;
}
