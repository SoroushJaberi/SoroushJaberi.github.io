'use client';

import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * Intro — a brief premium entry sequence. An abstract neural structure
 * assembles while "Soroush Jaberi" emerges from the field, then the whole
 * overlay dissolves forward into the hero. Plays once per tab session,
 * skippable, and skipped entirely under prefers-reduced-motion.
 */

const NODES: [number, number][] = [
  [22, 28], [50, 16], [78, 30], [33, 50], [67, 52], [50, 38], [16, 66], [50, 78], [84, 66], [38, 70], [62, 68],
];
const EDGES: [number, number][] = [
  [0, 1], [1, 2], [0, 5], [1, 5], [2, 5], [0, 3], [2, 4], [3, 5], [4, 5], [3, 6], [4, 8], [3, 9], [4, 10], [9, 7], [10, 7], [6, 9], [8, 10],
];

export default function Intro() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || sessionStorage.getItem('introSeen')) {
      window.dispatchEvent(new Event('intro:done'));
      return;
    }
    setShow(true);
    document.body.style.overflow = 'hidden';
    window.__lenis?.stop?.();
    const lock = setTimeout(() => window.__lenis?.stop?.(), 120);
    const t = setTimeout(() => setShow(false), 1650);
    return () => {
      clearTimeout(t);
      clearTimeout(lock);
    };
  }, []);

  const cleanup = useCallback(() => {
    sessionStorage.setItem('introSeen', '1');
    document.body.style.overflow = '';
    window.scrollTo(0, 0);
    window.__lenis?.scrollTo?.(0, { immediate: true });
    window.__lenis?.start?.();
    window.dispatchEvent(new Event('intro:done'));
  }, []);

  return (
    <AnimatePresence onExitComplete={cleanup}>
      {show && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[500] flex cursor-pointer items-center justify-center overflow-hidden bg-[#05070c]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.08, filter: 'blur(6px)' }}
          transition={{ duration: 0.8, ease: [0.7, 0, 0.84, 0] }}
          onClick={() => setShow(false)}
        >
          {/* assembling neural structure */}
          <svg viewBox="0 0 100 100" className="absolute h-[120vmin] w-[120vmin] opacity-70" aria-hidden="true">
            {EDGES.map(([a, b], i) => (
              <motion.line
                key={`e${i}`}
                x1={NODES[a][0]}
                y1={NODES[a][1]}
                x2={NODES[b][0]}
                y2={NODES[b][1]}
                stroke="rgba(143,227,217,0.4)"
                strokeWidth={0.12}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.25 + i * 0.045, ease: 'easeInOut' }}
              />
            ))}
            {NODES.map(([x, y], i) => (
              <motion.circle
                key={`n${i}`}
                cx={x}
                cy={y}
                r={i === 5 ? 0.9 : 0.6}
                fill={i === 5 ? '#d9ba70' : i % 3 === 0 ? '#d9ba70' : '#8fe3d9'}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: `${x}px ${y}px`, filter: 'drop-shadow(0 0 1px rgba(143,227,217,0.9))' }}
              />
            ))}
          </svg>

          {/* radial vignette to focus the name */}
          <div className="absolute inset-0 bg-[radial-gradient(40%_40%_at_50%_50%,rgba(5,7,12,0.2),rgba(5,7,12,0.85))]" />

          <div className="relative z-10 px-6 text-center">
            <motion.p
              className="eyebrow mb-5"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.0 }}
            >
AI Researcher · Data Scientist
            </motion.p>
            <motion.h1
              className="display-title text-glow text-[clamp(2.6rem,9vw,6rem)] leading-[0.95]"
              initial={{ opacity: 0, y: 18, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.0, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              Soroush <span className="serif-accent text-primary">Jaberi</span>
            </motion.h1>
            <motion.div
              className="mx-auto mt-8 h-px w-40 origin-left bg-gradient-to-r from-transparent via-primary/70 to-transparent"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 1.2, delay: 1.2 }}
            />
          </div>

          <motion.button
            type="button"
            className="absolute bottom-7 right-7 z-10 -m-2 p-2 font-syne text-[0.64rem] uppercase tracking-[0.24em] text-foreground/52 transition-colors hover:text-primary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            onClick={(e) => {
              e.stopPropagation();
              setShow(false);
            }}
          >
            Skip intro
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
