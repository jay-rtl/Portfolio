(() => {
  const { href, escape, icon, tag } = window.PORTFOLIO_UI;
  const projects = window.PORTFOLIO_DATA.projects;
  const project = projects.find(item => item.slug === document.body.dataset.case);
  const main = document.querySelector('main[data-case]');
  if (!project || !main) return;
  const p = project;
  const number = String(projects.indexOf(p) + 1).padStart(2,'0');
  const overview = p.intro || p.description;
  const challenge = p.challenge || p.previewChallenge ||
    'Present the business clearly, build trust, and give mobile and desktop visitors a straightforward path to the right information or enquiry.';
  const solution = p.solution || p.previewSolution ||
    'I built a responsive, business-focused experience using the technologies listed for this project, with clear content hierarchy and practical calls to action.';
  const narrative = (label, heading, text) =>
    '<section class="case-section"><div class="wrap case-narrative"><span class="eyebrow">' + label +
    '</span><div><h2>' + escape(heading) + '</h2><p>' + escape(text) + '</p></div></div></section>';
  const live = p.url ? '<a class="button button-primary" href="' + escape(p.url) + '" target="_blank" rel="noopener">View Live Website ' + icon() + '</a>' : '';
  main.innerHTML =
    '<section class="page-hero"><div class="wrap"><a class="text-link case-back" href="' + href('/work/') + '">All projects ' + icon('arrow-right') +
    '</a><span class="eyebrow">Project ' + number + ' / ' + escape(p.projectType || p.category) + '</span><h1>' + escape(p.title) + '</h1>' +
    '<p class="lead">' + escape(p.subtitle || p.description) + '</p><div class="actions">' + live +
    '<a class="' + (p.url ? 'text-link' : 'button button-primary') + '" href="' + href('/contact/') + '">Discuss a similar project ' + icon() + '</a></div>' +
    '<dl class="case-facts"><div><dt>Role</dt><dd>' + escape(p.role || (p.workflows ? 'Custom WordPress development' : 'Website development')) +
    '</dd></div><div><dt>Category</dt><dd>' + escape(p.category) + '</dd></div><div><dt>Technology</dt><dd>' + p.tech.slice(0,4).map(escape).join(' / ') +
    '</dd></div>' + (p.year ? '<div><dt>Year</dt><dd>' + escape(p.year) + '</dd></div>' : '') + '</dl></div></section>' +
    '<section class="case-image-section"><div class="wrap"><a class="case-image" href="' + href('/' + p.image) +
    '" target="_blank" rel="noopener" aria-label="Open full ' + escape(p.title) + ' screenshot"><div class="browser"><div class="browser-bar"><span></span><span></span><span></span><small>' +
    escape(p.title) + '</small></div><img src="' + href('/' + p.image) + '" alt="' + escape(p.imageAlt || p.title + ' website screenshot') +
    '" decoding="async"></div></a></div></section>' +
    narrative('01 / Overview', 'Built around a business need.', overview) +
    narrative('02 / The challenge', 'What needed to work better.', challenge) +
    narrative('03 / The solution', 'A considered approach.', solution) +
    (p.workflows ? '<section class="case-section band"><div class="wrap"><div class="section-head"><div><span class="eyebrow">04 / System workflow</span><h2>One connected process.</h2></div></div>' +
      p.workflows.map(flow => '<div class="workflow-block"><h3>' + escape(flow.title) + '</h3><ol class="workflow">' +
        flow.steps.map((step,index) => '<li><span>' + String(index + 1).padStart(2,'0') + '</span>' + escape(step) + '</li>').join('') + '</ol></div>').join('') + '</div></section>' : '') +
    '<section class="case-section"><div class="wrap"><div class="section-head"><div><span class="eyebrow">Key features</span><h2>Useful in practice.</h2></div></div>' +
    (p.featureDetails ? '<div class="case-features">' + p.featureDetails.map((feature,index) => '<article><span class="small-label">' + String(index + 1).padStart(2,'0') +
      '</span><h3>' + escape(feature.title) + '</h3><p>' + escape(feature.text) + '</p></article>').join('') + '</div>' :
      '<ul class="case-feature-list">' + p.features.map(feature => '<li>' + escape(feature) + '</li>').join('') + '</ul>') + '</div></section>' +
    narrative('Technical implementation', p.technicalTitle || 'The tools behind the experience.',
      p.technical || 'This project combines ' + p.tech.join(', ') + ' with a responsive content structure and a customer-focused interface. The implementation supports the features listed above and the website experience shown in the preview.') +
    '<section class="case-section band"><div class="wrap case-narrative"><span class="eyebrow">Outcome</span><div><h2>' + escape(p.value) +
    '</h2><div class="facts">' + p.tech.map(tag).join('') + '</div></div></div></section>' +
    '<section><div class="wrap cta"><span class="eyebrow">Your next project</span><h2>Let&rsquo;s build something useful.</h2><p>Start with the problem. Shape the website and the system around it.</p><a class="button button-primary" href="' +
    href('/contact/') + '">Start a Project ' + icon() + '</a></div></section>' +
    '<div class="wrap case-next"><span class="small-label">Next project</span><a class="text-link" href="' +
    href('/work/' + projects[(projects.indexOf(p) + 1) % projects.length].slug + '/') + '">' +
    escape(projects[(projects.indexOf(p) + 1) % projects.length].title) + ' ' + icon() + '</a></div>';
})();
