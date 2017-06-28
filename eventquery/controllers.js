app.controller("mainController", function($scope, $route, $location, $http, data) {

	$scope.idCardImg = "card";
	$scope.qrCodeImg = "ewm	";
	//切换方式
	$scope.setTab = function(name, cursel, n) {
		for(var i = 1; i <= n; i++) {
			$scope.menu = document.getElementById(name + i);
			$scope.con = document.getElementById("con_" + name + "_" + i);
			$scope.menu.className = (i == cursel ? "hover" : "");
			$scope.con.style.display = (i == cursel ? "block" : "none");
		}
		if("1" == cursel) {
			$.device.qrCodeClose();
			$scope.readIDcard();
		}
		if("2" == cursel) {
			$.device.idCardClose();
			$.device.qrCodeClose();
			$scope.eventquerySearch = function() {
				if($scope.number == '请输入您的编号') {
					$scope.number = ''; // 160400000446
				}
				if($scope.name == '请输入您的企业名称或姓名') {
					$scope.name = '';
				};
				$http.jsonp($.getConfigMsg.preUrl + "/aci/autoterminal/forward.do?fmd=aci-eventquery&fdo=getWorkApplyInfo&jsonpCallback=JSON_CALLBACK&stApplyNo=" + $scope.number + "&name=" + $scope.name)
					.success(function(dataJsonp) {
						data.detail = dataJsonp;
						data.details = undefined;
						if(dataJsonp) {
							$location.path('/detail/:');
						} else {
							$location.path('/hint');
						}
					})
					.error(function() {});
			};
		}
		if("3" == cursel) {
			$.device.idCardClose();
			$.device.qrCodeOpen(function(value) {
				$http.jsonp($.getConfigMsg.preUrl + "/aci/autoterminal/forward.do?fmd=aci-eventquery&fdo=getApplyInfoByStApplyNo&jsonpCallback=JSON_CALLBACK&stApplyNo=" + value)
					.success(function(dataJsonp) {
						data.detail = dataJsonp;
						data.details = undefined;
						if(dataJsonp) {
							$location.path('/detail/:');
						} else {
							$location.path('/hint');
						}
					})
					.error(function() {
					});
			});
		}
	};
	$scope.readIDcard = function() {
		$.device.idCardOpen(function(value) {
			var list = eval('(' + value + ')');
			$scope.id = list.Number;
			$http.jsonp($.getConfigMsg.preUrl+"/aci/autoterminal/forward.do?fmd=aci-eventquery&fdo=getApplyInfoByStIdCard&jsonpCallback=JSON_CALLBACK&stIdCard=" + $scope.id)
				.success(function(dataJsonp) {
					data.details = dataJsonp;
					data.detail = undefined;
					if(dataJsonp) {
						$location.path('/list');
					} else {
						$location.path('/hint');
					}
				})
				.error(function() {});
		});
	};
	$scope.readIDcard();
	$("#numberInput").keyboard();
});
//身份证获取列表
app.controller("listController", function($scope, $route, $location, $http, data) {
	$scope.totalLength = data.details.length; //办件个数
	$scope.total_page = Math.ceil($scope.totalLength / 2); //办件页数
	$scope.now_page = 1;
	$scope.arr = []; //办件个数数组
	$scope.arr2 = []; //办件个数分页数组
	//初始化
	for(var i = 0; i < $scope.totalLength; i++) {
		var detail_id = data.details[i].stApplyNo;
		$scope.arr[i] = {
			"No": i,
			"stApplyNo": data.details[i].stApplyNo,
			"stItemName": data.details[i].stItemName
		};
	};
	$scope.change = function(arr, n) {
		for(var i = 0; i < $scope.total_page; i++) {
			$scope.arr2[i] = arr.slice(i * n, i * n + n);
		}
		return $scope.arr2;
	};
	$scope.change($scope.arr, 2);
	$scope.list = $scope.arr2[0];
	$scope.right = function() {
		if($scope.now_page < $scope.total_page) {
			$scope.now_page += 1;
			$scope.list = $scope.arr2[$scope.now_page - 1];
		}
	};
	$scope.left = function() {
		if($scope.now_page > 1) {
			$scope.now_page -= 1;
			$scope.list = $scope.arr2[$scope.now_page - 1];
		}
	};
	$scope.back = function() {
		$location.path("/main");
	}
});
//身份证详情&二维码&办件详情
app.controller("detailController", function($scope, $route, $location, $http, data, $routeParams) {
	if(data.details != undefined) {
		for(i in data.details) {
			if(data.details[i].stApplyNo == $routeParams.detailID) {
				$scope.list = data.details[i];
			}
		}
	}
	if(data.detail != undefined) {
		$scope.list = data.detail;
	}

	$scope.back = function() {
		window.history.back();
	}
});
//错误页面控制器
app.controller("hintController", function($scope, $route, $location) {
	$scope.backIndex = function() {
		$location.path("/main");
	}
});