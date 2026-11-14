/**
 * Scroll-linked effects other than the opening stage. One scroll listener,
 * one animation frame, for all of them:
 *
 *   [data-hscroll]   a section that turns vertical scrolling into sideways
 *                    travel through its track (the work reel)
 *   [data-progress]  sets --progress (0–1) as the element crosses the screen
 *                    (the timeline's line, the photo deck's fan)
 *   [data-tilt]      leans a card towards the pointer, in 3D
 *
 * Each effect is an enhancement over a layout that already works without it:
 * the reel is a swipeable row, the timeline is a list, the deck is a row.
 */

const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const clamp = (x: number) => Math.min(1, Math.max(0, x));

type Reel = {
  el: HTMLElement;
  pin: HTMLElement;
  track: HTMLElement;
  bar: HTMLElement | null;
  count: HTMLElement | null;
  distance: number;
  current: number;
  target: number;
  panels: HTMLElement[];
};

const reels: Reel[] = [];
const sweeps = [...document.querySelectorAll<HTMLElement>('[data-progress]')];
// Sideways travel needs room and a precise pointer; elsewhere the row swipes.
const reelQuery = matchMedia('(min-width: 62rem) and (min-height: 34rem) and (hover: hover)');

for (const el of document.querySelectorAll<HTMLElement>('[data-hscroll]')) {
  const pin = el.querySelector<HTMLElement>('[data-hscroll-pin]');
  const track = el.querySelector<HTMLElement>('[data-hscroll-track]');
  if (!pin || !track) continue;
  reels.push({
    el,
    pin,
    track,
    bar: el.querySelector('[data-hscroll-bar]'),
    count: el.querySelector('[data-hscroll-count]'),
    distance: 0,
    current: 0,
    target: 0,
    panels: [...track.children] as HTMLElement[],
  });
}

function measure() {
  const live = reelQuery.matches && !reduce.matches;
  for (const reel of reels) {
    reel.el.classList.toggle('is-live', live);
    if (!live) {
      reel.el.style.height = '';
      reel.track.style.transform = '';
      reel.distance = 0;
      continue;
    }
    reel.track.style.transform = '';
    reel.distance = Math.max(0, reel.track.scrollWidth - reel.pin.clientWidth);
    reel.el.style.height = `${window.innerHeight + reel.distance}px`;
  }
  read();
}

function read() {
  const vh = window.innerHeight;
  for (const reel of reels) {
    if (!reel.distance) continue;
    const rect = reel.el.getBoundingClientRect();
    reel.target = clamp(-rect.top / (rect.height - vh));
  }
  for (const el of sweeps) {
    const rect = el.getBoundingClientRect();
    // 0 when the element's top reaches the lower part of the screen,
    // 1 when its bottom reaches the middle.
    const start = vh * 0.85;
    const p = clamp((start - rect.top) / (rect.height + start - vh * 0.5));
    el.style.setProperty('--progress', p.toFixed(4));
  }
  schedule();
}

let frame = 0;
function schedule() {
  if (!frame) frame = requestAnimationFrame(tick);
}
function tick() {
  frame = 0;
  let moving = false;
  for (const reel of reels) {
    if (!reel.distance) continue;
    reel.current += (reel.target - reel.current) * 0.14;
    if (Math.abs(reel.target - reel.current) < 0.0005) reel.current = reel.target;
    else moving = true;
    reel.track.style.transform = `translate3d(${(-reel.current * reel.distance).toFixed(1)}px, 0, 0)`;
    if (reel.bar) reel.bar.style.scale = `${reel.current.toFixed(4)} 1`;
    if (reel.count) {
      const index = Math.min(reel.panels.length, Math.round(reel.current * (reel.panels.length - 1)) + 1);
      reel.count.textContent = String(index).padStart(2, '0');
    }
  }
  if (moving) schedule();
}

if (reels.length || sweeps.length) {
  window.addEventListener('scroll', read, { passive: true });
  window.addEventListener('resize', measure);
  reelQuery.addEventListener('change', measure);
  reduce.addEventListener('change', measure);
  document.fonts?.ready.then(measure);
  window.addEventListener('load', measure);
  measure();
}

// Keyboard: focusing a link in an off-screen panel scrolls the page to it,
// instead of letting the browser shove the clipped track sideways.
for (const reel of reels) {
  reel.track.addEventListener('focusin', (event) => {
    if (!reel.distance) return;
    reel.pin.scrollLeft = 0;
    const panel = (event.target as HTMLElement).closest<HTMLElement>('[data-hscroll-track] > *');
    if (!panel) return;
    const want = clamp((panel.offsetLeft - (reel.pin.clientWidth - panel.offsetWidth) / 2) / reel.distance);
    const top = window.scrollY + reel.el.getBoundingClientRect().top + want * reel.distance;
    if (Math.abs(top - window.scrollY) > 40) window.scrollTo({ top, behavior: 'auto' });
  });
}

/* ---- tilt ---- */
if (!reduce.matches && matchMedia('(hover: hover)').matches) {
  for (const el of document.querySelectorAll<HTMLElement>('[data-tilt]')) {
    const max = Number(el.dataset.tilt) || 7;
    el.addEventListener('pointermove', (event) => {
      const r = el.getBoundingClientRect();
      const x = (event.clientX - r.left) / r.width - 0.5;
      const y = (event.clientY - r.top) / r.height - 0.5;
      el.style.setProperty('--rx', `${(-y * max).toFixed(2)}deg`);
      el.style.setProperty('--ry', `${(x * max).toFixed(2)}deg`);
      el.style.setProperty('--gx', `${((x + 0.5) * 100).toFixed(1)}%`);
      el.style.setProperty('--gy', `${((y + 0.5) * 100).toFixed(1)}%`);
    });
    el.addEventListener('pointerleave', () => {
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
    });
  }
}

export {};
