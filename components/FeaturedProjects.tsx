'use client';

import { motion } from 'framer-motion';
import MediaFrame, { type MediaVariant } from './ui/MediaFrame';
import Tilt from './ui/Tilt';

type ProjectLink = { label: string; href: string };

type Project = {
  number: string;
  title: string;
  type: string;
  variant: MediaVariant;
  imageHint: string;
  problem: string;
  approach: string;
  outcome: string;
  stack: string[];
  links: ProjectLink[];
};

const projects: Project[] = [
  {
    number: '01',
    title: 'Hybrid Persian Sentiment Analysis',
    type: 'NLP · Deep Learning · Research',
    variant: 'nlp',
    imageHint: 'Confusion matrix / training curves / demo UI',
    problem:
      'Persian sentiment is hard: informal text, scarce labelled data, negation and sarcasm. Pure lexicon methods miss context; pure transformers miss explicit polarity cues.',
    approach:
      'A hybrid framework fusing ParsBERT contextual embeddings with lexicon-based polarity signals, combined through ensemble methods for robustness on real product reviews.',
    outcome:
      'More robust and interpretable classification than either method alone — the basis of a paper currently under review.',
    stack: ['Python', 'ParsBERT', 'BERT', 'VADER', 'Ensemble', 'Evaluation'],
    links: [
      { label: 'GitHub', href: 'https://github.com/SoroushJaberi' },
      { label: 'Research', href: '#academic' },
    ],
  },
  {
    number: '02',
    title: 'LangChain LLM Retrieval QA',
    type: 'Generative AI · RAG · Vector Search',
    variant: 'rag',
    imageHint: 'Retrieval → context → grounded answer screenshot',
    problem:
      'Large language models answer fluently but hallucinate, and they have no knowledge of a user’s own private documents.',
    approach:
      'A retrieval-augmented pipeline: embed documents with Instructor-XL, index them in ChromaDB, retrieve the most relevant context, and let the model generate answers grounded in it — orchestrated with LangChain.',
    outcome:
      'Document-grounded question answering that stays traceable to retrieved sources instead of guessing.',
    stack: ['LangChain', 'Instructor-XL', 'ChromaDB', 'Dolly v2', 'RAG', 'Python'],
    links: [
      { label: 'Repository', href: 'https://github.com/SoroushJaberi/Langchain_LLM_Retrieval_QA' },
    ],
  },
  {
    number: '03',
    title: 'Medical Tumor Segmentation',
    type: 'Medical AI · Computer Vision',
    variant: 'medical',
    imageHint: 'CT slice with predicted tumor mask overlay',
    problem:
      'Manual tumor delineation in CT is slow and inconsistent, and tumors are small, heavily outnumbered by background voxels — a severe class-imbalance problem.',
    approach:
      'PyTorch UNet-style segmentation pipelines for liver and lung tumors, with careful preprocessing, augmentation, and imbalance-aware training across two imaging modalities.',
    outcome:
      'Reproducible segmentation pipelines that generalise across modalities — and the foundation for a systematic mapping study of biomedical segmentation.',
    stack: ['PyTorch', 'UNet', 'OpenCV', 'Medical Imaging', 'Segmentation', 'Deep Learning'],
    links: [
      { label: 'Liver Project', href: 'https://github.com/SoroushJaberi/Liver-Tumor-Segmentation-Using-PyTorch-DeepLearning' },
      { label: 'Lung Project', href: 'https://github.com/SoroushJaberi/Lung-Tumor-Segmentation-Using-PyTorch-DeepLearning' },
    ],
  },
  {
    number: '04',
    title: 'Applied Vision Prototypes',
    type: 'Computer Vision · Real-time Interaction',
    variant: 'vision',
    imageHint: 'Pose-keypoint overlay on live webcam frame',
    problem:
      'Turning a trained model into a usable real-time tool is its own challenge — latency, noisy keypoints, and interface design all get in the way.',
    approach:
      'A set of practical prototypes — pose-based rep counting with MediaPipe, motion detection, and image-processing utilities — wrapped in lightweight interfaces.',
    outcome:
      'Working end-to-end demos such as the Live Bicep Counter that translate camera input into real-time, useful interaction.',
    stack: ['OpenCV', 'MediaPipe', 'Tkinter', 'Python', 'Image Processing', 'Pose Estimation'],
    links: [
      { label: 'Live Bicep Counter', href: 'https://github.com/SoroushJaberi/LiveBicepCounter' },
      { label: 'GitHub', href: 'https://github.com/SoroushJaberi' },
    ],
  },
];

function CaseStudy({ project, index }: { project: Project; index: number }) {
  const mediaRight = index % 2 === 1;

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-14"
    >
      {/* media */}
      <div className={`${mediaRight ? 'lg:order-2' : 'lg:order-1'} lg:sticky lg:top-28`}>
        <Tilt>
          <MediaFrame
            variant={project.variant}
            ratio="4 / 3"
            label={`Project ${project.number}`}
            hint={project.imageHint}
            tag={project.variant}
          />
        </Tilt>
      </div>

      {/* content */}
      <div className={mediaRight ? 'lg:order-1' : 'lg:order-2'}>
        <div className="mb-6 flex items-center gap-4">
          <span className="rounded-full border border-primary/30 px-3 py-1.5 font-syne text-xs uppercase tracking-[0.2em] text-primary">
            {project.number}
          </span>
          <span className="font-syne text-xs uppercase tracking-[0.2em] text-foreground/42">{project.type}</span>
        </div>

        <h3 className="font-syne text-[clamp(2rem,4.5vw,3.2rem)] font-semibold leading-[1.05] tracking-[-0.04em] text-foreground">
          {project.title}
        </h3>

        <dl className="mt-7 space-y-5 border-l border-white/10 pl-5">
          {[
            ['Problem', project.problem],
            ['Approach', project.approach],
            ['Outcome', project.outcome],
          ].map(([term, def]) => (
            <div key={term}>
              <dt className="font-syne text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-primary/80">{term}</dt>
              <dd className="mt-1.5 font-syne text-sm leading-7 text-foreground/68 md:text-[0.95rem]">{def}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-7 flex flex-wrap gap-2">
          {project.stack.map((item) => (
            <span
              key={item}
              className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 font-syne text-[0.7rem] uppercase tracking-[0.14em] text-foreground/60"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {project.links.map((link) => {
            const external = link.href.startsWith('http');
            return (
              <a
                key={link.label}
                href={link.href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                className="rounded-full border border-white/12 px-5 py-2.5 font-syne text-xs font-bold uppercase tracking-[0.16em] text-foreground/78 transition-colors hover:border-primary hover:text-primary"
              >
                {link.label} ↗
              </a>
            );
          })}
        </div>
      </div>
    </motion.article>
  );
}

export default function FeaturedProjects() {
  return (
    <section id="projects" className="relative px-6 py-24 text-foreground md:px-12 md:py-32">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.75 }}
          className="mb-16 max-w-3xl md:mb-24"
        >
          <p className="eyebrow mb-5"><span className="text-foreground/30">06 ·</span> Featured Projects</p>
          <h2 className="display-title text-[clamp(2.8rem,7vw,5.4rem)]">
            Selected work, as <span className="serif-accent text-primary">case studies.</span>
          </h2>
          <p className="mt-6 max-w-2xl font-syne text-base leading-[1.8] text-foreground/64 md:text-lg">
            Not a list of repositories — each project framed by the problem it solves, the approach
            behind it, and what came out of it.
          </p>
        </motion.div>

        <div className="space-y-24 md:space-y-36">
          {projects.map((project, index) => (
            <CaseStudy key={project.title} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
