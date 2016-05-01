function AttendanceSorter (e) {

  var spreadsheet = e.range.getSheet().getParent();
  var documentProperties = PropertiesService.getDocumentProperties();
  var sheetList = eval("[" + documentProperties.getProperty('Sheets') + "]");
  var sheetListLength = sheetList.length;
  var sheet;  
  var namedValues = e.namedValues;
  var objectKeys = Object.keys(namedValues);
  var possibleFirstNameResponseArray;
  var possibleLastNameResponseArray;
  var firstNameResponses;
  var lastNameResponses;
  
  // pull out first and last name question answer arrays
  for (var r = 0; r < objectKeys.length; r++) {
    if (objectKeys[r].replace(/\s+/g, '').toUpperCase() === "FIRSTNAME") {
      possibleFirstNameResponseArray = namedValues[objectKeys[r]];
      for (var h = 0; h < possibleFirstNameResponseArray.length; h++) {
        if (possibleFirstNameResponseArray[h] != "") {firstNameResponses = possibleFirstNameResponseArray }
      }
    }
    
    if (objectKeys[r].replace(/\s+/g, '').toUpperCase() === "LASTNAME") {
      possibleLastNameResponseArray = namedValues[objectKeys[r]];
      for (var h = 0; h < possibleLastNameResponseArray.length; h++) {
        if (possibleLastNameResponseArray[h] != "") {lastNameResponses = possibleLastNameResponseArray }
      }
    }
    
  }
  
  // Start Filter out deleted question responses which are empty strings.
  
  var firstNameAnswerIndex = firstNameResponses.length - 1;
  var lastNameAnswerIndex = lastNameResponses.length - 1;

  for (var x = 0; x < firstNameResponses.length; x++) {
    if (firstNameResponses[x] != "") { firstNameAnswerIndex = x}
  }
  
  for (var b = 0; b < lastNameResponses.length; b++) {
    if (lastNameResponses[b] != "") { lastNameAnswerIndex = b}
  }
  
  // End filter out deleted question responses.
  
    var firstName = CapatalizeFirstLetter(firstNameResponses[firstNameAnswerIndex]);
    var lastName = CapatalizeFirstLetter(lastNameResponses[lastNameAnswerIndex]);
    var inputName = firstName + lastName;
    var comparisonName = inputName.replace(/\s+/g, '').toUpperCase();
    var timestamp = e.namedValues.Timestamp[0];
    var simpleDate = timestamp.slice(0, timestamp.indexOf(' '));
  
  //start for loop to go through each sheet in sheet list
  for (var i = 1; i < sheetListLength; i++) {
  sheet = getSheetById(spreadsheet, sheetList[i].id);
    if (sheet != null) {
      
   var fullSheetRange = sheet.getDataRange();
    var fullSheet = fullSheetRange.getValues();
      var fullSheetFontWeights = fullSheetRange.getFontWeights();
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
   
    //check if sorted sheet contains submitted name

    var indexOfComparisonName = names.indexOf(comparisonName);
    if (indexOfComparisonName == -1) {
        var MeetingAttendaceRow = names.length == 1 ?  2 : names.length + 1;
      //should so this on fullSheet array and then paste in array
        //sheet.insertRowBefore(MeetingAttendaceRow);
      var nameArrayToAdd = [firstName, lastName];
      var fontWeightArrayToAdd = ['normal', 'normal']
      while ( nameArrayToAdd.length != fullSheet[0].length) { nameArrayToAdd.push(''); }
       fullSheet.splice(MeetingAttendaceRow - 1, 0, nameArrayToAdd);
      
      var newName = true;  
        
    }
      else {
       var newName = false;
       
        
      }
      
     
      
      //increment "Number of Meetings Attended" Column
      //var numOfMeetingsAttendedRange = sheet.getRange(nameRow, sheet.getLastColumn());
      //numOfMeetingsAttendedRange.setValue(numOfMeetingsAttendedRange.getValue() + 1);
      var sheetDate;
      var needToAddDateColumn = true;
      var inputDate = new Date(simpleDate);
      var sheetDate;
      for (var q = 2; q < fullSheet[0].length - 1; q++) {
        sheetDate = fullSheet[0][q];
        if (sheetDate instanceof Date) {
          if (sheetDate.getDate()  === inputDate.getDate() && sheetDate.getMonth()  === inputDate.getMonth() && sheetDate.getFullYear()  === inputDate.getFullYear()) {
            needToAddDateColumn = false;
          }
        }
        

      }
      var alreadySignedIn = false;
      if (needToAddDateColumn === true) {
      
        fullSheet[0].splice(fullSheet[0].length - 1, 0, simpleDate);
        for (var z = 1; z < fullSheet.length; z++) { 
          fullSheet[z].splice(fullSheet[z].length -1, 0, ''); 
  
        }
     
        
      }
      if (newName === false && needToAddDateColumn === false) {
        var cellForDateAndPerson = sheet.getRange(indexOfComparisonName + 2, fullSheet[0].length - 1);
        if (cellForDateAndPerson.getBackground() != "#00ff00") {
          cellForDateAndPerson.setBackground("#00ff00");
        }
        else { alreadySignedIn = true; }
      }
      
      
      if ( newName === true) { 
        fullSheet[fullSheet.indexOf(nameArrayToAdd)][fullSheet[0].length - 1] = 1;
         fullSheet[fullSheet.length -1][fullSheet[0].length - 2] = Number(fullSheet[fullSheet.length -1][fullSheet[0].length - 2]) + 1;
      }
      else if (alreadySignedIn === false) { 
        fullSheet[indexOfComparisonName + 1][fullSheet[0].length - 1] = Number(fullSheet[indexOfComparisonName + 1][fullSheet[0].length - 1]) + 1; 
        fullSheet[fullSheet.length -1][fullSheet[0].length - 2] = Number(fullSheet[fullSheet.length -1][fullSheet[0].length - 2]) + 1;
      }
      
      //work on font weights
      // make correct number of rows
      while (fullSheetFontWeights.length !== fullSheet.length) {
      fullSheetFontWeights.push(['normal', 'normal']);
      }
      // make each row correct width
      for (var w = 0; w < fullSheetFontWeights.length; w++) {
        while (fullSheetFontWeights[w].length !== fullSheet[w].length) {
          fullSheetFontWeights[w].push('normal');
        }
        for (var r = 0; r< fullSheetFontWeights[w].length; r++) { fullSheetFontWeights[w][r] = 'normal'; }
      }
      fullSheetFontWeights[0][0] = 'bold';
      fullSheetFontWeights[0][1] = 'bold';
      fullSheetFontWeights[0][fullSheetFontWeights[0].length - 1] = 'bold';
      fullSheetFontWeights[fullSheetFontWeights.length - 1][0] = 'bold';
      
      //start values render
     var newRange = sheet.getRange(1, 1, fullSheet.length, fullSheet[0].length);
        newRange.setValues(fullSheet);   
      newRange.setFontWeights(fullSheetFontWeights);  
      //end values render
      
      // start working on color if newName and/or needToAddDateColumn is true
      if (newName === true || needToAddDateColumn === true) {
        /* more efficient method that's not working right now
        var numOfRows = newName === true ? fullSheet.length + 1 : fullSheet.length;
        var numOfColumns = needToAddDateColumn === true ? fullSheet[0].length + 1 : fullSheet.length;
        fullSheetRange = sheet.getRange(1, 1, numOfRows, numOfColumns);
        */
        fullSheetRange = sheet.getDataRange();
        var fullSheetBackgrounds = fullSheetRange.getBackgrounds();
        
        
        if (newName === true){
          for (var n = 2; n < fullSheetBackgrounds[0].length - 2; n++) {
          fullSheetBackgrounds[fullSheetBackgrounds.length - 2][n] = "#ff0000";
          }
          var nameRowIndex = fullSheet.length - 2;
        }
        else {
          var nameRowIndex = indexOfComparisonName + 1;  
        }
        if (needToAddDateColumn === true) {
        for (var y = 0; y < fullSheetBackgrounds.length; y++) {
          if (y === 0 || y === fullSheetBackgrounds.length - 1) {fullSheetBackgrounds[y][fullSheetBackgrounds[0].length - 2] = "#ffffff"; }
          else { fullSheetBackgrounds[y][fullSheetBackgrounds[0].length - 2] = "#ff0000"; }
        }
        
        }
        for (var w = 1; w < fullSheetBackgrounds.length - 1; w++) {
           fullSheetBackgrounds[w][fullSheetBackgrounds[w].length - 1] = '#ffffff';
           fullSheetBackgrounds[w][0] = '#ffffff'; 
           fullSheetBackgrounds[w][1] = '#ffffff';
      }
        fullSheetBackgrounds[nameRowIndex][fullSheetBackgrounds[0].length - 2] = "#00ff00";
        fullSheetBackgrounds[0][0] = '#e2e2e2';
        fullSheetBackgrounds[0][1] = '#e2e2e2';
        fullSheetBackgrounds[0][2] = '#ffffff';
        fullSheetBackgrounds[0][fullSheetBackgrounds[0].length - 1] = '#e2e2e2';
        fullSheetBackgrounds[fullSheetBackgrounds.length - 1][0] = '#e2e2e2';
        fullSheetRange.setBackgrounds(fullSheetBackgrounds);
      } // end color if
      removeRangeProtections(sheet);
      //start adding protections
      //protect top row
      sheet.getRange(1, 1, 1, fullSheet[0].length).protect().setWarningOnly(true);
    //protect last row
      sheet.getRange(fullSheet.length, 1, 1, fullSheet[0].length - 1).protect().setWarningOnly(true);
    //protect last column
      sheet.getRange(2, fullSheet[0].length, fullSheet.length - 2, 1).protect().setWarningOnly(true);
      //end adding protections
      sheet.getRange(1, fullSheet[0].length).setWrap(true);
      sheet.getRange(2, 1, fullSheet.length - 2, fullSheet[0].length).sort(2);
      var numberToShow = Number(sheetList[i].numberToShow);
      Logger.log(numberToShow);
      // start auto hiding date columns
      if (sheetList[i].numberToShow === 'none') {
        sheet.hideColumns(3, fullSheet[0].length - 3);
      }
      else if (sheetList[i].numberToShow !== 'all' && fullSheet[0].length - 3 > numberToShow) {
        sheet.hideColumns(3, fullSheet[0].length - 3 - sheetList[i].numberToShow);
      }
      else if (fullSheet[0].length - 3 < numberToShow) {
        sheet.showColumns(3, fullSheet[0].length - 3);
      }
      
      
    } // end check if sheet is null
  } // end sheet cycle for loop
} //end function
  
