(() => {
  'use strict';

  const section = document.querySelector('.home-reviews');
  const viewport = section?.querySelector('.review-window');
  const track = section?.querySelector('.review-track');
  if (!viewport || !track) return;

  const cards = [...track.children];
  const controls = section.querySelector('.review-controls');
  const toggle = section.querySelector('[data-review-toggle]');
  const status = section.querySelector('.review-status');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reducedMotion.matches;
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
  controls.hidden = false;
  section.classList.add('reviews-enhanced');

  function canPlay() {
    return !paused && !hovered && !focused && visible && !document.hidden
      && !section.closest('[data-page]').hidden && cycleWidth > 0;
  }

  function tick(time) {
    frame = 0;
    if (!canPlay()) return;
    // 16 CSS pixels per second: roughly 24 seconds for one desktop card.
    offset = (offset + Math.min(time - lastTime, 50) * 0.016) % cycleWidth;
    viewport.scrollLeft = offset;
    lastTime = time;
    frame = requestAnimationFrame(tick);
  }

  function update() {
    cancelAnimationFrame(frame);
    frame = 0;
    toggle.textContent = paused ? '자동 재생' : '일시정지';
    toggle.setAttribute('aria-label', paused ? '리뷰 자동 이동 시작' : '리뷰 자동 이동 일시정지');
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

  function move(direction) {
    paused = true;
    update();
    const step = cards[1].offsetLeft - cards[0].offsetLeft;
    let current = viewport.scrollLeft % cycleWidth;
    if (direction < 0 && current < step) current += cycleWidth;
    viewport.scrollLeft = current;
    const destination = Math.round(current / step) + direction;
    viewport.scrollTo({ left: destination * step, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
    status.textContent = `${cards.length}개 리뷰 중 ${((destination % cards.length) + cards.length) % cards.length + 1}번째`;
  }

  toggle.addEventListener('click', () => {
    paused = !paused;
    // Explicitly starting playback takes precedence over control focus.
    if (!paused) focused = false;
    update();
  });
  section.querySelector('[data-review-prev]').addEventListener('click', () => move(-1));
  section.querySelector('[data-review-next]').addEventListener('click', () => move(1));

  viewport.addEventListener('pointerenter', (event) => {
    if (event.pointerType === 'mouse') { hovered = true; update(); }
  });
  viewport.addEventListener('pointerleave', () => { hovered = false; update(); });
  viewport.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'mouse') { paused = true; update(); }
  });
  viewport.addEventListener('wheel', () => { paused = true; update(); }, { passive: true });
  viewport.addEventListener('scroll', () => {
    if (!canPlay()) offset = viewport.scrollLeft;
  }, { passive: true });
  section.addEventListener('focusin', () => { focused = true; update(); });
  section.addEventListener('focusout', (event) => {
    if (!section.contains(event.relatedTarget)) { focused = false; update(); }
  });
  viewport.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      move(event.key === 'ArrowLeft' ? -1 : 1);
    }
  });
  document.addEventListener('visibilitychange', update);
  window.addEventListener('hashchange', update);
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) paused = true;
    update();
  });
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    update();
  }, { threshold: 0.05 }).observe(viewport);
  new ResizeObserver(measure).observe(viewport);
  measure();
})();
