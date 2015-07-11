
  function onInstall(){
  onOpen();
    var spreadsheet = SpreadsheetApp.getActive();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  ScriptApp.newTrigger("AttendanceSorter").forSpreadsheet(ss).onFormSubmit().create();
    var documentProperties = PropertiesService.getDocumentProperties();
    documentProperties.setProperties({
      'Sorting': '1',
      'formNum': '0'
      
      
    });
    
    
   
    
 }
function onOpen(){
  var globalVar = PropertiesService.getUserProperties();
    globalVar.setProperty('test', 'alpine');
  
  var spreadsheet = SpreadsheetApp.getActive();
  
    SpreadsheetApp.getUi().createAddonMenu()
    .addItem('Setup', 'SetupStep1')
      .addSeparator()
      .addItem('Settings', 'Settings')
    .addSeparator()
      .addItem('DebugSheet', 'gsFormCreateSuccess')
    .addToUi();
    
  
}
function SetupStep1 () {
   var formUrl = SpreadsheetApp.getActiveSpreadsheet().getFormUrl();
  //check if a form is already attache to the spreadsheet
  if (formUrl !== null) {
    /*
    var form = FormApp.openByUrl(formUrl);
    var items = form.getItems();
    var firstItem = items[0];
    var secondItem = items[1];
    if ((firstItem.getType() == FormApp.ItemType.PARAGRAPH_TEXT && firstItem.getTitle().toUpperCase() == "NAME") || (firstItem.getType() == FormApp.ItemType.PARAGRAPH_TEXT && firstItem.getTitle().toUpperCase() == "FIRST NAME" && secondItem.getType() == FormApp.ItemType.PARAGRAPH_TEXT && secondItem.getTitle().toUpperCase() == "LAST NAME")) {
      var ui = SpreadsheetApp.getUi()
    ui.alert(
     'Valid form already exists',
     'You already have a valid form attached to this spreadsheet so the first step of creating a form will be skipped.',
      ui.ButtonSet.OK)
    var html = HtmlService.createHtmlOutputFromFile('CreateSheetSidebar.html')
  .setTitle('Attendance Sorter Setup')
      .setWidth(300)
  .setSandboxMode(HtmlService.SandboxMode.IFRAME);
  SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
      .showSidebar(html);
     
    }
    else { */
      var ui = SpreadsheetApp.getUi()
    ui.alert(
     'Form already attached',
     'This spreadsheet already has a form linked to it. If you already created the form through Attendance sorter and want to modify it, please click "Add-ons > Attendance Sorter > Form settings". If you did not create the from using Attendance Sorter, please unlink the form by clicking "Form > Unlink" before starting Attendance Sorter setup ',
      ui.ButtonSet.OK)
    return;
    //}
  }
  var documentProperties = PropertiesService.getDocumentProperties();
 /* if (documentProperties.getProperty('Setup') == 'true') {
    var ui = SpreadsheetApp.getUi()
    ui.alert(
     'Setup has already been completed',
     "The setup of Attendance Sorter has already been completed on this spreadsheet. If you'd like to change form settings, please click Add-ons > Attendance Sorter > Form settings. If you'd like to create a new formatted sheet, please click Add-ons > Attendance Sorter > Create new sheet.",
      ui.ButtonSet.OK)
  }
  else {*/
  var html = HtmlService.createHtmlOutputFromFile('SetupSidebar')
  .setTitle('Attendance Sorter Setup')
      .setWidth(300)
  .setSandboxMode(HtmlService.SandboxMode.IFRAME);
  SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
      .showSidebar(html);
  
   
    documentProperties.setProperties({
      'Setup': 'true',
      
      
    });
 // }
  
}


