document.addEventListener('DOMContentLoaded', function() {
  const rssFeed = document.getElementById('rssFeed');
  if (!rssFeed) return;

  const PROXY = 'https://api.rss2json.com/v1/api.json?rss_url=';
  const FEEDS = [
    { url: 'https://www.cert.ssi.gouv.fr/feed/', source: 'CERT-FR' },
    { url: 'https://www.ssi.gouv.fr/actualite/feed/', source: 'ANSSI' },
    { url: 'https://www.cnil.fr/fr/rss.xml', source: 'CNIL' }
  ];

  showSkeleton();

  Promise.allSettled(
    FEEDS.map(function(feed) {
      return fetch(PROXY + encodeURIComponent(feed.url))
        .then(function(r) { return r.json(); })
        .then(function(data) {
          if (!data.items || !data.items.length) throw new Error('empty');
          return data.items.slice(0, 3).map(function(item) {
            return {
              source: feed.source,
              title: item.title,
              description: stripHtml(item.description || item.content || '').slice(0, 160),
              date: timeAgo(item.pubDate),
              _ts: item.pubDate ? new Date(item.pubDate).getTime() : 0,
              link: item.link,
              category: detectCategory(item.title + ' ' + (item.description || ''))
            };
          });
        });
    })
  ).then(function(results) {
    const articles = [];
    results.forEach(function(r) {
      if (r.status === 'fulfilled') {
        r.value.forEach(function(a) { articles.push(a); });
      }
    });

    if (!articles.length) {
      showError();
      return;
    }

    // Sort by recency (most recent first), show 6
    articles.sort(function(a, b) { return a._ts > b._ts ? -1 : 1; });
    displayFeeds(articles.slice(0, 6));
  });

  function showSkeleton() {
    rssFeed.innerHTML = '';
    for (let i = 0; i < 6; i++) {
      const sk = document.createElement('div');
      sk.className = 'rss-skeleton';
      sk.innerHTML = '<div class="rss-sk-line rss-sk-line--short"></div>' +
        '<div class="rss-sk-line"></div>' +
        '<div class="rss-sk-line rss-sk-line--medium"></div>';
      rssFeed.appendChild(sk);
    }
  }

  function showError() {
    rssFeed.innerHTML = '<p class="rss-error">Impossible de charger les flux. ' +
      '<a href="https://www.cert.ssi.gouv.fr/" target="_blank" rel="noopener noreferrer">Consulter CERT-FR directement</a></p>';
  }

  function displayFeeds(feeds) {
    rssFeed.innerHTML = '';
    feeds.forEach(function(item) {
      rssFeed.appendChild(createFeedItem(item));
    });
  }

  function createFeedItem(item) {
    const article = document.createElement('article');
    article.className = 'rss-item';

    const source = document.createElement('span');
    source.className = 'rss-item-source';
    source.textContent = item.source;

    const link = document.createElement('a');
    link.href = item.link;
    link.className = 'rss-item-link';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';

    const title = document.createElement('h4');
    title.className = 'rss-item-title';
    title.textContent = item.title;
    link.appendChild(title);

    const description = document.createElement('p');
    description.className = 'rss-item-description';
    description.textContent = item.description;

    const metaInfo = document.createElement('div');
    metaInfo.className = 'rss-item-meta';

    const date = document.createElement('span');
    date.className = 'rss-item-date';
    date.textContent = item.date;

    const categoryColors = getCategoryColor(item.category);
    const category = document.createElement('span');
    category.className = 'rss-item-category';
    category.style.background = categoryColors.bg;
    category.style.color = categoryColors.text;
    category.textContent = item.category;

    metaInfo.appendChild(date);
    metaInfo.appendChild(category);

    article.appendChild(source);
    article.appendChild(link);
    article.appendChild(description);
    article.appendChild(metaInfo);

    return article;
  }

  function stripHtml(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }

  function timeAgo(dateStr) {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return 'Il y a ' + mins + ' min';
    const hours = Math.floor(mins / 60);
    if (hours < 24) return 'Il y a ' + hours + 'h';
    const days = Math.floor(hours / 24);
    if (days < 7) return 'Il y a ' + days + ' jour' + (days > 1 ? 's' : '');
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return 'Il y a ' + weeks + ' semaine' + (weeks > 1 ? 's' : '');
    return 'Il y a ' + Math.floor(days / 30) + ' mois';
  }

  function detectCategory(text) {
    const t = text.toLowerCase();
    if (/critical|critique|0day|zero.day/.test(t)) return 'Alerte Critique';
    if (/breach|pwned|fuite|leak|data.*exposed|exposed.*data|compromis/.test(t)) return 'Fuite de données';
    if (/post.quant|quantum|kyber|dilithium|sphincs|hqc|pqc|lattice/.test(t)) return 'Post-Quantique';
    if (/privacy|vie priv|surveillance|tracking|fingerprint|anonymi|pseudonymi/.test(t)) return 'Vie Privée';
    if (/vuln|cve|patch|faille/.test(t)) return 'Vulnérabilité';
    if (/ransomware|malware|botnet|phish|apt/.test(t)) return 'Menace';
    if (/rgpd|gdpr|lgpd|nis2|eidas|compliance|cnil|réglementation/.test(t)) return 'Réglementation';
    if (/recommandation|guide|bonnes pratiques|hygièn/.test(t)) return 'Recommandations';
    if (/rapport|bilan|analyse|study/.test(t)) return 'Rapport';
    if (/crypto|chiffr|tls|pki|certificat|encrypt/.test(t)) return 'Cryptographie';
    if (/arrest|saisi|démantèl|interpel/.test(t)) return 'Cybercrime';
    return 'Actualité';
  }

  function getCategoryColor(category) {
    const root = document.documentElement;
    const style = getComputedStyle(root);
    const map = {
      'Alerte Critique':    ['--rss-alerte-bg',         '--rss-alerte-text'],
      'Fuite de données':   ['--rss-fuite-bg',          '--rss-fuite-text'],
      'Post-Quantique':     ['--rss-postquantique-bg',  '--rss-postquantique-text'],
      'Vie Privée':         ['--rss-vieprivee-bg',      '--rss-vieprivee-text'],
      'Vulnérabilité':      ['--rss-vulnerabilite-bg',  '--rss-vulnerabilite-text'],
      'Menace':             ['--rss-menace-bg',          '--rss-menace-text'],
      'Recommandations':    ['--rss-recommandations-bg', '--rss-recommandations-text'],
      'Réglementation':     ['--rss-reglementation-bg',  '--rss-reglementation-text'],
      'Rapport':            ['--rss-rapport-bg',         '--rss-rapport-text'],
      'Cybercrime':         ['--rss-cybercrime-bg',      '--rss-cybercrime-text'],
      'Cryptographie':      ['--rss-cryptographie-bg',   '--rss-cryptographie-text']
    };
    const vars = map[category] || ['--rss-default-bg', '--rss-default-text'];
    return {
      bg:   style.getPropertyValue(vars[0]).trim(),
      text: style.getPropertyValue(vars[1]).trim()
    };
  }
});
