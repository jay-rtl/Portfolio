(() => {
  const { href, icon, projectCard } = window.PORTFOLIO_UI;
  const data = window.PORTFOLIO_DATA;
  const home = document.body.hasAttribute('data-home');
  const nav = home
    ? [['Work', '#selected-work'], ['Expertise', '#expertise'], ['About', '#about'], ['Contact', '#contact']]
    : [['Work', '/work/'], ['Expertise', '/services/'], ['Systems', '/systems/'], ['About', '/about/'], ['Contact', '/contact/']];
  const navHref = path => path.startsWith('#') ? path : href(path);
  const brand = '<span class="brand-wordmark">Francis Jay D. Rotol<span class="brand-period">.</span></span>';
  const header = document.querySelector('[data-header]');
  if (header) {
    header.outerHTML = '<header class="site-header"><div class="wrap nav">' +
      '<a class="brand" href="' + href('/') + '" aria-label="Francis Jay D. Rotol home">' + brand + '<small>Websites &amp; systems</small></a>' +
      '<button class="menu-button" type="button" aria-expanded="false" aria-controls="main-nav" aria-label="Open navigation"><span class="menu-lines" aria-hidden="true"><i></i><i></i></span></button>' +
      '<nav class="nav-links" id="main-nav" aria-label="Main navigation">' +
      nav.map(([label, path]) => '<a href="' + navHref(path) + '"' +
        (!home && location.pathname.includes(path) ? ' aria-current="page"' : '') + '>' + label + '</a>').join('') +
      '<span class="availability nav-availability"><span class="dot"></span>Available for projects</span></nav></div></header>';
  }
  const footer = document.querySelector('[data-footer]');
  if (footer) {
    footer.outerHTML = '<footer class="site-footer"><div class="wrap"><div class="footer-grid">' +
      '<div class="footer-intro"><a class="brand" href="' + href('/') + '">' + brand + '</a><p>Thoughtful websites. Practical systems.<br>Built around your business.</p><span class="availability"><span class="dot"></span>Philippines / Available worldwide</span></div>' +
      '<div><h2 class="footer-title">Explore</h2><div class="footer-list">' +
      [['Home', '/'], ['Work', '/work/'], ['About', '/about/'], ['Resume', '/resume/']].map(([label, path]) => '<a href="' + href(path) + '">' + label + '</a>').join('') + '</div></div>' +
      '<div><h2 class="footer-title">Working together</h2><div class="footer-list">' +
      [['Services', '/services/'], ['Business systems', '/systems/'], ['Pricing', '/pricing/'], ['Start a project', '/contact/']].map(([label, path]) => '<a href="' + href(path) + '">' + label + '</a>').join('') + '</div></div>' +
      '<div><h2 class="footer-title">Say hello</h2><div class="footer-list"><a href="mailto:rotoljay03@gmail.com">rotoljay03@gmail.com</a><a href="tel:+639615939457">+63 961 593 9457</a><span>Remote projects &amp; opportunities</span></div></div></div>' +
      '<div class="footer-bottom"><span>&copy; ' + new Date().getFullYear() + ' Francis Jay D. Rotol</span><span>Development / Systems / IT</span><a class="text-link" href="#main">Back to top ' + icon('arrow-up-right') + '</a></div></div></footer>';
  }

  const menu = document.querySelector('.menu-button');
  const links = document.querySelector('.nav-links');
  const mobile = matchMedia('(max-width: 800px)');
  const closeMenu = (restoreFocus = false) => {
    links?.classList.remove('open');
    menu?.setAttribute('aria-expanded', 'false');
    menu?.setAttribute('aria-label', 'Open navigation');
    document.body.classList.remove('menu-open');
    if (restoreFocus) menu?.focus();
  };
  menu?.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    if (!open) return closeMenu(true);
    links.classList.add('open');
    menu.setAttribute('aria-expanded', 'true');
    menu.setAttribute('aria-label', 'Close navigation');
    document.body.classList.add('menu-open');
    links.querySelector('a')?.focus();
  });
  links?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
  mobile.addEventListener('change', () => closeMenu());
  addEventListener('keydown', event => {
    if (menu?.getAttribute('aria-expanded') !== 'true') return;
    if (event.key === 'Escape') closeMenu(true);
    if (event.key === 'Tab') {
      const focusable = [menu, ...links.querySelectorAll('a')];
      const first = focusable[0], last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  const stickyHeader = document.querySelector('.site-header');
  let scrollQueued = false;
  const updateHeader = () => {
    stickyHeader?.classList.toggle('scrolled', scrollY > 32);
    scrollQueued = false;
  };
  addEventListener('scroll', () => {
    if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(updateHeader); }
  }, { passive: true });
  updateHeader();

  document.querySelectorAll('[data-projects]').forEach(grid => {
    const projects = grid.dataset.projects === 'featured' ? data.projects.slice(0,4) : data.projects;
    grid.innerHTML = projects.map(projectCard).join('');
  });
  const filters = [...document.querySelectorAll('.filter')];
  const projectGrid = document.querySelector('[data-projects="all"]');
  if (projectGrid) {
    const status = document.createElement('p');
    status.className = 'filter-status';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    projectGrid.before(status);
    const update = filter => {
      filters.forEach(button => {
        const active = button === filter;
        button.classList.toggle('active', active);
        button.setAttribute('aria-pressed', String(active));
      });
      let count = 0;
      projectGrid.querySelectorAll('[data-filters]').forEach(card => {
        card.hidden = filter.dataset.filter !== 'all' && !card.dataset.filters.split(' ').includes(filter.dataset.filter);
        if (!card.hidden) count++;
      });
      status.textContent = count + ' ' + (count === 1 ? 'project' : 'projects');
    };
    filters.forEach(button => button.addEventListener('click', () => update(button)));
    if (filters.length) update(filters[0]);
  }

  const form = document.querySelector('#contact-form');
  form?.addEventListener('submit', event => {
    event.preventDefault();
    const status = form.querySelector('.form-status');
    if (!form.checkValidity()) {
      form.reportValidity();
      status.className = 'form-status is-error';
      status.textContent = 'Please complete the required fields.';
      return;
    }
    if (form.elements.website.value) return;
    const values = new FormData(form);
    const subject = 'Portfolio inquiry: ' + values.get('projectType') + ' from ' + values.get('name');
    const body = 'Hello Jay,\n\nI would like to discuss a project.\n\nName: ' + values.get('name') +
      '\nEmail: ' + values.get('email') + '\nBusiness / Company: ' + (values.get('company') || 'Not provided') +
      '\nProject Type: ' + values.get('projectType') + '\nEstimated Budget: ' + values.get('budget') +
      '\n\nProject Details:\n' + values.get('details') + '\n\nRegards,\n' + values.get('name');
    status.className = 'form-status is-success';
    status.textContent = 'Opening Gmail with your project details...';
    location.href = 'https://mail.google.com/mail/?view=cm&fs=1&to=rotoljay03@gmail.com&su=' +
      encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  });
})();
