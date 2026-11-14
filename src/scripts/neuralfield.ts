/**
 * The network beside the opening of the home page.
 *
 * A small layered network with real depth: the nodes sit in space, the whole
 * form turns slowly, and signals travel forward from layer to layer the way
 * activations do. A node lights when a signal reaches it and passes the
 * signal on; a connection keeps a little warmth after one has gone through.
 *
 * Drawn on a 2D canvas (every browser has one, and its lines are smooth),
 * centred on the portrait and faded out toward the text. It stops when the
 * opening is off screen or the tab is hidden, and with "reduce motion" on it
 * draws one still frame. It is decoration: the page loses nothing without it.
 */

const TAU = Math.PI * 2;
/** Distance of the eye from the centre of the form, in model units. */
const CAMERA = 3.4;
/** How fast a signal moves, in model units per second. */
const SPEED = 0.8;
/** At most this many signals at once. */
const MAX_PULSES = 42;

type RGB = [number, number, number];

interface Node {
  x: number;
  y: number;
  z: number;
  layer: number;
  out: number[];
  degree: number;
  glow: number;
  // Where it lands on screen this frame.
  sx: number;
  sy: number;
  scale: number;
  depth: number;
}

interface Edge {
  a: number;
  b: number;
  // Control point: connections bow a little, as nothing organic is straight.
  cx: number;
  cy: number;
  cz: number;
  length: number;
  heat: number;
}

interface Pulse {
  edge: number;
  t: number;
  rate: number;
}

interface Ripple {
  node: number;
  age: number;
}

/** A small seeded generator, so the form is the same on every visit. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function parseColor(value: string, fallback: RGB): RGB {
  const v = value.trim();
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(v);
  if (hex) {
    const h = hex[1]!;
    const full = h.length === 3 ? [...h].map((c) => c + c).join('') : h;
    const n = parseInt(full, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  const parts = /^rgba?\(([^)]+)\)$/i.exec(v)?.[1]?.split(/[\s,/]+/).map(Number);
  if (parts && parts.length >= 3 && parts.slice(0, 3).every((n) => Number.isFinite(n))) {
    return [parts[0]!, parts[1]!, parts[2]!];
  }
  return fallback;
}

const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const smooth = (v: number) => {
  const t = clamp(v);
  return t * t * (3 - 2 * t);
};

/** Nodes in layers along one axis, each layer a loose disc, wider in the middle. */
function build(counts: number[], rand: () => number) {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const start: number[] = [];
  const layers = counts.length;
  const half = 1.32;

  counts.forEach((count, layer) => {
    start.push(nodes.length);
    const u = layers === 1 ? 0.5 : layer / (layers - 1);
    const radius = 0.3 + 0.58 * Math.sin(Math.PI * (0.12 + 0.76 * u));
    const spin = rand() * TAU;
    for (let i = 0; i < count; i++) {
      const r = radius * Math.sqrt((i + 0.5) / count);
      const angle = spin + i * 2.399963;
      nodes.push({
        x: -half + u * 2 * half + (rand() - 0.5) * 0.22,
        y: Math.cos(angle) * r + (rand() - 0.5) * 0.1,
        z: Math.sin(angle) * r + (rand() - 0.5) * 0.1,
        layer,
        out: [],
        degree: 0,
        glow: 0,
        sx: 0,
        sy: 0,
        scale: 1,
        depth: 0,
      });
    }
  });

  const seen = new Set<number>();
  const link = (a: number, b: number) => {
    const key = a * 4096 + b;
    if (seen.has(key)) return;
    seen.add(key);
    const A = nodes[a]!;
    const B = nodes[b]!;
    const length = Math.hypot(B.x - A.x, B.y - A.y, B.z - A.z);
    const bow = 0.3 * length;
    A.out.push(edges.length);
    A.degree++;
    B.degree++;
    edges.push({
      a,
      b,
      cx: (A.x + B.x) / 2 + (rand() - 0.5) * bow,
      cy: (A.y + B.y) / 2 + (rand() - 0.5) * bow,
      cz: (A.z + B.z) / 2 + (rand() - 0.5) * bow,
      length,
      heat: 0,
    });
  };
  const nearest = (from: number, layer: number) => {
    const A = nodes[from]!;
    const list: { index: number; d: number }[] = [];
    for (let i = start[layer]!; i < start[layer]! + counts[layer]!; i++) {
      const B = nodes[i]!;
      list.push({ index: i, d: Math.hypot(B.x - A.x, B.y - A.y, B.z - A.z) });
    }
    return list.sort((p, q) => p.d - q.d);
  };

  const fedBy = new Set<number>();
  for (let layer = 0; layer < layers - 1; layer++) {
    for (let a = start[layer]!; a < start[layer]! + counts[layer]!; a++) {
      const near = nearest(a, layer + 1);
      const fan = rand() < 0.36 ? 3 : 2;
      for (let j = 0; j < Math.min(fan, near.length); j++) {
        link(a, near[j]!.index);
        fedBy.add(near[j]!.index);
      }
      // Now and then a connection skips a layer, as in a residual network.
      if (layer < layers - 2 && rand() < 0.16) {
        const far = nearest(a, layer + 2);
        link(a, far[Math.floor(rand() * Math.min(3, far.length))]!.index);
      }
    }
    // No node is left without an input.
    for (let b = start[layer + 1]!; b < start[layer + 1]! + counts[layer + 1]!; b++) {
      if (fedBy.has(b)) continue;
      link(nearest(b, layer)[0]!.index, b);
      fedBy.add(b);
    }
  }

  return { nodes, edges, inputs: counts[0]!, layers };
}

