'use client';

import { useEffect, useRef } from 'react';

/**
 * DnaHelix
 * --------
 * The hero signature: a rotating DNA double-helix built from glowing nodes
 * and connecting rungs, drawn on Canvas 2D with a fake-3D depth cue
 * (sin of the rotation angle scales size + opacity, back-to-front sorted).
 *
 * - Two strands phase-shifted by π, cyan + violet, with a gold "research"
 *   accent node recurring along the chain.
 * - Pauses when scrolled out of view (IntersectionObserver) and on tab blur.
 * - Honours prefers-reduced-motion (renders a single static frame).
 */
export default function DnaHelix({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0;
    let h = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    let time = reduce ? 0.8 : 0;
    let visible = true;

    const N = 42;
    const turns = 2.6;

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    type P = { x: number; y: number; z: number; strand: number; i: number };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const desktop = w >= 1024;
      const cx = desktop ? w * 0.68 : w * 0.5;
      const R = Math.min(desktop ? w * 0.135 : w * 0.27, 175);
      const topPad = h * 0.14;
      const span = h - topPad * 2;
      if (!reduce) time += 0.0062;

      const pts: P[] = [];
      for (let i = 0; i <= N; i++) {
        const t = i / N;
        const y = topPad + t * span;
        const ang = t * turns * Math.PI * 2 + time;
        for (let s = 0; s < 2; s++) {
          const a = ang + s * Math.PI;
          pts.push({ x: cx + Math.cos(a) * R, y, z: Math.sin(a), strand: s, i });
        }
      }

      // strand backbones — the "lines" of the helix
      for (let s = 0; s < 2; s++) {
        ctx.beginPath();
        for (let i = 0; i <= N; i++) {
          const p = pts[i * 2 + s];
          if (i === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.strokeStyle = s === 0 ? 'rgba(124,199,255,0.30)' : 'rgba(167,139,250,0.30)';
        ctx.lineWidth = 1.4;
        ctx.stroke();
      }

      // rungs (every other step) behind nodes
      for (let i = 0; i <= N; i += 2) {
        const p0 = pts[i * 2];
        const p1 = pts[i * 2 + 1];
        const zavg = (p0.z + p1.z) / 2;
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.strokeStyle = `rgba(160,196,255,${0.06 + 0.16 * (zavg * 0.5 + 0.5)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // nodes back-to-front — crisp points (minimal bloom)
      const sorted = pts.slice().sort((a, b) => a.z - b.z);
      for (const p of sorted) {
        const depth = p.z * 0.5 + 0.5; // 0 far .. 1 near
        const r = 1.4 + depth * 3;
        const gold = p.i % 7 === 0;
        const base = gold
          ? '214,181,109'
          : p.strand === 0
          ? '124,199,255'
          : '167,139,250';
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${base},${0.3 + depth * 0.6})`;
        ctx.shadowColor = `rgba(${base},0.8)`;
        ctx.shadowBlur = gold ? 14 : 2 + depth * 7;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      raf = requestAnimationFrame(draw);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(draw);
    };

    resize();
    if (reduce) {
      draw();
      cancelAnimationFrame(raf);
    } else {
      start();
    }

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0].isIntersecting;
        if (visible && !reduce) start();
        else cancelAnimationFrame(raf);
      },
      { threshold: 0.01 }
    );
    io.observe(canvas);

    const onResize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      resize();
    };
    const onVis = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else if (visible && !reduce) start();
    };

    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVis);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
