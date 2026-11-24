(() => {
  'use strict';

  const section = document.querySelector('.home-reviews');
  const viewport = section?.querySelector('.review-window');
  const track = section?.querySelector('.review-track');
  const dialog = document.getElementById('review-dialog');
  if (!viewport || !track || !dialog?.showModal || track.children.length < 2) return;

  const cards = [...track.children];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const speed = 24; // CSS pixels per second
  let step = 0;
  let frame = 0;
  let previousTime = 0;
  let position = 0;
  let visible = false;
  let hovered = false;
  let touching = false;
  let resumeTimer = 0;

  for (const card of cards) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'review-read';
    button.setAttribute('data-open-review', '');
    button.textContent = '전문 보기';
    button.setAttribute('aria-label', card.getAttribute('aria-label') + ' 전문 보기');
    button.setAttribute('aria-haspopup', 'dialog');
    button.setAttribute('aria-controls', dialog.id);
    button.hidden = true;
    card.querySelector('.review-rating').append(button);
  }
  section.classList.add('reviews-enhanced');

  function measure() {
    if (!viewport.clientWidth) return;
    step = track.children[1].offsetLeft - track.children[0].offsetLeft;
    for (const card of cards) {
      const body = card.querySelector('.review-body');
      card.querySelector('.review-read').hidden = body.scrollHeight <= body.clientHeight + 1;
    }
    updateMotion();
  }

  function advance(time) {
    const elapsed = previousTime ? Math.min(time - previousTime, 80) : 0;
    previousTime = time;
    position += speed * elapsed / 1000;
    if (position >= step) {
      // Move only a card which has already passed out of sight.
      track.append(track.firstElementChild);
      position -= step;
    }
    viewport.scrollLeft = position;
    frame = requestAnimationFrame(advance);
  }

  function updateMotion() {
    const playing = visible && step > 0 && !document.hidden && !reducedMotion.matches
      && !hovered && !touching && !resumeTimer && !dialog.open
      && !viewport.querySelector(':focus-visible') && !viewport.matches(':focus-visible');
    section.dataset.playing = String(playing);
    if (playing && !frame) {
      previousTime = 0;
      position = viewport.scrollLeft;
      frame = requestAnimationFrame(advance);
    } else if (!playing && frame) {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  }

  function resumeLater() {
    touching = false;
    clearTimeout(resumeTimer);
    resumeTimer = window.setTimeout(() => {
      resumeTimer = 0;
      updateMotion();
    }, 4000);
    updateMotion();
  }

  viewport.addEventListener('pointerenter', (event) => {
    hovered = event.pointerType === 'mouse';
    updateMotion();
  });
  viewport.addEventListener('pointerleave', () => {
    hovered = false;
    updateMotion();
  });
  viewport.addEventListener('pointerdown', () => {
    touching = true;
    updateMotion();
  });
  function release() {
    if (touching) resumeLater();
  }
  window.addEventListener('pointerup', release);
  window.addEventListener('pointercancel', release);
  viewport.addEventListener('wheel', resumeLater, { passive: true });
  viewport.addEventListener('focusin', updateMotion);
  viewport.addEventListener('focusout', () => queueMicrotask(updateMotion));
  viewport.addEventListener('keydown', (event) => {
    if (!step || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    viewport.focus({ preventScroll: true });
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    if (direction < 0 && viewport.scrollLeft < step / 2) {
      track.prepend(track.lastElementChild);
      viewport.scrollLeft += step;
    } else if (direction > 0 && viewport.scrollLeft + viewport.clientWidth >= viewport.scrollWidth - 1) {
      track.append(track.firstElementChild);
      viewport.scrollLeft -= step;
    }
    const target = Math.round(viewport.scrollLeft / step) + direction;
    viewport.scrollTo({ left: target * step, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  });

  track.addEventListener('click', (event) => {
    const button = event.target.closest('.review-read');
    if (!button) return;
    const card = button.closest('.review-card');
    const rating = card.querySelector('.review-rating').cloneNode(true);
    rating.querySelector('button').remove();
    dialog.querySelector('h2').textContent = card.getAttribute('aria-label');
    dialog.querySelector('.review-dialog-content').replaceChildren(rating, card.querySelector('.review-body').cloneNode(true));
    queueMicrotask(updateMotion);
  });
  dialog.addEventListener('close', updateMotion);

  document.addEventListener('visibilitychange', updateMotion);
  reducedMotion.addEventListener('change', updateMotion);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    updateMotion();
  }).observe(viewport);
  new ResizeObserver(measure).observe(viewport);
  document.fonts.ready.then(measure);
  measure();
})();
