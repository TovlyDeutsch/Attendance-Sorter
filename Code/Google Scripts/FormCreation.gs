//This function creates a form for collecting attendance and sets it up
function createForm (numOfQuestions,formTitle,formName) {

  var form = FormApp.create(formName).setTitle(formTitle);
  var item1 = form.addTextItem().setTitle('First Name');
  var item2 = form.addTextItem().setTitle('Last Name');
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());
  // check if trigger doesn't exist and add it if it doesn't
  var projectTriggers = ScriptApp.getUserTriggers(ss);
  var formSubmitTriggerExists = false;
  for (var z = 0; z < projectTriggers.length; z++) { 
    if (projectTriggers[z].getHandlerFunction() == "AttendanceSorter") {
      formSubmitTriggerExists = true;
    }
  }
  
  if (formSubmitTriggerExists === false) {
    ScriptApp.newTrigger("AttendanceSorter").forSpreadsheet(ss).onFormSubmit().create();
  }
  
} //end createForm function

function gsFormCreateFail(e) {
  var ui = SpreadsheetApp.getUi()
  ui.alert(
    'Form could not be created',
    'The Form could not be created. Please close this dialog and try again. If this issue persists, please report the issue via Add-ons > Attendance Sorter > Help',
    ui.ButtonSet.OK)
}

function gsFormCreateSuccess(e) {
var html = HtmlService.createTemplateFromFile('FormCreated')
            .evaluate()
            .setSandboxMode(HtmlService.SandboxMode.IFRAME)
            .setWidth(730)
            .setHeight(155);
  SpreadsheetApp.getUi().showModalDialog(html, 'Form Created');
}