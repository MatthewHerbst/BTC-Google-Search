function buildContainer() {
var d = new Date();
var domElement = "<li class='mod g tpo knavi obcontainer'>
<!--m-->
	<div data-hveid='40'>
		<div class='cv_v vk_gy vk_c _l'>
			<div class='cv_sc'>
				<div class='cv_slider'>
					<div class='cv_card' id='finance_ciro_result_card'>
						<div class='cv_b'>
							<div class='cm_gesture_hint' id='cm_gesture_hint'></div>
							<div class='cv_ch vk_sh'>
								<div class='vk_h fmob_title'>Bitcoin</div>
								<span>" + data.options.m + ": </span>
								<span>BTC</span>
								<span> - </span> 
								<span class='fac-lt' data-symbol='BTC'>" + d.toLocalString() + "</span> 
								ET
							</div>
							<div class='cv_cb'>
								<div class='cv_card_content'>
									<div class='fmob_pl vk_h'>
										<span class='vk_bk fmob_pr fac-l' data-symbol='BTC' data-value='" + data.result.close + "'> " + data.result.close + "</span>
										<span class='vk_fin_dn fac-c' data-symbol='BTC'>-" + data.result.change + " (" + ((data.result.change >= 0) ? "+" : "-") + data.result.change + "%)</span>
									</div>
									<div class='fmob_r_ct'>
										<div class='fmob_rc_ct'>
											<a href='http://bitcoincharts.com/markets/" + result.symbol + ".html'>
												<img src='" + buildURL("d1") + "' style='border:0' alt='Bitcoin Market Data' id='fmob_chart'>
											</a>
											<div id='fmob_cb_container'>
												<div class='fmob_cb_l' onclick='updateRange(d1)' data-ved='0CCsQ-BMoADAA'>
													<span class='fmob_cb_np ksb mini' style='display:none'>1d</span>
													<span class='fmob_cb_pr ksb ksbs mini'>1d</span>
												</div>
												<div class='fmob_cb_m' onclick='updateRange(d5)' data-ved='0CCwQ-BMoATAA'>
													<span class='fmob_cb_np ksb mini'>5d</span>
													<span class='fmob_cb_pr ksb ksbs mini' style='display:none'>5d</span>
												</div>
												<div class='fmob_cb_m' onclick='updateRange(m1)' data-ved='0CC0Q-BMoAjAA'>
													<span class='fmob_cb_np ksb mini'>1m</span>
													<span class='fmob_cb_pr ksb ksbs mini' style='display:none'>1m</span>
												</div>
												<div class='fmob_cb_m' onclick='updateRange(m6)' data-ved='0CC4Q-BMoAzAA'>
													<span class='fmob_cb_np ksb mini'>6m</span>
													<span class='fmob_cb_pr ksb ksbs mini' style='display:none'>6m</span>
												</div>
												<div class='fmob_cb_m' onclick='updateRange(y1)' data-ved='0CC8Q-BMoBDAA'>
													<span class='fmob_cb_np ksb mini'>1y</span>
													<span class='fmob_cb_pr ksb ksbs mini' style='display:none'>1y</span>
												</div>
												<div class='fmob_cb_m' onclick='updateRange(y5)' data-ved='0CDAQ-BMoBTAA'>
													<span class='fmob_cb_np ksb mini'>5y</span>
													<span class='fmob_cb_pr ksb ksbs mini' style='display:none'>5y</span>
												</div>
												<div class='fmob_cb_r' onclick='updateRange(max)' data-ved='0CDEQ-BMoBjAA'>
													<span class='fmob_cb_np ksb mini'>max</span>
													<span class='fmob_cb_pr ksb ksbs mini' style='display:none'>max</span>
												</div>
											</div>
										</div>
										<div class='fmob_rd_ct vk_txt'>
											<div class='fmob_rd_bl'>
												<div class='fmob_rd_it'>
													<div>Avg</div>
													<div>High</div>
													<div>Low</div>
												</div>
												<div class='fmob_rd_itv'>
													<div>" + data.result.avg + "</div>
													<div>" + data.result.high + "</div>
													<div>" + data.result.low + "</div>
												</div>
											</div>
											<div class='fmob_rd_bl'>
												<div class='fmob_rd_it'>
													<div>Volume</div>
													<div>Currency Volume</div>
													<div>Network Total</div>
												</div>
												<div class='fmob_rd_itv'>
													<div>" + data.result.volume + "</div>
													<div>" + data.result.currency_volume + "</div>
													<div>" + data.result.hashrate + " Ghash/s</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div class='cv_card_footer'></div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class='vk_ftr'>
			Data is not promised to be accurate. Most data delayed 15 or more minutes.
		</div>
	</div>
<!--n-->
</li>";

$('#rso').prepend(domElement);
}