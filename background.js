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
	    //buildContainer();
        }
        return;
    },
    {urls: ["https://www.google.com/*"]} //Do this for all google urls
);

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
    if(changeInfo.status == 'complete'){
	chrome.tabs.executeScript(tabId, {
	    code: 'if (document.body.innerText.indexOf("bitcoin") != -1) {'+
		'buildContainer();'+
		'}'
	});
    }
});
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
    bkg.console.log("Starting to build");
    buildContainer();
    bkg.console.log("Finished");
});

function updateData() {
    getHashRate();
    getDifficulity();
    getCardData();
    getYesterdayAvg();
}

/*
*/
function buildURL(range) {
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

function formatDate(val){
	if(val < 10){ 
        return "0" + val;
	
    } else { 
        return val;
	}
}
function getYesterdayAvg() {
	$.ajax({
		url:"http://api.coindesk.com/v1/bpi/historical/close.json?for=yesterday",
		dataType: 'json',
		success: function ( json ){
			var d = new Date();
			d.setDate(d.getDate()-1);
			var formatted = d.getFullYear()+'-'+formatDate(d.getMonth()+1)+'-'+formatDate((d.getDay()-1));
			bkg.console.log(json['bpi']);
			data.result.yesterday_avg = json['bpi'][formatted];

			getChange();
		},
		error: ajaxError
	});
}
function getChange(){
	data.result.change = data.result.close - data.result.yesterday_avg; 
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
function getDifficulity() {
    $.ajax({
        url:"http://blockchain.info/q/getdifficulty",
        success: function( text ){
           data.result.difficulity = Number(text).toPrecision(2);
        },
        error: ajaxError
    });
}

function ajaxError(jqXHR, textStatus, errorThrown) {
    bkg.console.log("AJAX error: " + errorThrown + ": " + textStatus);
}

function buildContainer() {
    var d = new Date();
    var burl = buildURL("d1");
    var domElement = ["<li class='mod g tpo knavi obcontainer'>",
		      "<!--m-->",
		      "<div data-hveid='40'>",
		      "<div class='cv_v vk_gy vk_c _l'>",
                      "<div class='cv_sc'>",
                      "<div class='cv_slider'>",
                      "<div class='cv_card' id='finance_ciro_result_card'>",
                      "<div class='cv_b'>",
                      "<div class='cm_gesture_hint' id='cm_gesture_hint'></div>",
                      "<div class='cv_ch vk_sh'>",
                      "<div class='vk_h fmob_title'>Bitcoin</div>",
                      "<span>" + data.options.m + ": </span>",
                      "<span>BTC</span>",
                      "<span> - </span> ",
                      "<span class='fac-lt' data-symbol='BTC'>" + d.toLocalString() + "</span> ",
                      "ET",
                      "</div>",
                      "<div class='cv_cb'>",
                      "<div class='cv_card_content'>",
                      "<div class='fmob_pl vk_h'>",
                      "<span class='vk_bk fmob_pr fac-l' data-symbol='BTC' data-value='" + data.result.close + "'> " + data.result.close + "</span>",
                      "<span class='vk_fin_dn fac-c' data-symbol='BTC'>-" + data.result.change + " (" + ((data.result.change >= 0) ? "+" : "-") + data.result.change + "%)</span>",
                      "</div>",
                      "<div class='fmob_r_ct'>",
                      "<div class='fmob_rc_ct'>",
                      "<a href='http://bitcoincharts.com/markets/" + result.symbol + ".html'><img src='"+buildURL("d1")+"' style='border:0' alt='Bitcoin Market Data' id='fmob_chart'/></a><div id='fmob_cb_container'>" ,                                                 
		      "<div class='fmob_cb_l' onclick='updateRange(d1)' data-ved='0CCsQ-BMoADAA'>",
                      "<span class='fmob_cb_np ksb mini' style='display:none'>1d</span>",
                      "<span class='fmob_cb_pr ksb ksbs mini'>1d</span>",
                      "</div>",
                      "<div class='fmob_cb_m' onclick='updateRange(d5)' data-ved='0CCwQ-BMoATAA'>",
                      "<span class='fmob_cb_np ksb mini'>5d</span>",
                      "<span class='fmob_cb_pr ksb ksbs mini' style='display:none'>5d</span>",
                      "</div>",
                      "<div class='fmob_cb_m' onclick='updateRange(m1)' data-ved='0CC0Q-BMoAjAA'>",
                      "<span class='fmob_cb_np ksb mini'>1m</span>",
                      "<span class='fmob_cb_pr ksb ksbs mini' style='display:none'>1m</span>",
                      "</div>",
                      "<div class='fmob_cb_m' onclick='updateRange(m6)' data-ved='0CC4Q-BMoAzAA'>",
                      "<span class='fmob_cb_np ksb mini'>6m</span>",
                      "<span class='fmob_cb_pr ksb ksbs mini' style='display:none'>6m</span>",
                      "</div>",
                      "<div class='fmob_cb_m' onclick='updateRange(y1)' data-ved='0CC8Q-BMoBDAA'>",
                      "<span class='fmob_cb_np ksb mini'>1y</span>",
                      "<span class='fmob_cb_pr ksb ksbs mini' style='display:none'>1y</span>",
                      "</div>",
                      "<div class='fmob_cb_m' onclick='updateRange(y5)' data-ved='0CDAQ-BMoBTAA'>",
                      "<span class='fmob_cb_np ksb mini'>5y</span>",
                      "<span class='fmob_cb_pr ksb ksbs mini' style='display:none'>5y</span>",
                      "</div>",
                      "<div class='fmob_cb_r' onclick='updateRange(max)' data-ved='0CDEQ-BMoBjAA'>",
                      "<span class='fmob_cb_np ksb mini'>max</span>",
                      "<span class='fmob_cb_pr ksb ksbs mini' style='display:none'>max</span>",
                      "</div>",
                      "</div>",
                      "</div>",
                      "<div class='fmob_rd_ct vk_txt'>",
                      "<div class='fmob_rd_bl'>",
                      "<div class='fmob_rd_it'>",
                      "<div>Avg</div>",
                      "<div>High</div>",
                      "<div>Low</div>",
                      "</div>",
                      "<div class='fmob_rd_itv'>",
                      "<div>" + data.result.avg + "</div>",
                      "<div>" + data.result.high + "</div>",
                      "<div>" + data.result.low + "</div>",
                      "</div>",
                      "</div>",
                      "<div class='fmob_rd_bl'>",
                      "<div class='fmob_rd_it'>",
                      "<div>Volume</div>",
                      "<div>Currency Volume</div>",
                      "<div>Network Total</div>",
                      "</div>",
                      "<div class='fmob_rd_itv'>",
                      "<div>" + data.result.volume + "</div>",
                      "<div>" + data.result.currency_volume + "</div>",
                      "<div>" + data.result.hashrate + " Ghash/s</div>",
                      "</div>",
                      "</div>",
                      " </div>",
                      " </div>",
                      " </div>",
                      " </div>",
                      "<div class='cv_card_footer'></div>",
                      " </div>",
                      "</div>",
                      " </div>",
		      " </div>",
		      "</div>",
		      " <div class='vk_ftr'>",
                      "Data is not promised to be accurate. Most data delayed 15 or more minutes.",
		      "</div>",
		      " </div>",
		      "<!--n-->",
		      "</li>"].join('\n');

    $('#rso').prepend(domElement);
}
