'use client';

import { motion } from 'framer-motion';
import DnaHelix from './DnaHelix';

const focus = ['NLP', 'Medical AI', 'RAG Systems', 'Computer Vision', 'Research-driven AI'];

const ease = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  return (
    <section id="intro" className="relative min-h-screen w-full overflow-hidden">
      {/* signature helix */}
      <DnaHelix className="absolute inset-0 z-0 h-full w-full opacity-[0.68] lg:opacity-100" />

      {/* readability washes — different per breakpoint so the helix always reads */}
      <div className="absolute inset-0 z-[1] hidden lg:block bg-[linear-gradient(100deg,rgba(5,7,12,0.92)_0%,rgba(5,7,12,0.6)_40%,rgba(5,7,12,0)_68%)]" />
      <div className="absolute inset-0 z-[1] lg:hidden bg-[radial-gradient(130%_88%_at_50%_40%,rgba(5,7,12,0.22)_0%,rgba(5,7,12,0.58)_52%,rgba(5,7,12,0.92)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 z-[1] h-40 bg-[linear-gradient(to_top,var(--background),transparent)]" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center px-6 pb-28 pt-32 md:px-12 lg:px-16">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="eyebrow mb-7 flex items-center gap-3"
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_12px_rgba(124,199,255,0.9)]" />
          AI Researcher · Data Scientist · ML Engineer
        </motion.p>

        <h1 className="display-title text-glow text-[clamp(3.3rem,12vw,9.5rem)] leading-[0.92] text-foreground">
          <motion.span
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.28, ease }}
            className="block"
          >
            Soroush
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease }}
            className="serif-accent block text-primary"
          >
            Jaberi
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.56 }}
          className="mt-8 max-w-xl font-syne text-base leading-[1.75] text-foreground/72 md:text-lg"
        >
          Designing research-driven machine learning systems where language, medicine, and
          retrieval meet — built to be measured, understood, and trusted.
        </motion.p>

        {/* focus constellation */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-9 flex flex-wrap items-center gap-x-3.5 gap-y-2.5"
        >
          {focus.map((f, i) => (
            <span key={f} className="inline-flex items-center gap-3.5">
              {i > 0 && <span className="h-1 w-1 rounded-full bg-primary/55" />}
              <span className="font-syne text-[0.72rem] uppercase tracking-[0.2em] text-foreground/68 transition-colors hover:text-primary">
                {f}
              </span>
            </span>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.84 }}
          className="mt-11 flex flex-wrap gap-3"
        >
          <a
            href="#projects"
            className="rounded-full bg-primary px-6 py-3 font-syne text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground shadow-[0_0_40px_rgba(124,199,255,0.28)] transition-transform hover:-translate-y-0.5"
          >
            View Work
          </a>
          <a
            href="/Soroush-Jaberi-CV.pdf"
            target="_blank"
            className="rounded-full border border-white/14 bg-white/[0.03] px-6 py-3 font-syne text-xs font-bold uppercase tracking-[0.2em] text-foreground/86 backdrop-blur-sm transition-colors hover:border-primary hover:text-primary"
          >
            Download CV
          </a>
          <a
            href="mailto:jaberi.soroush@gmail.com"
            className="rounded-full border border-white/14 px-6 py-3 font-syne text-xs font-bold uppercase tracking-[0.2em] text-foreground/86 transition-colors hover:border-primary hover:text-primary"
          >
            Contact
          </a>
        </motion.div>
      </div>

      {/* footer rail */}
      <div className="absolute inset-x-0 bottom-6 z-10 flex flex-col gap-4 px-6 font-syne text-[0.66rem] uppercase tracking-[0.22em] text-foreground/45 md:flex-row md:items-center md:justify-between md:px-12 lg:px-16">
        <div className="flex items-center gap-3">
          <span className="scroll-cue-dot inline-block h-2.5 w-2.5 rounded-full border border-primary/60" />
          <span>Scroll to explore</span>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          <a className="transition-colors hover:text-primary" href="https://github.com/SoroushJaberi" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a className="transition-colors hover:text-primary" href="https://www.linkedin.com/in/soroush-jaberi/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a className="transition-colors hover:text-primary" href="https://soroushjaberi.github.io/" target="_blank" rel="noopener noreferrer">Website</a>
          <a className="transition-colors hover:text-primary" href="mailto:jaberi.soroush@gmail.com">Email</a>
        </div>
      </div>
    </section>
  );
}
