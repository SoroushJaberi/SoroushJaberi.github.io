'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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

      // the line draws as you scroll through the section
      gsap.fromTo(line.current, { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: track });
      // a comet head rides the line head
      gsap.fromTo(comet.current, { top: '0%' }, { top: '100%', ease: 'none', scrollTrigger: track });

      // each milestone reveals in sequence (plays once, stays visible)
      gsap.utils.toArray<HTMLElement>('.tl-item').forEach((item) => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: item, start: 'top 84%', once: true },
        });
        tl.from(item.querySelector('.tl-year'), { opacity: 0, x: -24, duration: 0.6, ease: 'power3.out' })
          .from(item.querySelector('.tl-node'), { scale: 0, opacity: 0, duration: 0.5, ease: 'back.out(2)' }, '<0.05')
          .from(item.querySelector('.tl-content'), { opacity: 0, y: 34, duration: 0.7, ease: 'power3.out' }, '<0.05');
      });

      ScrollTrigger.refresh();
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" className="relative px-6 py-24 text-foreground md:px-12 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 max-w-4xl">
          <p className="eyebrow mb-5"><span className="text-foreground/30">07 ·</span> Timeline</p>
          <h2 className="display-title text-[clamp(2.9rem,7vw,5.6rem)]">
            The trajectory behind the <span className="serif-accent text-primary">work.</span>
          </h2>
        </div>

        <div ref={root} className="relative pl-10 md:pl-16">
          {/* track */}
          <div className="absolute left-[3px] top-0 h-full w-px bg-white/10 md:left-[5px]" />
          {/* drawing line */}
          <div
            ref={line}
            className="absolute left-[3px] top-0 h-full w-px origin-top scale-y-0 bg-gradient-to-b from-primary via-[#a78bfa] to-[#d6b56d] shadow-[0_0_12px_rgba(124,199,255,0.5)] md:left-[5px]"
          />
          {/* comet head */}
          <div
            ref={comet}
            className="absolute left-[4px] top-0 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-white shadow-[0_0_22px_rgba(124,199,255,0.95)] md:left-[6px]"
          />

          <div className="space-y-12 md:space-y-16">
            {milestones.map((item) => (
              <article
                key={`${item.year}-${item.title}`}
                className="tl-item group relative grid grid-cols-1 gap-2 md:grid-cols-[7rem_1fr] md:gap-10"
              >
                {/* node on the line */}
                <span className="tl-node absolute left-[-2.05rem] top-2 hidden h-[0.7rem] w-[0.7rem] rounded-full border border-primary/60 bg-background shadow-[0_0_16px_rgba(124,199,255,0.7)] md:left-[-2.85rem] md:block" />
                <span className="tl-year font-instrument text-[2.6rem] italic leading-none tracking-[-0.03em] text-primary/85 md:text-[3.1rem]">
                  {item.year}
                </span>
                <div className="tl-content">
                  <h3 className="font-syne text-xl font-semibold tracking-[-0.03em] text-foreground md:text-2xl">{item.title}</h3>
                  <p className="mt-3 max-w-3xl font-syne text-sm leading-7 text-foreground/62 md:text-base">{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
