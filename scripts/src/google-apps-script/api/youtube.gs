function youtube(e) {

  const API_KEY = 'SUA_CHAVE_API_AQUI'; 
  const CHANNEL_ID = 'SEU_CHANNEL_ID_AQUI';
  const MAX_RESULTS = 6;

  const pageToken = (e && e.parameter && e.parameter.pageToken) ? e.parameter.pageToken : '';

  return sampleData(pageToken); // Dev - Sample data

  try {
    const channelUrl = `https://www.googleapis.com/youtube/v3/channels?key=${API_KEY}&id=${CHANNEL_ID}&part=contentDetails`;
    const channelRes = UrlFetchApp.fetch(channelUrl, { muteHttpExceptions: true });
    const channelData = JSON.parse(channelRes.getContentText());
    
    if (channelData.error) {
      throw new Error("Erro na API do YouTube (Canal): " + channelData.error.message);
    }
    if (!channelData.items || channelData.items.length === 0) {
      throw new Error("Canal não encontrado.");
    }
    
    const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;
    const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?key=${API_KEY}&playlistId=${uploadsPlaylistId}&part=snippet&maxResults=${MAX_RESULTS}&pageToken=${pageToken}`;
    const playlistRes = UrlFetchApp.fetch(playlistUrl, { muteHttpExceptions: true });
    const playlistData = JSON.parse(playlistRes.getContentText());
    
    if (playlistData.error) {
      throw new Error("Erro na API do YouTube (Playlist): " + playlistData.error.message);
    }
    if (!playlistData.items || playlistData.items.length === 0) {
      return printJSON({ items: [], nextPageToken: '' });
    }

    const videoIds = playlistData.items.map(item => item.snippet.resourceId.videoId).join(',');
    const videosUrl = `https://www.googleapis.com/youtube/v3/videos?key=${API_KEY}&id=${videoIds}&part=contentDetails,statistics`;
    const videosRes = UrlFetchApp.fetch(videosUrl, { muteHttpExceptions: true });
    const videosData = JSON.parse(videosRes.getContentText());
    
    if (videosData.error) {
      throw new Error("Erro na API do YouTube (Vídeos): " + videosData.error.message);
    }

    const videoDetailsMap = {};
    if (videosData.items) {
      videosData.items.forEach(video => {
        videoDetailsMap[video.id] = {
          duration: video.contentDetails.duration,
          viewCount: video.statistics.viewCount || '0'
        };
      });
    }

    const finalItems = playlistData.items.map(item => {
      const vId = item.snippet.resourceId.videoId;
      const details = videoDetailsMap[vId] || { duration: 'PT0S', viewCount: '0' };

      let thumbUrl = '';
      const thumbs = item.snippet.thumbnails;
      if (thumbs) {
        thumbUrl = thumbs.medium ? thumbs.medium.url : (thumbs.default ? thumbs.default.url : '');
      }

      return {
        id: vId,
        title: item.snippet.title,
        //description: item.snippet.description,
        thumbnail: thumbUrl,
        publishedAt: item.snippet.publishedAt,
        duration: details.duration,
        //views: details.viewCount
      };
    });

    const responsePayload = {
      nextPageToken: playlistData.nextPageToken || '',
      items: finalItems
    };

    return printJSON(responsePayload);
                         
  } catch (error) {
    return printJSON({ error: true, message: error.toString() });
  }
}

