// declare constants
var colSCENARIO_STEP = 0;
var colSCENARIO_INTERFACE = 1;
var colSCENARIO_IMAGE = 2
var colSCENARIO_DESCRIPTION = 3;
var colSCENARIO_ACTION = 4;
var colSCENARIO_TARGET_TYPE = 5;
var colSCENARIO_TARGET_SPECIFIER = 6;
var colSCENARIO_TARGET_OPTIONS = 7;
var colSCENARIO_ACTUATOR_TYPE = 8;
var colSCENARIO_ACTUATOR_SPECIFIER = 9;
var colSCENARIO_MODIFIER = 10;
var colSCENARIO_NOTES = 11;

// declare props constants
var rowPROPS_NAME = 1;
var rowPROPS_VERSION = 2;
var rowPROPS_PUBNAME = 3;
var rowPROPS_DOCID = 4;
var rowPROPS_DESCRIPTION = 5;
var rowPROPS_IMAGE_PATH = 6;
var rowPROPS_IMAGE_EXT = 7;
var rowPROPS_INTERFACE_TYPE = 8;
var colPROPS = 2;

// declare action constants
var ACTIONS_ID = "1ax75Fg7FvMqfUHfesdhWcVGw6V-Pc5fv_CtJ4dWpa1g";
var colACTION_NAME = 0;
var colACTION_DESCRIPTION = 1;
var colACTION_USAGE = 2;
var colACTION_GROUP = 3;
var colACTION_ORDER = 4;
var colACTION_CATEGORY = 5;
var colACTION_LINK = 6;
var colACTION_ID = 7;
var colACTION_NOTES = 8;
  
function getScenarioJson(action_id) {
  // declare local variables
  var spreadsheet = SpreadsheetApp.openById(action_id);
  var sheetSteps = spreadsheet.getSheetByName('steps');
  var sheetProps = spreadsheet.getSheetByName('props');
  var data = {};
  var props = {};
  var table = [];
  var row = {};
  
  // build table
  var steps = sheetSteps.getDataRange().getValues();
  for (var intRow = 1; intRow <= sheetSteps.getLastRow(); intRow++) {
    row = {};
    row['step'] = steps[intRow][colSCENARIO_STEP];
    row['interface'] = steps[intRow][colSCENARIO_INTERFACE];
    row['image'] = steps[intRow][colSCENARIO_IMAGE];
    row['description'] = steps[intRow][colSCENARIO_DESCRIPTION];
    row['action'] = steps[intRow][colSCENARIO_ACTION];
    row['target'] = steps[intRow][colSCENARIO_TARGET_TYPE];
    row['target-specifier'] = steps[intRow][colSCENARIO_TARGET_SPECIFIER];
    row['target-options'] = steps[intRow][colSCENARIO_TARGET_OPTIONS];
    row['actuator'] = steps[intRow][colSCENARIO_ACTUATOR_TYPE];
    row['actuator-specifier'] = steps[intRow][colSCENARIO_ACTUATOR_SPECIFIER];
    row['modifier'] = steps[intRow][colSCENARIO_MODIFIER];
    row['notes'] = steps[intRow][colSCENARIO_NOTES];
        
    if (row['interface'] == '') break;

    table.push(row);
  }
  
  // build data
  var propVals = sheetProps.getDataRange().getValues();
  props['name'] = propVals[rowPROPS_NAME][colPROPS];
  props['version'] = propVals[rowPROPS_VERSION][colPROPS];
  props['pubname'] = propVals[rowPROPS_PUBNAME][colPROPS];
  props['docid'] = propVals[rowPROPS_DOCID][colPROPS];
  props['description'] = propVals[rowPROPS_DESCRIPTION][colPROPS];
  props['image-path'] = propVals[rowPROPS_IMAGE_PATH][colPROPS];
  props['image-ext'] = propVals[rowPROPS_IMAGE_EXT][colPROPS];
  props['interface-type'] = propVals[rowPROPS_INTERFACE_TYPE][colPROPS];
  props['steps'] = table;
  data['scenario'] = props;
  
  return data;
}


