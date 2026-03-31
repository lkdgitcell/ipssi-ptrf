document.addEventListener('DOMContentLoaded', function() {
  // Keyboard navigation pour les cards onclick
  const cards = document.querySelectorAll('.card[role="link"]');
  cards.forEach(function(card) {
    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const onclickAttr = card.getAttribute('onclick');
        if (onclickAttr) {
          // Extract URL from onclick="window.location.href='...'"
          const match = onclickAttr.match(/href='([^']+)'/);
          if (match) window.location.href = match[1];
        }
      }
    });
  });

  // Smooth scroll hero CTA
  const heroCta = document.querySelector('.hero-cta');
  if (heroCta) {
    heroCta.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }
});
