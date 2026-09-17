(() => {
  const base = new URL('../..', document.currentScript.src).href.replace(/\/$/, '');
  const escape = value => String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
  const href = path => base + path;
  const icon = (name = 'arrow-up-right') =>
    '<img class="icon-arrow" src="' + href('/assets/icons/' + name + '.svg') + '" alt="" aria-hidden="true">';
  const tag = value => '<span class="tag">' + escape(value) + '</span>';
  const projectCard = (project, index) => {
    const p = project;
    const caseUrl = href('/work/' + p.slug + '/');
    return '<article class="project-card" data-filters="' + p.filters.join(' ') + '" data-reveal>' +
      '<a class="project-shot" href="' + caseUrl + '" data-cursor-label="VIEW" aria-label="View ' + escape(p.title) + ' case study">' +
      '<div class="project-preview-label"><span>' + (p.workflows ? 'Business system' : 'Website') + '</span><span>' + icon() + '</span></div>' +
      '<div class="browser"><div class="browser-bar"><span></span><span></span><span></span><small>' + escape(p.title) + '</small></div>' +
      '<img src="' + href('/' + p.image) + '" alt="' + escape(p.imageAlt || p.title + ' website screenshot') + '" loading="lazy" decoding="async"></div></a>' +
      '<div class="project-body"><div class="project-kicker"><span class="project-number">' + String(index + 1).padStart(2, '0') + '</span><span>' + escape(p.category) + '</span></div>' +
      '<h3><a href="' + caseUrl + '">' + escape(p.title) + '</a></h3><p>' + escape(p.description) + '</p>' +
      '<div class="project-summary"><div><span class="small-label">The challenge</span><p>' + escape(p.previewChallenge || p.challenge || 'Give the business a clearer, more useful online presence.') + '</p></div>' +
      '<div><span class="small-label">The approach</span><p>' + escape(p.previewSolution || p.solution || p.value) + '</p></div></div>' +
      '<div class="tags">' + p.tech.slice(0, 5).map(tag).join('') + '</div><div class="card-links"><a class="text-link" href="' + caseUrl + '">View Case Study ' + icon('arrow-right') + '</a>' +
      (p.url ? '<a class="text-link" href="' + escape(p.url) + '" target="_blank" rel="noopener">Live Website ' + icon() + '</a>' : '') + '</div></div></article>';
  };
  window.PORTFOLIO_UI = { base, escape, href, icon, tag, projectCard };
})();
