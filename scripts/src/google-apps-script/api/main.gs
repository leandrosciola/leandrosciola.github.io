function doGet(e) { 
  switch (e.parameter.service) {
    case 'youtube':
      return youtube(e);
      
    /*case 'newsletter':
      return newsletter(e);*/
      
    default:
      return printJSON({ error: 'GET service not found or not specified.' });
  }
}

function doPost(e) {
  return newsletter(e);
}

function printJSON(data) {
  return ContentService
  .createTextOutput(JSON.stringify(data))
  .setMimeType(ContentService.MimeType.JSON);
}

function printHTML(data) {
  return HtmlService.createHtmlOutput(data);
}
