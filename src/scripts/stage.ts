/**
 * The opening stage: 32,000 points.
 *
 * At rest the points draw a portrait (one point per pixel of a 160 × 200
 * sample of the photograph). As the page scrolls they lift into a rotating
 * globe, then settle as the results of the knowledge-conflict study: four
 * columns, one per document condition, 8,000 answers each, coloured by what
 * the model answered. The count is not a coincidence: 160 × 200 = 32,000 =
 * 8 runs × 4 conditions × 1,000 questions.
 *
 * Plain WebGL, no library. If WebGL is missing or the visitor prefers
 * reduced motion, nothing here runs and the static layout stays as it is.
 */

const COLS = 160;
const ROWS = 200;
const N = COLS * ROWS;
const PER_CONDITION = N / 4;

/** Data colours: true answer, planted answer, "I don't know", other. */
const DATA_COLORS: [number, number, number][] = [
  [0.56, 0.68, 1.0],
  [1.0, 0.36, 0.17],
  [0.6, 0.585, 0.55],
  [0.25, 0.25, 0.27],
];

const VERT = `
attribute vec2 aA;
attribute vec3 aB;
attribute vec2 aC;
attribute vec3 aColA;
attribute vec3 aColC;
attribute vec4 aMisc; // x: random, y: luminance, z: portrait alpha, w: unused
uniform vec2 uRes;
uniform vec2 uCenter;
uniform vec2 uMouse;
uniform float uT1;
uniform float uT2;
uniform float uTime;
uniform float uDpr;
uniform float uSizeA;
uniform float uSizeC;
uniform float uRadius;
uniform float uIntro;
varying vec3 vCol;
varying float vAlpha;

float ease(float t) { return t * t * (3.0 - 2.0 * t); }

void main() {
  float r = aMisc.x;
  float t1 = ease(clamp((uT1 - r * 0.4) / 0.6, 0.0, 1.0));
  float t2 = ease(clamp((uT2 - (1.0 - r) * 0.4) / 0.6, 0.0, 1.0));

  // The globe: a shell of points turning about its vertical axis.
  float ang = uTime * 0.1 + uT1 * 1.6 + uT2 * 1.4;
  float c = cos(ang);
  float s = sin(ang);
  vec3 q = aB;
  q.xz = mat2(c, -s, s, c) * q.xz;
  float persp = 1.0 / (1.0 + q.z * 0.42);
  vec2 globe = uCenter + q.xy * uRadius * persp;

  // The portrait: a slight shimmer, and points step aside for the cursor.
  vec2 a = aA + vec2(sin(uTime * 1.3 + r * 40.0), cos(uTime * 1.1 + r * 31.0)) * 0.5;
  vec2 d = a - uMouse;
  float push = smoothstep(110.0, 0.0, length(d));
  a += normalize(d + 0.0001) * push * 30.0;
  // On load the points fall into place from a loose cloud.
  float intro = ease(clamp((uIntro - r * 0.5) / 0.5, 0.0, 1.0));
  a = mix(uCenter + (aB.xy + aB.zx * 0.4) * uRadius * 1.5, a, intro);

  vec2 p = mix(mix(a, globe, t1), aC, t2);
  vec2 clip = p / uRes * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);

  float sizeA = uSizeA * (0.42 + 0.9 * aMisc.y);
  float sizeB = uSizeA * 0.95 * persp;
  gl_PointSize = max(mix(mix(sizeA, sizeB, t1), uSizeC, t2) * uDpr, 1.0);

  vCol = mix(aColA, aColC, t1);
  float alphaB = 0.35 + 0.6 * smoothstep(1.3, -0.9, q.z);
  vAlpha = mix(mix(aMisc.z * intro, alphaB, t1), 1.0, t2);
}`;