//This function creates a form and sets it up
function createForm (numOfQuestions,formTitle,formName) {
  Logger.log('create form ran');
   Logger.log('create form ran' + formTitle);
  //check if a form is already attache to the spreadsheet
  if (SpreadsheetApp.getActiveSpreadsheet().getFormUrl() !== null) {
    Logger.log('error ran');
    var ui = SpreadsheetApp.getUi()
    ui.alert(
     'Form already attached',
     'This spreadsheet already has a form linked to it. If you already created the form through Attendance sorter and want to modify it, please click "Add-ons > Attendance Sorter > Form settings". If you did not create the form using Attendance Sorter, please unlink the form by clicking "Form > Unlink" before starting Attendance Sorter setup ',
      ui.ButtonSet.OK)
    return;
  }
/*
    var documentProperties = PropertiesService.getDocumentProperties();
    var newFormNum = parseInt(documentProperties.getProperty('formNum')) + 1;
    documentProperties.setProperties({
      'formNum': newFormNum
      
      
    });
    */
 
    var form = FormApp.create(formName);
 
  form.setTitle(formTitle);
  if (numOfQuestions === 1) {
 var item = form.addTextItem();
 item.setTitle('Name');
  }
  else {
    var item1 = form.addTextItem();
    item1.setTitle('First Name');
    var item2 = form.addTextItem();
    item2.setTitle('Last Name');
  }

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());
    var documentProperties = PropertiesService.getDocumentProperties();
 
} //end create Form function

// this function runs whenever the form connected to the spreadsheet is submitted. You can see project triggers by hitting the clock icon on the menu
function AttendanceSorter (e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
 var sheet = ss.getSheetByName("Sorted Attendance");
Logger.log("it ran kjlsdafj");
  var d = new Date();
  var n = d.getDay();
  var dayOfMeeting = 2
  //only runs the program on tuesdays
  // if (n === dayOfMeeting){
 //gets active spreadsheet  and first sheet

  
   //variable declerations
    var array = e.values
    var inputName = array[array.length - 1];
    var firstName = inputName.charAt(0).toUpperCase() + inputName.slice(1,inputName.indexOf(" "))
    var lastName = inputName.slice(inputName.indexOf(" ")+1,inputName.indexOf(" ")+2).toUpperCase() + inputName.slice(inputName.indexOf(" ")+2)
    Logger.log(firstName)
    Logger.log(lastName)

   //iterates through all the rows with text in column B. It stops when it either 
   //1.finds that the input matches an cell in column B or 
   //2. it finds an empty cell
   for (var k = 2; k < 300; k ++){
     //gets the cell in column A in a given row.
      var lastNameRecordedRange = sheet.getRange(k,2);
     
      var lastNameRecordedName = lastNameRecordedRange.getValue();
     
      
     // this block of code executes when the input equals the cell being read. 
     if (lastName === lastNameRecordedName && firstName === sheet.getRange(k,1).getValue()) {
     //adds 1 to the cell to the right of cell being checked (outputName)
       if (lastNameRecordedRange.getNote().slice(0,15) == "Signed in today"){
       break;
       }
      var rowToAdd = k
       var rangeToAdd = sheet.getRange(rowToAdd,3);
       var currentValue = rangeToAdd.getValue();
       rangeToAdd.setValue(currentValue + 1);
       lastNameRecordedRange.setNote("Signed in today"+ lastNameRecordedRange.getNote() + "\n" + d.toLocaleString());
       //ends the loop
             break;

       }
     //this block of code runs if the cell being checked (outputName)
     else if (lastNameRecordedName === "" ) {
      lastNameRecordedRange.setValue(lastName);
       sheet.getRange(k,1).setValue(firstName);
       var rowToAdd = k;
       var rangeToAdd = sheet.getRange(rowToAdd,3);
       var currentValue = rangeToAdd.getValue();
       rangeToAdd.setValue(1);
        lastNameRecordedRange.setNote("Signed in today" + "\n" + d.toLocaleString());
      
       //ends the loop
           break;

     }
   
  }
    sheet.sort(2);
 // end bracket for the day checker if statement }
 
   }
function tuesdayStart () {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var formUrl = ss.getFormUrl()
 
   var form = FormApp.openByUrl(
     formUrl.slice(0,formUrl.lastIndexOf("v")) + "edit"
     );
    form.setConfirmationMessage("Thank you for signing in. ")
     
}
function tuesdayEnd(){
    var ss = SpreadsheetApp.getActiveSpreadsheet();
 var sheet = ss.getSheets()[0];
  var formUrl = ss.getFormUrl()
    var form = FormApp.openByUrl(
      formUrl.slice(0,formUrl.lastIndexOf("v")) + "edit"
     );
    form.setConfirmationMessage("Today is not tuesday. Shawnee Tv meets on tuesdays. Your sign in is prohibited. ")
    for (var j = 2; j<300; j++){
      var outputRange = sheet.getRange(j,2);
      if (outputRange.getValue() != ""){
      outputRange.setNote(outputRange.getNote().slice(15))
      }
      else{
        break;
      }
    }
}