function init(hero: HTMLElement) {
  const canvas = hero.querySelector<HTMLCanvasElement>('[data-neural-canvas]');
  const anchor = hero.querySelector<HTMLElement>('[data-neural-anchor]');
  const text = hero.querySelector<HTMLElement>('[data-neural-text]');
  const ctx = canvas?.getContext('2d');
  if (!canvas || !anchor || !ctx) return;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const coarse = matchMedia('(pointer: coarse)').matches;
  const small = Math.min(window.innerWidth, window.innerHeight) < 600;
  const rand = mulberry32(20261114);
  const net = build(small ? [4, 7, 10, 11, 9, 6, 3] : [5, 9, 13, 16, 15, 12, 8, 4], rand);
  const order = net.nodes.map((_, i) => i);
  const pulses: Pulse[] = [];
  const ripples: Ripple[] = [];

  // Geometry of the canvas, in CSS pixels.
  let width = 0;
  let height = 0;
  let dpr = 1;
  let centreX = 0;
  let centreY = 0;
  let size = 300; // pixels per model unit
  let weight = 1; // line and dot weight, lighter on small screens
  let fadeAcross: CanvasGradient | null = null;
  let fadeDown: CanvasGradient | null = null;

  // Colours, read from the page so the figure follows the theme.
  let line: RGB = [13, 110, 100];
  let spark: RGB = [201, 141, 34];
  let sprite: HTMLCanvasElement | null = null;
  const rgba = (c: RGB, a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a.toFixed(3)})`;

  const paint = () => {
    const css = getComputedStyle(canvas);
    line = parseColor(css.getPropertyValue('--accent-fill'), line);
    spark = parseColor(css.getPropertyValue('--warm-fill'), spark);
    // A soft round glow, drawn once and stamped wherever something is lit.
    sprite = document.createElement('canvas');
    sprite.width = sprite.height = 64;
    const g = sprite.getContext('2d');
    if (g) {
      const glow = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      glow.addColorStop(0, rgba(spark, 0.85));
      glow.addColorStop(0.35, rgba(spark, 0.28));
      glow.addColorStop(1, rgba(spark, 0));
      g.fillStyle = glow;
      g.fillRect(0, 0, 64, 64);
    }
  };

  const layout = () => {
    const box = canvas.getBoundingClientRect();
    if (box.width < 2 || box.height < 2) return;
    width = box.width;
    height = box.height;
    // Sharp on dense screens, but never more pixels than a phone can fill smoothly.
    dpr = Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(2.4e6 / (width * height)));
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);

    const photo = anchor.getBoundingClientRect();
    centreX = photo.left - box.left + photo.width / 2;
    centreY = photo.top - box.top + photo.height * 0.46;
    size = Math.min(Math.max(photo.width * 1.04, Math.min(width, height) * 0.42), 520);
    weight = clamp(size / 400, 0.62, 1.1);

    // Fade toward the words. Side by side with the text: a ramp that ends at
    // the photo's edge. Text all around the photo: a pool of light around it.
    const words = text?.getBoundingClientRect();
    const beside = !!words && words.width > 1 && words.right <= photo.left + 2;
    if (beside) {
      const from = words.left - box.left + words.width * 0.7;
      const to = Math.max(from + 40, photo.left - box.left);
      fadeAcross = ctx.createLinearGradient(from, 0, to, 0);
      fadeAcross.addColorStop(0, 'rgba(0,0,0,0)');
      fadeAcross.addColorStop(1, 'rgba(0,0,0,1)');
    } else {
      fadeAcross = ctx.createRadialGradient(centreX, centreY, photo.width * 0.5, centreX, centreY, size * 1.5);
      fadeAcross.addColorStop(0, 'rgba(0,0,0,0.8)');
      fadeAcross.addColorStop(1, 'rgba(0,0,0,0)');
    }
    // And toward the top (behind the header) and the bottom edge.
    const top = clamp((box.height - hero.clientHeight) / height, 0, 0.3);
    fadeDown = ctx.createLinearGradient(0, 0, 0, height);
    fadeDown.addColorStop(0, 'rgba(0,0,0,0.3)');
    fadeDown.addColorStop(Math.max(top, 0.02), 'rgba(0,0,0,1)');
    fadeDown.addColorStop(0.84, 'rgba(0,0,0,1)');
    fadeDown.addColorStop(1, 'rgba(0,0,0,0)');
  };

  // ---- the life of the network ----
  let clock = 0;
  let sinceSpawn = 0;

  const send = (edge: number) => {
    pulses.push({ edge, t: 0, rate: SPEED / Math.max(net.edges[edge]!.length, 0.3) });
  };
  const fire = (index: number) => {
    const node = net.nodes[index]!;
    node.glow = 1;
    if (node.out.length === 0) {
      ripples.push({ node: index, age: 0 });
      return;
    }
    send(node.out[Math.floor(rand() * node.out.length)]!);
    if (node.out.length > 1 && pulses.length < MAX_PULSES && rand() < 0.3) {
      send(node.out[Math.floor(rand() * node.out.length)]!);
    }
  };

  const step = (dt: number) => {
    clock += dt;
    // Signals enter at the first layer once the form has assembled.
    if (clock > 1.5) {
      sinceSpawn += dt;
      while (sinceSpawn > 0.46) {
        sinceSpawn -= 0.46;
        if (pulses.length < MAX_PULSES) fire(Math.floor(rand() * net.inputs));
      }
    }
    const cool = Math.exp(-dt / 0.95);
    const dim = Math.exp(-dt / 0.6);
    for (const edge of net.edges) edge.heat *= cool;
    for (const node of net.nodes) node.glow *= dim;

    for (let i = pulses.length - 1; i >= 0; i--) {
      const pulse = pulses[i]!;
      const edge = net.edges[pulse.edge]!;
      pulse.t += pulse.rate * dt;
      edge.heat = Math.max(edge.heat, 0.9);
      if (pulse.t >= 1) {
        pulses.splice(i, 1);
        fire(edge.b);
      }
    }
    for (let i = ripples.length - 1; i >= 0; i--) {
      ripples[i]!.age += dt;
      if (ripples[i]!.age > 1) ripples.splice(i, 1);
    }
  };

  // ---- drawing ----
  let pointerX = 0;
  let pointerY = 0;
  let leanX = 0;
  let leanY = 0;
  // Rotation for this frame.
  let cr = 1;
  let sr = 0;
  let cy = 1;
  let sy = 0;
  let cp = 1;
  let sp = 0;
  const out = { x: 0, y: 0, scale: 1, depth: 0 };

  const project = (x: number, y: number, z: number) => {
    const x1 = x * cr - y * sr;
    const y1 = x * sr + y * cr;
    const x2 = x1 * cy + z * sy;
    const z2 = -x1 * sy + z * cy;
    const y3 = y1 * cp - z2 * sp;
    const z3 = y1 * sp + z2 * cp;
    const scale = CAMERA / (CAMERA - z3);
    out.x = centreX + x2 * scale * size;
    out.y = centreY - y3 * scale * size;
    out.scale = scale;
    out.depth = clamp((z3 + 1.25) / 2.5);
  };

  const draw = () => {
    if (!width) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.lineCap = 'round';

    leanX += (pointerX - leanX) * 0.05;
    leanY += (pointerY - leanY) * 0.05;
    const roll = -0.2;
    const yaw = -0.5 + 0.2 * Math.sin(clock * 0.13) + leanX * 0.14;
    const pitch = 0.16 + 0.06 * Math.sin(clock * 0.09 + 1.3) + leanY * 0.09;
    cr = Math.cos(roll);
    sr = Math.sin(roll);
    cy = Math.cos(yaw);
    sy = Math.sin(yaw);
    cp = Math.cos(pitch);
    sp = Math.sin(pitch);

    // The form assembles layer by layer, from its input side.
    const born = (layer: number) => smooth((clock - 0.2 - layer * 0.15) / 0.7);

    for (const node of net.nodes) {
      project(node.x, node.y, node.z);
      node.sx = out.x;
      node.sy = out.y;
      node.scale = out.scale;
      node.depth = out.depth;
    }

    // Connections.
    for (const edge of net.edges) {
      const A = net.nodes[edge.a]!;
      const B = net.nodes[edge.b]!;
      const shown = born(B.layer);
      if (shown <= 0.01) continue;
      project(edge.cx, edge.cy, edge.cz);
      const depth = (A.depth + B.depth) / 2;
      ctx.beginPath();
      ctx.moveTo(A.sx, A.sy);
      ctx.quadraticCurveTo(out.x, out.y, B.sx, B.sy);
      ctx.lineWidth = 0.9 * weight;
      ctx.strokeStyle = rgba(line, (0.1 + 0.24 * depth) * shown);
      ctx.stroke();
      if (edge.heat > 0.03) {
        ctx.lineWidth = 1.3 * weight;
        ctx.strokeStyle = rgba(spark, edge.heat * (0.25 + 0.4 * depth));
        ctx.stroke();
      }
    }

    // Signals: a bright head with a short tail along its connection.
    for (const pulse of pulses) {
      const edge = net.edges[pulse.edge]!;
      const A = net.nodes[edge.a]!;
      const B = net.nodes[edge.b]!;
      const at = (t: number) => {
        const m = 1 - t;
        project(
          m * m * A.x + 2 * m * t * edge.cx + t * t * B.x,
          m * m * A.y + 2 * m * t * edge.cy + t * t * B.y,
          m * m * A.z + 2 * m * t * edge.cz + t * t * B.z,
        );
      };
      at(Math.max(0, pulse.t - 0.3));
      const tailX = out.x;
      const tailY = out.y;
      at(Math.max(0, pulse.t - 0.15));
      const midX = out.x;
      const midY = out.y;
      at(Math.min(1, pulse.t));
      const headX = out.x;
      const headY = out.y;
      const k = out.scale * weight;
      const bright = 0.45 + 0.55 * out.depth;

      const tail = ctx.createLinearGradient(tailX, tailY, headX, headY);
      tail.addColorStop(0, rgba(spark, 0));
      tail.addColorStop(1, rgba(spark, 0.9 * bright));
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.quadraticCurveTo(midX, midY, headX, headY);
      ctx.lineWidth = 1.7 * k;
      ctx.strokeStyle = tail;
      ctx.stroke();

      if (sprite) {
        const r = 9 * k;
        ctx.globalAlpha = bright;
        ctx.drawImage(sprite, headX - r, headY - r, r * 2, r * 2);
        ctx.globalAlpha = 1;
      }
      ctx.beginPath();
      ctx.arc(headX, headY, 1.9 * k, 0, TAU);
      ctx.fillStyle = rgba(spark, bright);
      ctx.fill();
    }

    // Nodes, far ones first.
    order.sort((p, q) => net.nodes[p]!.depth - net.nodes[q]!.depth);
    for (const index of order) {
      const node = net.nodes[index]!;
      const shown = born(node.layer);
      if (shown <= 0.01) continue;
      const k = node.scale * weight;
      const r = (1.3 + Math.min(node.degree, 8) * 0.3) * k * (0.6 + 0.4 * shown);
      if (node.glow > 0.04 && sprite) {
        const g = r * 5.5;
        ctx.globalAlpha = node.glow * 0.8;
        ctx.drawImage(sprite, node.sx - g, node.sy - g, g * 2, g * 2);
        ctx.globalAlpha = 1;
      }
      ctx.beginPath();
      ctx.arc(node.sx, node.sy, r, 0, TAU);
      ctx.fillStyle = rgba(line, (0.32 + 0.6 * node.depth) * shown);
      ctx.fill();
      if (node.glow > 0.04) {
        ctx.fillStyle = rgba(spark, node.glow);
        ctx.fill();
      }
      // The best-connected nodes carry a fine ring.
      if (node.degree >= 6) {
        ctx.beginPath();
        ctx.arc(node.sx, node.sy, r + 3.2 * k, 0, TAU);
        ctx.lineWidth = 0.8 * weight;
        ctx.strokeStyle = rgba(line, (0.1 + 0.26 * node.depth) * shown);
        ctx.stroke();
      }
    }

    // An output node answers with a ring that opens and fades.
    for (const ripple of ripples) {
      const node = net.nodes[ripple.node]!;
      const e = 1 - (1 - ripple.age) * (1 - ripple.age);
      ctx.beginPath();
      ctx.arc(node.sx, node.sy, (3 + 24 * e) * node.scale * weight, 0, TAU);
      ctx.lineWidth = 1.1 * weight;
      ctx.strokeStyle = rgba(spark, (1 - ripple.age) * 0.55);
      ctx.stroke();
    }

    // Keep only what the fades allow.
    ctx.globalCompositeOperation = 'destination-in';
    if (fadeAcross) {
      ctx.fillStyle = fadeAcross;
      ctx.fillRect(0, 0, width, height);
    }
    if (fadeDown) {
      ctx.fillStyle = fadeDown;
      ctx.fillRect(0, 0, width, height);
    }
    ctx.globalCompositeOperation = 'source-over';
  };

  // ---- running ----
  let raf = 0;
  let last = 0;
  let skip = false;
  let onScreen = true;

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    // Half the frame rate on touch devices: the motion is slow, the battery is not.
    if (coarse && (skip = !skip)) return;
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    step(dt);
    draw();
  };
  const still = () => {
    // One settled frame, with signals caught mid-flight.
    if (clock < 20) {
      clock = 20;
      for (let i = 0; i < 260; i++) step(1 / 30);
    }
    draw();
  };
  const stop = () => {
    cancelAnimationFrame(raf);
    raf = 0;
  };
  const start = () => {
    if (reduce.matches) {
      stop();
      still();
      return;
    }
    if (raf || !onScreen || document.hidden) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  };

  paint();
  layout();
  canvas.classList.add('is-live');

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(
      ([entry]) => {
        onScreen = !!entry?.isIntersecting;
        if (onScreen) start();
        else stop();
      },
      { threshold: 0.02 },
    ).observe(hero);
  }
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

  const relayout = () => {
    layout();
    if (reduce.matches || !raf) draw();
  };
  if ('ResizeObserver' in window) new ResizeObserver(relayout).observe(canvas);
  else (window as Window).addEventListener('resize', relayout);
  // The entrance animation moves the portrait a little; measure again after it.
  window.setTimeout(relayout, 1400);
  window.addEventListener('load', relayout);

  window.addEventListener('themechange', () => {
    paint();
    if (reduce.matches || !raf) draw();
  });
  const onReduce = () => start();
  if ('addEventListener' in reduce) reduce.addEventListener('change', onReduce);
  else (reduce as MediaQueryList).addListener(onReduce);

  // The form leans a little toward the mouse.
  window.addEventListener(
    'pointermove',
    (event) => {
      if (event.pointerType !== 'mouse') return;
      pointerX = (event.clientX / window.innerWidth) * 2 - 1;
      pointerY = (event.clientY / window.innerHeight) * 2 - 1;
    },
    { passive: true },
  );

  start();
}

for (const hero of document.querySelectorAll<HTMLElement>('[data-neural]')) {
  try {
    init(hero);
  } catch {
    /* decoration only: leave the page as it is */
  }
}

export {};
