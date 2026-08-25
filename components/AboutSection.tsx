'use client';

import { motion } from 'framer-motion';
import MediaFrame from './ui/MediaFrame';
import SectionLabel from './ui/SectionLabel';

const metrics = [
  ['4.0 / 4.0', 'M.Sc. AI GPA'],
  ['2026', 'Expected thesis defense'],
  ['NLP / CV / RAG', 'Research areas'],
];

const principles = [
  'Frame the research question before the model choice.',
  'Prefer measurable experiments over impressive demos.',
  'Build readable systems that can be trusted, reviewed, and reused.',
];

export default function AboutSection() {
  return (
    <section id="about" className="relative px-6 py-24 text-foreground md:px-12 md:py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.75 }}
        >
          <SectionLabel index="01" label="About" className="mb-5" />
          <h2 className="display-title max-w-[10ch] text-[clamp(3rem,7vw,6rem)]">
            Research-first, <span className="serif-accent gradient-text">build-minded.</span>
          </h2>
          <p className="mt-8 max-w-2xl font-syne text-xl leading-[1.65] text-foreground/78 md:text-2xl">
            I am an M.Sc. Artificial Intelligence candidate and data scientist who works across the whole
            of modern AI — from statistical modelling and classical machine learning, through deep neural
            architectures, to generative models and large language models.
          </p>
          <p className="mt-5 max-w-2xl font-syne text-base leading-[1.8] text-foreground/58 md:text-lg">
            That range is not theoretical: it shows up as Persian sentiment analysis, biomedical image
            segmentation, retrieval-augmented generation and applied computer vision — research and
            delivery, not one or the other. I care about experiments clean enough to reproduce and
            systems understandable enough to trust.
          </p>

          <div className="mt-10 grid grid-cols-1 border-y border-white/12 md:grid-cols-3">
            {metrics.map(([value, label]) => (
              <div key={label} className="border-white/12 py-5 md:border-r md:px-5 md:first:pl-0 md:last:border-r-0">
                <div className="font-syne text-2xl font-semibold tracking-[-0.04em] text-primary md:text-3xl">{value}</div>
                <div className="mt-2 font-mono-label text-[0.62rem] uppercase tracking-[0.18em] text-foreground/52">{label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.75, delay: 0.05 }}
          className="grid gap-4 sm:grid-cols-[0.82fr_1fr] lg:pt-12"
        >
          <div className="space-y-4">
            <MediaFrame
              src="/images/optimized/contact-sun.jpg"
              alt="Soroush Jaberi in a cinematic, side-lit portrait"
              variant="portrait"
              ratio="4 / 5"
              objectPosition="50% 37%"
              className="rounded-lg"
            />
            <div className="border border-white/10 bg-white/[0.025] p-4">
              <p className="font-mono-label text-[0.62rem] uppercase tracking-[0.2em] text-primary/78">Working pattern</p>
              <p className="mt-3 font-syne text-sm leading-6 text-foreground/62">
                Research question, baseline, evaluation, iteration, readable implementation.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <MediaFrame
              src="/images/optimized/hero-formal.jpg"
              alt="Soroush Jaberi seated in a formal portrait"
              variant="portrait"
              ratio="5 / 6"
              objectPosition="50% 40%"
              className="rounded-lg"
            />
            <div className="glow-card p-5">
              <p className="font-mono-label text-[0.62rem] uppercase tracking-[0.2em] text-foreground/52">Principles</p>
              <ul className="mt-4 space-y-3">
                {principles.map((principle) => (
                  <li key={principle} className="grid grid-cols-[0.7rem_1fr] gap-3 font-syne text-sm leading-6 text-foreground/66">
                    <span className="mt-2 h-1.5 w-1.5 bg-primary" />
                    <span>{principle}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
