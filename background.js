/*
Eventually this should become an event driven page instead of a pure background
page. However, only webRequest is currently not availble on event driven pages
for builds outside of the dev channel.
*/

//Used for logging to the background page (bkg.Console.log('foo'))
var bkg = chrome.extension.getBackgroundPage();

/*
Listener for requests coming from Google
*/
chrome.webRequest.onBeforeRequest.addListener(
    function(details){
    var subs;
        var positive = false;
        var index = details.url.search(/q=/);
        if(index != -1){
            subs = details.url.substring(index);
            subs = subs.substring(2, subs.indexOf('&'));
            positive = checkForBitcoin(subs);
        }
        if(positive){
            //Positive bitcoin match
            updateData();
            bkg.console.log("Bazinga: " + subs);
        }
        return;
    },
    {urls: ["https://www.google.com/*"]} //Do this for all google urls
);

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
    },
    result: {}
};

$(document).bind("ajaxStop", function(){
    insertHTML(buildContainer());
});

function updateData() {
    getHashRate();
    getDifficulity();
    getCardData();
    getYesterdayAvg();
}

/*
Given some HTML, inserts it into the correct location
*/
function insertHTML(html) {

}

/*
*/
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
}

/*
Function to be called when the user selects a range button. Causes the image to
be updated by replacing the image src URL with a new one
*/
function updateRange(range) {
    $('#fmob_chart').attr('src', buildURL(range));
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
 * Fetches the data for the card population
 * returns an array with values
 * avg, cvolume (currency volume), difficulty, ghashrate, high, low, and btc volume
 *
 **/
function getCardData(){
    $.ajax({
    	url:"http://api.bitcoincharts.com/v1/markets.json", 
    	dataType: 'json',
    	success : function( json ){
    	    $.each( json , function(key,val){
        		if(val['symbol'] == data.options.m){
        		    data.result = json[val];
        		}
    	    });
    	},
        error: ajaxError
    });
}
getYesterdayAvg();

function formatDate(val){
	if(val < 10){ return "0"+val;
	}else{ return val;
	}
}
function getYesterdayAvg(){
	$.ajax({
		url:"http://api.coindesk.com/v1/bpi/historical/close.json?for=yesterday",
		dataType: 'json',
		success: function ( json ){
			var d = new Date();
			d.setDate(d.getDate()-1);
			var formatted = d.getFullYear()+'-'+formatDate(d.getMonth()+1)+'-'+formatDate((d.getDay()-1));
			bkg.console.log(formatted +'-'+json);
			result.yesterday_avg = data.json['bpi'][formatted];

			getChange();
		},
		error: ajaxError
	});
}
function getChange(){
	result.change = result.close - result.yesterday_avg; 
}
function getHashRate() {
    $.ajax({
        url:"http://blockchain.info/q/hashrate",
        success: function( text ){
            data.result.hashrate = Number(text).toPrecision(3);
        },
        error: ajaxError
    });
}

/**
 *Returns the Difficulity rate currently for bitcoin
 **/
function getDifficulity(){
    $.ajax({
        url:"http://blockchain.info/q/getdifficulty",
        success: function( text ){
           data.result.difficulity = Number(text).toPrecision(2);
        },
        error: ajaxError
    });
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

function ajaxError(jqXHR, textStatus, errorThrown) {
    bkg.console.log("AJAX error: " + errorThrown + ": " + textStatus);
}
