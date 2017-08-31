function getData(jsonAction) {
  /*
  if (jsonAction['link'] != '') {
    return getDataGitHub(jsonAction);
  } else {
    return getDataDrive(jsonAction);
  }
  */
  return getDataDrive(jsonAction);
  
  return 0;
}

function getDataGitHub(jsonAction) {
  // initialize local variables
  var jsonData = {};
  
  // get json text data
  var url = jsonAction['link'];
  
  return getDataUrl(url);
}

function getDataUrl(url) {
  var response = UrlFetchApp.fetch(url);

  // parse json text into object
  var jsonData = JSON.parse(response.getContentText())  
  
  // return
  return jsonData;  
}

function getDataDrive(jsonAction) {
  var filename = jsonAction['name'].toLowerCase();
  var foldUsage = DriveApp.getFolderById('0B2A_XQu_O5s-clRqdjNHYmlCa1E');  // folder: usage
  var files = foldUsage.getFilesByName(filename);
  while (files.hasNext()) {
    var file = files.next();
    var action_id = file.getId();
    jsonData = getScenarioJson(action_id);
    return jsonData;
  }
  
  return 0;  
}

