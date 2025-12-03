// RSS Feed loader for cybersecurity news

document.addEventListener('DOMContentLoaded', function() {
  const rssFeed = document.getElementById('rssFeed');

  if (rssFeed) {
    loadRSSFeeds();
  }

  function loadRSSFeeds() {
    // Note: Due to CORS restrictions, you might need to use a proxy service
    // or implement this on the server-side to fetch RSS feeds

    // For demonstration, we'll show static placeholder content
    // In production, you would fetch from RSS feeds using a CORS proxy

    const feeds = [
      {
        source: 'ANSSI',
        title: 'Nouvelles recommandations de sécurité',
        description: 'L\'ANSSI publie de nouvelles recommandations pour la sécurisation des systèmes d\'information.',
        date: 'Il y a 2 jours',
        link: 'https://www.ssi.gouv.fr/'
      },
      {
        source: 'CERT-FR',
        title: 'Alerte de sécurité critique',
        description: 'Vulnérabilité critique détectée dans plusieurs systèmes d\'exploitation.',
        date: 'Il y a 3 jours',
        link: 'https://www.cert.ssi.gouv.fr/'
      },
      {
        source: 'CNIL',
        title: 'Mise à jour RGPD',
        description: 'Nouvelles directives concernant la protection des données personnelles.',
        date: 'Il y a 5 jours',
        link: 'https://www.cnil.fr/'
      }
    ];

    displayFeeds(feeds);
  }

  function displayFeeds(feeds) {
    rssFeed.innerHTML = '';

    feeds.forEach(function(item) {
      const feedItem = createFeedItem(item);
      rssFeed.appendChild(feedItem);
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

    const date = document.createElement('span');
    date.className = 'rss-item-date';
    date.textContent = item.date;

    article.appendChild(source);
    article.appendChild(link);
    article.appendChild(description);
    article.appendChild(date);

    return article;
  }
});
