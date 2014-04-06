/*
Eventually this should become an event driven page instead of a pure background
page. However, only webRequest is currently not availble on event driven pages
for builds outside of the dev channel.
*/

//Used for logging to the background page (bkg.Console.log('foo'))
var bkg = chrome.runtime.getBackgroundPage();


//Core data
var data = {
    lastUpdated: {},
    baseURL: "http://bitcoincharts.com/charts/chart.png?",
    options: {
        width: "940",
        height: "",
        m: "bitstampUSD",
        SubmitButton: "Draw",
        c: "",
        s: "",
        e: "",
        Prev: "",
        Next: "",
        t: "M",
        b: "",
        a1: "",
        m1: "10",
        a2: "",
        m2: "25",
        x: "0",
        i1: "",
        i2: "",
        i3: "",
        i4: "",
        v: "1",
        cv: "0",
        ps: "0",
        l: "0",
        p: "0",
        ranges: {
            d1: {
                i: "",
                r: ""
            },
            d5: {
                i: "",
                r: ""
            },
            m1: {
                i: "",
                r: ""
            },
            m6: {
                i: "",
                r: ""
            },
            y1: {
                i: "",
                r: ""
            },
            y5: {
                i: "",
                r: ""
            },
            max: {
                i: "",
                r: ""
            }
        }
    }
};

init(); //Called when the browser loads the extension at startup

/*
Fuction that runs when the browser is first opened
*/
function init() {
    setOptimumDimensions(); //Sets the optimum dimensions of the graph image
}

function setOptimumDimensions(){
    var window = chrome.app.window.current();
    bkg.console.log(window.width + ' - ' + window.height);
}

function optimizeURLS() {
    setOptimumDimensions();
}

function buildURL(range) {
    var url = data.baseURl;

    var first = true; //Control the placement of '&'
    for(var key in data.options) {
        if(data.options.hasOwnProperty(key) && key) {
            if(key == "ranges") {
                if(first) {
                    url += "i";
                    first = false;
                } else {
                    url += "&i";
                }

                url += "=" + data.options.ranges[range].i;
                url += "&r" + "=" + data.options.ranges[range].r;
            }

            if(!first) {
                url += "&" + key + "=" + data.options.key;
            } else {
                url += key + "=" + data.options.key;
                first = false;
            }
        }
    }

    return url;
}

/*
Checks strings for matches to bitcoin
*/
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

/*
Listener for requests coming from Google
*/
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
	    //TODO:
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