function createSheet(sheetType) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  
  function numberDeterminer(name) {
   var number = 1;
    while (ss.getSheetByName(name + ' ' + number) != null) {
      number++;
    }
    return number; 
  }
  
  if (sheetType == 'dataful') {
    var number = numberDeterminer('Sorted Attendance - Dataful');
    var newSheet = ss.insertSheet("Sorted Attendance - Dataful" + " " + number);
    newSheet.getRange(1, 1).setValue('First Name');
    newSheet.getRange(1, 2).setValue('Last Name');
    newSheet.getRange(2, 1).setValue('Meeting Attendance');
    newSheet.getRange(1, 3).setValue('Number of Meetings attended');
    newSheet.setColumnWidth(3, 190);
    newSheet.setFrozenRows(1);
    newSheet.setFrozenColumns(2);
    
  }
  else {
    var number = numberDeterminer('Sorted Attendance - Simple');
    var newSheet = ss.insertSheet("Sorted Attendance - Simple" + " " + number);
    newSheet.getRange(1, 1).setValue('First Name');
    newSheet.getRange(1, 2).setValue('Last Name');
    newSheet.getRange(1, 3).setValue('Number of Meetings attended');
    newSheet.setColumnWidth(3, 190);
    newSheet.setFrozenRows(1);
    newSheet.setFrozenColumns(2);
    
  }
  

}

function gsSheetCreateSuccess() {
  var formName = FormApp.openByUrl(SpreadsheetApp.getActiveSpreadsheet().getFormUrl()).getTitle();
  var ui = SpreadsheetApp.getUi()
    ui.alert(
     'Setup Complete',
      "Success! You've Successfully setup Attendance Sorter on this spreadsheet. Your users will sign on your form called " + '"' + formName + '" , which you can find in "My Drive". The sorted attendance will appear in the sheet you just created.',
      ui.ButtonSet.OK)
}

function gsSheetCreateFail() {
  var ui = SpreadsheetApp.getUi()
    ui.alert(
     'Sheet could not be created',
      "A sheet could not be created. Please close this dialog and try again. If this issue persists, please report the issue via Add-ons > Attendance Sorter > Help",
      ui.ButtonSet.OK)
}

function Settings() {
   var html = HtmlService.createHtmlOutputFromFile('Settings').setWidth(1000)
      .setHeight(500);
  SpreadsheetApp.getActive().show(html);
   var globalVar = PropertiesService.getUserProperties();
   var toAdd = globalVar.getProperty('test');
  Logger.log(toAdd)
  

}

function UpdatePref (Pref) {
  var documentProperties = PropertiesService.getDocumentProperties();
  documentProperties.setProperties({
    
    'Sorting': Pref[0]
    
    
  });
   
  Logger.log(documentProperties.getProperty('Sorting')); 
}

function gsFormCreateFail(e) {
      var ui = SpreadsheetApp.getUi()
    ui.alert(
     'Form could not be created',
     'The Form could not be created. Please close this dialog and try again. If this issue persists, please report the issue via Add-ons > Attendance Sorter > Help',
      ui.ButtonSet.OK)
    /*
    MailApp.sendEmail("tovlydeutsch@gmail.com", "Error report", 
      "\r\nMessage: " + e.message
      + "\r\nFile: " + e.fileName
      + "\r\nLine: " + e.lineNumber);
      */
  
}
function gsFormCreateSuccess(e) {
  Logger.log('success');
      var html = HtmlService.createHtmlOutputFromFile('CreateSheetSidebar.html')
  .setTitle('Attendance Sorter Setup')
      .setWidth(300)
  .setSandboxMode(HtmlService.SandboxMode.IFRAME);
  SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
      .showSidebar(html);
  
}

  
  
  


