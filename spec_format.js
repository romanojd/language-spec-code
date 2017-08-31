function formatHeadingProperty(para) {
  // set base font style
  var styleBase = {};
  styleBase[DocumentApp.Attribute.FONT_SIZE] = 10;
  //styleBase[DocumentApp.Attribute.BOLD] = true;

  para.setAttributes(styleBase);  
}

function formatTableProperty(tbl) {
  // apply base table format
  formatTable(tbl);
  
  // declare local variables
  var body = tbl.getParent();
  
  // set the column widths, 72 ppi
  tbl.setColumnWidth(0, 36);
  tbl.setColumnWidth(1, 115);
  tbl.setColumnWidth(2, 133);
  tbl.setColumnWidth(3, 184);
  
  // format markdown
  //formatMarkdown(tbl);  // need to apply only to the description column
  pubcode.formatActionText(tbl);
}

function formatTableEnum(tbl) {
  // apply base table format
  formatTable(tbl);
  
  // declare local variables
  var body = tbl.getParent();
  
  // set the column widths, 72 ppi
  tbl.setColumnWidth(0, 27);
  tbl.setColumnWidth(1, 100);
  tbl.setColumnWidth(2, 341);
  
  // format markdown
  //formatMarkdown(tbl);
  pubcode.formatActionText(tbl);
}

function formatTable(tbl) {
  // format header row
  formatHeader(tbl, 1);
  
  // set base font style
  var styleBase = {};
  styleBase[DocumentApp.Attribute.FONT_SIZE] = 10;
  //styleBase[DocumentApp.Attribute.BOLD] = true;

  tbl.setAttributes(styleBase);
  
  //formatSpecText(tbl)

}

function formatHeader(tbl, numRows) {
  // only format header if there are > 1 rows
  if (tbl.getNumRows() == 1) {
    return 0;
  }
  
  // set header row style
  var styleRowHeader = {};
  styleRowHeader[DocumentApp.Attribute.FOREGROUND_COLOR] = '#ffffff';  // white
  styleRowHeader[DocumentApp.Attribute.BOLD] = true;

  for (var rowNum = 0; rowNum < numRows; rowNum++) {
    // format header row
    var rowHeader = tbl.getRow(rowNum);  
    
    // set the cell background to header row
    for (cellNum = 0; cellNum < rowHeader.getNumCells(); cellNum++) {
      rowHeader.getCell(cellNum).setBackgroundColor('#073763');  // dark blue 3
    }
    
    // apply the style
    rowHeader.setAttributes(styleRowHeader);
  }
}

function formatTableSample(tbl) {
  // apply base table format
  formatTable(tbl);
  
  // set the font style
  var style = {};
  style[DocumentApp.Attribute.FONT_FAMILY] = 'Source Code Pro';
  style[DocumentApp.Attribute.FONT_SIZE] = 9;
  tbl.setAttributes(style);
  
  // set the table properties
  tbl.setBorderWidth(0);
  
  // set the cell properties
  var cell = tbl.getRow(0).getCell(0);
  cell.setBackgroundColor('#cfe2f3');
}

function formatSpecText(rng) {
  ///*
  var regex = 'MUST|REQUIRED|SHALL|SHOULD|RECOMMENDED|MAY|OPTIONAL'
  var findElement = rng.findText(regex);

  // Define a custom paragraph style.
  var style = {};
  style[DocumentApp.Attribute.BOLD] = true;
  
  while (findElement != null) {
    var elem = findElement.getElement();

    elem.setAttributes(findElement.getStartOffset(), findElement.getEndOffsetInclusive(), style);
    
    // get the next element
    findElement = rng.findText(regex);
    //findElement = null;  // debug: stop after one loop
  }
  //*/
}

function formatActionText(rng) {
  ///*
  var regex = '#[[:alpha:]]+'
  var findElement = rng.findText(regex);

  // Define a custom paragraph style.
  var style = {};
  style[DocumentApp.Attribute.BOLD] = true;
  style[DocumentApp.Attribute.FOREGROUND_COLOR] = '#0000ff';
  
  while (findElement != null) {
    var elem = findElement.getElement();

    //elem.setAttributes(findElement.getStartOffset(), findElement.getEndOffsetInclusive(), style);
    elem.asText().deleteText(findElement.getStartOffset(), findElement.getStartOffset());  // inclusive
    
    // get the next element
    findElement = rng.findText(regex);
    //findElement = null;  // debug: stop after one loop
  }
  //*/
}

function formatMarkdown(rng) {
  // inline code
  var regex = "`[[:graph:]]+`"
  var findElement = rng.findText(regex);

  // Define a custom paragraph style.
  var style = {};
  style[DocumentApp.Attribute.FONT_FAMILY] = 'Source Code Pro';
  style[DocumentApp.Attribute.BACKGROUND_COLOR] = '#d9d9d9';
  
  while (findElement != null) {
    //Logger.log(regex + ' found');
    var elem = findElement.getElement();

    elem.setAttributes(findElement.getStartOffset(), findElement.getEndOffsetInclusive(), style);
    elem.asText().deleteText(findElement.getEndOffsetInclusive(), findElement.getEndOffsetInclusive());  // inclusive
    elem.asText().deleteText(findElement.getStartOffset(), findElement.getStartOffset());  // inclusive
    
    // get the next element
    findElement = rng.findText(regex);
  }

  // italic
  regex = "_[\w]+_"
  findElement = rng.findText(regex);

  // Define a custom paragraph style.
  var style = {};
  style[DocumentApp.Attribute.ITALIC] = true;
  
  while (findElement != null) {
    //Logger.log(regex + ' found');
    var elem = findElement.getElement();

    elem.setAttributes(findElement.getStartOffset(), findElement.getEndOffsetInclusive(), style);
    elem.asText().deleteText(findElement.getEndOffsetInclusive(), findElement.getEndOffsetInclusive());  // inclusive
    elem.asText().deleteText(findElement.getStartOffset(), findElement.getStartOffset());  // inclusive
    
    // get the next element
    findElement = rng.findText(regex);
  }

  /*
  // bold
  var re = /(\*\*|__)(.*?)(\*\*|__)/
  findElement = rng.findText(re);
  
  Logger.log('Looking for ' + re);

  // Define a custom paragraph style.
  var style = {};
  style[DocumentApp.Attribute.BOLD] = true;
  
  while (findElement != null) {
    Logger.log(re + ' found');
    var elem = findElement.getElement();

    elem.setAttributes(findElement.getStartOffset(), findElement.getEndOffsetInclusive(), style);
    elem.asText().deleteText(findElement.getEndOffsetInclusive()-1, findElement.getEndOffsetInclusive());  // inclusive
    elem.asText().deleteText(findElement.getStartOffset(), findElement.getStartOffset()+1);  // inclusive
    
    // get the next element
    findElement = rng.findText(re);
  }
  //*/
}