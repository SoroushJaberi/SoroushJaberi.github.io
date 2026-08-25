'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionLabel from './ui/SectionLabel';
import Magnetic from './ui/Magnetic';

type Milestone = { year: string; title: string; text: string };

/* Chronological — the timeline reads left → right, 2019 through 2026. */
const milestones: Milestone[] = [
  {
    year: '2019',
    title: 'Computer engineering foundation',
    text: 'Started building the technical foundation in algorithms, programming, artificial intelligence, data mining, and software engineering.',
  },
  {
    year: '2022',
    title: 'Research & network internship',
    text: 'Worked with Tehran Telecommunication Company on network connectivity data, traffic monitoring, and cloud/networking research.',
  },
  {
    year: '2023',
    title: 'Started M.Sc. in Artificial Intelligence',
    text: 'Began graduate studies with a strong academic focus on machine learning, deep learning, image processing, and applied AI systems.',
  },
  {
    year: '2025',
    title: 'Graduate teaching and research focus',
    text: 'Continued teaching assistant work while deepening research across NLP, medical AI, and retrieval-augmented language systems.',
  },
  {
    year: '2026',
    title: 'M.Sc. thesis defense preparation',
    text: 'Preparing to defend my thesis on improving sentiment classification in Persian texts using transformer-based and lexicon-based methods.',
  },
];

export default function TimelineSection() {
  const pin = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLSpanElement>(null);
  const scroller = useRef<HTMLDivElement>(null);

  // One continuous gesture: scrolling down pins the section, carries the years
  // left→right, then releases and the page keeps going. Every screen size gets
  // this — no separate sideways scroll. Falls back to a swipe track only where
  // pinning can't work: reduced motion, or a viewport too short to hold a card.
  const [pinned, setPinned] = useState(false);

  // Shared readout: fills the 2019→2026 rail and lights the nearest milestone.
  const setProgress = useCallback((p: number) => {
    if (rail.current) rail.current.style.transform = `scaleX(${p})`;
    const items = track.current?.querySelectorAll<HTMLElement>('.tl-item');
    if (!items?.length) return;
    const active = Math.round(p * (items.length - 1));
    items.forEach((item, i) => item.classList.toggle('tl-active', i === active));
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    // A pinned frame is exactly one viewport tall, so the header + a card have
    // to fit inside it. Below that, pinning would clip the copy.
    const decide = () => setPinned(!reduce.matches && window.innerHeight >= 560);

    decide();
    reduce.addEventListener('change', decide);
    window.addEventListener('resize', decide);
    return () => {
      reduce.removeEventListener('change', decide);
      window.removeEventListener('resize', decide);
    };
  }, []);

  useEffect(() => {
    if (!pinned) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const el = track.current;
      const frame = pin.current;
      if (!el || !frame) return;

      const distance = () => Math.max(0, el.scrollWidth - frame.clientWidth);
      if (distance() === 0) return;

      gsap.to(el, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: frame,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          anticipatePin: 1,
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: (self) => setProgress(self.progress),
        },
      });

      // reveal the copy, never the node — the nodes have to stay on the axis
      gsap.from('.tl-item .tl-index, .tl-item .tl-year, .tl-item .tl-content', {
        opacity: 0,
        y: 24,
        duration: 0.6,
        stagger: 0.04,
        ease: 'power3.out',
        scrollTrigger: { trigger: frame, start: 'top 65%', once: true },
      });

      ScrollTrigger.refresh();
    }, pin);

    return () => ctx.revert();
  }, [pinned, setProgress]);

  useEffect(() => {
    if (pinned) return;
    const el = scroller.current;
    if (!el) return;

    const onScroll = () => {
      const max = el.scrollWidth - el.clientWidth;
      setProgress(max > 0 ? el.scrollLeft / max : 0);
    };

    onScroll();
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [pinned, setProgress]);

  const header = (
    <div className="mx-auto w-full max-w-7xl px-6 md:px-12">
      <SectionLabel index="06" label="Timeline" className="mb-5" />
      <h2 className="display-title text-[clamp(2.4rem,5.5vw,4.6rem)]">
        The path <span className="serif-accent text-primary">so far.</span>
      </h2>

      <div className="mt-7 flex max-w-lg items-center gap-4">
        <span className="coord shrink-0 text-foreground/52">2019</span>
        <span className="relative h-px flex-1 bg-white/12">
          <span
            ref={rail}
            className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-primary to-[#d9ba70]"
          />
        </span>
        <span className="coord shrink-0 text-foreground/52">2026</span>
      </div>

      <p className="mt-4 font-mono-label text-[0.62rem] uppercase tracking-[0.2em] text-foreground/52">
        {pinned ? (
          <>
            <span className="sm:hidden">Keep scrolling →</span>
            <span className="hidden sm:inline">Keep scrolling — the years move left to right</span>
          </>
        ) : (
          'Swipe through the years'
        )}
      </p>
    </div>
  );

  const rows = (
    <div ref={track} className="relative flex w-max items-start gap-9 px-6 md:gap-16 md:px-12">
      {/* the axis every node sits on — offset kept in sync with the head block below */}
      <span className="pointer-events-none absolute left-6 right-6 top-[5.25rem] h-px bg-gradient-to-r from-white/6 via-white/16 to-white/6 md:left-12 md:right-12 md:top-[6rem]" />

      {milestones.map((item, i) => (
        <article
          key={item.year}
          className="tl-item group relative w-[76vw] shrink-0 snap-start sm:w-[21rem] lg:w-[23rem]"
        >
          <div className="h-[5.25rem] md:h-[6rem]">
            <span className="tl-index coord block text-foreground/52">
              A.{String(i + 1).padStart(2, '0')} / {String(milestones.length).padStart(2, '0')}
            </span>
            <Magnetic strength={0.35} className="mt-3 inline-block">
              <span className="tl-year font-instrument block text-[3.4rem] leading-[0.85] tracking-[0.01em] md:text-[4.2rem]">
                {item.year}
              </span>
            </Magnetic>
          </div>

          {/* pulled up by half its height so it centres on the axis — margin, not
              transform, because .tl-active scales the node */}
          <span className="tl-node relative z-10 -mt-[0.35rem] block h-[0.7rem] w-[0.7rem] rounded-full border border-primary/50 bg-background" />

          <div className="tl-content pt-7">
            <h3 className="font-syne text-lg font-semibold tracking-[-0.03em] text-foreground md:text-[1.35rem]">
              {item.title}
            </h3>
            <p className="mt-3.5 font-syne text-[0.92rem] leading-7 text-foreground/62">{item.text}</p>
          </div>
        </article>
      ))}
    </div>
  );

  return (
    <section id="experience" className="relative text-foreground">
      {pinned ? (
        <div ref={pin} className="relative flex h-[100svh] flex-col justify-center overflow-hidden">
          {header}
          <div className="tl-edge-fade mt-12">{rows}</div>
        </div>
      ) : (
        <div className="py-24 md:py-32">
          {header}
          <div
            ref={scroller}
            tabIndex={0}
            data-lenis-prevent
            role="region"
            aria-label="Timeline, 2019 to 2026 — scroll sideways"
            className="tl-scroller mt-12 snap-x snap-proximity scroll-pl-6 overflow-x-auto overscroll-x-contain pb-8 md:scroll-pl-12"
          >
            {rows}
          </div>
        </div>
      )}
    </section>
  );
}
