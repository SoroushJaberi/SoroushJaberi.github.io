'use client';

import { motion } from 'framer-motion';
import MediaFrame, { type MediaVariant } from './ui/MediaFrame';
import SectionLabel from './ui/SectionLabel';
import SplitText from './ui/SplitText';

type Pillar = {
  id: string;
  node: string;
  variant: MediaVariant;
  title: string;
  description: string;
  methods: string[];
  imageHint: string;
};

const pillars: Pillar[] = [
  {
    id: 'nlp',
    node: '01',
    variant: 'nlp',
    title: 'Natural Language Processing',
    description:
      'Sentiment and language understanding for low-resource settings — including Persian — fusing transformer embeddings with lexicon signals for robust, interpretable results.',
    methods: ['Transformers', 'BERT / ParsBERT', 'Sentiment', 'Embeddings'],
    imageHint: 'Token-embedding / attention map visual',
  },
  {
    id: 'medical',
    node: '02',
    variant: 'medical',
    title: 'Medical AI',
    description:
      'Deep learning for biomedical image segmentation — liver and lung tumor delineation from CT — attentive to supervision strategy, class imbalance, and clinical evaluation.',
    methods: ['UNet', 'CT Imaging', 'Segmentation', 'PyTorch'],
    imageHint: 'CT scan with segmentation mask overlay',
  },
  {
    id: 'rag',
    node: '03',
    variant: 'rag',
    title: 'Retrieval-Augmented Generation',
    description:
      'Document-grounded question answering using vector search and language models, so responses stay traceable to source context rather than hallucinated.',
    methods: ['LangChain', 'Vector Search', 'Grounding', 'LLM QA'],
    imageHint: 'Document → retrieval → answer flow diagram',
  },
  {
    id: 'vision',
    node: '04',
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
    <section id="research" className="relative overflow-hidden px-6 py-24 text-foreground md:px-12 md:py-32">
      {/* faint intelligence-map connectors behind the grid */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.5]" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <line x1="50" y1="50" x2="26" y2="30" stroke="rgba(124,199,255,0.10)" strokeWidth="0.12" />
        <line x1="50" y1="50" x2="74" y2="30" stroke="rgba(124,199,255,0.10)" strokeWidth="0.12" />
        <line x1="50" y1="50" x2="26" y2="72" stroke="rgba(124,199,255,0.10)" strokeWidth="0.12" />
        <line x1="50" y1="50" x2="74" y2="72" stroke="rgba(124,199,255,0.10)" strokeWidth="0.12" />
      </svg>

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.75 }}
          className="mb-14 max-w-3xl md:mb-18"
        >
          <SectionLabel index="03" label="Research Focus" className="mb-5" />
          <h2 className="display-title text-[clamp(2.9rem,7vw,5.6rem)]">
            <SplitText text="A map of" />{' '}
            <span className="serif-accent gradient-text">intelligence.</span>
          </h2>
          <p className="mt-6 max-w-2xl font-syne text-base leading-[1.8] text-foreground/64 md:text-lg">
            Four connected domains, one discipline: frame the problem precisely, measure honestly, and
            build systems whose behaviour can be understood.
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
              className="glow-card flex flex-col overflow-hidden rounded-[1.75rem] p-5 md:p-6"
            >
              <div className="mb-5 flex items-center justify-between">
                <span className="inline-flex items-center gap-2.5 font-syne text-[0.66rem] uppercase tracking-[0.22em] text-foreground/45">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                  </span>
                  Node {pillar.node}
                </span>
                <span className="font-syne text-[0.66rem] uppercase tracking-[0.22em] text-foreground/30">{pillar.id}</span>
              </div>

              <MediaFrame variant={pillar.variant} ratio="16 / 9" hint={pillar.imageHint} tag={pillar.id} className="mb-6" />

              <h3 className="font-syne text-2xl font-semibold tracking-[-0.035em] text-foreground md:text-[1.7rem]">{pillar.title}</h3>
              <p className="mt-3 font-syne text-sm leading-7 text-foreground/64 md:text-base">{pillar.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {pillar.methods.map((method) => (
                  <span key={method} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 font-syne text-[0.7rem] uppercase tracking-[0.14em] text-foreground/55">{method}</span>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