const FRAG = `
precision mediump float;
varying vec3 vCol;
varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.36, d) * vAlpha;
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

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

async function loadPixels(url: string): Promise<Uint8ClampedArray> {
  const img = new Image();
  img.decoding = 'async';
  img.src = url;
  await img.decode();
  const c = document.createElement('canvas');
  c.width = COLS;
  c.height = ROWS;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('no 2d context');
  ctx.drawImage(img, 0, 0, COLS, ROWS);
  return ctx.getImageData(0, 0, COLS, ROWS).data;
}

function compile(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error('shader');
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) ?? 'compile');
  return shader;
}

async function init(stage: HTMLElement) {
  const canvas = stage.querySelector<HTMLCanvasElement>('[data-stage-canvas]');
  const pin = stage.querySelector<HTMLElement>('[data-stage-pin]');
  const slot = stage.querySelector<HTMLElement>('[data-stage-portrait]');
  const columns = [...stage.querySelectorAll<HTMLElement>('[data-stage-column]')];
  const scenes = [...stage.querySelectorAll<HTMLElement>('[data-scene]')];
  const cue = stage.querySelector<HTMLElement>('[data-stage-cue]');
  if (!canvas || !pin || !slot || columns.length !== 4) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const gl = canvas.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: true });
  if (!gl) return;

  // counts[c] = answers per outcome for condition c, summed over the 8 runs.
  const counts: number[][] = JSON.parse(stage.dataset.counts ?? '[]');
  let pixels: Uint8ClampedArray;
  try {
    pixels = await loadPixels(stage.dataset.sample ?? '');
  } catch {
    return;
  }

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

  /* ---- static per-point data ---- */
  const rand = mulberry32(20261114);
  const posB = new Float32Array(N * 3);
  const colA = new Float32Array(N * 3);
  const colC = new Float32Array(N * 3);
  const misc = new Float32Array(N * 4);

  // Which answer each portrait point becomes: a seeded shuffle.
  const order = new Uint32Array(N);
  for (let i = 0; i < N; i++) order[i] = i;
  for (let i = N - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const tmp = order[i]!;
    order[i] = order[j]!;
    order[j] = tmp;
  }
  // Cumulative outcome thresholds per condition.
  const thresholds = counts.map((row) => {
    let sum = 0;
    return row.map((n) => (sum += n));
  });
  const outcomeOf = (condition: number, j: number) => {
    const t = thresholds[condition] ?? [];
    for (let k = 0; k < t.length; k++) if (j < t[k]!) return k;
    return 3;
  };

  for (let i = 0; i < N; i++) {
    const px = i % COLS;
    const py = Math.floor(i / COLS);
    const r = pixels[i * 4]! / 255;
    const g = pixels[i * 4 + 1]! / 255;
    const b = pixels[i * 4 + 2]! / 255;
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    // Lift the photograph a little so it reads on a dark ground.
    const lift = 1.22;
    colA[i * 3] = Math.min(1, r * lift + 0.02);
    colA[i * 3 + 1] = Math.min(1, g * lift + 0.02);
    colA[i * 3 + 2] = Math.min(1, b * lift + 0.02);

    // Soft oval mask: the picture fades out towards its edges.
    const nx = (px + 0.5) / COLS - 0.5;
    const ny = (py + 0.5) / ROWS - 0.46;
    const dist = Math.sqrt((nx / 0.52) ** 2 + (ny / 0.6) ** 2);
    const mask = 1 - smooth(0.62, 1.0, dist);

    // A point on a shell, for the globe.
    const u = rand() * 2 - 1;
    const th = rand() * Math.PI * 2;
    const rad = 0.78 + 0.22 * rand() ** 2;
    const s = Math.sqrt(1 - u * u);
    posB[i * 3] = s * Math.cos(th) * rad;
    posB[i * 3 + 1] = u * rad;
    posB[i * 3 + 2] = s * Math.sin(th) * rad;

    const k = order[i]!;
    const condition = Math.floor(k / PER_CONDITION);
    const color = DATA_COLORS[outcomeOf(condition, k % PER_CONDITION)]!;
    colC[i * 3] = color[0];
    colC[i * 3 + 1] = color[1];
    colC[i * 3 + 2] = color[2];

    misc[i * 4] = rand();
    misc[i * 4 + 1] = lum;
    misc[i * 4 + 2] = mask * (0.35 + 0.65 * lum);
    misc[i * 4 + 3] = 0;
  }

  const posA = new Float32Array(N * 2);
  const posC = new Float32Array(N * 2);

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
  const bufA = buffer('aA', posA, 2, gl.DYNAMIC_DRAW);
  buffer('aB', posB, 3, gl.STATIC_DRAW);
  const bufC = buffer('aC', posC, 2, gl.DYNAMIC_DRAW);
  buffer('aColA', colA, 3, gl.STATIC_DRAW);
  buffer('aColC', colC, 3, gl.STATIC_DRAW);
  buffer('aMisc', misc, 4, gl.STATIC_DRAW);

  const U = (name: string) => gl.getUniformLocation(program, name);
  const uRes = U('uRes');
  const uCenter = U('uCenter');
  const uMouse = U('uMouse');
  const uT1 = U('uT1');
  const uT2 = U('uT2');
  const uTime = U('uTime');
  const uDpr = U('uDpr');
  const uSizeA = U('uSizeA');
  const uSizeC = U('uSizeC');
  const uRadius = U('uRadius');
  const uIntro = U('uIntro');

  gl.disable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0, 0, 0, 0);

  /* ---- scroll progress, scenes ---- */
  let target = 0;
  let progress = 0;
  let lastShown = -1;

  const showScenes = (p: number) => {
    if (Math.abs(p - lastShown) < 0.0005) return;
    lastShown = p;
    const visible = [
      1 - smooth(0.05, 0.17, p),
      smooth(0.24, 0.33, p) * (1 - smooth(0.5, 0.58, p)),
      smooth(0.76, 0.88, p),
    ];
    scenes.forEach((scene, i) => {
      const v = visible[i] ?? 0;
      scene.style.opacity = v.toFixed(3);
      scene.style.translate = `0 ${((1 - v) * (i === 0 ? -36 : 28)).toFixed(1)}px`;
      scene.style.visibility = v < 0.01 ? 'hidden' : 'visible';
      scene.style.pointerEvents = v < 0.6 ? 'none' : '';
    });
    if (cue) cue.style.opacity = (1 - smooth(0.02, 0.08, p)).toFixed(3);
    stage.style.setProperty('--p', p.toFixed(4));
  };

  /* ---- layout: where the portrait and the columns are on screen ---- */
  let width = 0;
  let height = 0;
  let dpr = 1;

  const layout = () => {
    // Measure with every scene at rest: a scene that is mid-fade is shifted.
    for (const scene of scenes) scene.style.translate = 'none';
    const frame = pin.getBoundingClientRect();
    width = frame.width;
    height = frame.height;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);

    // Portrait: one point per sampled pixel, filling the slot.
    const sr = slot.getBoundingClientRect();
    const sx = sr.left - frame.left;
    const sy = sr.top - frame.top;
    for (let i = 0; i < N; i++) {
      posA[i * 2] = sx + (((i % COLS) + 0.5) / COLS) * sr.width;
      posA[i * 2 + 1] = sy + ((Math.floor(i / COLS) + 0.5) / ROWS) * sr.height;
    }

    // Columns: 8,000 points each, filled row by row from the bottom.
    let spacing = Infinity;
    const boxes = columns.map((el) => {
      const r = el.getBoundingClientRect();
      const cols = Math.max(10, Math.round(Math.sqrt((PER_CONDITION * r.width) / Math.max(r.height, 1))));
      const rows = Math.ceil(PER_CONDITION / cols);
      spacing = Math.min(spacing, r.width / cols, r.height / rows);
      return { x: r.left - frame.left, y: r.top - frame.top, w: r.width, h: r.height, cols };
    });
    for (let i = 0; i < N; i++) {
      const k = order[i]!;
      const box = boxes[Math.floor(k / PER_CONDITION)]!;
      const j = k % PER_CONDITION;
      const col = j % box.cols;
      const row = Math.floor(j / box.cols);
      posC[i * 2] = box.x + (box.w - box.cols * spacing) / 2 + (col + 0.5) * spacing;
      posC[i * 2 + 1] = box.y + box.h - (row + 0.5) * spacing;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, bufA);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, posA);
    gl.bindBuffer(gl.ARRAY_BUFFER, bufC);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, posC);

    const wide = width >= 900;
    gl.uniform2f(uRes, width, height);
    gl.uniform2f(uCenter, wide ? width * 0.68 : width * 0.5, wide ? height * 0.5 : height * 0.4);
    gl.uniform1f(uDpr, dpr);
    gl.uniform1f(uSizeA, (sr.width / COLS) * 1.62);
    gl.uniform1f(uSizeC, spacing * 0.8);
    gl.uniform1f(uRadius, Math.min(width, height) * (wide ? 0.33 : 0.4));
    lastShown = -1;
    showScenes(progress);
  };

  const readScroll = () => {
    const rect = stage.getBoundingClientRect();
    const travel = rect.height - window.innerHeight;
    target = travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 0;
  };

  /* ---- pointer ---- */
  let mouseX = -9999;
  let mouseY = -9999;
  pin.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch') return;
    const frame = pin.getBoundingClientRect();
    mouseX = event.clientX - frame.left;
    mouseY = event.clientY - frame.top;
  });
  pin.addEventListener('pointerleave', () => {
    mouseX = mouseY = -9999;
  });

  /* ---- loop: only while the stage is on screen and the tab is visible ---- */
  let running = false;
  let frameId = 0;
  const started = performance.now();

  const frame = (now: number) => {
    frameId = 0;
    if (!running) return;
    progress += (target - progress) * 0.12;
    if (Math.abs(target - progress) < 0.0004) progress = target;
    showScenes(progress);

    const time = (now - started) / 1000;
    gl.uniform1f(uTime, time);
    gl.uniform1f(uIntro, Math.min(1, time / 2.2));
    gl.uniform1f(uT1, smooth(0.07, 0.42, progress));
    gl.uniform1f(uT2, smooth(0.5, 0.84, progress));
    gl.uniform2f(uMouse, mouseX, mouseY);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, N);
    frameId = requestAnimationFrame(frame);
  };
  const setRunning = (on: boolean) => {
    running = on;
    if (on && !frameId) frameId = requestAnimationFrame(frame);
  };

  // Go live: from here the CSS pins the stage and overlays the scenes.
  stage.classList.add('is-live');
  layout();
  readScroll();
  progress = target;
  showScenes(progress);

  let onScreen = true;
  new IntersectionObserver(([entry]) => {
    onScreen = entry?.isIntersecting ?? false;
    setRunning(onScreen && !document.hidden);
  }).observe(stage);
  document.addEventListener('visibilitychange', () => setRunning(onScreen && !document.hidden));
  window.addEventListener('scroll', readScroll, { passive: true });

  let resizeTimer = 0;
  new ResizeObserver(() => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      layout();
      readScroll();
    }, 120);
  }).observe(pin);
  // Fonts change text height, which moves the slots.
  document.fonts?.ready.then(layout);

  // Keyboard: tabbing into a later scene scrolls the story to it.
  scenes.forEach((scene) => {
    scene.addEventListener('focusin', () => {
      const at = Number(scene.dataset.at ?? 0);
      const rect = stage.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const y = window.scrollY + rect.top + at * travel;
      if (Math.abs(window.scrollY - y) > window.innerHeight * 0.3) window.scrollTo({ top: y, behavior: 'auto' });
    });
  });

  canvas.addEventListener('webglcontextlost', (event) => {
    event.preventDefault();
    setRunning(false);
    stage.classList.remove('is-live');
    scenes.forEach((scene) => scene.removeAttribute('style'));
  });
}

const stage = document.querySelector<HTMLElement>('[data-stage]');
if (stage) void init(stage);

export {};
