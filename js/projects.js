// Projects page specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
  // Scroll to top button
  const scrollToTopBtn = document.getElementById('scrollToTop');

  if (scrollToTopBtn) {
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 300) {
        scrollToTopBtn.style.display = 'flex';
      } else {
        scrollToTopBtn.style.display = 'none';
      }
    });

    scrollToTopBtn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Scroll progress bar
  const scrollProgress = document.getElementById('scroll-progress');

  if (scrollProgress) {
    window.addEventListener('scroll', function() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      scrollProgress.style.width = scrollPercent + '%';
    });
  }

  // Burger menu toggle
  const burger = document.getElementById('burger');
  const navLinks = document.querySelector('.nav-links');

  if (burger && navLinks) {
    burger.addEventListener('click', function() {
      navLinks.classList.toggle('open');
      const expanded = burger.getAttribute('aria-expanded') === 'true' || false;
      burger.setAttribute('aria-expanded', !expanded);
    });
  }

  // Fade in animations
  const fadeElements = document.querySelectorAll('.fade-in');

  if (fadeElements.length > 0) {
    const fadeObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('appear');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    fadeElements.forEach(function(el) {
      fadeObserver.observe(el);
    });
  }

  // Gallery lightbox
  const galleryImages = document.querySelectorAll('.gallery-image');

  if (galleryImages.length > 0) {
    galleryImages.forEach(function(img, index) {
      img.addEventListener('click', function() {
        openLightbox(this.src, index, galleryImages);
      });
    });
  }

  function openLightbox(src, currentIndex, images) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.style.display = 'flex';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'lightbox-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.setAttribute('aria-label', 'Fermer');

    const image = document.createElement('img');
    image.className = 'lightbox-image';
    image.src = src;
    image.alt = 'Image agrandie';

    lightbox.appendChild(closeBtn);
    lightbox.appendChild(image);
    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', handleKeyPress);

    function closeLightbox() {
      lightbox.remove();
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyPress);
    }

    function handleKeyPress(e) {
      if (e.key === 'Escape') {
        closeLightbox();
      }
    }
  }
});
