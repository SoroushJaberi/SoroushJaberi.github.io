/**
 * The study in 32,000 points.
 *
 * Each point is one answer from the knowledge-conflict study (8 runs × 4
 * conditions × 1,000 questions). They start as a slowly turning globe and,
 * when the figure scrolls into view, settle into four columns, one per
 * document condition, coloured by what the model answered.
 *
 * Plain WebGL, no library. It plays on its own time, not the page's scroll,
 * so it behaves the same on every device. If WebGL is missing or the visitor
 * prefers reduced motion, nothing here runs and the CSS bars stay as they are.
 */

const N = 32000;
const PER_CONDITION = N / 4;

const VERT = `
attribute vec3 aB;
attribute vec2 aC;
attribute vec3 aCol;
attribute float aRand;
uniform vec2 uRes;
uniform vec2 uCenter;
uniform float uT;
uniform float uTime;
uniform float uDpr;
uniform float uSizeB;
uniform float uSizeC;
uniform float uRadius;
varying vec3 vCol;
varying float vAlpha;

float ease(float t) { return t * t * (3.0 - 2.0 * t); }

void main() {
  float t = ease(clamp((uT - aRand * 0.45) / 0.55, 0.0, 1.0));

  float ang = uTime * 0.16 + uT * 1.4;
  float c = cos(ang);
  float s = sin(ang);
  vec3 q = aB;
  q.xz = mat2(c, -s, s, c) * q.xz;
  float persp = 1.0 / (1.0 + q.z * 0.4);
  vec2 globe = uCenter + q.xy * uRadius * persp;

  vec2 p = mix(globe, aC, t);
  vec2 clip = p / uRes * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
  gl_PointSize = max(mix(uSizeB * persp, uSizeC, t) * uDpr, 1.0);

  vCol = aCol;
  float depth = 0.4 + 0.6 * smoothstep(1.2, -0.9, q.z);
  vAlpha = mix(depth, 1.0, t);
}`;

const FRAG = `
precision mediump float;
varying vec3 vCol;
varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.34, d) * vAlpha;
  gl_FragColor = vec4(vCol * a, a);
}`;

/** Small seeded generator, so the arrangement is the same on every visit. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** "#rrggbb" or "rgb(r g b)" → [r, g, b] in 0–1. */
function parseColor(value: string): [number, number, number] {
  const v = value.trim();
  const hex = /^#([0-9a-f]{6})$/i.exec(v);
  if (hex) {
    const n = parseInt(hex[1]!, 16);
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  }
  const nums = v.match(/[\d.]+/g);
  if (nums && nums.length >= 3) return [Number(nums[0]) / 255, Number(nums[1]) / 255, Number(nums[2]) / 255];
  return [0.5, 0.5, 0.5];
}

function compile(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error('shader');
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) ?? 'compile');
  return shader;
}

