function gsUpdateSettings(numberToShow, showTimes) {
  
  var documentProperties = PropertiesService.getDocumentProperties();
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet;
  var lastColumnInSheet;
  var sheetListString;
  var sheetList = eval("[" + documentProperties.getProperty('Sheets') + "]");
  for (var i = 1; i < sheetList.length; i++) {
    sheetList[i].numberToShow = numberToShow.toString();
    sheetListString = JSON.stringify(sheetList);
    //why substring?
    documentProperties.setProperty('Sheets', sheetListString.substring(1, sheetListString.length - 1 ));
    sheet = getSheetById(spreadsheet, sheetList[i].id);
    
      if (sheet != null) {
        lastColumnInSheet = sheet.getLastColumn();
        if (lastColumnInSheet > 3) {
          if (sheetList[i].numberToShow === 'none') {
            sheet.hideColumns(3, lastColumnInSheet - 3);
          }
          if (sheetList[i].numberToShow !== 'all' && lastColumnInSheet - 3 > Number(sheetList[i].numberToShow)) {
             sheet.showColumns(3, lastColumnInSheet - 3);
             sheet.hideColumns(3, lastColumnInSheet - 3 - sheetList[i].numberToShow);
          }
          if (sheetList[i].numberToShow === "all" || lastColumnInSheet - 3 < Number(sheetList[i].numberToShow)) {
             sheet.showColumns(3, lastColumnInSheet - 3);
          }
        } // end check if lastColumnInSheet > 3
        
        if (showTimes === true) {
          documentProperties.setProperty('showDates','true');
        }
        
      } // end sheck if sheet is null
    
  } // end for loop
} // end update settings function

function gsGetStoredSheet() {
  var documentProperties = PropertiesService.getDocumentProperties();
  var sheetList = eval("[" + documentProperties.getProperty('Sheets') + "]");
  for (var i = 1; i < sheetList.length; i++) {
    if (sheetList[i] != null) {
      return sheetList[i];
    }
  }
}