function gsMarkAttendance(presentNames, sheetToSubmitTo) {
  var sheet;
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetList;
  if (sheetToSubmitTo === 'all') {
    var documentProperties = PropertiesService.getDocumentProperties();
    sheetList = eval("[" + documentProperties.getProperty('Sheets') + "]");
  }
  else {
    //null added because for loop starts at 1
    sheetList = [null, {id: sheetToSubmitTo}];
  }
  // check checkdate fucntion
  //start for loop to go through each sheet in sheet list. (all or just one)
  //for loop starts at 1 because first slot in sheetlist array is not a sheet. Why?
  for (var g = 1; g < sheetList.length; g++) {

  sheet = getSheetById(ss, sheetList[g].id);
  
  if (sheet != null) {
    
    var fullSheetRange = sheet.getDataRange();
    var fullSheet = fullSheetRange.getValues();
    var fullSheetBackgrounds = fullSheetRange.getBackgrounds(); // diff other one gets font weights
    var names = standardizeNames(JSON.parse(JSON.stringify(fullSheet.slice(1))));
  
    for (var h = 0; h < presentNames.length; h++) {
      //check if sorted sheet contains submitted name
      var comparisonName = (presentNames[h].firstName + presentNames[h].lastName).replace(/\s+/g, '').toUpperCase();
      var indexOfComparisonName = names.indexOf(comparisonName);
    
      if (indexOfComparisonName === -1) {
        
        var newName = true;
        var MeetingAttendanceRow = names.length == 1 ?  2 : names.length + 1;
        if (fullSheet[fullSheet.length -1][0].replace(/\s+/g, '').toUpperCase() !== 'MEETINGATTENDANCE') { MeetingAttendanceRow = names.length + 2;}
        var nameArrayToAdd = [presentNames[h].firstName, presentNames[h].lastName];
        var colorArrayToAdd = [ "#ffffff", "#ffffff"];
        while ( nameArrayToAdd.length != fullSheet[0].length) {
          nameArrayToAdd.push('');
          colorArrayToAdd.push("#ff0000"); 
        }
        
      //make last cell in row white
      colorArrayToAdd[colorArrayToAdd.length - 1] = "#ffffff";
      // add nameArray and colorarray
      fullSheet.splice(MeetingAttendanceRow - 1, 0, nameArrayToAdd);
      fullSheetBackgrounds.splice(MeetingAttendanceRow - 1, 0, colorArrayToAdd);
      //make all cells in right before last row red
      for (var n = 2; n < fullSheetBackgrounds[0].length - 1; n++) {fullSheetBackgrounds[MeetingAttendanceRow - 1][n] = "#ff0000";}
      var nameRowIndex = fullSheet.length - 2
      
      }
      
      else {
        var newName = false;
        var nameRowIndex = indexOfComparisonName + 1;  
      }

      if (h ===0 ) {var needToAddDateColumn = checkIfDateExists(fullSheet);}
      else { var needToAddDateColumn = false;}
      Logger.log(needToAddDateColumn);
      var alreadySignedIn = false;
    
      if (needToAddDateColumn === true) {
        for (var z = 0; z < fullSheet.length; z++) {
          //Logger.log(g.toString() + ' ' + z.toString() + ' ' + h.toString()); // check h
          fullSheet[z].splice(fullSheet[z].length -1, 0, '');
          if (z === 0 || z === fullSheet.length - 1) { fullSheetBackgrounds[z].splice(fullSheet[z].length - 2, 0, '#ffffff');}
          else { fullSheetBackgrounds[z].splice(fullSheet[z].length - 2, 0, '#ff0000'); }
        }
      fullSheet[0][fullSheet[0].length - 2] = new Date().toLocaleDateString();  
      }
        
      if (newName === false && needToAddDateColumn === false) {
        if (fullSheetBackgrounds[nameRowIndex][fullSheetBackgrounds[0].length - 2] != "#00ff00") {
          fullSheetBackgrounds[nameRowIndex][fullSheetBackgrounds[0].length - 2] = "#00ff00";
        }
        else { alreadySignedIn = true; }
      }
      
      if ( newName === true) { 
        fullSheet[fullSheet.indexOf(nameArrayToAdd)][fullSheet[0].length - 1] = 1;
         fullSheet[fullSheet.length -1][fullSheet[0].length - 2] = Number(fullSheet[fullSheet.length -1][fullSheet[0].length - 2]) + 1;
      }
      else if (alreadySignedIn === false) { 
        // increment the # of metings attendaded columns
        fullSheet[indexOfComparisonName + 1][fullSheet[0].length - 1] = Number(fullSheet[indexOfComparisonName + 1][fullSheet[0].length - 1]) + 1; 
        //increment the meeting attendacne row if last row is called meeting attendance
        if (fullSheet[fullSheet.length -1][0].replace(/\s+/g, '').toUpperCase() === 'MEETINGATTENDANCE') {
          fullSheet[fullSheet.length -1][fullSheet[0].length - 2] = Number(fullSheet[fullSheet.length -1][fullSheet[0].length - 2]) + 1;
        }
      }
    
    fullSheetBackgrounds[nameRowIndex][fullSheetBackgrounds[0].length - 2] = "#00ff00";
    
  } // end for loop going through each presentName
    
    fullSheetBackgrounds[0].splice(0,3,'#e2e2e2','#e2e2e2','#ffffff');
    fullSheetBackgrounds[0][fullSheetBackgrounds[0].length - 1] = '#e2e2e2';
    fullSheetBackgrounds[fullSheetBackgrounds.length - 1][0] = '#e2e2e2';
  
  //Render, hide, and protect
     var newRange = sheet.getRange(1, 1, fullSheet.length, fullSheet[0].length);
     newRange.setValues(fullSheet);
     newRange.setBackgrounds(fullSheetBackgrounds);
     setFontWeights(fullSheet, newRange);
     sortAndProtect(fullSheet,sheet);
     autoHideCoulumns(sheetList, fullSheet, g)
   
    } //end check if sheet is null
  } // end sheet list for loop
  
} // end gsMarkAttendance function