/**
 * Scroll-linked effects. One scroll listener, one animation frame, for all:
 *
 *   [data-hscroll]   the work reel
 *   [data-progress]  sets --progress (0–1) as the element crosses the screen
 *                    (the timeline's line, the photo deck's fan)
 *   [data-tilt]      leans a card towards the pointer, in 3D
 *
 * The reel has two modes and picks one by measuring, not by guessing the
 * device:
 *
 *   pinned   the section stays put and scrolling the page carries the panels
 *            sideways. Used whenever the panels fit inside one screen.
 *   row      an ordinary sideways-scrolling row. Used when they do not fit
 *            (short screens), with reduced motion, and without this script.
 *
 * In both modes every way of moving works: scrolling the page (pinned),
 * swiping sideways with a finger, dragging with a mouse, the two arrow
 * buttons, and the keyboard.
 */

const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const clamp = (x: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, x));
const two = (n: number) => String(n).padStart(2, '0');

/** Older Safari has addListener but not addEventListener on media queries. */
function onChange(query: MediaQueryList, fn: () => void) {
  if (typeof query.addEventListener === 'function') query.addEventListener('change', fn);
  else if (typeof query.addListener === 'function') query.addListener(fn);
}

/** Jump the page without the smooth-scroll animation set in CSS. */
function scrollPageBy(dy: number) {
  try {
    window.scrollBy({ top: dy, behavior: 'instant' as ScrollBehavior });
  } catch {
    window.scrollBy(0, dy);
  }
}

type Reel = { measure: (force?: boolean) => void; read: () => void; tick: () => boolean };
const reels: Reel[] = [];

function setupReel(el: HTMLElement): Reel | null {
  const pin = el.querySelector<HTMLElement>('[data-hscroll-pin]');
  const track = el.querySelector<HTMLElement>('[data-hscroll-track]');
  if (!pin || !track) return null;
  const bar = el.querySelector<HTMLElement>('[data-hscroll-bar]');
  const count = el.querySelector<HTMLElement>('[data-hscroll-count]');
  const prev = el.querySelector<HTMLButtonElement>('[data-hscroll-prev]');
  const next = el.querySelector<HTMLButtonElement>('[data-hscroll-next]');
  const panels = [...track.children] as HTMLElement[];

  let pinned = false;
  let distance = 0; // sideways travel in pinned mode, px
  let current = 0; // drawn progress, 0–1
  let target = 0; // progress the page's scroll asks for
  let stops: number[] = []; // progress at which each panel is at the start
  let lastW = 0;
  let lastH = 0;

  const rowMax = () => Math.max(0, track.scrollWidth - track.clientWidth);
  const rowProgress = () => (rowMax() > 0 ? clamp(track.scrollLeft / rowMax()) : 0);

  const nearest = (p: number) => {
    let best = 0;
    for (let i = 1; i < stops.length; i++) if (Math.abs(stops[i]! - p) < Math.abs(stops[best]! - p)) best = i;
    return best;
  };

  const paint = (p: number) => {
    if (bar) bar.style.transform = `scaleX(${p.toFixed(4)})`;
    if (count) count.textContent = two(nearest(p) + 1);
    if (prev) prev.disabled = p <= 0.004;
    if (next) next.disabled = p >= 0.996;
  };

  const measure = (force = false) => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    // Phones resize the window when the address bar slides away. That is not
    // a real change of layout, so it must not rebuild the section mid-scroll.
    if (!force && w === lastW && Math.abs(h - lastH) < 140) return;
    lastW = w;
    lastH = h;

    // Try the pinned layout, then keep it only if everything fits one screen.
    el.classList.add('is-pinned');
    el.style.height = '';
    track.style.transform = '';
    let ok = !reduce.matches && pin.offsetHeight >= 480;
    if (ok) {
      distance = Math.max(0, track.scrollWidth - pin.clientWidth);
      ok = distance > 40 && pin.scrollHeight <= pin.clientHeight + 2;
    }
    pinned = ok;
    el.classList.toggle('is-pinned', pinned);
    if (pinned) {
      el.style.height = `${pin.offsetHeight + distance}px`;
    } else {
      distance = 0;
    }

    const pad = parseFloat(getComputedStyle(track).paddingLeft) || 0;
    const max = pinned ? distance : rowMax();
    stops = panels.map((panel) => (max > 0 ? clamp((panel.offsetLeft - pad) / max) : 0));
    read();
  };

  const read = () => {
    if (pinned) {
      target = distance > 0 ? clamp(-el.getBoundingClientRect().top / distance) : 0;
    } else {
      paint(rowProgress());
    }
  };

  /** Advances the pinned animation one frame. Returns true while still moving. */
  const tick = () => {
    if (!pinned) return false;
    current += (target - current) * 0.16;
    const moving = Math.abs(target - current) >= 0.0005;
    if (!moving) current = target;
    track.style.transform = `translate3d(${(-current * distance).toFixed(1)}px, 0, 0)`;
    paint(current);
    return moving;
  };

  /* ---- arrows ---- */
  const go = (dir: 1 | -1) => {
    if (stops.length === 0) return;
    const p = pinned ? target : rowProgress();
    let i = nearest(p);
    // If the nearest stop is already behind us in that direction, it is the target.
    if (dir === 1 && stops[i]! > p + 0.01) i -= 1;
    if (dir === -1 && stops[i]! < p - 0.01) i += 1;
    const j = clamp(i + dir, 0, stops.length - 1);
    const behavior: ScrollBehavior = reduce.matches ? 'auto' : 'smooth';
    if (pinned) {
      const top = window.scrollY + el.getBoundingClientRect().top + stops[j]! * distance;
      window.scrollTo({ top, behavior });
    } else {
      track.scrollTo({ left: stops[j]! * rowMax(), behavior });
    }
  };
  prev?.addEventListener('click', () => go(-1));
  next?.addEventListener('click', () => go(1));
  track.addEventListener('scroll', () => !pinned && paint(rowProgress()), { passive: true });

  /* ---- dragging: a finger or a mouse pulling the panels sideways ---- */
  let drag: { id: number; x: number; y: number; last: number; active: boolean; mouse: boolean } | null = null;
  let swallowClick = false;

  track.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, last: event.clientX, active: false, mouse: event.pointerType === 'mouse' };
  });
  window.addEventListener(
    'pointermove',
    (event) => {
      if (!drag || event.pointerId !== drag.id) return;
      const dx = event.clientX - drag.x;
      const dy = event.clientY - drag.y;
      if (!drag.active) {
        if (Math.abs(dx) < 8 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
        // In the row, a finger already scrolls it natively. Only the mouse needs help.
        if (!pinned && !drag.mouse) {
          drag = null;
          return;
        }
        drag.active = true;
        el.classList.add('is-dragging');
      }
      const step = event.clientX - drag.last;
      drag.last = event.clientX;
      if (pinned) scrollPageBy(-step);
      else track.scrollLeft -= step;
    },
    { passive: true },
  );
  const endDrag = () => {
    if (drag?.active) {
      el.classList.remove('is-dragging');
      // The release of a drag must not count as a click on the panel's link.
      swallowClick = true;
      window.setTimeout(() => (swallowClick = false), 60);
    }
    drag = null;
  };
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);
  track.addEventListener(
    'click',
    (event) => {
      if (!swallowClick) return;
      event.preventDefault();
      event.stopPropagation();
    },
    true,
  );
  track.addEventListener('dragstart', (event) => event.preventDefault());

  /* ---- keyboard: focusing a link in a panel brings that panel into view ---- */
  track.addEventListener('focusin', (event) => {
    const panel = (event.target as HTMLElement).closest<HTMLElement>('[data-hscroll-track] > *');
    const i = panel ? panels.indexOf(panel) : -1;
    if (i < 0) return;
    if (pinned) {
      pin.scrollLeft = 0;
      const top = window.scrollY + el.getBoundingClientRect().top + stops[i]! * distance;
      if (Math.abs(top - window.scrollY) > 40) window.scrollTo({ top, behavior: 'auto' });
    }
  });

  return { measure, read, tick };
}