function updateScenarioFromGitHub() {
  var actions = getActions();
  
  var foldUsage = DriveApp.getFolderById('0B2A_XQu_O5s-clRqdjNHYmlCa1E');  // folder: usage
  var fileTemplate = DriveApp.getFileById('1sww1hpZ8eNzxgsOj-VpzEtZ6FtUTg3G9QJyK4VXh9_E');  // file: _template
  var fileUsage;

  for (var i = 0; i < actions.length; i++) {
    var action = actions[i];
    var action_name = action['name'].toLowerCase();
    Logger.log(action_name);
    var url = 'https://raw.githubusercontent.com/OpenC2-org/docs-pub/master/def/def-' + action_name + '.json';
    var data = getDataUrl(url);
    var action_details = data['scenario']
    
    // get previous file, if it exists
    var file_id = ''  
    var files = foldUsage.getFilesByName(action_name);
    while (files.hasNext()) {
      var file = files.next();
      file_id = file.getId();
      break;
    }
    if (file_id == '') {
      // create new document
      file = fileTemplate.makeCopy(action_name);
      file_id = file.getId();
      fileUsage = SpreadsheetApp.openById(file_id);
    } else {
      // debug
      continue;
    }
    
    // open file
    fileUsage = SpreadsheetApp.openById(file_id);
    
    // clear it
    clearScenario(fileUsage);
    
    // update
    var sheetSteps = fileUsage.getSheetByName('steps');
    var rowNum = 2
    var steps = action_details['steps'];

    for (var i = 0; i < action_details['steps'].length; i++) {
      step = action_details['steps'][i];
      sheetSteps.getRange(i + 2, colSTEP).setValue(step['step']);
      sheetSteps.getRange(i + 2, colDESCRIPTION).setValue(step['description']);
      sheetSteps.getRange(i + 2, colACTION).setValue(step['action'].toLowerCase());
      sheetSteps.getRange(i + 2, colTARGET_TYPE).setValue(step['target']);
      //sheetSteps.getRange(i + 2, colTARGET_SPECIFIER).setValue(step['target-specifier']);
      sheetSteps.getRange(i + 2, colTARGET_SPECIFIER).setValue('(as required)');
      sheetSteps.getRange(i + 2, colACTUATOR_TYPE).setValue(step['actuator']);
      sheetSteps.getRange(i + 2, colACTUATOR_SPECIFIER).setValue(step['actuator-specifier']);
      sheetSteps.getRange(i + 2, colMODIFIER).setValue(step['modifier']);
      sheetSteps.getRange(i + 2, colNOTES).setValue(step['notes']);
    }
  }
  

  

  
  //var sheetProps = fileUsage.getSheetByName('props');
  //var sheetSteps = fileUsage.getSheetByName('steps');

}


function clearScenario(fileUsage) {
  var sheetSteps = fileUsage.getSheetByName('steps');
  
  sheetSteps.getRange('A2:B50').clearContent();
  sheetSteps.getRange('D2:K50').clearContent();
  
}


function getActionsAsRange() {
  var actions_file = SpreadsheetApp.openById(ACTIONS_ID)
  var actions_sheet = actions_file.getSheetByName('actions');
  var actions = {};

  var rngData = actions_sheet.getDataRange();
  
  return rngData;
}

function getActionAsObject(action_row) {
  var action = {
    'name': action_row[colACTION_NAME],
    'description': action_row[colACTION_DESCRIPTION],
    'usage': action_row[colACTION_USAGE],
    'group': action_row[colACTION_GROUP],
    'order': action_row[colACTION_ORDER],
    'category': action_row[colACTION_CATEGORY],
    'link': action_row[colACTION_LINK],
    'id': action_row[colACTION_ID],
    'notes': action_row[colACTION_NOTES]
  };
  
  return action;
}

function getActionsAsObject() {
  var rngData = getActionsAsRange();
  var values = rngData.getValues();
  var actions = {};

  for (var rowNum = 1; rowNum < rngData.getNumRows(); rowNum++) {
    var jsonAction = getActionAsObject(values[rowNum]);    
    actions[jsonAction['name']] = jsonAction;
  }

  return actions;  
}

function getActionsAsList() {
  var rngData = getActionsAsRange();
  var values = rngData.getValues();
  var actions = [];

  for (var rowNum = 1; rowNum < rngData.getNumRows(); rowNum++) {
    var jsonAction = getActionAsObject(values[rowNum]);    
    actions.push(jsonAction);
  }

  return actions;  
}
