document.addEventListener('DOMContentLoaded', function() {
  const container = document.getElementById('blfFeed');
  if (!container) return;

  const PROXIES = [
    { url: 'https://api.codetabs.com/v1/proxy?quest=', json: false },
    { url: 'https://api.allorigins.win/get?url=', json: true }
  ];
  const TARGET = 'https://bonjourlafuite.eu.org/';

  var MONTHS = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];

  showSkeleton();

  function tryProxy(index) {
    if (index >= PROXIES.length) { showError(); return; }
    var proxy = PROXIES[index];
    fetch(proxy.url + encodeURIComponent(TARGET))
      .then(function(r) {
        if (!r.ok) throw new Error('status ' + r.status);
        return proxy.json ? r.json() : r.text();
      })
      .then(function(data) {
        var html = proxy.json ? data.contents : data;
        if (!html) throw new Error('empty');
        var parser = new DOMParser();
        var doc    = parser.parseFromString(html, 'text/html');
        var entries = parseLeaks(doc);
        if (!entries.length) throw new Error('no entries');
        displayLeaks(entries.slice(0, 8));
      })
      .catch(function() { tryProxy(index + 1); });
  }

  tryProxy(0);

  function formatDate(iso) {
    // "2026-03-31" → "31 mars 2026"
    var parts = iso.split('-');
    if (parts.length !== 3) return iso;
    return parseInt(parts[2]) + ' ' + MONTHS[parseInt(parts[1]) - 1] + ' ' + parts[0];
  }

  function parseLeaks(doc) {
    var entries = [];
    var h2s     = doc.querySelectorAll('h2');

    h2s.forEach(function(h2) {
      var text       = h2.textContent.trim();
      var emojiMatch = text.match(/^(🟢|🟠|🔴)/);
      if (!emojiMatch) return;

      var emoji = emojiMatch[1];
      var name  = text.replace(/[\u{1F7E2}\u{1F7E0}\u{1F534}]/u, '').trim();

      // Date from anchor id: "EntityName-YYYY-MM-DD"
      var date = '';
      var anchor = h2.querySelector('a[id]');
      if (anchor) {
        var idMatch = anchor.id.match(/(\d{4}-\d{2}-\d{2})$/);
        if (idMatch) date = formatDate(idMatch[1]);
      }

      // Optional sub-source from next h3
      var subSource = '';
      var next = h2.nextElementSibling;
      if (next && next.tagName === 'H3') {
        subSource = next.textContent.trim();
        next = next.nextElementSibling;
      }

      // Data items: inside <p><ul><li> or <ul><li> (skip source links)
      var dataItems = [];
      while (next) {
        if (next.tagName === 'H2') break;
        if (next.tagName === 'P') {
          var lis = Array.from(next.querySelectorAll('ul li'))
            .map(function(li) { return li.textContent.trim(); })
            .filter(function(t) { return t.length > 0; });
          if (lis.length) { dataItems = lis.slice(0, 4); break; }
        }
        if (next.tagName === 'UL') {
          // Skip source-link lists (contain <a> tags pointing to images/articles)
          var firstLi = next.querySelector('li');
          if (firstLi && !firstLi.querySelector('a[href]')) {
            dataItems = Array.from(next.querySelectorAll('li'))
              .map(function(li) { return li.textContent.trim(); })
              .filter(function(t) { return t.length > 0; })
              .slice(0, 4);
            break;
          }
        }
        next = next.nextElementSibling;
      }

      entries.push({ date: date, name: name, subSource: subSource, emoji: emoji, dataItems: dataItems });
    });

    return entries;
  }

  function showSkeleton() {
    container.innerHTML = '';
    for (var i = 0; i < 6; i++) {
      var sk = document.createElement('div');
      sk.className = 'blf-skeleton';
      sk.innerHTML =
        '<div class="blf-sk-line blf-sk-line--short"></div>' +
        '<div class="blf-sk-line"></div>' +
        '<div class="blf-sk-line blf-sk-line--medium"></div>';
      container.appendChild(sk);
    }
  }

  function showError() {
    container.innerHTML =
      '<p class="blf-error">Impossible de charger les données. ' +
      '<a href="https://bonjourlafuite.eu.org/" target="_blank" rel="noopener">Consulter Bonjour la Fuite directement</a></p>';
  }

  function getStatus(emoji) {
    if (emoji === '🟢') return { label: '🟢 Confirmée',    cls: 'blf-status--confirmed'  };
    if (emoji === '🟠') return { label: '🟠 Revendiquée',  cls: 'blf-status--claimed'    };
    return                     { label: '🔴 Non vérifiée', cls: 'blf-status--unverified' };
  }

  function displayLeaks(entries) {
    container.innerHTML = '';
    entries.forEach(function(entry) {
      var status  = getStatus(entry.emoji);
      var article = document.createElement('article');
      article.className = 'blf-item';

      var subHtml = entry.subSource
        ? '<span class="blf-subsource">via ' + entry.subSource + '</span>'
        : '';

      var dataHtml = entry.dataItems.length
        ? '<ul class="blf-data">' + entry.dataItems.map(function(d) { return '<li>' + d + '</li>'; }).join('') + '</ul>'
        : '';

      article.innerHTML =
        '<div class="blf-item-header">' +
          '<span class="blf-status ' + status.cls + '">' + status.label + '</span>' +
          '<span class="blf-date">' + entry.date + '</span>' +
        '</div>' +
        '<h4 class="blf-name">' + entry.name + '</h4>' +
        subHtml +
        dataHtml;

      container.appendChild(article);
    });
  }
});