function init(field: HTMLElement) {
  const canvas = field.querySelector<HTMLCanvasElement>('[data-field-canvas]');
  const stage = field.querySelector<HTMLElement>('[data-field-stage]');
  const columns = [...field.querySelectorAll<HTMLElement>('[data-field-column]')];
  const replay = field.querySelector<HTMLButtonElement>('[data-field-replay]');
  if (!canvas || !stage || columns.length !== 4) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const gl = canvas.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: true });
  if (!gl) return;

  // counts[c] = answers per outcome for condition c, summed over the 8 runs.
  const counts: number[][] = JSON.parse(field.dataset.counts ?? '[]');

  let program: WebGLProgram;
  try {
    const p = gl.createProgram();
    if (!p) return;
    gl.attachShader(p, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) return;
    program = p;
  } catch {
    return;
  }
  gl.useProgram(program);

  /* ---- per-point data ---- */
  const rand = mulberry32(20261114);
  const posB = new Float32Array(N * 3);
  const posC = new Float32Array(N * 2);
  const col = new Float32Array(N * 3);
  const rnd = new Float32Array(N);
  const outcome = new Uint8Array(N);

  // Which answer each point is: a seeded shuffle, so the globe is evenly mixed.
  const order = new Uint32Array(N);
  for (let i = 0; i < N; i++) order[i] = i;
  for (let i = N - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const tmp = order[i]!;
    order[i] = order[j]!;
    order[j] = tmp;
  }
  const thresholds = counts.map((row) => {
    let sum = 0;
    return row.map((n) => (sum += n));
  });
  for (let i = 0; i < N; i++) {
    const u = rand() * 2 - 1;
    const th = rand() * Math.PI * 2;
    const rad = 0.8 + 0.2 * rand() ** 2;
    const s = Math.sqrt(1 - u * u);
    posB[i * 3] = s * Math.cos(th) * rad;
    posB[i * 3 + 1] = u * rad;
    posB[i * 3 + 2] = s * Math.sin(th) * rad;
    rnd[i] = rand();

    const k = order[i]!;
    const t = thresholds[Math.floor(k / PER_CONDITION)] ?? [];
    const j = k % PER_CONDITION;
    let o = 3;
    for (let x = 0; x < t.length; x++) {
      if (j < t[x]!) {
        o = x;
        break;
      }
    }
    outcome[i] = o;
  }

  const buffer = (name: string, data: Float32Array, size: number, usage: number) => {
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, data, usage);
    const loc = gl.getAttribLocation(program, name);
    if (loc >= 0) {
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
    }
    return buf;
  };
  buffer('aB', posB, 3, gl.STATIC_DRAW);
  const bufC = buffer('aC', posC, 2, gl.DYNAMIC_DRAW);
  const bufCol = buffer('aCol', col, 3, gl.DYNAMIC_DRAW);
  buffer('aRand', rnd, 1, gl.STATIC_DRAW);

  const U = (name: string) => gl.getUniformLocation(program, name);
  const uRes = U('uRes');
  const uCenter = U('uCenter');
  const uT = U('uT');
  const uTime = U('uTime');
  const uDpr = U('uDpr');
  const uSizeB = U('uSizeB');
  const uSizeC = U('uSizeC');
  const uRadius = U('uRadius');

  gl.disable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0, 0, 0, 0);

  /* ---- colours follow the theme ---- */
  const paint = () => {
    const css = getComputedStyle(field);
    const palette = ['--c-true', '--c-wrong', '--c-idk', '--c-other'].map((name) => parseColor(css.getPropertyValue(name)));
    for (let i = 0; i < N; i++) {
      const c = palette[outcome[i]!]!;
      col[i * 3] = c[0];
      col[i * 3 + 1] = c[1];
      col[i * 3 + 2] = c[2];
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, bufCol);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, col);
  };

  /* ---- layout: where the columns are ---- */
  const layout = () => {
    const frame = stage.getBoundingClientRect();
    if (frame.width < 10 || frame.height < 10) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(frame.width * dpr);
    canvas.height = Math.round(frame.height * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);

    let spacing = Infinity;
    const boxes = columns.map((el) => {
      const r = el.getBoundingClientRect();
      const cols = Math.max(10, Math.round(Math.sqrt((PER_CONDITION * r.width) / Math.max(r.height, 1))));
      const rows = Math.ceil(PER_CONDITION / cols);
      spacing = Math.min(spacing, r.width / cols, r.height / rows);
      return { x: r.left - frame.left, y: r.top - frame.top, w: r.width, h: r.height, cols };
    });
    let top = Infinity;
    let bottom = 0;
    for (let i = 0; i < N; i++) {
      const k = order[i]!;
      const box = boxes[Math.floor(k / PER_CONDITION)]!;
      const j = k % PER_CONDITION;
      posC[i * 2] = box.x + (box.w - box.cols * spacing) / 2 + ((j % box.cols) + 0.5) * spacing;
      posC[i * 2 + 1] = box.y + box.h - (Math.floor(j / box.cols) + 0.5) * spacing;
    }
    for (const box of boxes) {
      top = Math.min(top, box.y);
      bottom = Math.max(bottom, box.y + box.h);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, bufC);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, posC);

    const radius = Math.min(frame.width * 0.46, (bottom - top) * 0.52);
    gl.uniform2f(uRes, frame.width, frame.height);
    gl.uniform2f(uCenter, frame.width / 2, (top + bottom) / 2);
    gl.uniform1f(uDpr, dpr);
    gl.uniform1f(uSizeB, Math.max(1.6, radius / 95));
    gl.uniform1f(uSizeC, Math.max(1, spacing * 0.82));
    gl.uniform1f(uRadius, radius);
  };

  /* ---- time ---- */
  let running = false;
  let frameId = 0;
  let onScreen = false;
  let playing = false;
  let t = 0; // 0 = globe, 1 = columns
  let last = 0;
  let clock = 0;

  const frame = (now: number) => {
    frameId = 0;
    if (!running) return;
    const dt = Math.min(0.05, (now - last) / 1000 || 0);
    last = now;
    clock += dt;
    if (playing && t < 1) t = Math.min(1, t + dt / 2.6);
    field.classList.toggle('is-settled', t > 0.92);

    gl.uniform1f(uTime, clock);
    gl.uniform1f(uT, t);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, N);
    // Once the columns have settled there is nothing left to animate.
    if (t < 1) frameId = requestAnimationFrame(frame);
    else running = false;
  };
  const start = () => {
    if (running) return;
    running = true;
    last = performance.now();
    frameId = requestAnimationFrame(frame);
  };
  const stop = () => {
    running = false;
    if (frameId) cancelAnimationFrame(frameId);
    frameId = 0;
  };

  field.classList.add('is-live');
  paint();
  layout();
  start();

  new IntersectionObserver(
    ([entry]) => {
      onScreen = entry?.isIntersecting ?? false;
      if (onScreen && (entry?.intersectionRatio ?? 0) >= 0.45) playing = true;
      if (onScreen && !document.hidden) start();
      else stop();
    },
    { threshold: [0, 0.45] },
  ).observe(stage);
  document.addEventListener('visibilitychange', () => {
    if (onScreen && !document.hidden) start();
    else stop();
  });

  replay?.addEventListener('click', () => {
    t = 0;
    playing = false;
    start();
    window.setTimeout(() => {
      playing = true;
    }, 900);
  });

  let resizeTimer = 0;
  new ResizeObserver(() => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      layout();
      start();
    }, 120);
  }).observe(stage);
  document.fonts?.ready.then(() => {
    layout();
    start();
  });
  window.addEventListener('themechange', () => {
    paint();
    start();
  });

  canvas.addEventListener('webglcontextlost', (event) => {
    event.preventDefault();
    stop();
    field.classList.remove('is-live', 'is-settled');
  });
}

for (const field of document.querySelectorAll<HTMLElement>('[data-field]')) init(field);

export {};
