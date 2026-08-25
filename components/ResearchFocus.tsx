'use client';

import { motion } from 'framer-motion';
import DataVisual from './ui/DataVisual';
import SectionLabel from './ui/SectionLabel';
import SplitText from './ui/SplitText';

const pillars = [
  {
    id: 'nlp',
    node: '01',
    title: 'Natural language processing',
    description:
      'Sentiment and language understanding for low-resource settings like Persian, pairing transformer context with interpretable lexicon signals.',
    methods: ['Transformers', 'ParsBERT', 'Sentiment'],
  },
  {
    id: 'medical',
    node: '02',
    title: 'Medical AI',
    description:
      'Biomedical image segmentation for CT scans, with care for class imbalance, reproducibility, and clinical evaluation.',
    methods: ['UNet', 'CT imaging', 'PyTorch'],
  },
  {
    id: 'rag',
    node: '03',
    title: 'Retrieval-augmented generation',
    description:
      'Document-grounded question answering with vector search and source-aware generation that keeps answers traceable.',
    methods: ['LangChain', 'Vector search', 'ChromaDB'],
  },
  {
    id: 'vision',
    node: '04',
    title: 'Applied computer vision',
    description:
      'Real-time pose estimation and image-processing prototypes that turn camera input into useful interaction.',
    methods: ['OpenCV', 'MediaPipe', 'Real-time'],
  },
] as const;

export default function ResearchFocus() {
  return (
    <section id="research" className="relative px-6 py-24 text-foreground md:px-12 md:py-32">
      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end"
        >
          <div>
            <SectionLabel index="03" label="Focus areas" className="mb-5" />
            <h2 className="display-title max-w-[13ch] text-[clamp(2.8rem,6.5vw,5.2rem)]">
              <SplitText text="From research to" /> <span className="serif-accent gradient-text">working systems.</span>
            </h2>
          </div>
          <p className="max-w-xl font-syne text-base leading-[1.8] text-foreground/60 md:text-lg lg:pb-2">
            Four areas I work across — from the first experiment to something that actually runs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {pillars.map((pillar, index) => (
            <motion.article
              key={pillar.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: index * 0.05 }}
              className="grid grid-cols-1 gap-5 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 transition-colors duration-300 hover:border-primary/25 sm:grid-cols-[8.5rem_1fr] sm:gap-6 sm:p-6"
            >
              <DataVisual kind={pillar.id} label={pillar.node} className="w-full self-start" />
              <div className="flex flex-col">
                <span className="font-mono-label text-[0.6rem] uppercase tracking-[0.22em] text-primary/70">{pillar.node}</span>
                <h3 className="mt-2 font-syne text-xl font-semibold tracking-[-0.03em] text-foreground md:text-[1.55rem]">{pillar.title}</h3>
                <p className="mt-2.5 font-syne text-sm leading-7 text-foreground/60">{pillar.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {pillar.methods.map((method) => (
                    <span key={method} className="rounded-full border border-white/10 px-3 py-1 font-mono-label text-[0.58rem] uppercase tracking-[0.14em] text-foreground/55">
                      {method}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
