//Used for logging to the background page (bkg.Console.log('foo'))
var bkg = chrome.extension.getBackgroundPage();


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

function fetchImage(){
	var tempImg = new Image();
	tempImg.src="http://bitcoincharts.com/charts/chart.png?width=940&m=bitstampUSD&SubmitButton=Draw&r=5&i=15-min&c=0&s=&e=&Prev=&Next=&t=M&b=&a1=&m1=10&a2=&m2=25&x=0&i1=&i2=&i3=&i4=&v=1&cv=0&ps=0&l=0&p=0&";
	saveImage("success.png",tempImg);
}

function saveImage(imageID, image) {
	var obj = {};
	obj[imageID] = image;
	chrome.storage.local.set(obj, function() {
        // Notify that we saved.
        message('Image ' + imageID + " saved");
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




