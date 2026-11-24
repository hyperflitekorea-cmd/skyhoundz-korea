(() => {
  const gallery = document.querySelector('.field-gallery');
  if (!gallery || !CSS.supports('clip-path', 'inset(0)')) return;

  const viewport = gallery.querySelector('.field-gallery__viewport');
  const track = gallery.querySelector('.field-gallery__track');
  const header = document.querySelector('.site-header');
  const motion = window.matchMedia('(prefers-reduced-motion: no-preference)');
  let inset = 0;
  let distance = 0;
  let lastProgress = -1;
  let visible = true;
  let frame = 0;

  // Hold each spread at the ends. The smaller frame follows the main photograph.
  function hiddenPortion(progress, start, end) {
    const t = Math.min(1, Math.max(0, (progress - start) / (end - start)));
    return ((1 - t * t * (3 - 2 * t)) * 100) + '%';
  }

  function paint() {
    frame = 0;
    if (!motion.matches || !distance || !visible) return;
    const top = gallery.getBoundingClientRect().top;
    const progress = Math.min(1, Math.max(0, (inset - top) / distance));
    if (progress === lastProgress) return;
    lastProgress = progress;
    track.style.setProperty('--main-inset', hiddenPortion(progress, 0.10, 0.72));
    track.style.setProperty('--detail-inset', hiddenPortion(progress, 0.28, 0.90));
  }

  function requestPaint() {
    if (!frame && visible && motion.matches) frame = requestAnimationFrame(paint);
  }

  function measure() {
    gallery.classList.toggle('field-gallery--scroll', motion.matches);
    if (!motion.matches || !viewport.clientWidth) return;
    inset = header?.offsetHeight || 0;
    distance = Math.round(viewport.clientHeight * 1.25);
    gallery.style.setProperty('--field-header', inset + 'px');
    gallery.style.setProperty('--field-travel', distance + 'px');
    lastProgress = -1;
    requestPaint();
  }

  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    if (header) observer.observe(header);
  }
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      requestPaint();
    }, { rootMargin: '100% 0px' });
    observer.observe(gallery);
  }

  gallery.addEventListener('focusin', ({ target }) => {
    if (!motion.matches || !target.closest('.home-featured') || !target.matches(':focus-visible')) return;
    if (inset - gallery.getBoundingClientRect().top >= distance) return;
    gallery.scrollIntoView({ behavior: 'instant', block: 'end' });
    target.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  window.addEventListener('scroll', requestPaint, { passive: true });
  window.addEventListener('resize', measure);
  document.addEventListener('home:show', measure);
  motion.addEventListener('change', measure);
  measure();
})();
