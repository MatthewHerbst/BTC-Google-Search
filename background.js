/*
Keeps the lastUpdated variable in localStorage updated by attachig an event
listener to storage that fires any time data is changed.
*/

//Used for logging to the background page (bkg.Console.log('foo'))
var bkg = chrome.extension.getBackgroundPage();


//Core data
var data = {
    baseURL: "http://bitcoincharts.com/charts/chart.png
        ?width=940
        &m=bitstampUSD
        &SubmitButton=Draw
        &r=5&i=15-min
        &c=0
        &s=
        &e=
        &Prev=
        &Next=
        &t=M
        &b=
        &a1=
        &m1=10
        &a2=
        &m2=25
        &x=0
        &i1=
        &i2=
        &i3=
        &i4=
        &v=1
        &cv=0
        &ps=0
        &l=0
        &p=0&",
	urls: {
        formats: {
            1d: {
                i: "",
                r: ""
            },
            5d: {
                i: "",
                r: ""
            },
            1m: {
                i: "",
                r: ""
            },
            6m: {
                i: "",
                r: ""
            },
            1y: {
                i: "",
                r: ""
            },
            5y: {
                i: "",
                r: ""
            },
            max: {
                i: "",
                r: ""
            }
        },
        options {
            width: "",
            height: ""
        }
    }
}

function optimizeURLS() {
    setOptimumWidth();
    setOptimumHeight();
    for()
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

function fetchImage(){
	var tempImg = new Image();
	tempImg.src="http://bitcoincharts.com/charts/chart.png?width=940&m=bitstampUSD&SubmitButton=Draw&r=5&i=15-min&c=0&s=&e=&Prev=&Next=&t=M&b=&a1=&m1=10&a2=&m2=25&x=0&i1=&i2=&i3=&i4=&v=1&cv=0&ps=0&l=0&p=0&";
	saveImage("success.png",tempImg);
}

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
        bkg.console.log('Image URLS saved');
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
	chrome.storage.local.get(imageID, function(image) {
        bkg.console.log('Updated lastUpdated to ' + obj.lastUpdated);
        return image;
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
	    fetchImage();
            bkg.console.log("Bazinga: "+subs);
        }
        return;
    },
    //Do this for all google urls
    {urls: ["https://www.google.com/*"]},
    ["blocking"]
);
