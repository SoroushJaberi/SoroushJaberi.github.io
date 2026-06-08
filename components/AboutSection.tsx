'use client';

import { motion } from 'framer-motion';
import SectionLabel from './ui/SectionLabel';

const metrics = [
  ['4.0 / 4.0', 'M.Sc. AI GPA'],
  ['AI + DS', 'Core direction'],
  ['NLP / CV / RAG', 'Research focus'],
  ['2026', 'Expected defense'],
];

export default function AboutSection() {
  return (
    <section id="about" className="relative px-6 py-24 text-foreground md:px-12 md:py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-[0.75fr_1fr] lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.75 }}
          className="lg:sticky lg:top-28 lg:h-fit"
        >
          <SectionLabel index="02" label="About" className="mb-5" />
          <h2 className="display-title text-[clamp(2.9rem,7vw,5.8rem)]">
            Research-first, <span className="serif-accent gradient-text">build-minded.</span>
          </h2>

          {/* abstract data-layers signature (no image needed) */}
          <div className="grain relative mt-9 max-w-xs overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.02] p-6">
            <div className="coord mb-5 flex items-center justify-between text-foreground/40">
              <span className="text-primary/80">SIGNAL</span>
              <span>SJ — AI/DS</span>
            </div>
            <div className="space-y-2.5">
              {[88, 64, 76, 42, 70, 54].map((w, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="h-1 w-1 shrink-0 rounded-full bg-primary/60" />
                  <span className="h-1.5 rounded-full bg-gradient-to-r from-primary/45 to-transparent" style={{ width: `${w}%` }} />
                </div>
              ))}
            </div>
            <div className="coord mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-foreground/35">
              <span>NLP · CV · RAG</span>
              <span className="text-primary/70">● LIVE</span>
            </div>
          </div>
        </motion.div>

        <div className="space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.75, delay: 0.05 }}
            className="soft-card rounded-[2rem] p-7 md:p-10"
          >
            <p className="font-syne text-xl leading-[1.7] text-foreground/82 md:text-2xl">
              I am an M.Sc. Artificial Intelligence candidate and data scientist focused on turning
              research ideas into practical machine learning systems.
            </p>
            <div className="mt-8 grid grid-cols-1 gap-5 border-t border-white/10 pt-8 md:grid-cols-2">
              <p className="font-syne text-base leading-[1.8] text-foreground/64">
                My work spans natural language processing, Persian sentiment analysis, medical image
                segmentation, retrieval-augmented generation, and applied computer vision.
              </p>
              <p className="font-syne text-base leading-[1.8] text-foreground/64">
                I care about clean experiments, measurable evaluation, readable code, and systems that
                are understandable enough to be trusted and useful enough to be deployed.
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {metrics.map(([value, label], index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, delay: index * 0.05 }}
                className="rounded-3xl border border-white/10 bg-white/[0.025] p-5"
              >
                <div className="font-syne text-2xl font-semibold tracking-[-0.04em] text-primary md:text-3xl">{value}</div>
                <div className="mt-2 font-syne text-xs uppercase tracking-[0.16em] text-foreground/45">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
