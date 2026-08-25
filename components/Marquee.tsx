'use client';

/**
 * Marquee — a continuous left-to-right motion band of tools and research
 * themes. CSS-animation driven (cheap), pauses on hover, and freezes under
 * prefers-reduced-motion (handled globally). The visible track is duplicated
 * for a seamless loop and aria-hidden; an sr-only list carries the content.
 */

const items: { t: string; style?: 'accent' | 'outline' }[] = [
  { t: 'Python' },
  { t: 'PyTorch', style: 'accent' },
  { t: 'Transformers' },
  { t: 'ParsBERT', style: 'outline' },
  { t: 'Medical imaging' },
  { t: 'Segmentation', style: 'accent' },
  { t: 'OpenCV' },
  { t: 'MediaPipe', style: 'outline' },
  { t: 'LangChain' },
  { t: 'ChromaDB', style: 'accent' },
  { t: 'Retrieval-augmented generation' },
  { t: 'scikit-learn', style: 'outline' },
  { t: 'NumPy' },
  { t: 'pandas', style: 'accent' },
  { t: 'Computer vision' },
  { t: 'NLP', style: 'outline' },
];

export default function Marquee() {
  return (
    <section aria-label="Tools and research themes" className="relative py-14 md:py-20">
      <div className="mx-auto mb-8 max-w-7xl px-6 md:px-12">
        <div className="coord flex items-center gap-3 text-foreground/45">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Stack in motion
        </div>
      </div>

      <div className="marquee marquee-mask relative overflow-hidden border-y border-white/10 py-7 md:py-9">
        <div className="marquee-track items-center" aria-hidden="true">
          {[...items, ...items].map((it, i) => (
            <span key={i} className="flex items-center">
              <span
                className={`px-8 font-syne text-[clamp(1.9rem,5vw,3.6rem)] font-semibold tracking-[-0.035em] ${
                  it.style === 'outline'
                    ? 'text-outline'
                    : it.style === 'accent'
                    ? 'text-primary'
                    : 'text-foreground/82'
                }`}
              >
                {it.t}
              </span>
              <span className="text-lg text-[#d9ba70]/70">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* accessible, non-duplicated content */}
      <ul className="sr-only">
        {items.map((it) => (
          <li key={it.t}>{it.t}</li>
        ))}
      </ul>
    </section>
  );
}
