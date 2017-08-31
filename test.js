function myFunction() {
  var name = "**Type Name**: target-copy-options";
  var regExp = new RegExp(/(\*\*|__)(.*?)(\*\*|__)/); // "i" is for case insensitive
  Logger.log(regExp.test(name));
  //var lastName = regExp.exec(name)[1];
  //Logger.log(lastName); // Smith  
}


function testLists() {
  var jsonMessage = {'key1': 5, 'key2': 7};
  var cells = [];
  var cell = [];
  cell.push(jsonMessage);
  cells.push(cell);
  Logger.log(cell);
  Logger.log(cells);
  
}

function testStrings() {
  s = 'abc';
  Logger.log(s == true);
  Logger.log(s == false);
}

function testProps() {
  var action_id = '1QGb8xBl6tWLBkpBygtLdV1ncr8SOyiAhOQWw_dTROrc';
  var spreadsheet = SpreadsheetApp.openById(action_id);
  var sheetProps = spreadsheet.getSheetByName('props');

  var propVals = sheetProps.getDataRange().getValues();
  Logger.log(propVals[8][2]);
  
}