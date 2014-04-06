/*
Keeps the lastUpdated variable in localStorage updated by attachig an event
listener to storage that fires any time data is changed.
*/

//Used for logging to the background page (bkg.Console.log('foo'))
var bkg = chrome.extension.getBackgroundPage();


//Core data
var data = {
	lastUpdated: "Not yet updated",
}

//Keeps the lastUpdated variable up-to-date
chrome.storage.onChanged.addListener(function(changes, namespace) {
    updateLastUpdated();

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

/*
Updates the lastUpdated value in storage to the current date/time
*/
function updateLastUpdated() {
	var obj = {};
	obj.lastUpdated = Date().toString();
	chrome.storage.local.set(obj, function() {
        bkg.console.log('Updated lastUpdated to ' + obj.lastUpdated);
    });	
}

/*
Given a list of image URLs, saves them using the imageURLs storage key
Each image must have it's own unique storage key as well. For example:
var imageURLs = [{id: URL}, {id: URL}, ...];
*/
function saveImageURLs(imageURLs) {
	chrome.storage.local.set({imageURLs: imageURLs}, function() {
        bkg.console.log('Updated lastUpdated to ' + obj.lastUpdated);
    });	
}

/*
Given an imageID and an image, saves the image using imageID as the storage key
*/
function saveImage(imageID, image) {
	var obj = {};
	obj[imageID] = image;
	chrome.storage.local.set(obj, function() {
        bkg.console.log('Image ' + imageID + ' saved');
    });	
}

/*
Given an imageID, retrieves an image from storage if it exists
*/
function getImage(imageID) {
	chrome.storage.local.get(imageID, function(items) {
        bkg.console.log('Updated lastUpdated to ' + obj.lastUpdated);
        return items;
	});	
}

//Checks strings for matches to bitcoin
function checkForBitcoin(subs){
    subs = subs.toLowerCase();
    if( (subs == 'bit%20coin') ||
        (subs == 'bit+coin')   ||
        (subs == 'bitcoin')    ||
        (subs == 'btc')){
        return true;
    }
    return false;
}

//Listener for requests coming from Google
chrome.webRequest.onBeforeRequest.addListener(
    function(details){
	var sub;
        var positive = false;
        var index = details.url.search(/q=/);
        if(index != -1){
            subs = details.url.substring(index);
            subs = subs.substring(2,subs.indexOf('&'));
            positive = checkForBitcoin(subs);
        }
        if(positive){
	    //Call to method that triggers with positive result
	    //will go here.
            bkg.console.log("Bazinga: "+subs);
        }
        return;
    },
    //Do this for all google urls
    {urls: ["https://www.google.com/*"]},
    ["blocking"]
);