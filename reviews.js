(() => {
  'use strict';

  const section = document.querySelector('.home-reviews');
  const viewport = section?.querySelector('.review-window');
  const track = section?.querySelector('.review-track');
  if (!viewport || !track) return;

  const cards = [...track.children];
  if (cards.length < 2) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const readingTime = 6000;
  let timer = 0;
  let step = 0;
  let visible = false;
  let held = false;
  let hovered = false;
  let focused = false;

  // A second sequence lets the final slide settle into the first one seamlessly.
  for (const card of cards) {
    const copy = card.cloneNode(true);
    copy.setAttribute('aria-hidden', 'true');
    copy.inert = true;
    track.append(copy);
  }
  section.classList.add('reviews-enhanced');

  function move(direction) {
    if (!step) return;
    const current = Math.round(viewport.scrollLeft / step);
    let index = current % cards.length;
    if (direction < 0 && index === 0) index = cards.length;
    if (current !== index) {
      viewport.scrollTo({ left: index * step, behavior: 'instant' });
    }
    viewport.scrollTo({
      left: (index + direction) * step,
      behavior: reducedMotion.matches ? 'instant' : 'smooth',
    });
  }

  function schedule() {
    clearTimeout(timer);
    const playing = visible && step > 0 && !document.hidden && !section.closest('[data-page]').hidden
      && !reducedMotion.matches && !held && !hovered && !focused;
    section.dataset.playing = String(playing);
    if (playing) {
      timer = window.setTimeout(() => {
        move(1);
        schedule();
      }, readingTime);
    }
  }

  function measure() {
    if (viewport.clientWidth) {
      const previous = step ? Math.round(viewport.scrollLeft / step) % cards.length : 0;
      const first = cards[0].getBoundingClientRect().left;
      const repeat = track.children[cards.length].getBoundingClientRect().left;
      const newStep = (repeat - first) / cards.length;
      if (newStep !== step) {
        step = newStep;
        viewport.scrollTo({ left: previous * step, behavior: 'instant' });
      }
    }
    schedule();
  }

  viewport.addEventListener('pointerenter', (event) => {
    hovered = event.pointerType === 'mouse';
    schedule();
  });
  viewport.addEventListener('pointerleave', () => {
    hovered = false;
    schedule();
  });
  viewport.addEventListener('pointerdown', () => {
    held = true;
    focused = false;
    schedule();
  });
  function release() {
    if (!held) return;
    held = false;
    schedule();
  }
  window.addEventListener('pointerup', release);
  window.addEventListener('pointercancel', release);
  viewport.addEventListener('scroll', schedule, { passive: true });
  viewport.addEventListener('focus', () => {
    focused = viewport.matches(':focus-visible');
    schedule();
  });
  viewport.addEventListener('blur', () => {
    focused = false;
    schedule();
  });
  viewport.addEventListener('keydown', (event) => {
    focused = true;
    schedule();
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    move(event.key === 'ArrowLeft' ? -1 : 1);
  });
  document.addEventListener('visibilitychange', schedule);
  window.addEventListener('hashchange', schedule);
  reducedMotion.addEventListener('change', schedule);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    schedule();
  }, { threshold: 0.05 }).observe(viewport);
  new ResizeObserver(measure).observe(viewport);
  measure();
})();
