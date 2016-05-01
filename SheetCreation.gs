function createSheet(numberToShow) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  function numberDeterminer(name) {
   var number = 1;
    while (ss.getSheetByName(name + ' ' + number) != null) {
      number++;
    }
    number = ss.getSheetByName('Sorted Attendance') != null ? " " + number.toString() :  '' ;
    return number; 
  }
  var documentProperties = PropertiesService.getDocumentProperties();
    
 
    var number = numberDeterminer('Sorted Attendance');
    var newSheet = ss.insertSheet("Sorted Attendance" + number);
  documentProperties.setProperty('Sheets', documentProperties.getProperty('Sheets') + ', { id:' + newSheet.getSheetId().toString() + ', numberToShow:"' + numberToShow +'"}');
    var newRange = newSheet.getRange(1, 1, 2, 3)
    newRange.setValues([['First Name', 'Last Name', 'Number of Meetings attended'], ['Meeting Attendance', '', '']] );
    newSheet.setFrozenRows(1);
    newSheet.setFrozenColumns(2);
    newRange.setFontWeights([['bold', 'bold', 'bold'], [ 'bold', 'normal', 'normal']]);
    newRange.setBackgrounds([['#e2e2e2', '#e2e2e2', '#e2e2e2'], [ '#e2e2e2', '#ffffff', '#ffffff']]);
    newSheet.getRange(1, 1, 1, 3).protect().setWarningOnly(true);
    newSheet.getRange(2, 1, 1, 3).protect().setWarningOnly(true);
    newSheet.setColumnWidth(1, 130);
    newSheet.setColumnWidth(3, 190);
    newSheet.getRange(1, 3).setWrap(true);
    
  
ss.setActiveSheet(newSheet);
 
  // pattern for getting the sum of cells above =SUM(INDIRECT(ADDRESS(1,COLUMN())&":"&ADDRESS(ROW()-1,COLUMN())))

}

function gsSheetCreateSuccess() {
  
  populateFullAddOnMenu();
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (ss.getSheetByName('Preview Sheet') != null) {
    ss.deleteSheet(ss.getSheetByName('Preview Sheet'));
  }
  
  var html = HtmlService.createTemplateFromFile('SheetCreated')
                .evaluate()
                .setSandboxMode(HtmlService.SandboxMode.IFRAME)
                .setWidth(730)
                .setHeight(240);
            SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
            .showModalDialog(html, 'Sheet Created');
}

function gsSheetCreateFail() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ui = SpreadsheetApp.getUi()
    ui.alert(
     'Sheet could not be created',
      "A sheet could not be created. Please close this dialog and try again. If this issue persists, please report the issue via Add-ons > Attendance Sorter > Help",
      ui.ButtonSet.OK);
}

