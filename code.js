function updateSpec() {
  // define constants
  var TNAME = 0;  // datatype name
  var TTYPE = 1;  // base type
  var TOPTS = 2;  // type options
  var TDESC = 3;  // type description
  var FIELDS = 4; // list of fields
  
  var FTAG = 0;   // element id
  var FNAME = 1;  // element name
  var EDESC = 2;  // description for enumerated types
  var FTYPE = 2;  // datatype of field
  var FOPTS = 3;  // field options
  var FDESC = 4;  // field description
  
  var schema = getSchema();
  var types = getSchemaTypes(schema);
  
  //Logger.log(data['meta']['description']);
  //Logger.log(JSON.stringify(schema));
  
  // get the root type, assume always in position 0
  rootkey = schema['meta']['root'];
  //root = schema['types'][0];
  root = types[rootkey];

  // open document or create new document
  var doc = DocumentApp.getActiveDocument();
  var body = doc.getBody();

  // clear previous content
  body.clear();

  // page setup
  //body.setPageHeight(612);  //  8.5 inches, 72 ppi
  //body.setPageWidth(792);     // 11.0 inches, 72 ppi
  
  var para = pubcode.addPara(body.getParagraphs()[0], '...intro...', 'Normal', true)
  
  para = addMessageSections(para, rootkey, types);
  
  para = addActionSections(para, types);
  
}

function addMessageSections(para, type_name, types) {
  var type = types[type_name];
  if (type === undefined) {
    Logger.log('Code/addMessageSections(): ' + type_name + ' is undefined');
  } else {    
    // add the type name and description
    var desc = type['tdesc'].split('::');
    if (desc.length == 2) {
      var typeName = desc[0].trim();
      var typeDesc = desc[1].trim();
    } else {
      var typeName = type_name;
      var typeDesc = type['tdesc'];
    }
    para = pubcode.addPara(para, typeName, 'Heading1');
    pubcode.formatMarkdown(para);    
    para = pubcode.addPara(para, typeDesc);
    pubcode.formatMarkdown(para);
    para = pubcode.addPara(para);
    
    //para = addTableProperty(para, 'OpenC2Object', types);
    
    // process each message type
    var fields = type['fields'];
    for(var fieldnum = 0; fieldnum < fields.length; fieldnum++) {
      var field = fields[fieldnum]; 
      
      // add heading for message type
      var desc = field['fdesc'].split('::');
      if (desc.length == 2) {
        var fieldHeading = desc[0].trim();
        var fieldDesc = desc[1].trim();
      } else {
        var fieldHeading = field['fname'];
        var fieldDesc = field['fdesc'];
      }
      para = pubcode.addPara(para, fieldHeading, 'Heading2');
      pubcode.formatMarkdown(para);
      para = pubcode.addPara(para);
      para = pubcode.addPara(para, fieldDesc);
      pubcode.formatMarkdown(para);
      para = pubcode.addPara(para);
      
      // process subtypes
      var fieldType = field['ftype'];
      para = addTableProperty(para, fieldType, types)
    }
  } 
  
  return para;
}

function addActionSections(para, types) {
  var actions = getActionsAsObject();  

  para = pubcode.addPara(para, 'Actions', 'Heading1');
  para = pubcode.addPara(para);

  var action_list = types['Action']['fields'];
  for (var itemnum = 0; itemnum < action_list.length; itemnum++) {
    var action_name = action_list[itemnum]['fname'];
    para = addActionSection(para, action_name, types, actions);
  }
  
  return para;
}

function addActionSection(para, action_name, types, actions) {
  var action_id = actions[action_name]['id'];
  var scenario = {};
  if (action_id != '') {
    var scenario = getScenarioJson(actions[action_name]['id']);
  }
    
  var action_type = action_name + '-type';
  var action = types[action_type];
  
  para = pubcode.addPara(para, action_name, 'Heading2');
  
  if (action !== undefined) {
    // add the definition
    var desc = types[action_type]['tdesc'];
    para = pubcode.addPara(para, desc);
    
    // add usage paragraph
    if (actions[action_name] !== undefined) {
      var usage = actions[action_name]['usage'];
      para = pubcode.addPara(para, usage);
      formatMarkdown(para);
      formatActionText(para);
    }
    
    // add the properties
    para = pubcode.addPara(para, 'Properties', 'Heading3');
    para = addTableProperty(para, action_type, types);
    // add the sample section
    para = addSampleSection(para, scenario, true);
    //para = pubcode.addPara(para, '\n');
  } else {
    para = pubcode.addPara(para, 'TBSL');
  }
  
  return para;
}

function addSampleSection(para, action_details, sample) {
  // add the section heading
  var paraNext = pubcode.addPara(para, 'Sample Commands', 'Heading3');

  if (action_details == {} || action_details === undefined) {
    para = pubcode.addPara(para, 'TBSL');
    return para;
  }

  // add the section detail  
  if (action_details['scenario'] !== undefined) {
    // default parameters
    sample = sample | false;
    
    // declare local variables
    var steps = action_details['scenario']['steps'];
    Logger.log(steps);
    
    for (var i = 0; i < steps.length; i++) {
      var step = steps[i];
      
      if ((sample && (parseStepValue(step['notes']).indexOf('<sample/>') != -1 || parseStepValue(step['notes']).indexOf('#sample') != -1)) || !sample) { 
        // add the sample description
        paraNext = pubcode.addPara(paraNext, step['description']);
        
        // get the sample json message
        var jsonMessage = getJsonMessage(step);
        
        // add the table
        paraNext = addTableSample(paraNext, jsonMessage);
      }
    }
        
    return paraNext;
  } else {
    return para;
  }
}

