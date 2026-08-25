'use client';

import { useEffect, useRef } from 'react';

/**
 * CosmicField
 * -----------
 * The site-wide ambient layer: a slow-drifting starfield plus a faint
 * "molecular constellation" of nodes that link when near each other.
 * Fixed behind all content. Subtle mouse parallax. Cheap on purpose —
 * the heavier hero helix is a separate canvas that pauses off-screen.
 *
 * Guards: respects prefers-reduced-motion, pauses on tab blur, caps DPR,
 * and scales particle counts to viewport area.
 */

type Star = { x: number; y: number; z: number; r: number; tw: number; sp: number };
type Node = { x: number; y: number; vx: number; vy: number; r: number };

export default function CosmicField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0;
    let h = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let stars: Star[] = [];
    let nodes: Node[] = [];
    let raf = 0;
    let t = 0;
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

    const init = () => {
      const area = w * h;
      // intentionally sparse + dim — the field is atmosphere, not decoration
      const starCount = Math.min(130, Math.round(area / 17000));
      stars = Array.from({ length: starCount }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random() * 0.8 + 0.2,
        r: Math.random() * 1.1 + 0.2,
        tw: Math.random() * Math.PI * 2,
        sp: Math.random() * 0.018 + 0.004,
      }));
      const nodeCount = Math.min(16, Math.round(area / 90000));
      nodes = Array.from({ length: nodeCount }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.04,
        vy: (Math.random() - 0.5) * 0.04,
        r: Math.random() * 1.3 + 0.5,
      }));
    };

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      init();
    };

    const draw = () => {
      t += 1;
      ctx.clearRect(0, 0, w, h);
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;

      // molecular links
      const link = 170;
      for (let i = 0; i < nodes.length; i++) {
        if (!reduce) {
          const n = nodes[i];
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0 || n.x > w) n.vx *= -1;
          if (n.y < 0 || n.y > h) n.vy *= -1;
        }
      }
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < link) {
            ctx.beginPath();
            ctx.moveTo(a.x + mouse.x * 10, a.y + mouse.y * 10);
            ctx.lineTo(b.x + mouse.x * 10, b.y + mouse.y * 10);
            ctx.strokeStyle = `rgba(143,227,217,${0.035 * (1 - d / link)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x + mouse.x * 10, n.y + mouse.y * 10, n.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(143,227,217,0.12)';
        ctx.fill();
      }

      // stars
      for (const s of stars) {
        const px = s.x + mouse.x * s.z * 22;
        const py = s.y + mouse.y * s.z * 22;
        const tw = reduce ? 0.7 : 0.55 + 0.45 * Math.sin(s.tw + t * s.sp);
        ctx.beginPath();
        ctx.arc(px, py, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(224,226,210,${0.22 * tw * s.z + 0.04})`;
        ctx.fill();
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

    const onResize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      resize();
    };
    const onMove = (e: MouseEvent) => {
      mouse.tx = e.clientX / window.innerWidth - 0.5;
      mouse.ty = e.clientY / window.innerHeight - 0.5;
    };
    const onVis = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else if (!reduce) start();
    };

    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('visibilitychange', onVis);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <canvas ref={canvasRef} aria-hidden="true" />
      {/* film grain for premium texture */}
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-soft-light"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      {/* edge vignette to focus the eye */}
      <div className="absolute inset-0 bg-[radial-gradient(80%_66%_at_50%_42%,transparent_60%,rgba(2,3,7,0.42))]" />
    </div>
  );
}
