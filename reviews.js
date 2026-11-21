(() => {
  'use strict';

  const section = document.querySelector('.home-reviews');
  const viewport = section?.querySelector('.review-window');
  const track = section?.querySelector('.review-track');
  if (!viewport || !track) return;

  const cards = [...track.children];
  if (!cards.length) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let interacting = false;
  let touching = false;
  let resumeTimer = 0;
  let hovered = false;
  let focused = false;
  let visible = false;
  let cycleWidth = 0;
  let offset = 0;
  let frame = 0;
  let lastTime = 0;

  // Only the original seven cards belong to the accessibility tree.
  for (const card of cards) {
    const copy = card.cloneNode(true);
    copy.setAttribute('aria-hidden', 'true');
    copy.inert = true;
    track.append(copy);
  }
  section.classList.add('reviews-enhanced');

  function canPlay() {
    return !reducedMotion.matches && !interacting && !hovered && !focused && visible && !document.hidden
      && !section.closest('[data-page]').hidden && cycleWidth > 0;
  }

  function tick(time) {
    frame = 0;
    if (!canPlay()) return;
    // 24 CSS pixels per second: roughly 16 seconds for one desktop card.
    offset = (offset + Math.min(time - lastTime, 50) * 0.024) % cycleWidth;
    viewport.scrollLeft = offset;
    lastTime = time;
    frame = requestAnimationFrame(tick);
  }

  function update() {
    cancelAnimationFrame(frame);
    frame = 0;
    section.dataset.playing = String(canPlay());
    if (canPlay()) {
      offset = viewport.scrollLeft % cycleWidth;
      viewport.scrollLeft = offset;
      lastTime = performance.now();
      frame = requestAnimationFrame(tick);
    }
  }

  function measure() {
    const progress = cycleWidth ? viewport.scrollLeft / cycleWidth : 0;
    cycleWidth = track.children[cards.length].offsetLeft - cards[0].offsetLeft;
    offset = (progress % 1) * cycleWidth;
    viewport.scrollLeft = offset;
    update();
  }

  function resumeAfterInteraction() {
    clearTimeout(resumeTimer);
    if (touching) return;
    resumeTimer = window.setTimeout(() => {
      interacting = false;
      update();
    }, 2500);
  }

  function pauseForInteraction() {
    interacting = true;
    update();
    resumeAfterInteraction();
  }

  function move(direction) {
    pauseForInteraction();
    if (cards.length < 2 || !cycleWidth) return;
    const step = cards[1].offsetLeft - cards[0].offsetLeft;
    let current = viewport.scrollLeft % cycleWidth;
    if (direction < 0 && current < step) current += cycleWidth;
    viewport.scrollLeft = current;
    const destination = Math.round(current / step) + direction;
    viewport.scrollTo({ left: destination * step, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
  }

  viewport.addEventListener('pointerenter', (event) => {
    if (event.pointerType === 'mouse') { hovered = true; update(); }
  });
  viewport.addEventListener('pointerleave', () => { hovered = false; update(); });
  viewport.addEventListener('pointerdown', (event) => {
    focused = false;
    if (event.pointerType !== 'mouse') {
      touching = true;
      pauseForInteraction();
    }
  });
  function endTouch() {
    if (!touching) return;
    touching = false;
    resumeAfterInteraction();
  }
  window.addEventListener('pointerup', endTouch);
  window.addEventListener('pointercancel', endTouch);
  viewport.addEventListener('wheel', pauseForInteraction, { passive: true });
  viewport.addEventListener('scroll', () => {
    if (!canPlay()) offset = viewport.scrollLeft;
    // Let touch momentum settle before restarting the automatic movement.
    if (interacting) resumeAfterInteraction();
  }, { passive: true });
  section.addEventListener('focusin', () => {
    focused = viewport.matches(':focus-visible');
    update();
  });
  section.addEventListener('focusout', (event) => {
    if (!section.contains(event.relatedTarget)) { focused = false; update(); }
  });
  viewport.addEventListener('keydown', (event) => {
    focused = true;
    update();
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      move(event.key === 'ArrowLeft' ? -1 : 1);
    }
  });
  document.addEventListener('visibilitychange', update);
  window.addEventListener('hashchange', update);
  reducedMotion.addEventListener('change', update);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    update();
  }, { threshold: 0.05 }).observe(viewport);
  new ResizeObserver(measure).observe(viewport);
  measure();
})();