for (const el of document.querySelectorAll<HTMLElement>('[data-hscroll]')) {
  const reel = setupReel(el);
  if (reel) reels.push(reel);
}

/* ---- --progress for the timeline and the photo deck ---- */
const sweeps = [...document.querySelectorAll<HTMLElement>('[data-progress]')];
function readSweeps() {
  const vh = window.innerHeight;
  for (const el of sweeps) {
    const rect = el.getBoundingClientRect();
    // 0 when the element's top reaches the lower part of the screen,
    // 1 when its bottom reaches the middle.
    const start = vh * 0.85;
    const p = clamp((start - rect.top) / (rect.height + start - vh * 0.5));
    el.style.setProperty('--progress', p.toFixed(4));
  }
}

/* ---- one frame loop ---- */
let frame = 0;
function schedule() {
  if (!frame) frame = requestAnimationFrame(run);
}
function run() {
  frame = 0;
  let moving = false;
  for (const reel of reels) if (reel.tick()) moving = true;
  if (moving) schedule();
}
function onScroll() {
  for (const reel of reels) reel.read();
  readSweeps();
  schedule();
}
function measureAll(force = false) {
  for (const reel of reels) reel.measure(force);
  readSweeps();
  schedule();
}

if (reels.length || sweeps.length) {
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => measureAll(false));
  window.addEventListener('orientationchange', () => window.setTimeout(() => measureAll(true), 250));
  window.addEventListener('load', () => measureAll(true));
  onChange(reduce, () => measureAll(true));
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => measureAll(true));
  measureAll(true);
}

/* ---- tilt ---- */
if (!reduce.matches && matchMedia('(hover: hover)').matches) {
  for (const el of document.querySelectorAll<HTMLElement>('[data-tilt]')) {
    const max = Number(el.dataset.tilt) || 7;
    el.addEventListener('pointermove', (event) => {
      if (event.pointerType !== 'mouse') return;
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