function updateSheetPreview (sheetType) {
 var valueData = [["Name", (new Date(1379995200000)), (new Date(1381204800000)), (new Date(1382587200000)), (new Date(1384837200000)), (new Date(1386046800000)), (new Date(1389070800000)), (new Date(1391490000000)), (new Date(1392699600000)), (new Date(1393909200000)), (new Date(1393909200000)), (new Date(1398744000000)), (new Date(1401163200000)), "Number of Meetings attended"], ["John Doe", "", "", "", "", "", "", "", "", "", "", "", "", 7], ["James Smith", "", "", "", "", "", "", "", "", "", "", "", "", 8], ["Emma Torres", "", "", "", "", "", "", "", "", "", "", "", "", 13], ["William Johnson", "", "", "", "", "", "", "", "", "", "", "", "", 4], ["Andree Sharkey", "", "", "", "", "", "", "", "", "", "", "", "", 5], ["Flavia Gaillard", "", "", "", "", "", "", "", "", "", "", "", "", 9], ["Candance Mauck", "", "", "", "", "", "", "", "", "", "", "", "", 5], ["Cleopatra Mcray", "", "", "", "", "", "", "", "", "", "", "", "", 1], ["Maryjane Waxman", "", "", "", "", "", "", "", "", "", "", "", "", 5], ["Hui Bellantoni", "", "", "", "", "", "", "", "", "", "", "", "", 7], ["Latia Veasley", "", "", "", "", "", "", "", "", "", "", "", "", 2], ["Jennie Dresser", "", "", "", "", "", "", "", "", "", "", "", "", 7], ["Jaleesa Waldow", "", "", "", "", "", "", "", "", "", "", "", "", 7], ["Salena Rishel", "", "", "", "", "", "", "", "", "", "", "", "", 1], ["Molly Hentges", "", "", "", "", "", "", "", "", "", "", "", "", 1], ["Jeanene Lemarr", "", "", "", "", "", "", "", "", "", "", "", "", 8], ["Lou Sheen", "", "", "", "", "", "", "", "", "", "", "", "", 1], ["Odis Lindblad", "", "", "", "", "", "", "", "", "", "", "", "", 12], ["Cordelia Gearing", "", "", "", "", "", "", "", "", "", "", "", "", 13], ["Lewis Sexson", "", "", "", "", "", "", "", "", "", "", "", "", 10], ["Shona Isenhour", "", "", "", "", "", "", "", "", "", "", "", "", 11], ["Alphonse Trieu", "", "", "", "", "", "", "", "", "", "", "", "", 7], ["Tanesha Kunze", "", "", "", "", "", "", "", "", "", "", "", "", 7], ["Luba Gotto", "", "", "", "", "", "", "", "", "", "", "", "", 10], ["Charlesetta Bard", "", "", "", "", "", "", "", "", "", "", "", "", 5], ["Tina Koury", "", "", "", "", "", "", "", "", "", "", "", "", 5], ["Connie Kalman", "", "", "", "", "", "", "", "", "", "", "", "", 11], ["Halina Yadao", "", "", "", "", "", "", "", "", "", "", "", "", 11], ["Kellee Outen", "", "", "", "", "", "", "", "", "", "", "", "", 1], ["Jamar Moretz", "", "", "", "", "", "", "", "", "", "", "", "", 3], ["Sadie An", "", "", "", "", "", "", "", "", "", "", "", "", 1], ["Javier Gorton", "", "", "", "", "", "", "", "", "", "", "", "", 2], ["Meeting Attendance", 23, 24, 16, 23, 18, 22, 12, 22, 23, 17, 19, 20, ""]]   
var colorData = [["#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff"], ["#ffffff", "#ff0000", "#00ff00", "#ff0000", "#00ff00", "#ff0000", "#ff0000", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#ff0000", "#ffffff"], ["#ffffff", "#00ff00", "#ff0000", "#00ff00", "#00ff00", "#ff0000", "#00ff00", "#ff0000", "#00ff00", "#00ff00", "#ff0000", "#00ff00", "#00ff00", "#ffffff"], ["#ffffff", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#ffffff"], ["#ffffff", "#00ff00", "#00ff00", "#ff0000", "#00ff00", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#00ff00", "#ff0000", "#ff0000", "#ffffff"], ["#ffffff", "#00ff00", "#00ff00", "#ff0000", "#00ff00", "#00ff00", "#ff0000", "#ff0000", "#00ff00", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ffffff"], ["#ffffff", "#00ff00", "#ff0000", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#ff0000", "#00ff00", "#00ff00", "#ff0000", "#00ff00", "#00ff00", "#ffffff"], ["#ffffff", "#00ff00", "#ff0000", "#00ff00", "#00ff00", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#00ff00", "#00ff00", "#ff0000", "#ff0000", "#ffffff"], ["#ffffff", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#00ff00", "#ff0000", "#ff0000", "#ff0000", "#ffffff"], ["#ffffff", "#00ff00", "#00ff00", "#ff0000", "#ff0000", "#00ff00", "#00ff00", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#00ff00", "#ffffff"], ["#ffffff", "#00ff00", "#00ff00", "#ff0000", "#00ff00", "#00ff00", "#00ff00", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#00ff00", "#00ff00", "#ffffff"], ["#ffffff", "#ff0000", "#00ff00", "#ff0000", "#00ff00", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ffffff"], ["#ffffff", "#00ff00", "#ff0000", "#ff0000", "#00ff00", "#00ff00", "#ff0000", "#ff0000", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#ff0000", "#ffffff"], ["#ffffff", "#ff0000", "#00ff00", "#ff0000", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#ff0000", "#ff0000", "#ff0000", "#ffffff"], ["#ffffff", "#00ff00", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ffffff"], ["#ffffff", "#00ff00", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ffffff"], ["#ffffff", "#ff0000", "#00ff00", "#ff0000", "#00ff00", "#00ff00", "#ff0000", "#ff0000", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#ffffff"], ["#ffffff", "#ff0000", "#00ff00", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ffffff"], ["#ffffff", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#ffffff"], ["#ffffff", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#ffffff"], ["#ffffff", "#00ff00", "#00ff00", "#00ff00", "#ff0000", "#00ff00", "#00ff00", "#ff0000", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#ffffff"], ["#ffffff", "#00ff00", "#00ff00", "#ff0000", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#ffffff"], ["#ffffff", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#00ff00", "#00ff00", "#00ff00", "#ffffff"], ["#ffffff", "#ff0000", "#00ff00", "#ff0000", "#00ff00", "#ff0000", "#00ff00", "#ff0000", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#ff0000", "#ffffff"], ["#ffffff", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#ff0000", "#00ff00", "#00ff00", "#ff0000", "#00ff00", "#00ff00", "#ffffff"], ["#ffffff", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#00ff00", "#ff0000", "#00ff00", "#00ff00", "#00ff00", "#ff0000", "#00ff00", "#ffffff"], ["#ffffff", "#ff0000", "#ff0000", "#00ff00", "#00ff00", "#ff0000", "#00ff00", "#ff0000", "#ff0000", "#00ff00", "#ff0000", "#ff0000", "#00ff00", "#ffffff"], ["#ffffff", "#ff0000", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#ff0000", "#00ff00", "#00ff00", "#ffffff"], ["#ffffff", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#00ff00", "#ff0000", "#ffffff"], ["#ffffff", "#00ff00", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ffffff"], ["#ffffff", "#00ff00", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#00ff00", "#ff0000", "#00ff00", "#ff0000", "#ff0000", "#ff0000", "#ffffff"], ["#ffffff", "#ff0000", "#00ff00", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ffffff"], ["#ffffff", "#ff0000", "#00ff00", "#ff0000", "#ff0000", "#ff0000", "#00ff00", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ff0000", "#ffffff"], ["#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff"]];              
 var ss = SpreadsheetApp.getActiveSpreadsheet();
var previewSheet = ss.getSheetByName('Preview Sheet');
if (previewSheet != null) {
  SpreadsheetApp.setActiveSheet(previewSheet);
}
  else {
    previewSheet = ss.insertSheet("Preview Sheet");
  }

 var sampleRange = previewSheet.getRange(1, 1, 34, 14);
  sampleRange.setValues(valueData);
   sampleRange.setBackgrounds(colorData);
 // range2.setBackgrounds(colors); 
}

function debug (text) {
  
 
  Logger.log(text);  
}
