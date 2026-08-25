'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import PortraitCard from './PortraitCard';
import SplitText from './ui/SplitText';

const NeuralField = dynamic(() => import('./three/NeuralField'), { ssr: false });

const signals = ['NLP', 'Medical imaging', 'Grounded QA', 'Vision prototypes'];
const proof = [
  ['M.Sc. AI', '4.0 / 4.0 GPA'],
  ['Research', 'NLP, CV, RAG'],
  // non-breaking space keeps 'Gen AI' from splitting across lines
  ['Spectrum', 'Classical ML to LLMs and Gen AI'],
];

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

    if (prefersReduce || sessionStorage.getItem('introSeen')) {
      setStarted(true);
    } else {
      const onDone = () => setStarted(true);
      window.addEventListener('intro:done', onDone);
      const fallback = window.setTimeout(() => setStarted(true), 2200);
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
      <div className="absolute inset-0 z-0" aria-hidden="true">
        {mode === 'webgl' ? (
          <NeuralField active={active} reduce={reduce} />
        ) : (
          <div className="absolute inset-0 data-mesh opacity-70" />
        )}
      </div>

      <div className="absolute inset-0 z-[1] bg-[linear-gradient(90deg,rgba(6,7,5,0.96)_0%,rgba(6,7,5,0.82)_46%,rgba(6,7,5,0.38)_78%,rgba(6,7,5,0.12)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 z-[1] h-40 bg-[linear-gradient(to_top,var(--background),transparent)]" />

      <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 pb-8 pt-32 md:pb-28 md:px-12 lg:grid-cols-[minmax(0,1fr)_24rem] lg:px-16">
        <div className="order-2 lg:order-1">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mb-8 flex max-w-2xl flex-wrap items-center gap-x-3 gap-y-2 font-mono-label text-[0.68rem] uppercase tracking-[0.2em] text-foreground/56"
          >
            <span className="h-px w-10 bg-primary/70" />
            AI / Data Science / ML Engineering / Generative AI
          </motion.div>

          <h1 className="display-title text-glow max-w-[9ch] text-[clamp(3.4rem,9vw,8rem)] leading-[0.88] text-foreground">
            <SplitText text="Soroush" trigger={started} interactive className="block" />{' '}
            <SplitText text="Jaberi" trigger={started} delay={0.16} interactive className="serif-accent block text-primary" />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.48 }}
            className="mt-7 max-w-2xl font-syne text-lg leading-[1.75] text-foreground/74 md:text-xl"
          >
            I&apos;m an AI researcher and data scientist building machine learning systems for language,
            medical imaging, and document retrieval.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.62 }}
            className="mt-9 grid max-w-2xl grid-cols-1 border-y border-white/12 sm:grid-cols-3"
          >
            {proof.map(([label, value]) => (
              <div key={label} className="border-white/12 py-4 sm:border-r sm:px-5 sm:first:pl-0 sm:last:border-r-0">
                <p className="font-mono-label text-[0.62rem] uppercase tracking-[0.22em] text-foreground/52">{label}</p>
                <p className="mt-2 font-syne text-sm font-semibold tracking-[-0.02em] text-foreground/82 md:text-base">{value}</p>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.76 }}
            className="mt-10 flex flex-wrap gap-3"
          >
            <a href="#projects" className="border border-primary bg-primary px-5 py-3 font-syne text-xs font-bold uppercase tracking-[0.18em] text-primary-foreground shadow-[0_0_22px_rgba(143,227,217,0.1)] transition-transform hover:-translate-y-0.5">
              View case studies
            </a>
            <a href="/Soroush-Jaberi-CV.pdf" target="_blank" className="border border-white/14 bg-white/[0.035] px-5 py-3 font-syne text-xs font-bold uppercase tracking-[0.18em] text-foreground/86 backdrop-blur-sm transition-colors hover:border-primary hover:text-primary">
              Download CV
            </a>
            <a href="mailto:jaberi.soroush@gmail.com" className="border border-white/14 px-5 py-3 font-syne text-xs font-bold uppercase tracking-[0.18em] text-foreground/86 transition-colors hover:border-primary hover:text-primary">
              Contact
            </a>
          </motion.div>
        </div>

        <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
          <PortraitCard />
        </div>
      </div>

      <div className="relative z-10 mt-12 flex flex-col gap-4 px-6 pb-10 font-mono-label text-[0.65rem] uppercase tracking-[0.2em] text-foreground/52 md:absolute md:inset-x-0 md:bottom-6 md:mt-0 md:flex-row md:items-center md:justify-between md:px-12 md:pb-0 lg:px-16">
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {signals.map((signal) => (
            <span key={signal}>{signal}</span>
          ))}
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          <a className="inline-flex min-h-11 items-center link-underline transition-colors hover:text-primary" href="https://github.com/SoroushJaberi" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a className="inline-flex min-h-11 items-center link-underline transition-colors hover:text-primary" href="https://www.linkedin.com/in/soroush-jaberi/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a className="inline-flex min-h-11 items-center link-underline transition-colors hover:text-primary" href="mailto:jaberi.soroush@gmail.com">Email</a>
        </div>
      </div>
    </section>
  );
}
