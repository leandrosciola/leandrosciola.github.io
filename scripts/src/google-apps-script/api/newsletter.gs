function newsletter(e) {
  var data = [];
  var json = e.parameter;

  data.push([
    json["email"]
  ]);

  check(data);
  insert(data);
  return printJSON({status: 200});
}

function insert(data) {
  var spreadsheet = SpreadsheetApp.openById('1y6AFNIX35Gyxgs4YKft0RQsNE6QnWBWn7OqLLhefRZY');
  var sheet = spreadsheet.getSheetByName('Sheet1');
  var lastRow = sheet.getLastRow();
  sheet.getRange(lastRow + 1, 1, data.length, data[0].length).setValues(data);
}

function check(data) {
  data[0].forEach(function (item, index) {
    if (item === "null") {
      data[0][index] = "";
    }
  });
}
