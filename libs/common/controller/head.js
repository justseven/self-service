//头部控制器
app.controller("headController", function($scope, $rootScope, $route, $location, data) {
	$scope.returnHome = function() {
		try {
			window.external.ReturnToHome();
		} catch(e) {
			window.location.href = "../index.html";
		}
	};
	$rootScope.returnUpImg = "btn_back";
	$rootScope.orderSubmitImg = "btn_yuyue";
	$rootScope.logoImg = "../"+$.getConfigMsg.logoIcon;
	$rootScope.timingParam = 70;
});