console.log('Hack.js Loaded');

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
                i: "1",
                r: "10"
            },
            d5: {
                i: "5",
                r: "10"
            },
            m1: {
                i: "30",
                r: "60"
            },
            m6: {
                i: "180",
                r: "60"
            },
            y1: {
                i: "365",
                r: "60"
            },
            y5: {
                i: "1825",
                r: "60"
            },
            max: {
                i: "0",
                r: "60"
            }
        }
    },
    result: {},
    isBitcoin : false
};

//http://bitcoincharts.com/charts/chart.png?width=940&m=bitstampUSD&SubmitButton=Draw&r=60&i=&c=0&s=&e=&Prev=&Next=&t=M&b=&a1=&m1=10&a2=&m2=25&x=0&i1=&i2=&i3=&i4=&v=0&cv=0&ps=0&l=0&p=0&
window.setTimeout(setdiv, 2000);
var charts = "http://bitcoincharts.com/markets/"
function buildURL(url,range) {
	var w = data.options.width;
	var h = data.options.height;
	var m = data.options.m;
	
	url = url + 'width='+w+'&height='+h;
	url = url + '&m='+m+'&SubmitButton=Draw&m2=25&t=M&m1=10';
	
	var i=0, r=0;
	$.each(data.options.ranges, function(key, val){
		if(key == range){
			i = val.i;
			r = "";
		}
	});

	url = url + '&i='+ i + '&r='+r;
    console.log(url+'!!!');
    return url;
}

function getChange(){
        data.result.change = data.result.close - data.result.yesterday_avg;
	console.log('setting change');
	$('#dataresultchange').html(data.result.change);
	console.log('setting m');
	$('#dataoptionsm').html(data.optionsm);
}

function updateData() {
    getChange();
    getHashRate();
    getDifficulity();
    getCardData();
    getYesterdayAvg();
    loadimage();
}

function getCardData(){
    $.ajax({
        url:"http://api.bitcoincharts.com/v1/markets.json",
        dataType: 'json',
        success : function( json ){
            $.each( json , function(key,val){
                        if(val['symbol'] == data.options.m){
                            //data.result = json[val];
				$.each( val, function(key2, val2){
                                	data.result[key2] = val2;
					console.log(key2 + '==' +data.result[key2]);
				});

				            console.log('Setting card data');
            console.log(data.result['avg']);
            $('#dataresultavg').html(data.result['avg']);
            $('#dataresulthigh').html(data.result['high']);
            $('#dataresultlow').html(data.result['low']);
            $('#dataresultvolume').html(data.result['volume']);
            $('#dataresultcvolume').html(data.result['currency_volume']);

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

function getHashRate() {
    $.ajax({
        url:"http://blockchain.info/q/hashrate",
        success: function( text ){
            data.result.hashrate = Number(text).toPrecision(3);
	    console.log('setting hash rate');
	    $('#dataresulthashrate').html(data.result.hashrate);
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
//	   $('#dataresultdifficulity').html(data.result.difficulity);
        },
        error: ajaxError
    });
}

function ajaxError(jqXHR, textStatus, errorThrown) {
    console.log("AJAX error: " + errorThrown + ": " + textStatus);
}


function setdiv(){
	//topstuff
	document.getElementById("topstuff").innerHTML = buildContainer();
	updateData();
}

function getYesterdayAvg() {
        $.ajax({
                url:"http://api.coindesk.com/v1/bpi/historical/close.json?for=yesterday",
                dataType: 'json',
                success: function ( json ){
                        var d = new Date();
                        d.setDate(d.getDate()-1);
                        var formatted = d.getFullYear()+'-'+formatDate(d.getMonth()+1)+'-'+formatDate((d.getDay()-1));
                        data.result.yesterday_avg = json['bpi'][formatted];
			$('#dataresultclose').html(data.result.yesterday_avg);
                },
                error: ajaxError
        });
}

function loadimage(){
	$('#fmob_chart').attr('src', buildURL(data.baseURL,"d5")); 
}
function buildContainer() {
    console.log("Inside of buildContainer()");

    var d = new Date();

    console.log("Date built");

    var domElement = [
        "<li class='mod g tpo knavi obcontainer'>",
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
        "<span id='dataoptionsm'></span>",
        "<span>BTC</span>",
        "<span> - </span> ",
        "<span class='fac-lt' data-symbol='BTC'>" + d.toLocaleString() + "</span> ",
        "ET",
        "</div>",
        "<div class='cv_cb'>",
        "<div class='cv_card_content'>",
        "<div class='fmob_pl vk_h'>",
        "<span class='vk_bk fmob_pr fac-l' data-symbol='BTC' id='dataresultclose' data-value=''></span>",
        "<span class='vk_fin_dn fac-c' data-symbol='BTC' id='dataresultchange' ></span>",
        "</div>",
        "<div class='fmob_r_ct'>",
        "<div class='fmob_rc_ct'>",
        "<a href='' id='chartssymbol'><img src='' style='border:0' alt='Bitcoin Market Data' id='fmob_chart'/></a><div id='fmob_cb_container'>" ,                                                 
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
        "<div id='dataresultavg'></div>",
        "<div id='dataresulthigh'></div>",
        "<div id='dataresultlow'></div>",
        "</div>",
        "</div>",
        "<div class='fmob_rd_bl'>",
        "<div class='fmob_rd_it'>",
        "<div>Volume</div>",
        "<div>Currency Volume</div>",
        "<div>Network Total</div>",
        "</div>",
        "<div class='fmob_rd_itv'>",
        "<div id='dataresultvolume'></div>",
        "<div id='dataresultcvolume'></div>",
        "<div id='dataresulthashrate'>Ghash/s</div>",
        "</div>",
        "</div>",
        "</div>",
        "</div>",
        "</div>",
        "</div>",
        "<div class='cv_card_footer'></div>",
        "</div>",
        "</div>",
        "</div>",
        "</div>",
        "</div>",
        "<div class='vk_ftr'>",
        "Data is not promised to be accurate. Most data delayed 15 or more minutes.",
        "</div>",
        " </div>",
        "<!--n-->",
        "</li>"
    ].join('\n');
	
	return domElement;
}
