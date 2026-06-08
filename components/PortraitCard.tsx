'use client';

import { motion } from 'framer-motion';
import MediaFrame from './ui/MediaFrame';

/**
 * PortraitCard — an "AI research identity card" for the hero. A glass panel
 * with the portrait, grain, scientific metadata (status, coordinates, ID),
 * wrapped by a slow orbital ring and floating data points. Holds a designed
 * placeholder until /images/portrait.jpg is added (see public/images/README).
 */
export default function PortraitCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="relative mx-auto w-full max-w-[19rem]"
    >
      {/* orbital ring */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-7 rounded-[2.6rem] border border-white/[0.07]"
        animate={{ rotate: 360 }}
        transition={{ duration: 46, repeat: Infinity, ease: 'linear' }}
        style={{ borderRadius: '46% 54% 50% 50% / 50%' }}
      >
        <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_12px_rgba(124,199,255,0.9)]" />
      </motion.div>

      {/* floating data points */}
      <span className="absolute -right-3 top-10 h-1.5 w-1.5 rounded-full bg-[#a78bfa]/80 [animation:float-soft_5s_ease-in-out_infinite]" />
      <span className="absolute -left-4 bottom-16 h-1 w-1 rounded-full bg-primary/70 [animation:float-soft_6.5s_ease-in-out_infinite]" />

      {/* the card */}
      <div className="glow-card grain relative overflow-hidden rounded-[1.6rem] p-2.5">
        <div className="coord mb-2.5 flex items-center justify-between px-1.5 pt-1">
          <span className="flex items-center gap-1.5 text-primary/85">
            <span className="h-1.5 w-1.5 rounded-full bg-primary [animation:pulse-ring_2.6s_ease-out_infinite]" />
            Active
          </span>
          <span className="text-foreground/35">ID · SJ—AI</span>
        </div>

        <MediaFrame
          variant="portrait"
          ratio="4 / 5"
          label="Portrait"
          hint="Studio headshot — /images/portrait.jpg"
          tag="4:5"
          className="rounded-[1.1rem]"
        />

        <div className="flex items-end justify-between px-1.5 pb-1 pt-3">
          <div>
            <p className="font-syne text-[1.05rem] font-semibold leading-none tracking-[-0.02em] text-foreground">Soroush Jaberi</p>
            <p className="coord mt-2 text-foreground/45">AI Researcher · DS</p>
          </div>
          <p className="coord text-right text-foreground/30">35.84°N<br />50.99°E</p>
        </div>
      </div>
    </motion.div>
  );
}
