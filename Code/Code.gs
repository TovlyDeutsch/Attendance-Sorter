 function onInstall() {
     SpreadsheetApp.getUi().createAddonMenu()
         .addItem('Create attendance sheet', 'openWelcomingCreateSheetSidebar')
         .addToUi();

     var documentProperties = PropertiesService.getDocumentProperties();
     documentProperties.setProperties({
       'Version': '15'
     });

 }

function onOpen(e) {
   
  if (e.authMode == ScriptApp.AuthMode.NONE) {
    SpreadsheetApp.getUi().createAddonMenu()
         .addItem('Create attendance sheet', 'openWelcomingCreateSheetSidebar')
         .addToUi();
  }
  
  else { // if authmode is limited, add-on is enabled
    var spreadsheet = SpreadsheetApp.getActive(); 
    var documentProperties = PropertiesService.getDocumentProperties();
    var sheetList = eval("[" + documentProperties.getProperty('Sheets') + "]");
    var sheetExists = false;
    var sheet;
    
    for (var i = 1; i < sheetList.length; i++) {
      sheet = getSheetById(spreadsheet, sheetList[i].id);
      if (sheet != null) { sheetExists = true;}
    }
    
    if (sheetExists === false) {
      populateLimitedAddOnMenu()
    }
    
    else { // sheets exist
      populateFullAddOnMenu();
    } // end sheet exists

  } //end auth mode is limitied
} // end onOpen()

function openMarkAttendanceSidebar () {
  var html = HtmlService.createHtmlOutputFromFile('MarkAttendanceSidebar')
                .setTitle('Mark attendance')
                .setWidth(300)
                .setSandboxMode(HtmlService.SandboxMode.IFRAME);
            SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
            .showSidebar(html);
}

function openWelcomingCreateSheetSidebar () {
  var html = HtmlService.createHtmlOutputFromFile('WelcomingCreateSheetSidebar')
         .setTitle('Attendance Sorter Sheet Creation')
         .setWidth(300)
         .setSandboxMode(HtmlService.SandboxMode.IFRAME);
     SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
     .showSidebar(html);
}

function openFormSidebar () {
  var html = HtmlService.createHtmlOutputFromFile('FormSidebar')
         .setTitle('Attendance Sorter Form Creation')
         .setWidth(300)
         .setSandboxMode(HtmlService.SandboxMode.IFRAME);
     SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
     .showSidebar(html);
}

function openInsertRosterSidebar() {
  var spreadsheet = SpreadsheetApp.getActive(); 
    var documentProperties = PropertiesService.getDocumentProperties();
    var sheetList = eval("[" + documentProperties.getProperty('Sheets') + "]");
    var sheetExists = false;
    var sheet;
    
    for (var i = 1; i < sheetList.length; i++) {
      sheet = getSheetById(spreadsheet, sheetList[i].id);
      if (sheet != null) { sheetExists = true;}
    }
  if (sheetExists === true) {
  var html = HtmlService.createHtmlOutputFromFile('InsertRosterSidebar')
         .setTitle('Add Names')
         .setWidth(300)
         .setSandboxMode(HtmlService.SandboxMode.IFRAME);
     SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
     .showSidebar(html);
  }
  else {
    populateLimitedAddOnMenu();
    var ui = SpreadsheetApp.getUi()
      ui.alert(
       'No Attendance Sorter sheet exists',
       "Your spreadsheet doesn't contain any sheets created by Attendance Sorter. First you'll need to create a sheet by clicking Add-ons > Attendance Sorter > Create sheet.", 
        ui.ButtonSet.OK);
  }
}



function settingsDialog() {
  var html = HtmlService.createHtmlOutputFromFile('SettingsDialog')
                .setSandboxMode(HtmlService.SandboxMode.IFRAME)
                .setWidth(400)
                .setHeight(300);
            SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
            .showModalDialog(html, 'Attendance Sorter Settings');
}


 function openCreateSheetSidebar() {
     var html = HtmlService.createHtmlOutputFromFile('CreateSheetSidebar')
         .setTitle('Attendance Sorter Sheet Creation')
         .setWidth(300)
         .setSandboxMode(HtmlService.SandboxMode.IFRAME);
     SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
     .showSidebar(html);
 }

 function openCreateSheetSidebar() {
     var html = HtmlService.createHtmlOutputFromFile('CreateSheetSidebar')
         .setTitle('Attendance Sorter Setup')
         .setWidth(300)
         .setSandboxMode(HtmlService.SandboxMode.IFRAME);
     SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
     .showSidebar(html);
 }

function populateFullAddOnMenu () {
 SpreadsheetApp.getUi().createAddonMenu()
         .addItem('Create attendance sheet', 'openCreateSheetSidebar')
         .addItem('Add names', 'openInsertRosterSidebar')
         .addItem('Mark attendance', 'openMarkAttendanceSidebar')
         .addSeparator()
         .addItem('Create attendance form', 'openFormSidebar')
         .addSeparator()
         .addItem('Settings', 'settingsDialog')
         .addToUi(); 
}

function populateLimitedAddOnMenu() {
        SpreadsheetApp.getUi().createAddonMenu()
          .addItem('Create sheet', 'openWelcomingCreateSheetSidebar')
          .addToUi();
}

function getExistingSheets() {
  var spreadsheet = SpreadsheetApp.getActive();
  var documentProperties = PropertiesService.getDocumentProperties();
  var sheetList = eval("[" + documentProperties.getProperty('Sheets') + "]");
  var existingSheets = [];
  var comparisonSheet;
  var activeSheetFound = false;
  var activeSheetId = spreadsheet.getActiveSheet().getSheetId().toString();
  for (var i = 1; i < sheetList.length; i++) {
    comparisonSheet = getSheetById(spreadsheet,sheetList[i].id);
    if(comparisonSheet !== null) {
      if (activeSheetFound === false && activeSheetId == sheetList[i].id) {
        existingSheets.push({sheetId: sheetList[i].id, sheetName: comparisonSheet.getSheetName(), isActiveSheet: true });
        activeSheetFound = true;
      }
      else {
      existingSheets.push({sheetId: sheetList[i].id, sheetName: comparisonSheet.getSheetName(), isActiveSheet: false });
      }
    } 
  }
  return existingSheets;
}


