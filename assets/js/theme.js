(() => {
  const apply = () => {
    document.documentElement.dataset.theme = 'dark';
    document.documentElement.style.colorScheme = 'dark';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#050505');
  };
  document.addEventListener('DOMContentLoaded', apply, { once: true });
  apply();
})();
