function getJsonMessage(jsonStep) {
  var txt = '';
  var action = parseStepValue(jsonStep['action']);
  var target = parseStepValue(jsonStep['target']);
  var target_specifier = parseStepValue(jsonStep['target-specifier']);
  var target_options = parseStepValue(jsonStep['target-options']);
  var actuator = parseStepValue(jsonStep['actuator']);
  var actuator_specifier = parseStepValue(jsonStep['actuator-specifier']);
  var modifiers = parseStepValue(jsonStep['modifier']);
  
  if (action != '') {
    txt = '{\n';
    
    if (action == 'response') {
      txt += tab(1) + '"' + action + '": {\n';
      txt += tab(2) + '"source": {\n';
      txt += tab(3) + '"' + target + '": {\n';
      txt += processDetails(target_specifier, 4) + '\n';
      txt += tab(3) + '}\n';
      txt += tab(2) + '},\n';
      
      txt += processDetails(actuator, 2) + ',\n';
      txt += processDetails(actuator_specifier, 2) + '\n';
      
      txt += tab(1) + '}\n';
    } else {
      // action
      txt += tab(1) + '"action": "' + action + '",\n';
      
      // target
      txt += tab(1) + '"target": {\n';
      txt += tab(2) + '"' + target + '": {';
      
      if (target_specifier != '') {
        txt += '\n';
        txt += processDetails(target_specifier, 3) + '\n';
        txt += tab(2);
      }
      
      if (target_options != '') {
        txt += '},\n';
        txt += tab(2) + '"options": {\n';
        txt += processDetails(target_options, 3) + '\n';
        txt += tab(2);
      }      
      txt += '}\n';

      txt += tab(1) + '}';
      if (actuator != '' || modifiers != '') {
        txt += ',';
      }
      txt += '\n';
      
      // actuator
      if (actuator != '') {
        txt += tab(1) + '"actuator": {\n';
        
        txt += tab(2) + '"' + actuator + '": {'
        
        if (actuator_specifier != '') {
          txt += '\n';
          txt += processDetails(actuator_specifier, 3) + '\n';
          txt += tab(2)
        }          
        txt += '}\n';
        
        txt += tab(1) + '}';
        if (modifiers != '') {
          txt += ',';
        }
        txt += '\n';
      }

      // modifiers
      if (modifiers != '') {
        txt += tab(1) + '"modifiers": {\n';
        
        if (modifiers != '') {
          txt += processDetails(modifiers, 2) + '\n';
        } else {
          txt += tab(2) + '...\n';
        }
        txt += tab(1) + '}\n';
      }
      
    }

    txt += '}';
  }
  
  // return
  return txt; 
}

function tab(numTabs) {
  txt = '';
  
  // add tabs    
  for (var tabNum = 0; tabNum < numTabs; tabNum++) {
    txt += '    ';  // four spaces
  }
  
  return txt;
}

function processDetails(specifier, numTabs) {
  var txt = tab(numTabs);
  var lines = specifier.split(',');
  for (var lineNum = 0; lineNum < lines.length; lineNum++) {
    var line = lines[lineNum].trim();
    
    if (line.slice(0, 1) == '<') {
      txt += line;
    } else {    
      // create key-value pair with quotes
      if (line.indexOf(':') > 0) {
        var key = line.slice(0, line.indexOf(':')).trim();
        var value = line.slice(line.indexOf(':') + 1).trim();
        
        if (!isNumeric(value)) {
          if (value.slice(0, 1) != '<') {
            value = '"' + value + '"';
          }
        }
        txt += '"' + key + '": ' + value;
      } else {
        txt += line;
      }
    }
    
    // add comma and newline
    if (lineNum + 1 < lines.length) {
      txt += ',\n';
    }
  }
  
  return txt;
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}