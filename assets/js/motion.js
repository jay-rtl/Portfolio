(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('.stack-list > article, .expertise-item, .page-hero .wrap, .case-narrative, .case-image-section .wrap, .case-features > article, .workflow-block, main .grid, .cta, .case-next, .contact-grid').forEach(element => {
    if (!element.closest('[data-reveal]') && !element.querySelector('[data-reveal]')) element.setAttribute('data-reveal', '');
  });
  const targets = [...document.querySelectorAll('[data-reveal], .workflow-experience')];
  targets.forEach(element => {
    const siblings = [...element.parentElement.children].filter(child => child.hasAttribute('data-reveal'));
    element.style.setProperty('--reveal-delay', Math.min(siblings.indexOf(element), 3) * 70 + 'ms');
  });
  let observer;
  const reset = () => {
    observer?.disconnect();
    document.documentElement.classList.remove('motion-ready');
    if (reduced.matches || !('IntersectionObserver' in window)) {
      targets.forEach(element => element.classList.add('is-visible'));
      return;
    }
    document.documentElement.classList.add('motion-ready');
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: .04 });
    targets.forEach(element => observer.observe(element));
  };
  reset();
  reduced.addEventListener('change', reset);
  const fine = matchMedia('(min-width:801px) and (hover:hover) and (pointer:fine)');
  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  cursor.setAttribute('data-cursor', '');
  cursor.setAttribute('aria-hidden', 'true');
  document.body.append(cursor);
  const interactive = new Set();
  const motionProperties = ['--tilt-x','--tilt-y','--magnet-x','--magnet-y'];
  let frame = 0, x = 0, y = 0, nextX = 0, nextY = 0;
  const moveCursor = () => {
    x += (nextX - x) * .28;
    y += (nextY - y) * .28;
    cursor.style.transform = 'translate(' + x + 'px,' + y + 'px)';
    frame = Math.abs(nextX - x) + Math.abs(nextY - y) > .2 ? requestAnimationFrame(moveCursor) : 0;
  };
  const stopCursor = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    cursor?.classList.remove('is-on', 'is-expanded');
  };
  document.addEventListener('pointermove', event => {
    if (!cursor || !fine.matches || reduced.matches || event.pointerType !== 'mouse') return;
    nextX = event.clientX; nextY = event.clientY;
    if (!cursor.classList.contains('is-on')) { x = nextX; y = nextY; }
    cursor.classList.add('is-on');
    if (!frame) frame = requestAnimationFrame(moveCursor);
  }, { passive: true });
  document.addEventListener('pointerover', event => {
    if (!cursor || !fine.matches || reduced.matches || event.pointerType !== 'mouse') return;
    const field = event.target.closest('input, textarea, select, [contenteditable="true"]');
    cursor.classList.toggle('is-field', !!field);
    const target = event.target.closest('a, button');
    const label = target?.dataset.cursorLabel || (target?.classList.contains('case-image') ? 'VIEW' : target?.target === '_blank' ? 'OPEN' : '');
    cursor.classList.toggle('is-link', !!target && !label);
    cursor.classList.toggle('is-expanded', !!label);
    cursor.textContent = label;
  });
  document.addEventListener('pointerleave', stopCursor);
  addEventListener('blur', stopCursor);
  document.addEventListener('pointermove', event => {
      if (!fine.matches || reduced.matches || event.pointerType !== 'mouse') return;
      const element = event.target.closest('.project-shot, .case-image, .button');
      if (!element) return;
      interactive.add(element);
      const rect = element.getBoundingClientRect();
      const dx = (event.clientX - rect.left) / rect.width - .5;
      const dy = (event.clientY - rect.top) / rect.height - .5;
      if (element.matches('.project-shot, .case-image')) {
        element.style.setProperty('--tilt-x', -dy * 5 + 'deg');
        element.style.setProperty('--tilt-y', dx * 5 + 'deg');
      } else {
        element.style.setProperty('--magnet-x', dx * 10 + 'px');
        element.style.setProperty('--magnet-y', dy * 8 + 'px');
      }
  }, { passive: true });
  document.addEventListener('pointerout', event => {
    const element = event.target.closest('.project-shot, .case-image, .button');
    if (!element || (event.relatedTarget instanceof Node && element.contains(event.relatedTarget))) return;
    motionProperties.forEach(key => element.style.removeProperty(key));
    interactive.delete(element);
  });
  const resetInteractive = () => {
    stopCursor();
    interactive.forEach(element => motionProperties.forEach(key => element.style.removeProperty(key)));
    interactive.clear();
  };
  fine.addEventListener('change', resetInteractive);
  reduced.addEventListener('change', resetInteractive);
  reduced.addEventListener('change', () => {
    if (reduced.matches) document.getAnimations().forEach(animation => animation.cancel());
  });
  document.addEventListener('portfolio:filter', event => {
    event.target.querySelectorAll('.project-card').forEach(card => card.getAnimations().forEach(animation => animation.cancel()));
    const cards = [...event.target.querySelectorAll('.project-card:not([hidden])')];
    cards.forEach((card, index) => {
      card.classList.add('is-visible');
      if (!reduced.matches) card.animate(
        [{ opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'translateY(0)' }],
        { duration: 500, delay: Math.min(index, 4) * 55, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' }
      );
    });
  });
  document.addEventListener('focusin', event => {
    event.target.closest('[data-reveal]')?.classList.add('is-visible');
  });
  const navigation = document.querySelector('.nav-links');
  if (document.body.hasAttribute('data-home')) {
    const sections = [document.querySelector('.hero'), ...[...navigation.querySelectorAll('a[href^="#"]')].map(link => document.querySelector(link.getAttribute('href')))];
    const sectionObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        navigation.querySelectorAll('a').forEach(link => {
          if (link.getAttribute('href') === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      }
    }, { rootMargin: '-20% 0px -50% 0px' });
    sections.filter(Boolean).forEach(section => sectionObserver.observe(section));
  }
})();
