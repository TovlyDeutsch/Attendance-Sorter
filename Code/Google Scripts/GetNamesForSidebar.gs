//This function gets the names from the sheet to display on the mark attendance sidebar
function gsGetNames() {
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var documentProperties = PropertiesService.getDocumentProperties();
  var sheetList = eval("[" + documentProperties.getProperty('Sheets') + "]");
  var activeSheet = ss.getActiveSheet();
  var activeSheetId = activeSheet.getSheetId();
  var sheet = null;

  for (var y = 1; y < sheetList.length; y++) {
    if (activeSheetId == sheetList[y].id) { sheet = activeSheet; break; }
  }
  
  if (sheet === null) {sheet = getSheetById(ss, sheetList[sheetList.length - 1].id); }
    var fullSheetRange = sheet.getDataRange();
    var fullSheet = fullSheetRange.getValues();
    var names = JSON.parse(JSON.stringify(fullSheet.slice(1, fullSheet.length - 1)));
    var lengthOfNames = names.length;
      
     if (lengthOfNames === 0) { 
       return null; 
     }
     else {
       for (var j=0; j<lengthOfNames; j++) {
         names[j] = {firstName: names[j][0], lastName: names[j][1]};
    }
    if (fullSheet[fullSheet.length -1][0].replace(/\s+/g, '').toUpperCase() !== 'MEETINGATTENDANCE') {
      names.push({firstName: fullSheet[fullSheet.length -1][0], lastName: fullSheet[fullSheet.length -1][1]});
    }
  return names;
  }
  
} // end gsGetNames function