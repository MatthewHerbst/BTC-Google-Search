//Core data
var data = {
	lastUpdated: "Not yet updated",
}

//Keeps the lastUpdated variable up-to-date
chrome.storage.onChanged.addListener(function(changes, namespace) {
    data.lasUpdated = Date().toString();
    
    /*
    for (key in changes) {
      var storageChange = changes[key];
      console.log('Storage key "%s" in namespace "%s" changed. ' +
                  'Old value was "%s", new value is "%s".',
                  key,
                  namespace,
                  storageChange.oldValue,
                  storageChange.newValue);
    }
    */
  });

function saveImage(imageID, image) {
	var obj = {};
	obj[imageID] = image;
	chrome.storage.local.set(obj, function() {
        // Notify that we saved.
        message('Image ' + imageID + " saved");
    });	
}