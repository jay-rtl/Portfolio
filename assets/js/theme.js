(() => {
  const key = 'francis-workspace-theme';
  const system = matchMedia('(prefers-color-scheme: dark)');
  let preference;
  try { preference = localStorage.getItem(key); } catch { /* Storage can be unavailable. */ }
  const valid = value => value === 'light' || value === 'dark';
  const apply = () => {
    const theme = valid(preference) ? preference : system.matches ? 'dark' : 'light';
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#f3f5f9' : '#090c12');
    dispatchEvent(new CustomEvent('portfolio:theme', { detail: theme }));
  };
  window.PORTFOLIO_THEME = {
    toggle() {
      preference = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(key, preference); } catch { /* Keep this session usable without storage. */ }
      apply();
    }
  };
  system.addEventListener('change', () => { if (!valid(preference)) apply(); });
  addEventListener('storage', event => { if (event.key === key || event.key === null) { preference = event.newValue; apply(); } });
  document.addEventListener('DOMContentLoaded', apply, { once: true });
  apply();
})();
