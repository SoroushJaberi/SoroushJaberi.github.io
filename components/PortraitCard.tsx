'use client';

import { motion } from 'framer-motion';
import MediaFrame from './ui/MediaFrame';

export default function PortraitCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
      className="relative mx-auto w-full max-w-[24rem]"
    >
      <div className="absolute -left-5 top-10 hidden h-[72%] w-px bg-gradient-to-b from-transparent via-primary/50 to-transparent lg:block" aria-hidden="true" />
      <div className="absolute -right-3 -top-3 h-24 w-24 border-r border-t border-primary/30" aria-hidden="true" />
      <div className="absolute -bottom-3 -left-3 h-24 w-24 border-b border-l border-gold/30" aria-hidden="true" />

      <div className="editorial-photo rounded-[1.35rem] p-2.5">
        <MediaFrame
          src="/images/optimized/about-cafe.jpg"
          alt="Soroush Jaberi seated at a cafe table"
          variant="portrait"
          ratio="4 / 5"
          objectPosition="50% 52%"
          priority
          className="rounded-[0.9rem] border-white/12"
        />
        <div className="grid grid-cols-[1fr_auto] items-end gap-4 px-2 pt-4">
          <div>
            <p className="font-syne text-lg font-semibold leading-none tracking-[-0.03em] text-foreground">Soroush Jaberi</p>
            <p className="coord portrait-role mt-2 text-foreground/52">AI researcher / data scientist</p>
          </div>
          <div className="text-right font-mono-label text-[0.65rem] uppercase leading-5 tracking-[0.18em] text-foreground/52">
            Karaj
            <br />
            Iran
          </div>
        </div>
      </div>
    </motion.div>
  );
}
