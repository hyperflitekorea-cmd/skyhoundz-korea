(() => {
  const gallery = document.querySelector('.field-gallery');
  if (!gallery) return;

  const viewport = gallery.querySelector('.field-gallery__viewport');
  const track = gallery.querySelector('.field-gallery__track');
  const shots = Array.from(track.querySelectorAll('.field-gallery__shot'));
  const header = document.querySelector('.site-header');
  const motion = window.matchMedia('(prefers-reduced-motion: no-preference)');

  let visible = true;
  let needsMeasure = true;
  let frame = 0;
  let inset = 0;
  let viewportWidth = 0;
  let distance = 0;
  let previousOffset = -1;
  let photos = [];

  function measure() {
    needsMeasure = false;
    previousOffset = -1;
    gallery.classList.toggle('field-gallery--scroll', motion.matches);
    if (!motion.matches) {
      track.style.removeProperty('transform');
      for (const photo of photos) photo.image.style.removeProperty('transform');
      distance = 0;
      return;
    }

    // A hidden SPA page has no geometry. ResizeObserver remeasures it on return.
    viewportWidth = viewport.clientWidth;
    if (!viewportWidth) return;
    inset = header?.offsetHeight || 0;
    gallery.style.setProperty('--field-header', `${inset}px`);
    distance = Math.max(0, track.scrollWidth - viewportWidth);
    gallery.style.setProperty('--field-travel', `${distance}px`);
    photos = shots.map((shot) => ({
      image: shot.querySelector('img'),
      center: shot.offsetLeft + shot.offsetWidth / 2,
      width: shot.offsetWidth,
    }));
  }

  function paint() {
    frame = 0;
    if (needsMeasure) measure();
    if (!visible || !motion.matches || !viewportWidth) return;
    const offset = Math.min(distance, Math.max(0, inset - gallery.getBoundingClientRect().top));
    if (offset === previousOffset) return;
    previousOffset = offset;

    track.style.transform = `translate3d(${-offset}px, 0, 0)`;
    for (const photo of photos) {
      // Pan gently against the track as each frame crosses the viewport.
      const relative = (offset + viewportWidth / 2 - photo.center) / ((viewportWidth + photo.width) / 2);
      const shift = Math.max(-1, Math.min(1, relative)) * photo.width * 0.046;
      photo.image.style.transform = `translate3d(${shift}px, 0, 0)`;
    }
  }

  function requestPaint() {
    if (!frame && (visible || needsMeasure)) frame = requestAnimationFrame(paint);
  }

  function requestMeasure() {
    needsMeasure = true;
    requestPaint();
  }

  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(requestMeasure);
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

  window.addEventListener('scroll', requestPaint, { passive: true });
  window.addEventListener('resize', requestMeasure);
  window.addEventListener('hashchange', requestMeasure);
  motion.addEventListener('change', requestMeasure);
  paint();
})();