function sampleData(pageToken) {
  // Banco de dados completo com os seus 15 vídeos de teste
  var todosOsVideos = [
    { "id": "HuGAiGfKqW0", "title": "Como Programar em Google Apps Script para Iniciantes", "thumbnail": "https://ytimg.com", "publishedAt": "2026-08-25T14:00:00Z", "duration": "PT12M45S" },
    { "id": "x0692zj9jsI", "title": "Consumindo a API do YouTube v3 sem Mistérios", "thumbnail": "https://ytimg.com", "publishedAt": "2026-08-20T18:30:00Z", "duration": "PT8M20S" },
    { "id": "rPq7ITrWFvY", "title": "Dicas de Produtividade no Google Workspace", "thumbnail": "https://ytimg.com", "publishedAt": "2026-08-15T11:15:00Z", "duration": "PT15M02S" },
    { "id": "Nm5e9ok8dIg", "title": "Criando uma API REST com Apps Script em 10 Minutos", "thumbnail": "https://ytimg.com", "publishedAt": "2026-08-10T09:00:00Z", "duration": "PT10M11S" },
    { "id": "dWH8n-FkprM", "title": "Análise de Dados com Python e Planilhas Google", "thumbnail": "https://ytimg.com", "publishedAt": "2026-08-05T20:00:00Z", "duration": "PT22M35S" },
    { "id": "bSp-foRDH5M", "title": "Novidades do Desenvolvimento Low-Code para 2026", "thumbnail": "https://ytimg.com", "publishedAt": "2026-08-01T13:00:00Z", "duration": "PT6M50S" },
    { "id": "Sm7OTow3mcY", "title": "Como Programar em Google Apps Script para Iniciantes", "thumbnail": "https://ytimg.com", "publishedAt": "2026-08-25T14:00:00Z", "duration": "PT12M45S" },
    { "id": "YSKzyVOQmuA", "title": "Consumindo a API do YouTube v3 sem Mistérios", "thumbnail": "https://ytimg.com", "publishedAt": "2026-08-20T18:30:00Z", "duration": "PT8M20S" },
    { "id": "2jBT5mlomoE", "title": "Dicas de Produtividade no Google Workspace", "thumbnail": "https://ytimg.com", "publishedAt": "2026-08-15T11:15:00Z", "duration": "PT15M02S" },
    { "id": "iDz4GqHQL6Q", "title": "Criando uma API REST com Apps Script em 10 Minutos", "thumbnail": "https://ytimg.com", "publishedAt": "2026-08-10T09:00:00Z", "duration": "PT10M11S" },
    { "id": "TglEnUdBb3o", "title": "Análise de Dados com Python e Planilhas Google", "thumbnail": "https://ytimg.com", "publishedAt": "2026-08-05T20:00:00Z", "duration": "PT22M35S" },
    { "id": "MfDYRK1pAvA", "title": "Novidades do Desenvolvimento Low-Code para 2026", "thumbnail": "https://ytimg.com", "publishedAt": "2026-08-01T13:00:00Z", "duration": "PT6M50S" },
    { "id": "JJTdXTf12oQ", "title": "Como Programar em Google Apps Script para Iniciantes", "thumbnail": "https://ytimg.com", "publishedAt": "2026-08-25T14:00:00Z", "duration": "PT12M45S" },
    { "id": "mx0xFpVjxHE", "title": "Consumindo a API do YouTube v3 sem Mistérios", "thumbnail": "https://ytimg.com", "publishedAt": "2026-08-20T18:30:00Z", "duration": "PT8M20S" },
    { "id": "iGOmDRYctOw", "title": "Dicas de Produtividade no Google Workspace", "thumbnail": "https://ytimg.com", "publishedAt": "2026-08-15T11:15:00Z", "duration": "PT15M02S" }
  ];

  // Define os limites do corte baseado no token enviado
  var inicio = 0;
  var proximoToken = null;

  if (!pageToken) {
    inicio = 0;
    proximoToken = "PAGINA_2"; // Próximo token após os primeiros 6 itens
  } else if (pageToken === "PAGINA_2") {
    inicio = 6;
    proximoToken = "PAGINA_3"; // Próximo token após o 12º item
  } else if (pageToken === "PAGINA_3") {
    inicio = 12;
    proximoToken = null;       // Não há mais itens (fim da lista)
  }

  // Corta o array para pegar apenas os 6 itens da página atual
  var itensDaPagina = todosOsVideos.slice(inicio, inicio + 6);

  // Monta a estrutura final idêntica à do YouTube
  var respostaJSON = {
    "items": itensDaPagina
  };

  // Só adiciona a propriedade "nextPageToken" se ainda houver uma próxima página
  if (proximoToken) {
    respostaJSON.nextPageToken = proximoToken;
  }

  return printJSON(respostaJSON);
}
