app.controller("mainController", function($scope,$route, $location,data) {
    //显示高拍仪
    angular.element(document).ready(function(){
        $.device.cmCaptureShow(430, 275, 385, 330);
        $.device.cmCaptureSelectRect(30,80, 2533, 1780);
    });
    $scope.photo = function(){
        $.device.cmCaptureHide();
        //获取图片地址
        $scope.savedPhoto = $.device.cmCaptureCaptureUrl();
        data.imgUrl = $scope.savedPhoto;
    };
    $scope.hint = "请将您的材料对准屏幕下方高拍仪";
    $scope.defaultDisplay = true;
    $scope.defaultHidden = false;
    $scope.savePhoto = false;
    $scope.saveMaterial = function(){
        if(!$scope.savePhoto){
            $scope.photo();
            $scope.savePhoto = true;
        };
        $scope.hint = "请预览下方照片，您是否确认保存";
        $scope.defaultDisplay = false;
        $scope.defaultHidden = true;
    };
    $scope.reload = function(){
        //刷新页面的方法
        $route.reload();
    };

});
app.controller("chooseController", function($scope,$route, $location,data) {
    $scope.imgUrl = data.imgUrl;
    //打印页数默认为1
    $scope.printNums = 1;
    //是否需要支付 需要1 不需要0
    $scope.payParams = $.getConfigMsg.isMaterialCopyPay;
    $scope.add = function(){
        $scope.printNums++;
        data.printNums = $scope.printNums;
    };
    $scope.minus = function(){
        if($scope.printNums>1)
        $scope.printNums--;
        data.printNums = $scope.printNums;
    };
    data.printNums = $scope.printNums;
    $scope.payJudge = function(){
        if($scope.payParams == 1){
            $location.path("/pay");
        }else if($scope.payParams ==0){
            $location.path("/pwait");
        }
    }
});
app.controller("payController", function($scope,$route, $location,$http,data,$timeout) {
    angular.element(document).ready(function(){
        $scope.getQRcodeUrl();
    });
    //判断支付类型
    $scope.payType = "wechat";
    $scope.printNums = data.printNums;
    $scope.prices = $scope.printNums* $.getConfigMsg.materialCopyPayMoney;
    $scope.materialCopyPayDesc = $.getConfigMsg.materialCopyPayDesc;
    $scope.weixin = "cur_weixin";
    $scope.payTypeIcon ="weixinico";
    $scope.alp = "alp";
    $scope.qrCode = "";
    //默认微信支付.ajax请求获取二维码图片的地址
    $scope.getQRcodeUrl = function(){
        $http.jsonp($.getConfigMsg.preUrl+"/aci/pay/newPayOrder.do?jsonpCallback=JSON_CALLBACK&MONEY="+$scope.prices+"&ST_PAY_TOOL="+$scope.payType+"&paySource=selfTerminal&ST_COMMODITY_DESC="+$scope.materialCopyPayDesc)
            .success(function(dataJsonp){
                $scope.stApplyNo = dataJsonp.stOrderId;
                $scope.qrCode = $.getConfigMsg.preUrl+"/aci/pay/getPayQrcodeByNewScanOrderId.do?ST_ORDER_ID="+$scope.stApplyNo+"&NM_TIMES=6";
                $scope.testResult();
            })
            .error(function(){
                layer.alert('请重新选择支付方式', {
                    skin: 'layui-layer-lan'
                    ,closeBtn: 0
                    ,anim: 4 //动画类型
                });
            });
    };

    //
    $scope.wechat = function(){
        $scope.weixin = "cur_weixin";
        $scope.alp = "alp";
        $scope.payTypeIcon ="weixinico";
        $scope.payType = "wechat";
        $scope.getQRcodeUrl();
    }
    $scope.alipay = function(){
        $scope.alp = "cur_alp";
        $scope.weixin = "weixin";
        $scope.payTypeIcon ="zhifubao";
        $scope.payType = "alipay";
        $scope.getQRcodeUrl();
    }
    $scope.testResult =function(){
        $http.jsonp($.getConfigMsg.preUrl+"/aci/pay/queryOrder.do?jsonpCallback=JSON_CALLBACK&ST_ORDER_ID="+$scope.stApplyNo)
            .success(function(dataJsonp){
                $scope.result = dataJsonp.nmIsPaid;
                //返回1 表示已经支付
                if($scope.result =="1"){
                    $location.path("/pwait");
                    //返回0 表示未支付
                }else if($scope.result == "0"){
                     $timeout(function(){
                        $scope.testResult()
                    },2000);
                    //既不返回1也不返回0 表示支付失败。重新生成二维码。
                }else{
                    $scope.getQRcodeUrl();
                }
            })
            .error(function(){})
    }
});
app.controller("pwaitController", function($scope,$route, $location,data,$timeout) {
   //设置打印状态为：打印中
    $scope.printStating = "geginprint";
    $scope.beginPrint = true;
    $scope.endPrint = false;
    //设置打印页数
    $scope.printNums = data.printNums;
    //打印完毕后跳转到打印完毕的页面，再返回首页
    $timeout(function(){
        $scope.beginPrint = false;
        $scope.endPrint = true;
        $scope.printStated = "img_print";
    },10000*$scope.printNums);
    $timeout(function(){window.location.href = "../index.html"},10000*$scope.printNums+10000);
    //打印参数
    var options = {
        settings:{
            paperName:'a4',
            orientation:2,
            topMargin:1,
            leftMargin:1,
            bottomMargin:1,
            rightMargin:1,
            copies:$scope.printNums//打印次数
        }
    };
    //获取打印图片
    $scope.printImg = data.imgUrl;
    angular.element(document).ready(function(){
        //旋转打印图片
        $.jatools.init();
        $.jatools.print(options);
    });
});