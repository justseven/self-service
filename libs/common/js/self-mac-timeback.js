//创建定时器标签
$("body").append("<span id='selfTimeMark' style='color:  #69a9c2; font-weight: bold; position: absolute;top: 50px;left: 50px;font-size: 30px'></span>");
// 页面点击标志位
var bodyClickFlag = false;
// 页面被点击
$("body").click(function() {
	bodyClickFlag = true;
});
function selfMacTimeCount(second, total) {
	// 页面被点击的场合
	if(bodyClickFlag) {
		second = total + 10;
	}
	// 标志位回复
	bodyClickFlag = false;
	second--;

	// 少于一分钟的场合
	if(second < total) {
		$("#selfTimeMark").html(second);
	} else {
		$("#selfTimeMark").html("");
	}
	// 页面跳转
	if(second <= 0) {
		try {
			window.external.ReturnToHome();
		} catch(e) {
			window.location.href = "../index.html";
		}
	};

	setTimeout("selfMacTimeCount(" + second + "," + total + ")", 1000);
}
selfMacTimeCount(parseInt($.config.get("idleTime"))+10,parseInt($.config.get("idleTime")));
