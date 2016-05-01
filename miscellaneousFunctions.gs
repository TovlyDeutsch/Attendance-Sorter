 function CapatalizeFirstLetter(word) {
     return (word.charAt(0).toUpperCase() + word.slice(1)).trim();
 }

 function sliceName(name) {
     // returns first name as first array item and last name as last array item
     return [(name.charAt(0).toUpperCase() + name.slice(1, name.indexOf(" "))).trim(), (name.slice(name.indexOf(" ") + 1, name.indexOf(" ") + 2).toUpperCase() + name.slice(name.indexOf(" ") + 2)).trim()]

 }

 function getSheetById(ss, id) {
     var sheets = ss.getSheets();
     for (var i = 0; i < sheets.length; i++) {
         if (sheets[i].getSheetId() == id) {
             return sheets[i];
         }
     }
     return null;
 }

 function getFormEditUrl() {
     return SpreadsheetApp.getActiveSpreadsheet().getFormUrl();
 }

 function getFormEditUrl() {
     return SpreadsheetApp.getActiveSpreadsheet().getFormUrl();

 }

function removeRangeProtections(sheet) {

      var protections = sheet.getProtections(SpreadsheetApp.ProtectionType.RANGE);
      for (var za = 0; za < protections.length; za++) { protections[za].remove() }
   
}