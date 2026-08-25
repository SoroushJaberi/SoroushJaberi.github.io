'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionLabel from './ui/SectionLabel';
import Magnetic from './ui/Magnetic';

const milestones = [
  {
    year: '2026',
    title: 'M.Sc. thesis defense preparation',
    text: 'Preparing to defend my thesis on improving sentiment classification in Persian texts using transformer-based and lexicon-based methods.',
  },
  {
    year: '2025',
    title: 'Graduate teaching and research focus',
    text: 'Continued teaching assistant work while deepening research across NLP, medical AI, and retrieval-augmented language systems.',
  },
  {
    year: '2023',
    title: 'Started M.Sc. in Artificial Intelligence',
    text: 'Began graduate studies with a strong academic focus on machine learning, deep learning, image processing, and applied AI systems.',
  },
  {
    year: '2022',
    title: 'Research & network internship',
    text: 'Worked with Tehran Telecommunication Company on network connectivity data, traffic monitoring, and cloud/networking research.',
  },
  {
    year: '2019',
    title: 'Computer engineering foundation',
    text: 'Started building the technical foundation in algorithms, programming, artificial intelligence, data mining, and software engineering.',
  },
];

export default function TimelineSection() {
  const root = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLDivElement>(null);
  const comet = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const track = { trigger: root.current, start: 'top 68%', end: 'bottom 80%', scrub: true } as const;
      gsap.fromTo(line.current, { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: track });
      gsap.fromTo(comet.current, { top: '0%' }, { top: '100%', ease: 'none', scrollTrigger: track });

      gsap.utils.toArray<HTMLElement>('.tl-item').forEach((item) => {
        // reveal — slide + subtle rotate
        gsap.timeline({ scrollTrigger: { trigger: item, start: 'top 84%', once: true } })
          .from(item.querySelector('.tl-index'), { opacity: 0, x: -20, duration: 0.5, ease: 'power3.out' })
          .from(item.querySelector('.tl-year'), { opacity: 0, x: -28, rotateX: -40, duration: 0.6, ease: 'power3.out' }, '<0.05')
          .from(item.querySelector('.tl-content'), { opacity: 0, y: 30, duration: 0.6, ease: 'power3.out' }, '<0.05');
        // active highlight while centred
        ScrollTrigger.create({ trigger: item, start: 'top 58%', end: 'bottom 42%', toggleClass: { targets: item, className: 'tl-active' } });
      });

      ScrollTrigger.refresh();
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" className="relative px-6 py-24 text-foreground md:px-12 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 max-w-4xl">
          <SectionLabel index="07" label="Timeline" className="mb-6" />
          <h2 className="display-title text-[clamp(2.8rem,6.5vw,5.2rem)]">
            The path <span className="serif-accent text-primary">so far.</span>
          </h2>
        </div>

        <div ref={root} className="relative pl-12 md:pl-0">
          {/* signal track */}
          <div className="absolute left-[3px] top-0 h-full w-px bg-white/10 md:left-[166px]" />
          <div ref={line} className="absolute left-[3px] top-0 h-full w-px origin-top scale-y-0 bg-gradient-to-b from-primary via-primary/70 to-[#d9ba70] shadow-[0_0_8px_rgba(143,227,217,0.3)] md:left-[166px]" />
          <div ref={comet} className="absolute left-[4px] top-0 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-white shadow-[0_0_14px_rgba(143,227,217,0.6)] md:left-[167px]" />

          <div className="space-y-16 md:space-y-24">
            {milestones.map((item, i) => (
              <article
                key={`${item.year}-${item.title}`}
                className="tl-item group relative grid grid-cols-1 gap-3 md:grid-cols-[166px_1fr] md:gap-16"
              >
                {/* node on the line */}
                <span className="tl-node absolute left-[-2.55rem] top-7 hidden h-[0.7rem] w-[0.7rem] rounded-full border border-primary/50 bg-background md:left-[160px] md:block" />

                {/* year as research-archive coordinate */}
                <div className="md:pr-10 md:text-right">
                  <span className="tl-index coord block text-foreground/35">A.{String(i + 1).padStart(2, '0')} / {String(milestones.length).padStart(2, '0')}</span>
                  <Magnetic strength={0.4} className="mt-3 inline-block md:mt-4">
                    <span className="tl-year font-instrument block text-[3.6rem] leading-[0.85] tracking-[0.01em] md:text-[4.8rem]">
                      {item.year}
                    </span>
                  </Magnetic>
                </div>

                <div className="tl-content md:pt-3">
                  <h3 className="font-syne text-xl font-semibold tracking-[-0.03em] text-foreground md:text-[1.6rem]">{item.title}</h3>
                  <p className="mt-4 max-w-2xl font-syne text-[0.95rem] leading-7 text-foreground/62 md:text-base">{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
