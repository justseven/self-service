app.controller("mainController", function($scope,$route,$location,data) {
    //显示高拍仪
    angular.element(document).ready(function(){
        $.device.cmCaptureShow(430, 275, 385, 330);
        $.device.cmCaptureSelectRect(60, 710, 710, 430);
    });
    $scope.photoFront = function(){
        $.device.cmCaptureHide();
        //获取身份证正面地址
        $scope.idCardFront = $.device.cmCaptureCaptureUrl();
        data.frontImgUrl = $scope.idCardFront;
    };
    $scope.photoReverse = function(){
        $.device.cmCaptureHide();
        //获取身份证反面地址
        $scope.idCardReverse = $.device.cmCaptureCaptureUrl();
        data.reverseImgUrl = $scope.idCardReverse;
    };
    $scope.hint = "请将身份证正面对准屏幕下方高拍仪";
    $scope.frontSide = true;
    $scope.reverseSide = false;
    $scope.defaultDisplay = true;
    $scope.defaultHidden = false;
    $scope.saveStatusFront = false;
    $scope.saveStatusReverse = false;
    $scope.savedFront = function(){
        $scope.hint = "请预览下方照片，您是否确认保存";
        $scope.defaultDisplay = false;
        $scope.defaultHidden = true;
        if(!$scope.saveStatusFront){
            $scope.photoFront();
            $scope.saveStatusFront = true;
        };
        $scope.prev = function(){
            $route.reload();
        };
        $scope.next = function(){
            $.device.cmCaptureShow(430, 275, 385, 330);
            $.device.cmCaptureSelectRect(60, 710, 710, 430);
            $scope.hint = "请将身份证反面对准屏幕下方高拍仪";
            $scope.defaultDisplay = true;
            $scope.defaultHidden = false;
            $scope.reverseSide = true;
            $scope.frontSide = false;
        };
    };
    $scope.savedReverse = function(){
        $scope.hint = "请预览下方照片，您是否确认保存";
        $scope.defaultDisplay = false;
        $scope.defaultHidden = true;
        if(!$scope.saveStatusReverse){
            $scope.photoReverse();
            $scope.saveStatusReverse = true;
        }
        $scope.prev = function(){
            $scope.hint = "请将身份证反面对准屏幕下方高拍仪";
            $scope.defaultDisplay = true;
            $scope.defaultHidden = false;
            $scope.reverseSide = true;
            $scope.frontSide = false;
            $scope.idCardReverse = "";
            $.device.cmCaptureShow(430, 275, 385, 330);
            $.device.cmCaptureSelectRect(60, 710, 710, 430);
            $scope.saveStatusReverse = false;
        }
        $scope.next = function(){
            $location.path("/choose");
        };
    }
});
app.controller("chooseController", function($scope,$route, $location,data) {
    $scope.frontImgUrl = data.frontImgUrl;
    $scope.reverseImgUrl = data.reverseImgUrl;
    $scope.printNums = 1;
    //是否需要支付 需要1 不需要0
    $scope.payParams = $.getConfigMsg.isIdCopyPay;
    $scope.add = function(){
        $scope.printNums++;
        data.printNums = $scope.printNums;
    };
    $scope.minus = function(){
        if($scope.printNums>1)
        $scope.printNums--;
        data.printNums = $scope.printNums;
    };
    $scope.payJudge = function(){
        if($scope.payParams == 1){
            $location.path("/pay");
        }else if($scope.payParams ==0){
            $location.path("/pwait");
        }
    }
    data.printNums = $scope.printNums;
});
app.controller("payController", function($scope,$route, $location,$http,data,$timeout) {
    //判断支付类型
    $scope.payType = "wechat";
    $scope.printNums = data.printNums;
    $scope.prices = $scope.printNums* $.getConfigMsg.idCopyPayMoney;
    $scope.idCopyPayDesc = $.getConfigMsg.idCopyPayDesc;
    $scope.weixin = "cur_weixin";
    $scope.payTypeIcon ="weixinico";
    $scope.alp = "alp";
    $scope.qrCode = "";
    //默认微信支付.ajax请求获取二维码图片的地址
    $scope.getQRcodeUrl = function(){
        $http.jsonp($.getConfigMsg.preUrl+"/aci/pay/newPayOrder.do?jsonpCallback=JSON_CALLBACK&MONEY="+$scope.prices+"&ST_PAY_TOOL="+$scope.payType+"&paySource=selfTerminal&ST_COMMODITY_DESC="+$scope.idCopyPayDesc)
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
    angular.element(document).ready(function(){
        $scope.getQRcodeUrl();
    });
    //切换微信支付
    $scope.wechat = function(){
        $scope.weixin = "cur_weixin";
        $scope.alp = "alp";
        $scope.payTypeIcon ="weixinico";
        $scope.payType = "wechat";
        $scope.getQRcodeUrl();
    };
    //切换支付宝支付
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
    //打印完毕后跳转到打印完毕的页面,再返回首页
    $timeout(function(){
        $scope.beginPrint = false;
        $scope.endPrint = true;
        $scope.printStated = "img_print";
    },10000*$scope.printNums);
    $timeout(function(){window.location.href = "../index.html"},10000*$scope.printNums+10000);

    //定义打印参数
    var options = {
        settings:{
            paperName:'a4',
            orientation:1,
            topMargin: 0,
            leftMargin: 0,
            bottomMargin: 0,
            rightMargin: 0,
            copies:$scope.printNums//打印次数
        }
    };
    //获取打印图片
    $scope.printFrontImg = data.frontImgUrl;
    $scope.printReverseImg = data.reverseImgUrl;
    angular.element(document).ready(function(){
        //旋转打印图片
        $.jatools.init();
        $.jatools.print(options);
    });
});