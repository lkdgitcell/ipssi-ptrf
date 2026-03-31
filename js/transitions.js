// View Transitions API for multi-page navigation
(function() {
  'use strict';

  // Only activate if View Transitions API is supported
  if (!document.startViewTransition) return;

  // Intercept all internal page navigation links (links to .html files)
  document.addEventListener('click', function(e) {
    const link = e.target.closest('a[href]');
    if (!link) return;

    const href = link.getAttribute('href');
    // Only handle relative .html links or root-relative links, not anchors or external
    if (!href) return;
    if (href.startsWith('#')) return;
    if (href.startsWith('http') || href.startsWith('//')) return;
    if (href.startsWith('mailto:') || href.startsWith('tel:')) return;

    // Check it's an HTML page link
    const isHtmlPage = href.endsWith('.html') || href === '/' || href === './';
    if (!isHtmlPage) return;

    e.preventDefault();

    document.startViewTransition(function() {
      window.location.href = href;
    });
  });
})();