function updateSheetPreview (numberToShow) {
  var valueData = [["First Name", "Last Name", (new Date(1379995200000)), (new Date(1381204800000)), (new Date(1382587200000)), (new Date(1384837200000)), (new Date(1386046800000)), (new Date(1389070800000)), (new Date(1391490000000)), (new Date(1392699600000)), "Number of Meetings attended"], ["Sadie", "An", "", "", "", "", "", "", "", "", 1], ["Charlesetta", "Bard", "", "", "", "", "", "", "", "", 2], ["Hui", "Bellantoni", "", "", "", "", "", "", "", "", 7], ["John", "Doe", "", "", "", "", "", "", "", "", 7], ["Jennie", "Dresser", "", "", "", "", "", "", "", "", 7], ["Flavia", "Gaillard", "", "", "", "", "", "", "", "", 9], ["Cordelia", "Gearing", "", "", "", "", "", "", "", "", 13], ["Javier", "Gorton", "", "", "", "", "", "", "", "", 2], ["Luba", "Gotto", "", "", "", "", "", "", "", "", 10], ["Molly", "Hentges", "", "", "", "", "", "", "", "", 1], ["Shona", "Isenhour", "", "", "", "", "", "", "", "", 11], ["William", "Johnson", "", "", "", "", "", "", "", "", 4], ["Connie", "Kalman", "", "", "", "", "", "", "", "", 11], ["Tina", "Koury", "", "", "", "", "", "", "", "", 5], ["Tanesha", "Kunze", "", "", "", "", "", "", "", "", 7], ["Jeanene", "Lemarr", "", "", "", "", "", "", "", "", 8], ["Odis", "Lindblad", "", "", "", "", "", "", "", "", 12], ["Candance", "Mauck", "", "", "", "", "", "", "", "", 5], ["Cleopatra", "Mcray", "", "", "", "", "", "", "", "", 1], ["Jamar", "Moretz", "", "", "", "", "", "", "", "", 3], ["Kellee", "Outen", "", "", "", "", "", "", "", "", 1], ["Salena", "Rishel", "", "", "", "", "", "", "", "", 1], ["Lewis", "Sexson", "", "", "", "", "", "", "", "", 10], ["Andree", "Sharkey", "", "", "", "", "", "", "", "", 5], ["Lou", "Sheen", "", "", "", "", "", "", "", "", 1], ["James", "Smith", "", "", "", "", "", "", "", "", 8], ["Emma", "Torres", "", "", "", "", "", "", "", "", 13], ["Alphonse", "Trieu", "", "", "", "", "", "", "", "", 7], ["Latia", "Veasley", "", "", "", "", "", "", "", "", 2], ["Jaleesa", "Waldow", "", "", "", "", "", "", "", "", 7], ["Maryjane", "Waxman", "", "", "", "", "", "", "", "", 5], ["Halina", "Yadao", "", "", "", "", "", "", "", "", 11], ["Meeting", "Attendance", 23, 24, 16, 23, 18, 22, 12, 22, ""]];
  var colorData = [["#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff"], ["#ffffff", "#ffffff", "#ff0000", "#00ff00", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ffffff"], ["#ffffff", "#ffffff", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#00ff00", "#ff0000", "#00ff00", "#ffffff"], ["#ffffff", "#ffffff", "#00ff00", "#00ff00", "#ff0000", "#00ff00", "#00ff00", "#00ff00", "#ff0000", "#ff0000", "#ffffff"], ["#ffffff", "#ffffff", "#ff0000", "#00ff00", "#ff0000", "#00ff00", "#ff0000", "#ff0000", "#00ff00", "#00ff00", "#ffffff"], ["#ffffff", "#ffffff", "#00ff00", "#ff0000", "#ff0000", "#00ff00", "#00ff00", "#ff0000", "#ff0000", "#00ff00", "#ffffff"], ["#ffffff", "#ffffff", "#00ff00", "#ff0000", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#ff0000", "#00ff00", "#ffffff"], ["#ffffff", "#ffffff", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#ffffff"], ["#ffffff", "#ffffff", "#ff0000", "#00ff00", "#ff0000", "#ff0000", "#ff0000", "#00ff00", "#ff0000", "#ff0000", "#ffffff"], ["#ffffff", "#ffffff", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#ff0000", "#00ff00", "#ffffff"], ["#ffffff", "#ffffff", "#00ff00", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ffffff"], ["#ffffff", "#ffffff", "#00ff00", "#00ff00", "#ff0000", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#ffffff"], ["#ffffff", "#ffffff", "#00ff00", "#00ff00", "#ff0000", "#00ff00", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ffffff"], ["#ffffff", "#ffffff", "#ff0000", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#ffffff"], ["#ffffff", "#ffffff", "#ff0000", "#ff0000", "#00ff00", "#00ff00", "#ff0000", "#00ff00", "#ff0000", "#ff0000", "#ffffff"], ["#ffffff", "#ffffff", "#ff0000", "#00ff00", "#ff0000", "#00ff00", "#ff0000", "#00ff00", "#ff0000", "#00ff00", "#ffffff"], ["#ffffff", "#ffffff", "#ff0000", "#00ff00", "#ff0000", "#00ff00", "#00ff00", "#ff0000", "#ff0000", "#00ff00", "#ffffff"], ["#ffffff", "#ffffff", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#ffffff"], ["#ffffff", "#ffffff", "#00ff00", "#ff0000", "#00ff00", "#00ff00", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ffffff"], ["#ffffff", "#ffffff", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ffffff"], ["#ffffff", "#ffffff", "#00ff00", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#00ff00", "#ff0000", "#ffffff"], ["#ffffff", "#ffffff", "#00ff00", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ffffff"], ["#ffffff", "#ffffff", "#00ff00", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ffffff"], ["#ffffff", "#ffffff", "#00ff00", "#00ff00", "#00ff00", "#ff0000", "#00ff00", "#00ff00", "#ff0000", "#00ff00", "#ffffff"], ["#ffffff", "#ffffff", "#00ff00", "#00ff00", "#ff0000", "#00ff00", "#00ff00", "#ff0000", "#ff0000", "#00ff00", "#ffffff"], ["#ffffff", "#ffffff", "#ff0000", "#00ff00", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ffffff"], ["#ffffff", "#ffffff", "#00ff00", "#ff0000", "#00ff00", "#00ff00", "#ff0000", "#00ff00", "#ff0000", "#00ff00", "#ffffff"], ["#ffffff", "#ffffff", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#ffffff"], ["#ffffff", "#ffffff", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ffffff"], ["#ffffff", "#ffffff", "#ff0000", "#00ff00", "#ff0000", "#00ff00", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ffffff"], ["#ffffff", "#ffffff", "#ff0000", "#00ff00", "#ff0000", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#ffffff"], ["#ffffff", "#ffffff", "#00ff00", "#00ff00", "#ff0000", "#ff0000", "#00ff00", "#00ff00", "#ff0000", "#ff0000", "#ffffff"], ["#ffffff", "#ffffff", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#ffffff"], ["#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff"]];
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var previewSheet = ss.getSheetByName('Preview Sheet');
  if (previewSheet != null) {
    SpreadsheetApp.setActiveSheet(previewSheet);
  }
  else {
    previewSheet = ss.insertSheet("Preview Sheet");
    previewSheet.setFrozenRows(1);
    previewSheet.setFrozenColumns(2);
    var sampleRange = previewSheet.getRange(1, 1, 34, 11);
    sampleRange.setValues(valueData);
    sampleRange.setBackgrounds(colorData);
  }

  if (numberToShow === 'all' || numberToShow >= 8) {
    previewSheet.showColumns(3, 8);
  }
  
  if (numberToShow === 'none')  {
    previewSheet.hideColumns(3, 8);
  }
  
  if (numberToShow < 8)  {
    previewSheet.showColumns(3, 8);
    previewSheet.hideColumns(3, 8 - numberToShow);
  }
 
}

function fakeCreateSheet() {
  createSheet('midnight');
}