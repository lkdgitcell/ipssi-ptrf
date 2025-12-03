// RSS Feed loader for cybersecurity news

document.addEventListener('DOMContentLoaded', function() {
  const rssFeed = document.getElementById('rssFeed');

  if (rssFeed) {
    loadRSSFeeds();
  }

  function loadRSSFeeds() {
    // Note: Due to CORS restrictions, RSS feeds cannot be fetched directly from client-side
    // In production, you would need:
    // 1. A CORS proxy service (e.g., cors-anywhere, allorigins.win)
    // 2. Server-side RSS aggregation
    // 3. Use RSS-to-JSON APIs

    // For demonstration, displaying curated cybersecurity news
    // These would normally come from live RSS feeds

    const feeds = [
      {
        source: 'ANSSI',
        title: 'Publication du guide d\'hygiène informatique 2025',
        description: 'L\'ANSSI met à jour son guide de bonnes pratiques en cybersécurité avec les dernières recommandations pour sécuriser les systèmes d\'information face aux menaces actuelles.',
        date: 'Il y a 1 jour',
        link: 'https://www.ssi.gouv.fr/',
        category: 'Recommandations'
      },
      {
        source: 'CERT-FR',
        title: 'Vulnérabilité critique CVE-2025-0001 dans Windows',
        description: 'Une faille de sécurité critique permettant l\'exécution de code à distance a été découverte dans Windows Server. Mise à jour urgente recommandée.',
        date: 'Il y a 2 jours',
        link: 'https://www.cert.ssi.gouv.fr/',
        category: 'Alerte Critique'
      },
      {
        source: 'CNIL',
        title: 'Nouvelles sanctions RGPD : 50M€ d\'amende',
        description: 'La CNIL sanctionne une entreprise pour non-respect du RGPD concernant la collecte et le traitement des données personnelles sans consentement explicite.',
        date: 'Il y a 3 jours',
        link: 'https://www.cnil.fr/',
        category: 'Réglementation'
      },
      {
        source: 'The Hacker News',
        title: 'Nouvelle campagne de ransomware BlackCat 2.0',
        description: 'Les chercheurs découvrent une version évoluée du ransomware BlackCat ciblant les infrastructures critiques avec des techniques d\'évasion avancées.',
        date: 'Il y a 4 jours',
        link: 'https://thehackernews.com/',
        category: 'Menace'
      },
      {
        source: 'BleepingComputer',
        title: 'Zero-day exploité dans VPN Fortinet',
        description: 'Une vulnérabilité zero-day activement exploitée dans les appliances VPN Fortinet permet aux attaquants de contourner l\'authentification.',
        date: 'Il y a 5 jours',
        link: 'https://www.bleepingcomputer.com/',
        category: 'Vulnérabilité'
      },
      {
        source: 'ENISA',
        title: 'Rapport annuel sur les menaces cyber 2024',
        description: 'L\'agence européenne de cybersécurité publie son analyse des principales menaces et tendances observées en 2024, avec focus sur les ransomwares et l\'IA.',
        date: 'Il y a 1 semaine',
        link: 'https://www.enisa.europa.eu/',
        category: 'Rapport'
      },
      {
        source: 'Krebs on Security',
        title: 'Démantèlement du botnet QakBot par le FBI',
        description: 'Les autorités américaines annoncent la saisie de l\'infrastructure du botnet QakBot responsable de millions de dollars de pertes suite à des attaques ransomware.',
        date: 'Il y a 1 semaine',
        link: 'https://krebsonsecurity.com/',
        category: 'Cybercrime'
      },
      {
        source: 'Dark Reading',
        title: 'Authentification FIDO2 : adoption en hausse de 200%',
        description: 'Les entreprises accélèrent le déploiement de l\'authentification passwordless avec FIDO2, réduisant significativement les risques de phishing.',
        date: 'Il y a 1 semaine',
        link: 'https://www.darkreading.com/',
        category: 'Innovation'
      },
      {
        source: 'NIST',
        title: 'Publication des standards de cryptographie post-quantique',
        description: 'Le NIST finalise les premiers standards de chiffrement résistants aux ordinateurs quantiques, marquant une étape majeure pour la sécurité future.',
        date: 'Il y a 2 semaines',
        link: 'https://www.nist.gov/',
        category: 'Cryptographie'
      }
    ];

    displayFeeds(feeds);
  }

  function displayFeeds(feeds) {
    rssFeed.innerHTML = '';

    // Shuffle feeds to show variety
    const shuffled = shuffleArray([...feeds]);

    // Display first 6 items
    const itemsToShow = shuffled.slice(0, 6);

    itemsToShow.forEach(function(item) {
      const feedItem = createFeedItem(item);
      rssFeed.appendChild(feedItem);
    });
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
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
    metaInfo.style.display = 'flex';
    metaInfo.style.justifyContent = 'space-between';
    metaInfo.style.alignItems = 'center';
    metaInfo.style.marginTop = '0.75rem';
    metaInfo.style.paddingTop = '0.75rem';
    metaInfo.style.borderTop = '1px solid var(--color-border-light)';

    const date = document.createElement('span');
    date.className = 'rss-item-date';
    date.textContent = item.date;
    date.style.border = 'none';
    date.style.padding = '0';
    date.style.margin = '0';

    const category = document.createElement('span');
    category.style.fontSize = '0.75rem';
    category.style.fontWeight = '600';
    category.style.padding = '0.25rem 0.75rem';
    category.style.borderRadius = '1rem';
    category.style.background = getCategoryColor(item.category).bg;
    category.style.color = getCategoryColor(item.category).text;
    category.textContent = item.category;

    metaInfo.appendChild(date);
    metaInfo.appendChild(category);

    article.appendChild(source);
    article.appendChild(link);
    article.appendChild(description);
    article.appendChild(metaInfo);

    return article;
  }

  function getCategoryColor(category) {
    const colors = {
      'Alerte Critique': { bg: '#fee2e2', text: '#dc2626' },
      'Vulnérabilité': { bg: '#fef3c7', text: '#d97706' },
      'Menace': { bg: '#fce7f3', text: '#db2777' },
      'Recommandations': { bg: '#dbeafe', text: '#1d4ed8' },
      'Réglementation': { bg: '#e0e7ff', text: '#4f46e5' },
      'Innovation': { bg: '#d1fae5', text: '#059669' },
      'Rapport': { bg: '#f3e8ff', text: '#9333ea' },
      'Cybercrime': { bg: '#fecaca', text: '#b91c1c' },
      'Cryptographie': { bg: '#ddd6fe', text: '#7c3aed' }
    };
    return colors[category] || { bg: '#f1f5f9', text: '#475569' };
  }
});
