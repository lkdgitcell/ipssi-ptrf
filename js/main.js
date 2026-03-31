document.addEventListener('DOMContentLoaded', function() {
  // ── BURGER MENU ──
  const burger = document.getElementById('burger');
  const navLinks = document.querySelector('.nav-links');

  if (burger) {
    burger.addEventListener('click', function() {
      navLinks.classList.toggle('open');
      const expanded = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!expanded));
    });
  }

  // ── NAV PILL INDICATOR ──
  const navLinksContainer = document.querySelector('.nav-links');
  let navPill = null;
  if (navLinksContainer) {
    navPill = document.createElement('div');
    navPill.className = 'nav-pill';
    navLinksContainer.insertBefore(navPill, navLinksContainer.firstChild);
  }

  function updateNavPill(activeLink) {
    if (!navPill || !navLinksContainer || !activeLink) return;
    const containerRect = navLinksContainer.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();
    navPill.style.left = (linkRect.left - containerRect.left - 8) + 'px';
    navPill.style.width = (linkRect.width + 16) + 'px';
    navLinksContainer.classList.add('pill-ready');
  }

  // ── SECTION ACTIVE TRACKING (scroll-driven sans calcul progress) ──
  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('.nav-link');

  let scrollTicking = false;
  window.addEventListener('scroll', function() {
    if (!scrollTicking) {
      requestAnimationFrame(function() {
        const scrollTop = window.scrollY;
        let current = '';
        sections.forEach(function(section) {
          if (scrollTop >= (section.offsetTop - 200)) {
            current = section.getAttribute('id');
          }
        });

        navLinksAll.forEach(function(link) {
          link.classList.remove('active');
          link.removeAttribute('aria-current');
          if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'true');
            updateNavPill(link);
          }
        });

        scrollTicking = false;
      });
      scrollTicking = true;
    }
  });

  // Initialiser la pill au chargement
  const initialActive = document.querySelector('.nav-link.active');
  if (initialActive) {
    setTimeout(function() { updateNavPill(initialActive); }, 100);
  }

  // ── SCROLL TO TOP (click handler — visibilité gérée par CSS SDA) ──
  const scrollToTopBtn = document.getElementById('scrollToTop');
  if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ── ANIMATED COUNTERS (IntersectionObserver) ──
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  if (statNumbers.length) {
    const counterObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const duration = 1200;
        const start = performance.now();
        function update(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target);
          if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
        counterObserver.unobserve(el);
      });
    }, { threshold: 0.5 });
    statNumbers.forEach(function(el) { counterObserver.observe(el); });
  }

  // ── RIPPLE EFFECT ──
  const rippleButtons = document.querySelectorAll('.ripple');
  rippleButtons.forEach(function(button) {
    button.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      ripple.classList.add('ripple-wave');

      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';

      this.appendChild(ripple);
      setTimeout(function() { ripple.remove(); }, 600);
    });
  });
});
