// ── THEME TOGGLE (dark / light) ──
// Appliqué immédiatement (avant DOMContentLoaded) pour éviter le flash
(function() {
  var saved = localStorage.getItem('theme');
  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  var initial = saved || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', initial);
})();

document.addEventListener('DOMContentLoaded', function() {
  var btn = document.getElementById('themeToggle');
  if (!btn) return;

  // Sync icône avec le thème déjà appliqué
  var current = document.documentElement.getAttribute('data-theme') || 'light';
  syncBtn(btn, current);

  btn.addEventListener('click', function() {
    var now = document.documentElement.getAttribute('data-theme') || 'light';
    applyTheme(now === 'dark' ? 'light' : 'dark');
  });

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    syncBtn(btn, theme);
  }

  function syncBtn(button, theme) {
    var use = button.querySelector('use');
    if (use) use.setAttribute('href', theme === 'dark' ? '#icon-sun' : '#icon-moon');
    button.setAttribute('aria-label', theme === 'dark' ? 'Activer le mode clair' : 'Activer le mode sombre');
  }
});
