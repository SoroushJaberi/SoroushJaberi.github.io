'use client';

import { motion } from 'framer-motion';
import DataVisual from './ui/DataVisual';
import SectionLabel from './ui/SectionLabel';
import SplitText from './ui/SplitText';
import Tilt from './ui/Tilt';

type ProjectLink = { label: string; href: string };
type ProjectKind = 'nlp' | 'rag' | 'medical' | 'vision';
type Project = {
  number: string;
  title: string;
  type: string;
  kind: ProjectKind;
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
    type: 'NLP / Deep Learning / Research',
    kind: 'nlp',
    problem: 'Persian sentiment is difficult because informal text, scarce labels, negation, and sarcasm weaken simple polarity models.',
    approach: 'ParsBERT contextual embeddings fused with lexicon polarity, combined through ensemble methods and evaluation-led iteration.',
    outcome: 'A more interpretable sentiment classification pipeline and the basis of a paper currently under review.',
    stack: ['Python', 'ParsBERT', 'VADER', 'Ensemble', 'Evaluation'],
    links: [
      { label: 'GitHub', href: 'https://github.com/SoroushJaberi' },
      { label: 'Research', href: '#academic' },
    ],
  },
  {
    number: '02',
    title: 'LangChain LLM Retrieval QA',
    type: 'Generative AI / RAG / Vector Search',
    kind: 'rag',
    problem: 'LLMs can answer fluently while ignoring private documents or inventing unsupported details.',
    approach: 'Document embeddings, ChromaDB retrieval, and grounded generation orchestrated through LangChain.',
    outcome: 'A document-grounded QA workflow where answers remain traceable to retrieved source context.',
    stack: ['LangChain', 'Instructor-XL', 'ChromaDB', 'Dolly v2', 'RAG'],
    links: [{ label: 'Repository', href: 'https://github.com/SoroushJaberi/Langchain_LLM_Retrieval_QA' }],
  },
  {
    number: '03',
    title: 'Medical Tumor Segmentation',
    type: 'Medical AI / Computer Vision',
    kind: 'medical',
    problem: 'Manual CT tumor delineation is slow, and tiny tumor regions create severe foreground-background imbalance.',
    approach: 'PyTorch UNet pipelines for liver and lung tumors with reproducible training structure and image-processing support.',
    outcome: 'Segmentation projects across modalities and a foundation for a deep learning biomedical segmentation mapping study.',
    stack: ['PyTorch', 'UNet', 'OpenCV', 'Medical Imaging', 'Segmentation'],
    links: [
      { label: 'Liver Project', href: 'https://github.com/SoroushJaberi/Liver-Tumor-Segmentation-Using-PyTorch-DeepLearning' },
      { label: 'Lung Project', href: 'https://github.com/SoroushJaberi/Lung-Tumor-Segmentation-Using-PyTorch-DeepLearning' },
    ],
  },
  {
    number: '04',
    title: 'Applied Vision Prototypes',
    type: 'Computer Vision / Real-time',
    kind: 'vision',
    problem: 'Turning model output into a real-time tool means handling latency, noisy keypoints, and interaction feedback.',
    approach: 'Pose-based rep counting with MediaPipe, motion detection, and image-processing prototypes in Python.',
    outcome: 'Working camera-input demos including the Live Bicep Counter and related visual interaction experiments.',
    stack: ['OpenCV', 'MediaPipe', 'Python', 'Pose Estimation'],
    links: [
      { label: 'Live Bicep Counter', href: 'https://github.com/SoroushJaberi/LiveBicepCounter' },
      { label: 'GitHub', href: 'https://github.com/SoroushJaberi' },
    ],
  },
];

function ProjectCase({ project, index }: { project: Project; index: number }) {
  const visualFirst = index % 2 === 1;

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.68, delay: index * 0.04 }}
      className="grid grid-cols-1 gap-6 border-t border-white/12 py-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12 lg:py-16"
    >
      <div className={`min-w-0 ${visualFirst ? 'lg:order-2' : 'lg:order-1'}`}>
        <Tilt max={6} className="min-w-0 [transform-style:preserve-3d]">
          <DataVisual kind={project.kind} label={`Case ${project.number}`} className="min-h-[15rem] sm:min-h-[20rem]" />
        </Tilt>
      </div>

      <div className={`min-w-0 ${visualFirst ? 'lg:order-1' : 'lg:order-2'}`}>
        <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="font-mono-label text-[0.64rem] uppercase tracking-[0.24em] text-primary">Case {project.number}</span>
          <span className="font-mono-label text-[0.64rem] uppercase tracking-[0.2em] text-foreground/52">{project.type}</span>
        </div>
        <h3 className="font-syne text-[clamp(2rem,4vw,3.4rem)] font-semibold leading-[1.02] tracking-[-0.045em] text-foreground">
          {project.title}
        </h3>

        <dl className="mt-7 grid grid-cols-1 gap-5">
          {[
            ['Problem', project.problem],
            ['Approach', project.approach],
            ['Outcome', project.outcome],
          ].map(([term, def]) => (
            <div key={term} className="grid grid-cols-1 gap-2 border-l border-white/12 pl-5 md:grid-cols-[6rem_1fr]">
              <dt className="font-mono-label text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-primary/78">{term}</dt>
              <dd className="font-syne text-sm leading-7 text-foreground/66 md:text-base">{def}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-7 flex flex-wrap gap-x-4 gap-y-2 font-mono-label text-[0.62rem] uppercase tracking-[0.16em] text-foreground/52">
          {project.stack.map((item) => (
            <span key={item}>{item}</span>
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
                className="border border-white/12 px-4 py-2.5 font-syne text-xs font-bold uppercase tracking-[0.16em] text-foreground/78 transition-colors hover:border-primary hover:text-primary"
              >
                {link.label}
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
        <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <SectionLabel index="05" label="Selected Work" className="mb-5" />
            <h2 className="display-title max-w-[12ch] text-[clamp(2.8rem,6.5vw,5.4rem)]">
              <SplitText text="Selected" /> <span className="serif-accent gradient-text">case studies.</span>
            </h2>
          </div>
          <p className="max-w-xl font-syne text-base leading-[1.8] text-foreground/60 md:text-lg">
            What each project solves, how it was built, and why it matters.
          </p>
        </div>

        <div>
          {projects.map((project, index) => (
            <ProjectCase key={project.title} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
