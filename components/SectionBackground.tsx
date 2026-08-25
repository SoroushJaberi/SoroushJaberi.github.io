'use client';

export default function SectionBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="lab-grid absolute inset-0 opacity-25 [mask-image:radial-gradient(120%_70%_at_50%_30%,#000_55%,transparent)]" />
      <svg className="absolute inset-x-0 top-0 h-[52rem] w-full opacity-30" viewBox="0 0 1440 620" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="section-line" x1="0" x2="1">
            <stop offset="0" stopColor="rgba(143,227,217,0)" />
            <stop offset="0.48" stopColor="rgba(143,227,217,0.34)" />
            <stop offset="1" stopColor="rgba(217,186,112,0)" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <path
            key={i}
            d={`M-60 ${110 + i * 58} C190 ${36 + i * 42}, 424 ${210 + i * 18}, 704 ${128 + i * 48} S1134 ${92 + i * 54}, 1500 ${172 + i * 34}`}
            fill="none"
            stroke="url(#section-line)"
            strokeWidth="1"
          />
        ))}
      </svg>
      <div className="absolute inset-x-0 top-0 h-[52rem] bg-[linear-gradient(180deg,rgba(6,7,5,0),var(--background)_92%)]" />
    </div>
  );
}
