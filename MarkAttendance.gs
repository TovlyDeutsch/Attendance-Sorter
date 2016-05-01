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

function gsMarkAttendance(presentNames, sheetToSubmitTo) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetList;
  if (sheetToSubmitTo === 'all') {
    var documentProperties = PropertiesService.getDocumentProperties();
    sheetList = eval("[" + documentProperties.getProperty('Sheets') + "]");
    Logger.log('all');
  }
  else {
    sheetList = [null, {id: sheetToSubmitTo}];
  }
  
  for (var g = 1; g < sheetList.length; g++) {
    
    Logger.log(sheetList);
    Logger.log(g);
  var sheet = getSheetById(ss, sheetList[g].id)
  
  if (sheet !== null) {
  var fullSheetRange = sheet.getDataRange();
  var fullSheet = fullSheetRange.getValues();
  var fullSheetBackgrounds = fullSheetRange.getBackgrounds();
  var names = JSON.parse(JSON.stringify(fullSheet.slice(1)));
  var lengthOfNames = names.length;
      
     
    for (var j=0; j<lengthOfNames; j++) {
     names[j][0] = names[j][0] + names[j][1];
      names[j][0] = names[j][0].replace(/\s+/g, '').toUpperCase();
      names[j].splice(1, names[j].length);
    }
    
    names = names.reduce(function(prev, next) {
    return prev.concat(next);
    });
      if(names[1] == '') { names.splice(names.length - 1, 1); }
   
    
  var comparisonName;
  var MeetingAttendanceRow;
  var nameArrayToAdd;
  var newName;
  var indexOfComparisonName;
  var sheetDate;
  var needToAddDateColumn;
  var inputDate;
  var sheetDate;
  var colorArrayToAdd;
  var nameRowIndex;
  var alreadySignedIn;
  
  for (var h = 0; h < presentNames.length; h++) {
    //check if sorted sheet contains submitted name
    Logger.log(presentNames[h].firstName + presentNames[h].lastName)
    comparisonName = (presentNames[h].firstName + presentNames[h].lastName).replace(/\s+/g, '').toUpperCase();
    indexOfComparisonName = names.indexOf(comparisonName);
    if (indexOfComparisonName == -1) {
      MeetingAttendanceRow = names.length == 1 ?  2 : names.length + 1;
      if (fullSheet[fullSheet.length -1][0].replace(/\s+/g, '').toUpperCase() !== 'MEETINGATTENDANCE') { MeetingAttendanceRow = names.length + 2;}
      nameArrayToAdd = [presentNames[h].firstName, presentNames[h].lastName];
      colorArrayToAdd = [ "#ffffff", "#ffffff"];
      while ( nameArrayToAdd.length != fullSheet[0].length) { 
        nameArrayToAdd.push('');
        colorArrayToAdd.push("#ff0000"); 
      }
      colorArrayToAdd[colorArrayToAdd.length - 1] = "#ffffff";
       fullSheet.splice(MeetingAttendanceRow - 1, 0, nameArrayToAdd);
      fullSheetBackgrounds.splice(MeetingAttendanceRow - 1, 0, colorArrayToAdd);
          for (var n = 2; n < fullSheetBackgrounds[0].length - 1; n++) {
          fullSheetBackgrounds[MeetingAttendanceRow - 1][n] = "#ff0000";
          }
      nameRowIndex = fullSheet.length - 2
      
      newName = true;  
        
    }
      else {
        newName = false;
        nameRowIndex = indexOfComparisonName + 1;  
      }
      
     
      

      needToAddDateColumn = true;
      inputDate = new Date();
    
      for (var q = 2; q < fullSheet[0].length - 1; q++) {
        sheetDate = new Date(fullSheet[0][q]);
        if (sheetDate instanceof Date) {
          if (sheetDate.getDate()  === inputDate.getDate() && sheetDate.getMonth()  === inputDate.getMonth() && sheetDate.getFullYear()  === inputDate.getFullYear()) {
            needToAddDateColumn = false;
          }
        }
      }
      alreadySignedIn = false;
      if (needToAddDateColumn === true) {
      
      Logger.log(fullSheetBackgrounds);
        Logger.log(fullSheet);
        for (var z = 0; z < fullSheet.length; z++) { 
          fullSheet[z].splice(fullSheet[z].length -1, 0, '');
          if (z === 0 || z === fullSheet.length - 1) { fullSheetBackgrounds[z].splice(fullSheet[z].length - 2, 0, '#ffffff');}
          else { fullSheetBackgrounds[z].splice(fullSheet[z].length - 2, 0, '#ff0000'); }
        }
        
       fullSheet[0][fullSheet[0].length - 2] = inputDate.toLocaleDateString();
        
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
  
  //start values render
     var newRange = sheet.getRange(1, 1, fullSheet.length, fullSheet[0].length);
        newRange.setValues(fullSheet);   
      //end values render
        fullSheetBackgrounds[0][0] = '#e2e2e2';
        fullSheetBackgrounds[0][1] = '#e2e2e2';
        fullSheetBackgrounds[0][2] = '#ffffff';
        fullSheetBackgrounds[0][fullSheetBackgrounds[0].length - 1] = '#e2e2e2';
        fullSheetBackgrounds[fullSheetBackgrounds.length - 1][0] = '#e2e2e2';
        newRange.setBackgrounds(fullSheetBackgrounds);
    
    //work on font weights
    var fullSheetFontWeights = [['normal', 'normal']];
      // make correct number of rows
      while (fullSheetFontWeights.length !== fullSheet.length) {
      fullSheetFontWeights.push(['normal', 'normal']);
      }
    Logger.log(fullSheetFontWeights);
      // make each row correct width
      for (var w = 0; w < fullSheetFontWeights.length; w++) {
        while (fullSheetFontWeights[w].length !== fullSheet[w].length) {
          fullSheetFontWeights[w].push('normal');
        }
      }
    Logger.log(fullSheetFontWeights);
      fullSheetFontWeights[0][0] = 'bold';
      fullSheetFontWeights[0][1] = 'bold';
      fullSheetFontWeights[0][fullSheetFontWeights[0].length - 1] = 'bold';
      fullSheetFontWeights[fullSheetFontWeights.length - 1][0] = 'bold';
      newRange.setFontWeights(fullSheetFontWeights);
      sheet.getRange(1, fullSheet[0].length).setWrap(true);
  // end work on font weights
      sheet.getRange(2, 1, fullSheet.length - 2, fullSheet[0].length).sort(2);
      removeRangeProtections(sheet);
    //protect top row
      sheet.getRange(1, 1, 1, fullSheet[0].length).protect().setWarningOnly(true);
    //protect last row
      sheet.getRange(fullSheet.length, 1, 1, fullSheet[0].length - 1).protect().setWarningOnly(true);
    //protect last column
      sheet.getRange(2, fullSheet[0].length, fullSheet.length - 2, 1).protect().setWarningOnly(true);
  var documentProperties = PropertiesService.getDocumentProperties();
  var sortSheetList = eval("[" + documentProperties.getProperty('Sheets') + "]");
      var numberToShow = Number(sortSheetList[1].numberToShow);
      Logger.log(numberToShow);
      // start auto hiding date columns
      if (sortSheetList[1].numberToShow === 'none') {
        sheet.hideColumns(3, fullSheet[0].length - 3);
      }
      else if (sortSheetList[1].numberToShow !== 'all' && fullSheet[0].length - 3 > numberToShow) {
        sheet.hideColumns(3, fullSheet[0].length - 3 - sortSheetList[1].numberToShow);
      }
      else if (fullSheet[1].length - 3 < numberToShow) {
        sheet.showColumns(3, fullSheet[0].length - 3);
      }
    } //end check if sheet is null
  } // end sheet list for loop
  
} // end gsMarkAttendance function