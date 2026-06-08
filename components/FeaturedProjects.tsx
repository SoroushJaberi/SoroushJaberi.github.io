'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MediaFrame, { type MediaVariant } from './ui/MediaFrame';
import SectionLabel from './ui/SectionLabel';
import SplitText from './ui/SplitText';

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
    problem: 'Persian sentiment is hard — informal text, scarce labels, negation and sarcasm.',
    approach: 'ParsBERT contextual embeddings fused with lexicon polarity, combined via ensembles.',
    outcome: 'More robust, interpretable classification — basis of a paper under review.',
    stack: ['Python', 'ParsBERT', 'VADER', 'Ensemble', 'Evaluation'],
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
    problem: 'LLMs answer fluently but hallucinate, and ignore a user’s private documents.',
    approach: 'Embed docs (Instructor-XL) → ChromaDB retrieval → grounded generation, via LangChain.',
    outcome: 'Document-grounded QA traceable to its sources instead of guessing.',
    stack: ['LangChain', 'Instructor-XL', 'ChromaDB', 'Dolly v2', 'RAG'],
    links: [{ label: 'Repository', href: 'https://github.com/SoroushJaberi/Langchain_LLM_Retrieval_QA' }],
  },
  {
    number: '03',
    title: 'Medical Tumor Segmentation',
    type: 'Medical AI · Computer Vision',
    variant: 'medical',
    imageHint: 'CT slice with predicted tumor mask overlay',
    problem: 'Manual CT tumor delineation is slow, and tumors are tiny vs. background — severe imbalance.',
    approach: 'PyTorch UNet pipelines for liver & lung tumors with imbalance-aware training.',
    outcome: 'Reproducible segmentation across modalities — foundation for a mapping study.',
    stack: ['PyTorch', 'UNet', 'OpenCV', 'Medical Imaging', 'Segmentation'],
    links: [
      { label: 'Liver Project', href: 'https://github.com/SoroushJaberi/Liver-Tumor-Segmentation-Using-PyTorch-DeepLearning' },
      { label: 'Lung Project', href: 'https://github.com/SoroushJaberi/Lung-Tumor-Segmentation-Using-PyTorch-DeepLearning' },
    ],
  },
  {
    number: '04',
    title: 'Applied Vision Prototypes',
    type: 'Computer Vision · Real-time',
    variant: 'vision',
    imageHint: 'Pose-keypoint overlay on a live webcam frame',
    problem: 'Turning a trained model into a real-time tool means fighting latency and noisy keypoints.',
    approach: 'Pose-based rep counting (MediaPipe), motion detection, and image-processing tools.',
    outcome: 'Working demos like the Live Bicep Counter — camera input as real-time interaction.',
    stack: ['OpenCV', 'MediaPipe', 'Python', 'Pose Estimation'],
    links: [
      { label: 'Live Bicep Counter', href: 'https://github.com/SoroushJaberi/LiveBicepCounter' },
      { label: 'GitHub', href: 'https://github.com/SoroushJaberi' },
    ],
  },
];

function Panel({ project, index, horizontal }: { project: Project; index: number; horizontal: boolean }) {
  const mediaRight = index % 2 === 1;
  return (
    <article
      className={
        horizontal
          ? 'panel flex h-screen w-screen shrink-0 items-center px-6 md:px-12 lg:px-20'
          : 'panel w-full'
      }
    >
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16">
        <div className={mediaRight ? 'lg:order-2' : 'lg:order-1'}>
          <MediaFrame variant={project.variant} ratio="4 / 3" label={`Project ${project.number}`} hint={project.imageHint} tag={project.variant} />
        </div>
        <div className={mediaRight ? 'lg:order-1' : 'lg:order-2'}>
          <div className="mb-5 flex items-center gap-4">
            <span className="rounded-full border border-primary/30 px-3 py-1.5 font-syne text-xs uppercase tracking-[0.2em] text-primary">{project.number}</span>
            <span className="font-syne text-xs uppercase tracking-[0.2em] text-foreground/42">{project.type}</span>
          </div>
          <h3 className="font-syne text-[clamp(1.9rem,3.4vw,3rem)] font-semibold leading-[1.05] tracking-[-0.04em] text-foreground">{project.title}</h3>
          <dl className="mt-6 space-y-4 border-l border-white/10 pl-5">
            {[
              ['Problem', project.problem],
              ['Approach', project.approach],
              ['Outcome', project.outcome],
            ].map(([term, def]) => (
              <div key={term}>
                <dt className="font-syne text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-primary/80">{term}</dt>
                <dd className="mt-1 font-syne text-sm leading-6 text-foreground/68">{def}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6 flex flex-wrap gap-2">
            {project.stack.map((item) => (
              <span key={item} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 font-syne text-[0.68rem] uppercase tracking-[0.14em] text-foreground/60">{item}</span>
            ))}
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            {project.links.map((link) => {
              const external = link.href.startsWith('http');
              return (
                <a key={link.label} href={link.href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} className="rounded-full border border-white/12 px-5 py-2.5 font-syne text-xs font-bold uppercase tracking-[0.16em] text-foreground/78 transition-colors hover:border-primary hover:text-primary">
                  {link.label} ↗
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function FeaturedProjects() {
  const pin = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const [horizontal, setHorizontal] = useState(false);

  // decide layout mode (desktop + motion allowed = horizontal)
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const compute = () => setHorizontal(!reduce && window.innerWidth >= 1024);
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, []);

  // pinned horizontal scroll
  useEffect(() => {
    if (!horizontal || !track.current || !pin.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const distance = () => track.current!.scrollWidth - window.innerWidth;
      const tween = gsap.to(track.current, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: pin.current,
          start: 'top top',
          end: () => '+=' + distance(),
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
      gsap.to(progress.current, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { trigger: pin.current, start: 'top top', end: () => '+=' + distance(), scrub: true },
      });
      return () => tween.kill();
    }, pin);
    return () => ctx.revert();
  }, [horizontal]);

  return (
    <section id="projects" className="relative text-foreground">
      <div className="px-6 pb-12 pt-24 md:px-12 md:pt-32">
        <div className="mx-auto max-w-7xl">
          <SectionLabel index="06" label="Featured Projects" className="mb-5" />
          <h2 className="display-title text-[clamp(2.8rem,7vw,5.4rem)]">
            <SplitText text="Selected work, as" />{' '}
            <span className="serif-accent gradient-text">case studies.</span>
          </h2>
          <p className="mt-6 max-w-2xl font-syne text-base leading-[1.8] text-foreground/64 md:text-lg">
            Each project framed by the problem it solves, the approach behind it, and what came of it.
            {horizontal ? ' Scroll to move through them.' : ''}
          </p>
        </div>
      </div>

      <div ref={pin} className={horizontal ? 'h-screen overflow-hidden' : ''}>
        <div ref={track} className={horizontal ? 'flex h-screen' : 'flex flex-col gap-24 pb-8 md:gap-32'}>
          {projects.map((project, index) => (
            <Panel key={project.title} project={project} index={index} horizontal={horizontal} />
          ))}
        </div>
        {horizontal && (
          <div className="pointer-events-none absolute bottom-10 left-1/2 z-10 h-px w-[min(60vw,40rem)] -translate-x-1/2 bg-white/10">
            <div ref={progress} className="h-full w-full origin-left scale-x-0 bg-gradient-to-r from-primary via-[#a78bfa] to-[#d6b56d]" />
          </div>
        )}
      </div>
    </section>
  );
}
