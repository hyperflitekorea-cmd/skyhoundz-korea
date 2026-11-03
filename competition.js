(() => {
  'use strict';

  // Native details remain usable by touch and keyboard, even without this enhancement.
  const hoverInput = window.matchMedia('(hover: hover) and (pointer: fine)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('.competition-quick').forEach((details) => {
    const summary = details.querySelector('summary');
    const body = details.querySelector('.competition-quick-body');
    let expanded = details.open;
    let animation;
    let hoverOpened = false;
    let enterTimer;
    let leaveTimer;

    const clearTimers = () => {
      window.clearTimeout(enterTimer);
      window.clearTimeout(leaveTimer);
    };
    const finishMotion = () => {
      details.open = expanded;
      if (animation) {
        animation.onfinish = null;
        animation.cancel();
        animation = null;
      }
      details.style.removeProperty('overflow');
    };
    const setExpanded = (next) => {
      if (expanded === next) return;
      // Measure the current rendered height so reversing mid-motion never jumps.
      const startHeight = details.getBoundingClientRect().height;
      expanded = next;
      details.dataset.expanded = String(next);
      if (animation) {
        animation.onfinish = null;
        animation.cancel();
      }
      if (reducedMotion.matches || !details.animate) {
        finishMotion();
        return;
      }
      // Keep the native content rendered until the closing motion completes.
      details.open = true;
      const endHeight = summary.getBoundingClientRect().height + (next ? body.getBoundingClientRect().height : 0);
      details.style.overflow = 'hidden';
      animation = details.animate(
        [{ height: `${startHeight}px` }, { height: `${endHeight}px` }],
        { duration: next ? 300 : 220, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'both' },
      );
      animation.onfinish = finishMotion;
    };
    const closeHover = () => {
      clearTimers();
      if (hoverOpened) setExpanded(false);
      hoverOpened = false;
    };

    details.addEventListener('pointerenter', (event) => {
      if (event.pointerType !== 'mouse' || !hoverInput.matches) return;
      clearTimers();
      enterTimer = window.setTimeout(() => {
        if (!expanded) {
          hoverOpened = true;
          setExpanded(true);
        }
      }, 120);
    });
    details.addEventListener('pointerleave', () => {
      clearTimers();
      leaveTimer = window.setTimeout(closeHover, 200);
    });

    summary.addEventListener('click', (event) => {
      event.preventDefault();
      clearTimers();
      // Clicking a hover preview pins it open; other activations toggle it.
      const pinHover = hoverOpened && event.detail > 0;
      hoverOpened = false;
      if (!pinHover) setExpanded(!expanded);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      closeHover();
      if (details.contains(document.activeElement)) setExpanded(false);
    });
    hoverInput.addEventListener('change', closeHover);
    reducedMotion.addEventListener('change', finishMotion);
    window.addEventListener('resize', finishMotion);
    window.addEventListener('hashchange', closeHover);
  });
})();
