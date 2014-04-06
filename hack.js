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

/*
Function to be called when the user selects a range button. Causes the image to
be updated by replacing the image src URL with a new one
*/
function updateRange(range) {
    $('#fmob_chart').attr('src', buildURL(data.baseURL, range));
}



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
            $('#dataresultavg').html(parseFloat(data.result['avg']).toFixed(2));
            $('#dataresulthigh').html(parseFloat(data.result['high']).toFixed(2));
            $('#dataresultlow').html(parseFloat(data.result['low']).toFixed(2));
            $('#dataresultvolume').html(parseFloat(data.result['volume']).toFixed(2));
            $('#dataresultcvolume').html(parseFloat(data.result['currency_volume']).toFixed(2));

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
	$('#fmob_chart').attr('src', buildURL(data.baseURL,"d1")); 
}
function buildContainer() {
    console.log("Inside of buildContainer()");

    var d = new Date();

    console.log("Date built");

    var domElement = [
        "<li class='mod g tpo knavi obcontainer' style='list-style-type: none'>",
	"<style>"+googcss+"</style>",
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
        "<div class='fmob_cb_l' onclick='updateRange(\"d1\")' data-ved='0CCsQ-BMoADAA'>",
        "<span class='fmob_cb_np ksb mini' style='display:none'>1d</span>",
        "<span class='fmob_cb_pr ksb ksbs mini'>1d</span>",
        "</div>",
        "<div class='fmob_cb_m' onclick='updateRange(\"d5\")' data-ved='0CCwQ-BMoATAA'>",
        "<span class='fmob_cb_np ksb mini'>5d</span>",
        "<span class='fmob_cb_pr ksb ksbs mini' style='display:none'>5d</span>",
        "</div>",
        "<div class='fmob_cb_m' onclick='updateRange(\"m1\")' data-ved='0CC0Q-BMoAjAA'>",
        "<span class='fmob_cb_np ksb mini'>1m</span>",
        "<span class='fmob_cb_pr ksb ksbs mini' style='display:none'>1m</span>",
        "</div>",
        "<div class='fmob_cb_m' onclick='updateRange(\"m6\")' data-ved='0CC4Q-BMoAzAA'>",
        "<span class='fmob_cb_np ksb mini'>6m</span>",
        "<span class='fmob_cb_pr ksb ksbs mini' style='display:none'>6m</span>",
        "</div>",
        "<div class='fmob_cb_m' onclick='updateRange(\"y1\")' data-ved='0CC8Q-BMoBDAA'>",
        "<span class='fmob_cb_np ksb mini'>1y</span>",
        "<span class='fmob_cb_pr ksb ksbs mini' style='display:none'>1y</span>",
        "</div>",
        "<div class='fmob_cb_m' onclick='updateRange(\"y5\")' data-ved='0CDAQ-BMoBTAA'>",
        "<span class='fmob_cb_np ksb mini'>5y</span>",
        "<span class='fmob_cb_pr ksb ksbs mini' style='display:none'>5y</span>",
        "</div>",
        "<div class='fmob_cb_r' onclick='updateRange(\"max\")' data-ved='0CDEQ-BMoBjAA'>",
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
        "<div>$ Volume</div>",
        "<div>Network</div>",
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


var googcss = ".mod{clear:both}.fmob_r_ct{margin-top:20px}.fmob_title{overflow:hidden;text-overflow:ellipsis}.cv_ch{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.cv_cb{overflow:hidden;padding-bottom:0;position:relative}.cv_v{-webkit-text-size-adjust:none}.fmob_pl{line-height:1.1;margin-top:10px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.fmob_pr{margin-right:10px}.fmob_pr{font-size:120%}#fmob_chart{height:96px;margin-bottom:10px;width:100%}.cv_card_content{-webkit-box-flex:1;-webkit-flex:1 1 auto;line-height:1.4;overflow:hidden}#fmob_cb_container{display:-webkit-flexbox;display:-webkit-box;line-height:22px;margin:0 auto;max-width:400px;min-height:19px;text-align:center}.fmob_cb_l,.fmob_cb_m{-webkit-box-flex:1;-webkit-flex:1 1 auto;}.fmob_cb_r{-webkit-box-flex:1.1;-webkit-flex:1.1 1.1 auto;}.fmob_cb_np.ksb,.fmob_cb_pr.ksb{margin-top:0}.fmob_cb_l .ksb,.fmob_cb_m .ksb{margin-right:-1px !important}.fmob_cb_r .ksb,.fmob_cb_m .ksb{margin-left:-1px !important}.fmob_cb_pr,.fmob_cb_np{display:block;}.fmob_cb_np.ksb,.fmob_cb_pr.ksb{height:25px !important;line-height:25px !important;}.fmob_rd_ct{-webkit-box-pack:justify;-webkit-flex-pack:justify;display:-webkit-flexbox;display:-webkit-box;margin-top:20px;white-space:nowrap}.fmob_rd_bl{-webkit-box-pack:justify;-webkit-flex-pack:justify;display:-webkit-flexbox;display:-webkit-box}.fmob_rd_it{margin-right:20px}.fmob_funds .fmob_rd_it{margin-right:15px}.ecn_line{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.fmob_dis{bottom:-20px;position:absolute;right:20px}.fmob_dis a{color:#878787 !important;font-size:11px !important;font-weight:normal !important}.fmob_dis a:hover{text-decoration:underline}@media only screen and (min-width:480px){.cv_cb{padding-bottom:0}.fmob_rc_ct{-webkit-box-flex:2.0;-webkit-flex:2 1 auto;width:66%;margin-right:25px}.fmob_rd_ct{-webkit-box-flex:1.0;-webkit-flex:1 1 auto;display:block;margin:0;min-width:160px}.fmob_rd_bl{-webkit-box-pack:start;-webkit-flex-pack:start}.fmob_rd_it{width:55px}.fmob_funds .fmob_rd_it{width:95px}.fmob_r_ct{display:-webkit-box;display:-webkit-flexbox;}}.vk_fin_up{color:#3d9400 !important}.vk_fin_dn{color:#dd4b39 !important}#newsbox span.tl>a,li#newsbox div.vsc>div.gl{font-size:13px}.newsimg.cosm{margin-top:4px;margin-bottom:4px}.newsimg.bgnw{margin-top:0px;margin-bottom:8px;margin-right:16px}.newsimg{margin-top:7px;margin-bottom:7px}._Ry .scim,._Ry .nscim{margin:0;margin-top:7px}.w0.lead_result{margin-top:5px;margin-bottom:0px}.l.lead_result{margin-top:0px;margin-bottom:4px}.l.scim{margin-left:16px}.crl{color:#777;cursor:pointer;display:inline-block}.crl:hover{color:#222}.cri{display:none !important}.crp{color:#444;z-index:3;width:350px;margin-left:-160px;margin-top:3px;background:#fff;border:1px solid #d6d6d6;-webkit-box-shadow:0px 2px 4px #d6d6d6;-moz-box-shadow:0px 2px 4px #d6d6d6;box-shadow:0 2px 4px #d6d6d6;padding:16px;-webkit-border-radius:2px;-moz-border-radius:2px;border-radius:2px;white-space:normal;position:absolute}.crp .crt{position:initial;max-width:40px;max-height:40px;margin-right:10px;border:0px}.crc{display:inline-block;position:relative;margin-left:4px}.crc .cr-load{display:none}.crc .yp.yl .cr-load{display:block}.cr-dwn-arw{border-color:#aaa transparent !important;border-style:solid;border-width:4px 4px 0px 4px;width:0;height:0;top:50%;position:absolute;margin-left:6px;margin-top:-3px}.crl:hover .cr-dwn-arw{border-color:#222 transparent !important}.crp table{margin-bottom:6px}.crp .cr-summary{margin-bottom:4px}.crp .cr-debug{color:red}.crp .cr-hdr{margin-top:12px;font-weight:bold;margin-bottom:2px}.cr-wikicite{color:#777 !important;font-size:11px;text-decoration:none}.cr-wikicite:hover{text-decoration:underline}.cr-quote{margin-top:15px;margin-bottom:15px;color:#666}.cr-quote-first a{font-weight:bold}.cr-quote a{color:#777 !important;text-decoration:none}.cr-quote a:hover{text-decoration:underline}.cr-summary b{font-weight:normal}.cr-sitename{font-size:15px;font-weight:bold}.cr-award,.cr-nomination,.cr-owner,.cr-date{font-weight:normal;margin-top:5px}.cr-sitetype{color:#777;font-weight:normal;margin-top:1px}.cr-misc{margin-top:15px}.cr-l-debug{color:red;cursor:pointer}.cr-sep{margin-left:13px}a.cr-owner:link,a.cr-owner:visited{color:#2518b5;text-decoration:none}a.cr-owner:hover{color:#2518b5;text-decoration:underline}"
