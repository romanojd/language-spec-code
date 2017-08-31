function addTableScenario(para, jsonDetails, sample) {
  // default parameters
  sample = sample | false;
  
  // declare local variables
  var steps = jsonDetails['scenario']['steps'];
  
  // build the table header
  var header = ['', 'Description', 'Action', 'Target', 'Actuator', 'Modifier']
  var cells = [ header ];
      
  // add the table
  var paraNext = pubcode.addPara(para);
  var tbl = pubcode.addTable(para, cells);
  
  // add multicell header
  var row = tbl.getRow(0);
  var cell = row.getCell(3);
  cell.appendHorizontalRule();
  cell.appendParagraph('Target-Specifier');
  cell = row.getCell(4);
  cell.appendHorizontalRule();
  cell.appendParagraph('Actuator-Specifier');
  
  for (var i = 0; i < steps.length; i++) {
    var step = steps[i];
    
    if ((sample && (parseStepValue(step['notes']).indexOf('<sample/>') != -1 || parseStepValue(step['notes']).indexOf('#sample') != -1)) || !sample) { 
      row = tbl.appendTableRow();
      cell = row.appendTableCell(parseStepValue(step['step']));
      cell = row.appendTableCell(parseStepValue(step['description']));
      pubcode.formatMarkdown(cell);
      var action = parseStepValue(step['action']);
      cell = row.appendTableCell(action != '' ? '#' + action : '');
      pubcode.formatMarkdown(cell);
      //pubcode.formatActionText(cell);
      
      cell = row.appendTableCell(parseStepValue(step['target']));
      cell.appendHorizontalRule();
      cell.appendParagraph(parseStepValue(step['target-specifier']));
      cell = row.appendTableCell(parseStepValue(step['actuator']));
      cell.appendHorizontalRule();
      cell.appendParagraph(parseStepValue(step['actuator-specifier']));
      
      cell = row.appendTableCell(parseStepValue(step['modifier']));
    }
  }
  
  // format table
  pubcode.formatTableScenario(tbl);
  
  return paraNext;
}

function parseStepValue(value) {
  var rvalue = '';
  
  if (value != null) {
    rvalue = value;
  }
  
  return rvalue;
}

function addFigureUseCase(para, jsonDetails, imagePath, imageExt, sample) {
  // default parameters
  sample = sample | false;
  
  // set styles
  var styleNormal = {};
  styleNormal[DocumentApp.Attribute.FONT_FAMILY] = 'Open Sans';
  styleNormal[DocumentApp.Attribute.FONT_SIZE] = 10;
  var styleDesc = {};
  styleDesc[DocumentApp.Attribute.FONT_FAMILY] = 'Open Sans';
  styleDesc[DocumentApp.Attribute.FONT_SIZE] = 8;
  var styleCode = {};
  styleCode[DocumentApp.Attribute.FONT_FAMILY] = 'Source Code Pro';

  // set image style
  var width = 605;
  var height = width * 74 / 722;
  
  // declare local variables
  var steps = jsonDetails['scenario']['steps'];
  
  // build the table header
  var header = ['', 'Description', '']
  var cells = [ header ];

  // add the table
  var paraNext = pubcode.addPara(para);
  var tbl = pubcode.addTable(para, cells);

  // set the styles to the header
  tbl.setAttributes(styleNormal);
  
  // add the swimlanes image
  var cell = tbl.getCell(0, 2);
  // set the image cell
  var imageUrl = imagePath + 'swimlanes' + imageExt;
  cell.setPaddingTop(0);
  cell.setPaddingBottom(0);
  cell.setPaddingLeft(0);
  cell.setPaddingRight(0);
  
  // Retrieve an image from the web.
  var resp = UrlFetchApp.fetch(imageUrl);
  
  // insert the image
  var img = cell.insertImage(0, resp.getBlob());
  img.setWidth(width);
  img.setHeight(height);
  cell.setText('');
  
  for (var i = 0; i < steps.length; i++) {
    // debug
    if (i > 4) {
      break;
    }
    
    var step = steps[i];
    
    if ((sample && (parseStepValue(step['notes']).indexOf('<sample/>') != -1 || parseStepValue(step['notes']).indexOf('#sample') != -1)) || !sample) { 
      row = tbl.appendTableRow();
            
      cell = row.appendTableCell(parseStepValue(step['step']));
      cell.setAttributes(styleNormal);
      cell = row.appendTableCell(parseStepValue(step['description']));
      cell.setAttributes(styleDesc);
      pubcode.formatMarkdown(cell);
      
      // set the image cell
      var imageUrl = imagePath + parseStepValue(step['image']) + imageExt;
      cell = row.appendTableCell();
      cell.setPaddingTop(0);
      cell.setPaddingBottom(0);
      cell.setPaddingLeft(0);
      cell.setPaddingRight(0);
      
      // Retrieve an image from the web.
      var resp = UrlFetchApp.fetch(imageUrl);
      
      // insert the image
      var img = cell.insertImage(0, resp.getBlob());
      img.setWidth(width);
      img.setHeight(height);
      cell.setText('');
    }
  }
  
  // format table
  formatFigureUseCase(tbl);
  
  return paraNext;
}

