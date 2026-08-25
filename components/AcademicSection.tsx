'use client';

import { motion } from 'framer-motion';
import MediaFrame from './ui/MediaFrame';
import SectionLabel from './ui/SectionLabel';

const education = [
  {
    role: 'M.Sc. Artificial Intelligence',
    org: 'Karaj Islamic Azad University',
    period: '2023 - Present',
    details: ['Overall GPA: 4.0 / 4.0', 'Thesis defense expected Summer 2026', 'Machine Learning, Deep Learning, Image Processing'],
  },
  {
    role: 'B.Sc. Computer Engineering',
    org: 'Karaj Islamic Azad University',
    period: '2019 - 2023',
    details: ['Overall GPA: 3.74 / 4.0', 'Last two years GPA: 3.81 / 4.0', 'AI, Data Mining, Algorithms, Computer Graphics'],
  },
];

const teaching = [
  {
    role: 'Teaching Assistant - Machine Learning',
    period: '2023 - 2025',
    text: 'Supported graduate students in machine learning workflows, model evaluation, and implementation-focused practice.',
  },
  {
    role: 'Teaching Assistant - Data Mining & Algorithm Design',
    period: '2022 - 2025',
    text: 'Guided preprocessing, feature selection, classification, clustering, algorithmic design, and complexity analysis.',
  },
];

const researchWorks = [
  {
    title: 'Enhancing Sentiment Analysis via Ensemble Methods - BERT + VADER',
    venue: 'Under review',
    description:
      'A hybrid sentiment analysis framework combining transformer-based contextual embeddings with lexicon-based polarity signals.',
  },
  {
    title: 'Systematic Mapping Study on Deep Learning-Based Biomedical Image Segmentation Techniques',
    venue: 'In preparation',
    description:
      'A systematic study of deep learning architectures across biomedical imaging modalities, evaluation metrics, 3D modeling challenges, and clinical relevance.',
  },
];

export default function AcademicSection() {
  return (
    <section id="academic" className="relative px-6 py-24 text-foreground md:px-12 md:py-32">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.75 }}
          className="mb-14 grid grid-cols-1 gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end"
        >
          <div>
            <SectionLabel index="03" label="Academic" className="mb-5" />
            <h2 className="display-title max-w-[12ch] text-[clamp(2.8rem,6.5vw,5.4rem)]">
              Education, teaching & <span className="serif-accent gradient-text">research.</span>
            </h2>
          </div>
          <p className="max-w-xl font-syne text-base leading-[1.8] text-foreground/60 md:text-lg">
            Graduate AI work, teaching assistant experience, and active research writing.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.72fr_1.28fr] lg:gap-8">
          <motion.aside
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-70px' }}
            transition={{ duration: 0.7 }}
            className="lg:sticky lg:top-28 lg:h-fit"
          >
            <MediaFrame
              src="/images/optimized/outdoor-formal.jpg"
              alt="Soroush Jaberi in a formal outdoor portrait"
              variant="portrait"
              ratio="4 / 5"
              objectPosition="50% 48%"
              className="rounded-lg"
            />
            <div className="mt-4 border border-white/10 bg-white/[0.025] p-5">
              <p className="font-mono-label text-[0.62rem] uppercase tracking-[0.2em] text-primary/78">Background</p>
              <p className="mt-3 font-syne text-sm leading-6 text-foreground/62">
                AI graduate work, teaching assistant experience, and research writing around NLP and biomedical imaging.
              </p>
            </div>
          </motion.aside>

          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {education.map((item, index) => (
                <motion.article
                  key={item.role}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  className="glow-card p-6"
                >
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <h3 className="font-syne text-xl font-semibold leading-snug tracking-[-0.03em] text-foreground md:text-2xl">{item.role}</h3>
                      <p className="mt-2 font-mono-label text-[0.62rem] uppercase tracking-[0.18em] text-foreground/52">{item.org}</p>
                    </div>
                    <span className="font-mono-label text-[0.62rem] uppercase tracking-[0.18em] text-primary/80">{item.period}</span>
                  </div>
                  <ul className="mt-6 space-y-3 border-t border-white/10 pt-5">
                    {item.details.map((detail) => (
                      <li key={detail} className="flex gap-3 font-syne text-sm leading-6 text-foreground/64">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-primary/75" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </motion.article>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.65 }}
              className="border border-white/10 bg-white/[0.02] p-6"
            >
              <div className="mb-6 flex items-center gap-4">
                <h3 className="font-mono-label text-[0.68rem] uppercase tracking-[0.22em] text-foreground/56">Teaching</h3>
                <div className="h-px flex-1 bg-white/10" />
              </div>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {teaching.map((item) => (
                  <article key={item.role} className="border-l border-primary/35 pl-5">
                    <p className="font-mono-label text-[0.62rem] uppercase tracking-[0.18em] text-primary/76">{item.period}</p>
                    <h4 className="mt-2 font-syne text-lg font-semibold tracking-[-0.03em] text-foreground">{item.role}</h4>
                    <p className="mt-3 font-syne text-sm leading-6 text-foreground/62">{item.text}</p>
                  </article>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.65 }}
              className="grid grid-cols-1 gap-4 lg:grid-cols-2"
            >
              {researchWorks.map((work) => (
                <article key={work.title} className="border border-white/10 bg-white/[0.025] p-6 transition-colors hover:border-primary/35">
                  <span className="font-mono-label text-[0.62rem] uppercase tracking-[0.2em] text-primary/75">{work.venue}</span>
                  <h4 className="mt-4 font-syne text-xl font-semibold leading-snug tracking-[-0.035em] text-foreground md:text-2xl">{work.title}</h4>
                  <p className="mt-4 font-syne text-sm leading-7 text-foreground/64 md:text-base">{work.description}</p>
                </article>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
