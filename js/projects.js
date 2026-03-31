document.addEventListener('DOMContentLoaded', function() {

  // ── SCROLL TO TOP (click handler — visibilité gérée par CSS SDA) ──
  const scrollToTopBtn = document.getElementById('scrollToTop');
  if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ── BURGER MENU ──
  const burger = document.getElementById('burger');
  const navLinks = document.querySelector('.nav-links');
  if (burger && navLinks) {
    burger.addEventListener('click', function() {
      navLinks.classList.toggle('open');
      const expanded = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!expanded));
    });
  }

  // ── LIGHTBOX GALERIE via <dialog> natif ──
  const galleryImages = document.querySelectorAll('.gallery-image');
  if (galleryImages.length === 0) return;

  // Créer le dialog une seule fois dans le DOM
  const lightbox = document.createElement('dialog');
  lightbox.id = 'lightbox';
  lightbox.setAttribute('aria-label', 'Image agrandie');

  const closeBtn = document.createElement('button');
  closeBtn.className = 'lightbox-close';
  closeBtn.innerHTML = '&times;';
  closeBtn.setAttribute('aria-label', 'Fermer');

  const lightboxImage = document.createElement('img');
  lightboxImage.className = 'lightbox-image';
  lightboxImage.alt = 'Image agrandie';

  lightbox.appendChild(closeBtn);
  lightbox.appendChild(lightboxImage);
  document.body.appendChild(lightbox);

  galleryImages.forEach(function(img) {
    img.addEventListener('click', function() {
      lightboxImage.src = this.src;
      lightboxImage.alt = this.alt || 'Image agrandie';
      lightbox.showModal();
    });
  });

  closeBtn.addEventListener('click', function() { lightbox.close(); });

  // Clic backdrop ferme
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) { lightbox.close(); }
  });

  // Escape géré nativement par <dialog>
});
