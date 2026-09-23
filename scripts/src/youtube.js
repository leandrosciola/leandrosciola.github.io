/*
 * Low quality
 * https://img.youtube.com/vi/[video-id]/sddefault.jpg
 *
 * Medium quality
 * https://img.youtube.com/vi/[video-id]/mqdefault.jpg
 *
 * High quality
 * http://img.youtube.com/vi/[video-id]/hqdefault.jpg
 *
 * Maximum resolution
 * http://img.youtube.com/vi/[video-id]/maxresdefault.jpg
 */
const CONFIG = {
  MAX_RESULTS: 6,
  GOOGLE_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbyBfYSf2cCa6nZyTQXfwhQAL0zHc9WRz40FGUpZ1jeLV7oWzcCtJRWG1PHyh-3NmV-S/exec?service=youtube'
};

const DOM = {
  gallery: document.getElementById('gallery'),
  loadMoreBtn: document.getElementById('loadMoreBtn'),
  loadingMsg: document.getElementById('loadingMsg'),
  errorMsg: document.getElementById('errorMsg')
};

let nextPageToken = '';

const formatDuration = (iso) => {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) {
    return '0:00';
  }
  const hours = parseInt(match[1] || 0);
  const minutes = parseInt(match[2] || 0);
  const seconds = parseInt(match[3] || 0);

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
};

const formatViews = (views) => {
  const num = parseInt(views, 10);

  if (isNaN(num)) {
    return '0 visualizações';
  }

  const formatter = new Intl.NumberFormat('pt-BR', { notation: 'compact', compactDisplay: 'short' });

  return formatter.format(num).toLowerCase();
};

const formatDate = (publishedAt) => {
  const date = new Date(publishedAt);
  const day = String(date.getUTCDate()).padStart(2, '0');
  //const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const month = [
      "janeiro", "fevereiro", "março", "abril", "maio", "junho",
      "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
  ];
  const year = date.getUTCFullYear();
  //return `${day}/${month}/${year}`;
  return `${day} de ${month[date.getUTCMonth()]} de ${year}`;
};

const timeAgo = (dateString) => {
  const date = new Date(dateString);
  const seconds = Math.floor((new Date() - date) / 1000);
  
  const intervals = [
    { label: 'ano', seconds: 31536000 },
    { label: 'mês', seconds: 2592000 },
    { label: 'semana', seconds: 604800 },
    { label: 'dia', seconds: 86400 },
    { label: 'hora', seconds: 3600 },
    { label: 'minuto', seconds: 60 }
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);

    if (count >= 1) {
      const plural = count > 1 ? (interval.label === 'mês' ? 'meses' : interval.label + 's') : interval.label;
      return `há ${count} ${plural}`;
    }
  }
  return 'agora mesmo';
};

function renderGallery(videos) {
  if (!DOM.gallery) {
    return;
  }

  videos.forEach(video => {
    const card = document.createElement('article');
    card.innerHTML = `
      <div class="thumb">
        <img src="https://img.youtube.com/vi/${video.id}/mqdefault.jpg" alt="${video.title}" loading="lazy">
        <div class="play-icon"></div>
        <span class="duration">${formatDuration(video.duration)}</span>
      </div>
      <div class="video-info">
        <h2 class="video-title">${video.title}</h2>
        <p class="video-meta">${formatDate(video.publishedAt)}</p>
      </div>
    `;
    card.classList.add('video-card', 'border'); 
    /*
    card.innerHTML = `
      <div class="thumb">
        <a href="https://youtube.com/watch?v=${video.id}" target="_blank">
          <img src="${video.thumbnail}" width="369" height="208" alt="${video.title}" loading="lazy">
        </a>
        <div class="play-icon"></div>
        <span class="duration">${formatDuration(video.duration)}</span>
      </div>
      <div class="video-info">
        <h2 class="video-title">${video.title}</h2>
        <p class="video-meta">${formatViews(video.views)} • ${timeAgo(video.publishedAt)}</p>
      </div>
    `;
    */
    card.addEventListener('click', (e) => {
      const classes = ['bg-dark', 'btn-close'];
      dialog(`<iframe class="youtube m-0 p-0" src="https://www.youtube.com/embed/${video.id}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`, classes);
    });
    DOM.gallery.appendChild(card);
  });
}

async function fetchVideos(pageToken = '') {
  try {
    if (DOM.loadingMsg) {
      DOM.loadingMsg.style.display = 'block';
    }

    if (DOM.errorMsg) {
      DOM.errorMsg.style.display = 'none';
    }

    if (DOM.loadMoreBtn) {
      DOM.loadMoreBtn.disabled = true;
    }

    const response = await fetch(`${CONFIG.GOOGLE_SCRIPT_URL}&pageToken=${pageToken}`);
    const data = await response.json();

    if (data.error) throw new Error(data.message);

    nextPageToken = data.nextPageToken || '';

    renderGallery(data.items);

    if (DOM.loadMoreBtn) {
      DOM.loadMoreBtn.style.display = nextPageToken ? 'block' : 'none';
    }

  } catch (error) {
    console.error('Erro na aplicação:', error);

    if (DOM.errorMsg) {
      DOM.errorMsg.style.display = 'block';
    }
  } finally {
    if (DOM.loadingMsg) {
      DOM.loadingMsg.style.display = 'none';
    }

    if (DOM.loadMoreBtn) {
      DOM.loadMoreBtn.disabled = false;
    }
  }
}

if (DOM.loadMoreBtn) {
  DOM.loadMoreBtn.addEventListener('click', () => {
    fetchVideos(nextPageToken);
  });
}

fetchVideos();
