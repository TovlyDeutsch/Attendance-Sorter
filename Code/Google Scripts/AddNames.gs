function insertAddNamesSheet() {
  
  var oldActiveSheet = SpreadsheetApp.getActiveSheet();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  function numberDeterminer(name) {
    var number = 1;
    while (ss.getSheetByName(name + ' ' + number) != null) {number++;}
    number = ss.getSheetByName('Insert names on this sheet') != null ? " " + number.toString() :  '' ;
    return number; 
  }
  
  var safeSheetName = "Insert names on this sheet" + numberDeterminer('Insert names on this sheet');
  var sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(safeSheetName, oldActiveSheet.getIndex());
  var newActiveSheetId = sheet.getSheetId();
  var range = sheet.getRange(1, 1, 1, 2)
  range.setValues([['First Name','Last Name']]);
  range.setBackgrounds([['#000000', '#000000']]);
  range.setFontColor('#ffffff');
  sheet.setFrozenRows(1);
  sheet.setActiveRange(sheet.getRange(2, 1));
  return newActiveSheetId;
}

function gsAddNames(sheetToPutNamesIntoId, sheetToPullNamesFromId) {
  
  var ss = SpreadsheetApp.getActive();
  var sendingSheet = getSheetById(ss, sheetToPullNamesFromId);
  var lastRowNum = sendingSheet.getLastRow();
  if (lastRowNum == 1) { return 'no names';}
  var newNames = sendingSheet.getRange(2, 1, lastRowNum - 1, 2).getValues();
  var receivingSheet;
  if (sheetToPutNamesIntoId !== 'all') {var sheetList = [null, {id: sheetToPutNamesIntoId}];}
  else {
   var documentProperties = PropertiesService.getDocumentProperties();
   var sheetList = eval("[" + documentProperties.getProperty('Sheets') + "]"); 
  }
 
  for (var j = 1; j < sheetList.length; j++) {
    
    receivingSheet = getSheetById(ss, sheetList[j].id);
    if (receivingSheet !== null) {
      var fullSheetRange = receivingSheet.getDataRange()
      var fullSheet = fullSheetRange.getValues();
      var fullSheetBackgrounds = fullSheetRange.getBackgrounds();
      var meetingAttendanceRowIndex = fullSheet[fullSheet.length - 1][0].replace(/\s+/g, '').toUpperCase() === 'MEETINGATTENDANCE' ? fullSheet.length - 1 : false;
      if (meetingAttendanceRowIndex !== false) {
        for (var i = 0; i< newNames.length; i++) {
          fullSheet.splice(meetingAttendanceRowIndex, 0, newNames[i]);
          fullSheetBackgrounds.splice(meetingAttendanceRowIndex, 0, ['#ffffff', '#ffffff']);
        }
      }
      else {
        for (var i = 0; i< newNames.length; i++) {
          fullSheet.push(newNames[i]);
          fullSheetBackgrounds.push(['#ffffff', '#ffffff']);
        }
      }
  
      var topRowWidth = fullSheet[0].length;
      var test = 0;
      for (var q = 1; q < fullSheet.length; q++) { // go through each row except the top row
        //keep pushing empty string until arrrays aren't jagged
        while (fullSheet[q].length !== topRowWidth) {fullSheet[q].push('');}
        //keep pushing red strings until arrrays aren't jagged
        while (fullSheetBackgrounds[q].length !== topRowWidth) {fullSheetBackgrounds[q].push('#ff0000');}
        fullSheetBackgrounds[q][fullSheetBackgrounds[q].length -1] = "#ffffff";
      }

      var newRange = receivingSheet.getRange(1, 1, fullSheet.length, fullSheet[0].length);
      newRange.setValues(fullSheet);
      newRange.setBackgrounds(fullSheetBackgrounds);
      var fontWeights = newRange.getFontWeights();
      for (var j = 1; j< fontWeights.length - 1; j++) {fontWeights[j][0] = 'normal';}
      fontWeights[fontWeights.length - 1][0] = 'bold';
        
      newRange.setFontWeights(fontWeights);
      receivingSheet.getRange(2, 1, fullSheet.length - 2, fullSheet[0].length).sort(2);
      removeRangeProtections(receivingSheet);
      receivingSheet.getRange(1, 1, 1, fullSheet[0].length).protect().setWarningOnly(true);
      receivingSheet.getRange(fullSheet.length, 1, 1, fullSheet[0].length).protect().setWarningOnly(true);
      receivingSheet.getRange(2, fullSheet[0].length, fullSheet.length - 2, 1).protect().setWarningOnly(true);
      
    } // end check if sheet is null
  } // end go through sheet list for loop
  
  ss.deleteSheet(sendingSheet);
  ss.setActiveSheet(receivingSheet)
  
}
