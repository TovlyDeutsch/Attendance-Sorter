function myFunction() {
   var documentProperties = PropertiesService.getDocumentProperties();
var a = documentProperties.getProperty('Sheets');
  Logger.log(a);
  var b = 1;
}

function deleteAllProperties () {
   var documentProperties = PropertiesService.getDocumentProperties();
  documentProperties.deleteAllProperties();
}

function test() {
var html = HtmlService.createTemplateFromFile('SetupComplete')
                .evaluate()
                .setSandboxMode(HtmlService.SandboxMode.IFRAME)
                .setWidth(730)
                .setHeight(200);
            SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
            .showModalDialog(html, 'Setup Complete');
}

function test2 () {
  Logger.log(FormApp.openByUrl(SpreadsheetApp.getActiveSpreadsheet().getFormUrl()).getTitle())
}
function insertRowsatpoint () {
  var sheet = SpreadsheetApp.getActiveSheet();
  sheet.insertRowsAfter(34, 5);
}


function test3 () {
  var cake = SpreadsheetApp.getActiveSpreadsheet().getFormUrl();
 Logger.log(cake);
  var a = 1;
}