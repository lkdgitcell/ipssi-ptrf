(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    const filterBar = document.querySelector('.projects-filter');
    if (!filterBar) return;

    const buttons = filterBar.querySelectorAll('.projects-filter-btn');
    const cards = document.querySelectorAll('#projets .card[data-epreuve]');
    if (!cards.length) return;

    function applyFilter(value) {
      cards.forEach(function (card) {
        const match = value === 'all' || card.dataset.epreuve === value;
        card.hidden = !match;
      });
    }

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        buttons.forEach(function (b) {
          b.classList.remove('is-active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');
        applyFilter(btn.dataset.filter);
      });
    });
  });
})();
