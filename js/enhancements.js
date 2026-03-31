document.addEventListener('DOMContentLoaded', function() {

  // ── TABS VEILLE (ARIA roving tabindex) ──
  const veilleTabBtns = document.querySelectorAll('.veille-tab');
  if (veilleTabBtns.length) {
    function activateTab(btn) {
      const panelId = btn.getAttribute('aria-controls');
      veilleTabBtns.forEach(function(b) {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
        b.setAttribute('tabindex', '-1');
      });
      document.querySelectorAll('.veille-panel').forEach(function(p) {
        p.hidden = true;
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      btn.setAttribute('tabindex', '0');
      btn.focus();
      const panel = document.getElementById(panelId);
      if (panel) panel.hidden = false;
    }

    veilleTabBtns.forEach(function(btn) {
      btn.setAttribute('tabindex', btn.classList.contains('active') ? '0' : '-1');
      btn.addEventListener('click', function() { activateTab(this); });
      btn.addEventListener('keydown', function(e) {
        const tabs = Array.from(veilleTabBtns);
        const current = tabs.indexOf(this);
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          activateTab(tabs[(current + 1) % tabs.length]);
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          activateTab(tabs[(current - 1 + tabs.length) % tabs.length]);
        } else if (e.key === 'Home') {
          e.preventDefault();
          activateTab(tabs[0]);
        } else if (e.key === 'End') {
          e.preventDefault();
          activateTab(tabs[tabs.length - 1]);
        }
      });
    });
  }

  // ── LAZY IMAGE FADE-IN (déclenché par l'attribut natif loading="lazy") ──
  // L'animation .fade-in est désormais gérée par CSS Scroll-Driven Animations.
  // On garde uniquement le .loaded pour les images lazy (transition opacity CSS).
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  lazyImages.forEach(function(img) {
    if (img.complete) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', function() { img.classList.add('loaded'); });
    }
  });

  // ── LIGHTBOX via <dialog> natif ──
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = lightbox ? lightbox.querySelector('.lightbox-image') : null;
  const lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;

  if (lightbox && lightboxImage && lightboxClose) {
    // .gallery-image est géré par projects.js sur les pages projet
    const certImages = document.querySelectorAll('.certification-image');

    certImages.forEach(function(img) {
      img.addEventListener('click', function() {
        lightboxImage.src = this.src;
        lightboxImage.alt = this.alt || 'Image agrandie';
        lightbox.showModal();
      });
    });

    lightboxClose.addEventListener('click', function() { lightbox.close(); });

    // Clic sur le backdrop ferme
    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) { lightbox.close(); }
    });

    // Escape natif géré par <dialog> — pas besoin de listener manuel
  }
});

