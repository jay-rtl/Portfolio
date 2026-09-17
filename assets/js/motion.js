(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const targets = [...document.querySelectorAll('[data-reveal], .workflow-experience')];
  let observer;
  const reset = () => {
    observer?.disconnect();
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
