function logProperties() {
   var documentProperties = PropertiesService.getDocumentProperties();
var a = documentProperties.getProperty('Sheets');
  Logger.log(a);
  var b = 1;
}

function deleteAllProperties () {
   var documentProperties = PropertiesService.getDocumentProperties();
  documentProperties.deleteAllProperties();
  PropertiesService.getUserProperties().deleteAllProperties()
}

function reset () {
  //unlink all forms
  var noFormsLeft = false;
  var spreadsheet = SpreadsheetApp.getActive();
  var formUrl = spreadsheet.getFormUrl();
  while (formUrl !== null) {
    FormApp.openByUrl(formUrl).removeDestination();
    formUrl = spreadsheet.getFormUrl();
  }
  spreadsheet.insertSheet();
  var sheets = spreadsheet.getSheets();
  for (var i = 0; i < sheets.length - 1; i++) {
    spreadsheet.deleteSheet(sheets[i]);
  }
  deleteAllProperties();
  onOpen('debug');
}

function hideTesting () {
  SpreadsheetApp.getActiveSheet().showColumns(1,3);
}