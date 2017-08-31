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

function getSchema() {
  var url = 'https://raw.githubusercontent.com/romanojd/jaen/working/schema/openc2.jaen'
  var schema = getDataUrl(url);
  
  return schema;
}

function getSchemaTypes(jaen) {
  var type_list = jaen['types'];
  var types = {};
  
  for (var i = 0; i < type_list.length; i++) {
    var type = type_list[i];
    
    // get the type name
    var typename = type[TNAME];
    
    // get the type
    var datatype = type[TTYPE];
    
    // get the field fields
    Logger.log(type[TNAME]);
    if (datatype == 'Enumerated') {
      var fields = getSchemaEnumFields(type[FIELDS]);
    } else {
      var fields = getSchemaTypeFields(type[FIELDS]);
    }
    
    var obj = {'tname': type[TNAME], 
               'ttype': type[TTYPE], 
               'topts': type[TOPTS], 
               'tdesc': type[TDESC], 
               'fields': fields};

    // add the type object to the json object
    types[typename] = obj;
  }
  
  return types;
}

function getSchemaTypeFields(schema_fields) {
  var fields = [];
  
  if (schema_fields !== undefined) {
    for (var i = 0; i < schema_fields.length; i++) {
      var field = schema_fields[i];
      var obj = {'ftag': field[FTAG],
                 'fname': field[FNAME],
                 'ftype': field[FTYPE],
                 'fopts': field[FOPTS],
                 'fdesc': field[FDESC]};
      
      fields[i] = obj;
    }
  }
  
  return fields;
}

function getSchemaEnumFields(schema_fields) {
  var fields = [];
  
  if (schema_fields !== undefined) {
    for (var i = 0; i < schema_fields.length; i++) {
      var field = schema_fields[i];
      var obj = {'ftag': field[FTAG],
                 'fname': field[FNAME],
                 'edesc': field[EDESC]};
      
      fields[i] = obj;
    }
  }
  
  return fields;
}