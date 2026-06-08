'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import PortraitCard from './PortraitCard';
import SplitText from './ui/SplitText';

const NeuralField = dynamic(() => import('./three/NeuralField'), { ssr: false });

const focus = ['NLP', 'Medical AI', 'RAG Systems', 'Computer Vision', 'Research-driven AI'];

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
  } catch {
    return false;
  }
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [mode, setMode] = useState<'canvas' | 'webgl'>('canvas');
  const [reduce, setReduce] = useState(false);
  const [active, setActive] = useState(true);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReduce(prefersReduce);
    if (hasWebGL()) setMode('webgl');

    // play the title reveal once the intro dissolves (or immediately if skipped)
    if (prefersReduce || sessionStorage.getItem('introSeen')) {
      setStarted(true);
    } else {
      const onDone = () => setStarted(true);
      window.addEventListener('intro:done', onDone);
      const fallback = window.setTimeout(() => setStarted(true), 4200);
      return () => {
        window.removeEventListener('intro:done', onDone);
        clearTimeout(fallback);
      };
    }
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="intro" className="relative min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0 z-0">
        {mode === 'webgl' ? (
          <NeuralField active={active} reduce={reduce} />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(40%_50%_at_70%_42%,rgba(124,199,255,0.16),transparent_70%),radial-gradient(30%_40%_at_55%_60%,rgba(167,139,250,0.12),transparent_70%)]" />
        )}
      </div>

      {/* readability washes */}
      <div className="absolute inset-0 z-[1] hidden lg:block bg-[linear-gradient(90deg,rgba(5,7,12,0.9)_0%,rgba(5,7,12,0.7)_42%,rgba(5,7,12,0.2)_72%,rgba(5,7,12,0)_100%)]" />
      <div className="absolute inset-0 z-[1] lg:hidden bg-[radial-gradient(130%_80%_at_50%_44%,rgba(5,7,12,0.2)_0%,rgba(5,7,12,0.62)_55%,rgba(5,7,12,0.92)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 z-[1] h-40 bg-[linear-gradient(to_top,var(--background),transparent)]" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center px-6 pb-28 pt-32 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[19rem_1fr] lg:gap-16">
          {/* portrait identity card */}
          <div className="order-1 flex justify-center lg:justify-start">
            <PortraitCard />
          </div>

          {/* text content */}
          <div className="order-2">
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="coord mb-7 flex flex-wrap items-center gap-x-3 gap-y-1 text-foreground/70"
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_12px_rgba(124,199,255,0.9)]" />
              AI Researcher
              <span className="text-foreground/25">/</span> Data Scientist
              <span className="text-foreground/25">/</span> ML Engineer
            </motion.p>

            <h1 className="display-title text-glow text-[clamp(2.9rem,8.5vw,7rem)] leading-[0.92] text-foreground">
              <SplitText text="Soroush" trigger={started} className="block" />
              <SplitText text="Jaberi" trigger={started} delay={0.18} className="serif-accent block text-primary" />
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-7 max-w-xl font-syne text-base leading-[1.75] text-foreground/72 md:text-lg"
            >
              Designing research-driven machine learning systems where language, medicine, and
              retrieval meet — built to be measured, understood, and trusted.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.64 }}
              className="mt-8 flex flex-wrap items-center gap-x-3.5 gap-y-2.5"
            >
              {focus.map((f, i) => (
                <span key={f} className="inline-flex items-center gap-3.5">
                  {i > 0 && <span className="h-1 w-1 rounded-full bg-primary/55" />}
                  <span className="link-underline coord text-foreground/65 transition-colors hover:text-primary">{f}</span>
                </span>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.78 }}
              className="mt-10 flex flex-wrap gap-3"
            >
              <a href="#projects" className="rounded-full bg-primary px-6 py-3 font-syne text-xs font-bold uppercase tracking-[0.18em] text-primary-foreground shadow-[0_0_40px_rgba(124,199,255,0.28)] transition-transform hover:-translate-y-0.5">
                View Work
              </a>
              <a href="/Soroush-Jaberi-CV.pdf" target="_blank" className="rounded-full border border-white/14 bg-white/[0.03] px-6 py-3 font-syne text-xs font-bold uppercase tracking-[0.18em] text-foreground/86 backdrop-blur-sm transition-colors hover:border-primary hover:text-primary">
                Download CV
              </a>
              <a href="mailto:jaberi.soroush@gmail.com" className="rounded-full border border-white/14 px-6 py-3 font-syne text-xs font-bold uppercase tracking-[0.18em] text-foreground/86 transition-colors hover:border-primary hover:text-primary">
                Contact
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-6 z-10 flex flex-col gap-4 px-6 coord text-foreground/45 md:flex-row md:items-center md:justify-between md:px-12 lg:px-16">
        <div className="flex items-center gap-3">
          <span className="scroll-cue-dot inline-block h-2.5 w-2.5 rounded-full border border-primary/60" />
          <span>Scroll to explore</span>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          <a className="link-underline transition-colors hover:text-primary" href="https://github.com/SoroushJaberi" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a className="link-underline transition-colors hover:text-primary" href="https://www.linkedin.com/in/soroush-jaberi/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a className="link-underline transition-colors hover:text-primary" href="https://soroushjaberi.github.io/" target="_blank" rel="noopener noreferrer">Website</a>
          <a className="link-underline transition-colors hover:text-primary" href="mailto:jaberi.soroush@gmail.com">Email</a>
        </div>
      </div>
    </section>
  );
}
