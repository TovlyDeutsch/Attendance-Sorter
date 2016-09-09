// This is the code that is run whenever the linked form(s) are submitted
function AttendanceSorter (e) {
  
  //Take from Google at http://googleappsdeveloper.blogspot.com/2011/10/concurrency-and-google-apps-script.html
  // Get a public lock on this script, because we're about to modify a shared resource.
  var lock = LockService.getPublicLock();
  // Wait for up to 2 minutes for other processes to finish.
  lock.waitLock(120000);

  var spreadsheet = e.range.getSheet().getParent();
  var documentProperties = PropertiesService.getDocumentProperties();
  var sheetList = eval("[" + documentProperties.getProperty('Sheets') + "]");
  var sheetListLength = sheetList.length;
  var namedValues = e.namedValues;
  var objectKeys = Object.keys(namedValues);
  
  // Pull out first and last name question answer arrays
  for (var r = 0; r < objectKeys.length; r++) {
    
    if (objectKeys[r].replace(/\s+/g, '').toUpperCase() === "FIRSTNAME") {
      var possibleFirstNameResponseArray = namedValues[objectKeys[r]];
      for (var h = 0; h < possibleFirstNameResponseArray.length; h++) {
        if (possibleFirstNameResponseArray[h] != "") {var firstNameResponses = possibleFirstNameResponseArray }
      }
    }
    
    if (objectKeys[r].replace(/\s+/g, '').toUpperCase() === "LASTNAME") {
      var possibleLastNameResponseArray = namedValues[objectKeys[r]];
      for (var h = 0; h < possibleLastNameResponseArray.length; h++) {
        if (possibleLastNameResponseArray[h] != "") {var lastNameResponses = possibleLastNameResponseArray }
      }
    }
    
  } // End for loop
  
  // Filter out deleted question responses which are empty strings.
  
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

  //start for loop to go through each sheet in sheet list. (all or just one)
  //for loop starts at 1 because first slot in sheetlist array is not a sheet. Why?
  for (var i = 1; i < sheetListLength; i++) {
    
    var sheet = getSheetById(spreadsheet, sheetList[i].id);
    if (sheet != null) {
      var fullSheetRange = sheet.getDataRange();
      var fullSheet = fullSheetRange.getValues();
      var names = standardizeNames(JSON.parse(JSON.stringify(fullSheet.slice(1))));
      
    //check if sorted sheet contains submitted name

      var indexOfComparisonName = names.indexOf(comparisonName);
      if (indexOfComparisonName == -1) {
      var MeetingAttendanceRow = names.length == 1 ?  2 : names.length + 1;
      var nameArrayToAdd = [firstName, lastName];
      //add empty cells to fit row width
      while ( nameArrayToAdd.length != fullSheet[0].length) { nameArrayToAdd.push(''); }
      fullSheet.splice(MeetingAttendanceRow - 1, 0, nameArrayToAdd);
      var newName = true;  
      }
      else {
      var newName = false;
      }
      
      var needToAddDateColumn = checkIfDateExists(fullSheet);

      var alreadySignedIn = false;
      //if need to add date column, add date and coulumn
      if (needToAddDateColumn === true) {
        fullSheet[0].splice(fullSheet[0].length - 1, 0, new Date());
        for (var z = 1; z < fullSheet.length; z++) { fullSheet[z].splice(fullSheet[z].length - 1, 0, ''); }
      }
      //neither new name or new column make green
      if (newName === false && needToAddDateColumn === false) {
        var cellForDateAndPerson = sheet.getRange(indexOfComparisonName + 2, fullSheet[0].length - 1);
        if (cellForDateAndPerson.getBackground() != "#00ff00") {
          cellForDateAndPerson.setBackground("#00ff00");
        }
        //if cell color is green, then the person must have already signed in
        else { alreadySignedIn = true; }
      }
      
      if ( newName === true) { 
        // make number of meetings attended = 1 and increment meeting attedance cell
        fullSheet[fullSheet.indexOf(nameArrayToAdd)][fullSheet[0].length - 1] = 1;
        fullSheet[fullSheet.length -1][fullSheet[0].length - 2] = Number(fullSheet[fullSheet.length -1][fullSheet[0].length - 2]) + 1;
      }
      else if (alreadySignedIn === false) { 
        //increment number of meetings attended and meeting attedance cell
        fullSheet[indexOfComparisonName + 1][fullSheet[0].length - 1] = Number(fullSheet[indexOfComparisonName + 1][fullSheet[0].length - 1]) + 1; 
        fullSheet[fullSheet.length -1][fullSheet[0].length - 2] = Number(fullSheet[fullSheet.length -1][fullSheet[0].length - 2]) + 1;
      }
      
      
      
      //start values render
      var newRange = sheet.getRange(1, 1, fullSheet.length, fullSheet[0].length);
      newRange.setValues(fullSheet);    
      setFontWeights(fullSheet,newRange);
      //end values render
      
      // start working on color if newName and/or needToAddDateColumn is true
      if (newName === true || needToAddDateColumn === true) {
        
        fullSheetRange = sheet.getDataRange();
        var fullSheetBackgrounds = fullSheetRange.getBackgrounds();
        var numOfRows = fullSheetBackgrounds.length;
        var numOfColumns = fullSheetBackgrounds[0].length;
        if (newName === true){
          for (var n = 2; n < numOfColumns - 2; n++) {fullSheetBackgrounds[numOfRows - 2][n] = "#ff0000";}
          var nameRowIndex = fullSheet.length - 2;
        }
        else {var nameRowIndex = indexOfComparisonName + 1;}
        if (needToAddDateColumn === true) {
          for (var y = 0; y < fullSheetBackgrounds.length; y++) {
            if (y === 0 || y === numOfRows - 1) {fullSheetBackgrounds[y][numOfColumns - 2] = "#ffffff"; }
            else { fullSheetBackgrounds[y][numOfColumns - 2] = "#ff0000"; }
          }
        }
        for (var w = 1; w < numOfRows - 1; w++) {
          fullSheetBackgrounds[w][fullSheetBackgrounds[w].length - 1] = '#ffffff';
          fullSheetBackgrounds[w][0] = '#ffffff'; 
          fullSheetBackgrounds[w][1] = '#ffffff';
        }
        fullSheetBackgrounds[nameRowIndex][numOfColumns - 2] = "#00ff00";
        fullSheetBackgrounds[0].splice(0,3,'#e2e2e2','#e2e2e2','#ffffff');
        fullSheetBackgrounds[0][numOfColumns - 1] = '#e2e2e2';
        fullSheetBackgrounds[numOfRows - 1][0] = '#e2e2e2';
        Logger.log(fullSheetBackgrounds);
        fullSheetRange.setBackgrounds(fullSheetBackgrounds);
      } // end color work if
      
      sortAndProtect(fullSheet,sheet);
      autoHideCoulumns(sheetList, fullSheet, i);
  
    } // end check if sheet is null
  } // end sheet cycle for loop
  
  // Release the lock so that other processes can continue.
  lock.releaseLock();
  
} //end function
  

//Debug
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

//Possible Code

//Patterned countif for counting 
//=COUNTIFS(ArrayFormula(trim('Form Responses 16'!B2:B)),"test", ArrayFormula(trim('Form Responses 16'!C2:C)), "bacon" )
     

//formula to meeting attendance row bottoms
//=SUM(INDIRECT(ADDRESS(1,COLUMN())&":"&ADDRESS(ROW()-1,COLUMN())))
