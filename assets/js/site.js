(() => {
  const { href, projectCard } = window.PORTFOLIO_UI;
  const data = window.PORTFOLIO_DATA;
  const components = window.WORKSPACE_COMPONENTS;
  const home = document.body.hasAttribute('data-home');
  const main = document.querySelector('main');
  const active = document.body.dataset.workspace || (home ? 'overview' : 'projects');
  if (components && main) {
    const shell = components.shell(home, active);
    const app = document.createElement('div');
    app.className = 'app-window';
    app.innerHTML = shell.top + '<div class="app-layout">' + shell.side + '</div>';
    main.before(app);
    app.querySelector('.app-layout').append(main);
    main.classList.add('workspace-main');
    document.querySelector('[data-header]')?.remove();
    document.querySelector('[data-footer]')?.remove();
    app.insertAdjacentHTML('beforeend', shell.bottom + shell.dialog);
    const label = components.nav.find(([id]) => id === active)?.[1] || active;
    document.querySelector('[data-current-view]').textContent = label;
  }

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
      projectGrid.dispatchEvent(new CustomEvent('portfolio:filter', { bubbles: true }));
    };
    filters.forEach(button => button.addEventListener('click', () => update(button)));
    if (filters.length) update(filters[0]);
  }

  const form = document.querySelector('#contact-form');
  if (form) form.querySelector('[type=submit]').disabled = false;
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
