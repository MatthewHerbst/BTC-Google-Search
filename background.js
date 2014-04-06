/*
Eventually this should become an event driven page instead of a pure background
page. However, only webRequest is currently not availble on event driven pages
for builds outside of the dev channel.
*/

//Used for logging to the background page (bkg.Console.log('foo'))
var bkg = chrome.extension.getBackgroundPage();

//Core data
var data = {
    lastUpdated: {},
    baseURL: "http://bitcoincharts.com/charts/chart.png?",
    options: {
        width: "660",
        height: "192",
        m: "bitfinexUSD",
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

 $(document).bind("ajaxStop", function(){
   bkg.console.log("All AJAX calls complete. Injecting!");
 });

/*
Fuction that runs when the browser is first opened
*/
function init() {
    
}

function buildContainer() {
    
}

/*
Sets the URL of the img tag holding the graph, thus effectively changing the image
*/
function updateGraphImage(url) {
    $('.fmob_rc_ct img').attr('src', url);
}

function ajaxError(jqXHR, textStatus, errorThrown) {
    bkg.console.log("AJAX error: " + errorThrown + ": " + textStatus);
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

/**
 *Returns the Difficulity rate currently for bitcoin
 **/
function getDifficulity(){
    var difficulity;
    $.ajax({
	url:"http://blockchain.info/q/getdifficulty",
	success: function( text ){
	    difficulity = text;
	}
    });
    return Number(difficulity).toPrecision(2);
}

/**
 * Fetches the data for the card population
 * returns an array with values
 * avg, cvolume (currency volume), difficulty, ghashrate, high, low, and btc volume
 *
 * TODO: remove "async: false" when we get the dom elements
 **/
function getCardData(){
    var result = [];
    $.ajax({
	url:"http://api.bitcoincharts.com/v1/markets.json", 
	dataType: 'json',
	async: false, 
	success : function( json ){
	    $.each( json , function(key,val){
		if(val['symbol'] == data.options.m){
		    result['high']   = val['high'];
		    result['low']    = val['low'];
		    result['avg']    = val['avg'];
		    result['volume'] = val['volume'];
		    result['cvolume']= val['currency_volume'];
		}
	    });
	    
	    $.ajax({
		url:"http://blockchain.info/q/hashrate",
		async: false,
		success: function( text ){
		    result['hashrate'] = Number(text).toPrecision(3);
		}
	    });
	}
    });
    bkg.console.log(result);
    return result;
}
/*
Listener for requests coming from Google
*/
chrome.webRequest.onBeforeRequest.addListener(
    function(details){
	var sub;
        var positive = false;
        var index = details.url.search(/&q=/);
        if(index != -1){
            subs = details.url.substring(index+3);
            subs = subs.substring(0,subs.indexOf('&'));
            positive = checkForBitcoin(subs);
        }
        if(positive){
	    //Positive bitcoin match
            bkg.console.log(subs);
	    getCardData();
        }
        return;
    },
    //Do this for all google urls
    {urls: ["https://www.google.com/*"]}
    //["blocking"]
);
