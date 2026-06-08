'use client';

import { motion } from 'framer-motion';
import MediaFrame, { type MediaVariant } from './ui/MediaFrame';

type Pillar = {
  id: string;
  variant: MediaVariant;
  title: string;
  description: string;
  methods: string[];
  imageHint: string;
};

const pillars: Pillar[] = [
  {
    id: 'nlp',
    variant: 'nlp',
    title: 'Natural Language Processing',
    description:
      'Sentiment analysis and language understanding for low-resource settings — including Persian — combining transformer embeddings with lexicon signals for robust, interpretable results.',
    methods: ['Transformers', 'BERT / ParsBERT', 'Sentiment', 'Embeddings'],
    imageHint: 'Token-embedding / attention map visual',
  },
  {
    id: 'medical',
    variant: 'medical',
    title: 'Medical AI',
    description:
      'Deep learning for biomedical image segmentation — liver and lung tumor delineation from CT — with attention to supervision strategy, class imbalance, and clinical evaluation.',
    methods: ['UNet', 'CT Imaging', 'Segmentation', 'PyTorch'],
    imageHint: 'CT scan with segmentation mask overlay',
  },
  {
    id: 'rag',
    variant: 'rag',
    title: 'Retrieval-Augmented Generation',
    description:
      'Document-grounded question answering using vector search and language models, so responses stay traceable to source context rather than hallucinated.',
    methods: ['LangChain', 'Vector Search', 'Grounding', 'LLM QA'],
    imageHint: 'Document → retrieval → answer flow diagram',
  },
  {
    id: 'vision',
    variant: 'vision',
    title: 'Computer Vision',
    description:
      'Applied visual intelligence — real-time pose estimation, motion analysis, and image-processing prototypes that turn camera input into useful interaction.',
    methods: ['OpenCV', 'MediaPipe', 'Pose Estimation', 'Real-time'],
    imageHint: 'Pose-keypoint / feature-detection visual',
  },
];

export default function ResearchFocus() {
  return (
    <section id="research" className="relative px-6 py-24 text-foreground md:px-12 md:py-32">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.75 }}
          className="mb-14 max-w-3xl md:mb-18"
        >
          <p className="eyebrow mb-5"><span className="text-foreground/30">03 ·</span> Research Focus</p>
          <h2 className="display-title text-[clamp(2.9rem,7vw,5.6rem)]">
            Four directions, one <span className="serif-accent text-primary">throughline.</span>
          </h2>
          <p className="mt-6 max-w-2xl font-syne text-base leading-[1.8] text-foreground/64 md:text-lg">
            Different domains, the same discipline: frame the problem precisely, measure honestly, and
            build systems that earn trust because their behaviour can be understood.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
          {pillars.map((pillar, index) => (
            <motion.article
              key={pillar.id}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: index * 0.06 }}
              className="soft-card group flex flex-col overflow-hidden rounded-[1.75rem] p-5 transition-colors hover:border-primary/40 md:p-6"
            >
              <MediaFrame
                variant={pillar.variant}
                ratio="16 / 9"
                hint={pillar.imageHint}
                tag={pillar.id}
                className="mb-6"
              />
              <h3 className="font-syne text-2xl font-semibold tracking-[-0.035em] text-foreground md:text-[1.7rem]">
                {pillar.title}
              </h3>
              <p className="mt-3 font-syne text-sm leading-7 text-foreground/64 md:text-base">
                {pillar.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {pillar.methods.map((method) => (
                  <span
                    key={method}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 font-syne text-[0.7rem] uppercase tracking-[0.14em] text-foreground/55"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
