type DataVisualKind = 'nlp' | 'medical' | 'rag' | 'vision';

type DataVisualProps = {
  kind: DataVisualKind;
  label?: string;
  className?: string;
};

const tokens = ['fa', 'sent', 'bert', 'lex', 'eval'];
const bars = [52, 74, 39, 88, 64, 45, 70];
const points = [
  [24, 64],
  [38, 42],
  [52, 58],
  [68, 32],
  [82, 48],
] as const;

function NlpVisual() {
  return (
    <>
      <g opacity="0.34">
        {[0, 1, 2, 3, 4, 5].map((row) => (
          <line key={row} x1="14" y1={18 + row * 14} x2="146" y2={18 + row * 14} stroke="currentColor" strokeWidth="0.4" />
        ))}
      </g>
      {tokens.map((token, index) => (
        <g key={token} transform={`translate(${16 + index * 27} ${25 + (index % 2) * 14})`}>
          <rect width="22" height="9" rx="2" fill={index === 2 ? 'var(--primary)' : 'rgba(255,255,255,0.08)'} />
          <text x="11" y="6.2" textAnchor="middle" fontSize="3.5" fill={index === 2 ? '#061019' : 'rgba(244,247,251,0.72)'}>{token}</text>
        </g>
      ))}
      <path d="M27 54 C48 28, 80 82, 110 40 S138 55, 146 26" fill="none" stroke="var(--gold)" strokeWidth="1.2" />
      {bars.map((bar, index) => (
        <rect key={index} x={19 + index * 17} y={92 - bar * 0.45} width="8" height={bar * 0.45} rx="2" fill={index % 3 === 0 ? 'var(--primary)' : 'rgba(255,255,255,0.16)'} />
      ))}
    </>
  );
}

function MedicalVisual() {
  return (
    <>
      <rect x="18" y="18" width="124" height="76" rx="4" fill="rgba(255,255,255,0.045)" stroke="rgba(255,255,255,0.14)" />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M26 ${34 + i * 12} C48 ${22 + i * 7}, 75 ${56 - i * 4}, 132 ${31 + i * 11}`} fill="none" stroke="rgba(143,227,217,0.16)" strokeWidth="1" />
      ))}
      <path d="M59 68 C47 51, 61 35, 82 42 C101 48, 106 72, 86 82 C75 88, 66 80, 59 68Z" fill="rgba(143,227,217,0.13)" stroke="var(--primary)" strokeWidth="1.4" />
      <path d="M78 66 C72 58, 78 51, 88 55 C97 58, 97 70, 88 73 C83 75, 80 71, 78 66Z" fill="rgba(217,186,112,0.42)" stroke="var(--gold)" strokeWidth="1.1" />
      <line x1="16" y1="56" x2="144" y2="56" stroke="rgba(255,255,255,0.08)" />
      <line x1="80" y1="16" x2="80" y2="96" stroke="rgba(255,255,255,0.08)" />
    </>
  );
}

function RagVisual() {
  return (
    <>
      {[0, 1, 2].map((index) => (
        <g key={index} transform={`translate(${16 + index * 9} ${22 + index * 8})`}>
          <rect width="34" height="44" rx="4" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.14)" />
          <line x1="8" y1="13" x2="25" y2="13" stroke="rgba(255,255,255,0.32)" />
          <line x1="8" y1="22" x2="22" y2="22" stroke="rgba(255,255,255,0.22)" />
        </g>
      ))}
      <path d="M70 54 H95" stroke="var(--gold)" strokeWidth="1.2" strokeDasharray="3 4" />
      <circle cx="110" cy="54" r="20" fill="rgba(143,227,217,0.08)" stroke="var(--primary)" strokeWidth="1.2" />
      <path d="M101 56 L108 62 L121 45" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M110 30 V16 M110 92 V78 M86 54 H73 M147 54 H131" stroke="rgba(255,255,255,0.16)" strokeWidth="0.8" />
    </>
  );
}

function VisionVisual() {
  return (
    <>
      <path d="M18 58 C42 24, 118 24, 142 58 C118 92, 42 92, 18 58Z" fill="rgba(255,255,255,0.045)" stroke="rgba(255,255,255,0.16)" />
      <circle cx="80" cy="58" r="18" fill="rgba(143,227,217,0.08)" stroke="var(--primary)" strokeWidth="1.2" />
      <circle cx="80" cy="58" r="7" fill="var(--gold)" opacity="0.82" />
      <polyline points={points.map(([x, y]) => `${x},${y}`).join(' ')} fill="none" stroke="var(--primary)" strokeWidth="1.2" />
      {points.map(([x, y], index) => (
        <circle key={index} cx={x} cy={y} r={index === 3 ? 3.5 : 2.7} fill={index === 3 ? 'var(--gold)' : 'var(--primary)'} />
      ))}
      <path d="M22 22 H48 M112 22 H138 M22 94 H48 M112 94 H138" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" strokeLinecap="round" />
    </>
  );
}

export default function DataVisual({ kind, label, className = '' }: DataVisualProps) {
  return (
    <div className={`data-visual group relative w-full min-w-0 max-w-full overflow-hidden border border-white/10 bg-[#080a0d] transition-colors duration-500 hover:border-primary/30 ${className}`}>
      <div className="absolute inset-0 data-mesh opacity-45 transition-opacity duration-500 group-hover:opacity-60" />
      <svg viewBox="0 0 160 112" className="relative z-10 h-full w-full text-primary/80 transition-colors duration-500 group-hover:text-primary" role="img" aria-label={label ?? `${kind} research visual`}>
        {kind === 'nlp' && <NlpVisual />}
        {kind === 'medical' && <MedicalVisual />}
        {kind === 'rag' && <RagVisual />}
        {kind === 'vision' && <VisionVisual />}
      </svg>
      <div className="pointer-events-none absolute inset-x-3 bottom-3 flex items-center justify-between font-mono-label text-[0.58rem] uppercase tracking-[0.2em] text-foreground/36">
        <span>{label ?? kind}</span>
        <span>{kind.toUpperCase()}</span>
      </div>
    </div>
  );
}