function SendFakeFormSubmits() {
  var e = { values: ['2015/05/04 15:00', 'Bob', 'Smith'], range: SpreadsheetApp.getActiveRange(), namedValues: {'First Name': ['this'], 'Timestamp': ['9/25/2015 20:54:13'], 'Last Name': ['will']}}
  AttendanceSorter(e);
  e = { values: ['2015/05/04 15:00', 'Bob', 'Smith'], range: SpreadsheetApp.getActiveRange(), namedValues: {'First Name': ['this'], 'Timestamp': ['9/27/2015 20:54:13'], 'Last Name': ['will']}}
  AttendanceSorter(e);
  e = { values: ['2015/05/04 15:00', 'Bob', 'Smith'], range: SpreadsheetApp.getActiveRange(), namedValues: {'First Name': ['this'], 'Timestamp': ['9/28/2015 20:54:13'], 'Last Name': ['will']}}
  AttendanceSorter(e);
  e = { values: ['2015/05/04 15:00', 'Bob', 'Smith'], range: SpreadsheetApp.getActiveRange(), namedValues: {'First Name': ['this'], 'Timestamp': ['10/29/2015 20:54:13'], 'Last Name': ['sam']}}
  AttendanceSorter(e);
  e = { values: ['2015/05/04 15:00', 'Bob', 'Smith'], range: SpreadsheetApp.getActiveRange(), namedValues: {'First Name': ['yam'], 'Timestamp': ['11/29/2015 20:54:13'], 'Last Name': ['sam']}}
  AttendanceSorter(e);
  AttendanceSorter(e);
    e = { values: ['2015/05/04 15:00', 'Bob', 'Smith'], range: SpreadsheetApp.getActiveRange(), namedValues: {'First Name': ['new'], 'Timestamp': ['11/29/2015 20:54:13'], 'Last Name': ['name']}}
  AttendanceSorter(e);
  }






      //Patterned countif
//=COUNTIFS(ArrayFormula(trim('Form Responses 16'!B2:B)),"test", ArrayFormula(trim('Form Responses 16'!C2:C)), "bacon" )
     

//formula to meeting attendance row bottoms
//=SUM(INDIRECT(ADDRESS(1,COLUMN())&":"&ADDRESS(ROW()-1,COLUMN())))
