document.addEventListener('DOMContentLoaded', function() {

  // ── TABLE OF CONTENTS ──────────────────────────────────────────────
  (function() {
    const projectMain = document.querySelector('.project-main');
    const sidebar = document.querySelector('.project-sidebar');
    if (!projectMain || !sidebar) return;

    const sections = projectMain.querySelectorAll('.content-section');
    const items = [];

    sections.forEach(function(section, i) {
      const h2 = section.querySelector('h2.section-title');
      if (!h2) return;

      // Générer un ID depuis le texte du titre
      const raw = h2.textContent.trim()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // retire accents
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .slice(0, 32);
      const id = 's-' + (i + 1) + '-' + raw;
      section.id = id;
      items.push({ id, text: h2.textContent.trim() });
    });

    if (items.length < 3) return;

    // Créer le bloc TOC
    const tocSection = document.createElement('div');
    tocSection.className = 'sidebar-section';

    const tocTitle = document.createElement('h3');
    tocTitle.className = 'sidebar-title';
    tocTitle.textContent = 'Sommaire';

    const tocNav = document.createElement('nav');
    tocNav.className = 'toc-list';
    tocNav.setAttribute('aria-label', 'Sommaire de la page');

    items.forEach(function(item) {
      const a = document.createElement('a');
      a.href = '#' + item.id;
      a.className = 'toc-link';
      a.textContent = item.text;
      a.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.getElementById(item.id);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      tocNav.appendChild(a);
    });

    tocSection.appendChild(tocTitle);
    tocSection.appendChild(tocNav);
    sidebar.insertBefore(tocSection, sidebar.firstChild);

    // Suivi de section active via IntersectionObserver
    const tocLinks = tocNav.querySelectorAll('.toc-link');

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (!entry.isIntersecting) return;
        const activeId = entry.target.id;
        tocLinks.forEach(function(link) {
          link.classList.toggle(
            'toc-link--active',
            link.getAttribute('href') === '#' + activeId
          );
        });
      });
    }, {
      rootMargin: '-80px 0px -55% 0px',
      threshold: 0
    });

    sections.forEach(function(section) {
      if (section.id) observer.observe(section);
    });
  })();

  // ── STATUS INDICATORS ──────────────────────────────────────────────
  (function() {
    const candidates = document.querySelectorAll(
      '.sidebar-section .info-label, .sidebar-section .info-value'
    );
    candidates.forEach(function(el) {
      const text = el.textContent;
      if (/op[eé]rationnel/i.test(text)) {
        el.classList.add('status-operational');
      } else if (/en cours/i.test(text)) {
        el.classList.add('status-progress');
      } else if (/[àa]\s+venir|planifi[eé]|pr[eé]vu/i.test(text)) {
        el.classList.add('status-planned');
      }
    });
  })();

  // ── PROJECT COUNTER IN NAVIGATION ─────────────────────────────────
  (function() {
    const order = [
      'apyka.html',
      'scc.html',
      'opnsense.html',
      'proxmox-backup.html',
      'truenas.html',
      'infra-perso.html',
      'gsb.html',
      'bibli.html'
    ];

    const filename = window.location.pathname.split('/').pop() || '';
    const current = order.indexOf(filename) + 1;
    const total = order.length;
    if (current === 0) return;

    const nav = document.querySelector('.project-navigation');
    if (!nav) return;

    const counter = document.createElement('div');
    counter.className = 'nav-project-counter';
    counter.innerHTML = '<span>' + current + '</span> / ' + total;
    counter.setAttribute('aria-label', 'Projet ' + current + ' sur ' + total);
    nav.insertBefore(counter, nav.children[1] || null);
  })();

});
