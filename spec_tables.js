function addTableProperty(para, type_name, types) {
  // declare constants
  var colID = 0;
  var colNAME = 1;
  var colTYPE = 2;
  var colDESCRIPTION = 3;
  
  // get the type
  //Logger.log('addTableProperty: ' + type_name);
  var typedef = types[type_name];
  
  // check for missing types
  if (typedef === undefined) {
    Logger.log('spec_tables/addTableProperty(): ' + type_name + ' is undefined');
    return para;
  }
  
  // check if already printed
  if (types[type_name]['printed']) {
    Logger.log('spec_tables/addTableProperty(): ' + type_name + ' is already printed');
    return para;
  }
  
  // get the type
  var type = typedef['ttype'];
  
  // redirect to add enum table
  if (type == 'Enumerated') {
    return addTableEnum(para, type_name, types);
  }
  
  // add the type name, type
  para = pubcode.addPara(para, 'Type Name: ' + typedef['tname']);
  formatMarkdown(para);
  formatHeadingProperty(para);
  para = pubcode.addPara(para, 'Base Type: ' + type);
  formatMarkdown(para);
  formatHeadingProperty(para);
  para = pubcode.addPara(para);

  // build the table header
  var cells = [['ID', 'Property Name', 'Type', 'Description']];
  
  // build the table rows
  var fields = typedef['fields'];
  for(var fieldnum = 0; fieldnum < fields.length; fieldnum++) {
    var field = fields[fieldnum];
    var field_name = field['fname'];
    var field_opts = field['fopts'];
    var name = field_name;
    if (type != 'Choice') {
      name = field_name + ' (required)';
      if (field_opts == '?') name = field_name + ' (optional)';
    }
    var row = [field['ftag'], name, field['ftype'], field['fdesc']];
    cells.push(row);
  }
  
  // make sub-property tables list
  var sub_list = [];
  for (var rownum = 1; rownum < cells.length; rownum++) {
    var row = cells[rownum];
    var desc = row[colDESCRIPTION];
    if (desc == '#common') {
      row[colDESCRIPTION] = '';
    } else {
      sub_list.push(row[colTYPE]);
    }
  }
  
  // add the table
  var paraNext = pubcode.addPara(para, '');
  var tbl = pubcode.addTable(para, cells);
  
  // format table
  formatTableProperty(tbl);
  
  // set published flag
  types[type_name]['printed'] = true;
  
  // add sub-property tables
  for (var subnum = 0; subnum < sub_list.length; subnum++) {
    paraNext = addTableProperty(paraNext, sub_list[subnum], types);
  }
  
  // return
  return paraNext;
}

function addTableEnum(para, type_name, types) {
  // declare constants
  var colID = 0;
  var colNAME = 1;
  var colDESCRIPTION = 2;
  
  // get the type
  //Logger.log('addTableEnum(): ' + type_name);
  var typedef = types[type_name];
  
  // check for missing types
  if (typedef === undefined) {
    Logger.log('spec_tables/addTableEnum(): ' + type_name + ' is undefined');
    return para;
  }
  
  // check if already printed
  if (types[type_name]['printed']) {
    Logger.log('spec_tables/addTableEnum(): ' + type_name + ' is already printed');
    return para;
  }
  
  // get the type
  var type = typedef['ttype'];
  
  // add the type name, type
  para = pubcode.addPara(para, 'Type Name: ' + typedef['tname']);
  formatHeadingProperty(para);
  para = pubcode.addPara(para, 'Base Type: ' + type);
  formatHeadingProperty(para);
  para = pubcode.addPara(para);

  // build the table header
  var cells = [['ID', 'Element Name', 'Description']];
  
  // build the table rows
  var fields = typedef['fields'];
  for(var fieldnum = 0; fieldnum < fields.length; fieldnum++) {
    var field = fields[fieldnum];
    var row = [field['ftag'], field['fname'], field['edesc']];
    cells.push(row);
  }
  
  // add the table
  var paraNext = pubcode.addPara(para, '');
  var tbl = pubcode.addTable(para, cells);
  
  // format table
  formatTableEnum(tbl);
  
  // set published flag
  types[type_name]['printed'] = true;
  
  // return
  return paraNext;
}

function addTableSample(para, sample) {
  // build the table
  var cells = [];
  var cell = [];
  cell.push(sample)
  cells.push(cell);
  
  // add the table
  var paraNext = pubcode.addPara(para, '');
  var tbl = pubcode.addTable(para, cells);
  
  // format sample table
  formatTableSample(tbl);
  
  // return
  return paraNext;
}

