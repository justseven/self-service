app.controller("mainController", function($scope, $route, $location, $http) {
    $scope.currentPage = 1;
    $scope.configUrl = $.getConfigMsg.preUrl;
    $scope.machineId = $.getConfigMsg.deviceId;
    $scope.paging = false;
    $scope.formName = "";
    $scope.getFormList = function(){
        $http.jsonp($.getConfigMsg.preUrl+"/aci/autoterminal/forward.do?fmd=aci-selfFilling&fdo=getSelfmFillFormList&jsonpCallback=JSON_CALLBACK&pageSize=6&currentPage="+$scope.currentPage+"&stMachineId="+$scope.machineId)
            .success(function(dataJsonp){
                $scope.formList = dataJsonp;
                if(dataJsonp){
                    $scope.totalPages = dataJsonp[0].totalPage;
                    $scope.paging = $scope.totalPages>1?true:false;
                }
            })
    };
    $scope.nextPage = function(){
        if($scope.currentPage<$scope.totalPages){
            $scope.currentPage++;
        }
    };
    $scope.previousPage = function(){
        if($scope.currentPage>1){
            $scope.currentPage--;
        }
    };
    $scope.$watch("currentPage",function(){
        $scope.getFormList();
    });
    $scope.getSearchFormList = function(){
        $http.jsonp($.getConfigMsg.preUrl+"/aci/autoterminal/forward.do?fmd=aci-selfFilling&fdo=getSelfmFillFormListForName&jsonpCallback=JSON_CALLBACK&pageSize=6&itemName="+$scope.formName+"&currentPage="+$scope.currentPage+"&stMachineId="+$scope.machineId)
            .success(function(dataJsonp){
                $scope.formList = dataJsonp;
                if(dataJsonp){
                    $scope.totalPages = dataJsonp[0].totalPage;
                    $scope.paging = $scope.totalPages>1?true:false;
                }else{
                    layer.alert('对不起未搜索到此部门事项', {
                        skin: 'layui-layer-lan'
                        ,closeBtn: 0
                        ,anim: 4 //动画类型
                    });
                    $scope.getFormList();
                }
            })
    };
    $scope.searchItem = function(){
        if($scope.formName){
            $scope.getSearchFormList();
        }else{
            layer.alert('对不起未搜索到此部门事项', {
                skin: 'layui-layer-lan'
                ,closeBtn: 0
                ,anim: 4 //动画类型
            });
        }
    }
});
app.controller("noteController", function($scope, $route, $location, $http, $sce,data,$routeParams) {
    //先获取图表ID，再通过Id获取图表地址
    $scope.formImgId= $routeParams.id;
    data.formImgId =$scope.formImgId;
    ////判断填表类型
    $scope.fillFormType = $routeParams.type;
    data.fillFormType =$scope.fillFormType;
    $scope.getFormImgUrl = function(){
        $http.jsonp($.getConfigMsg.preUrl+"/aci/autoterminal/forward.do?fmd=aci-selfFilling&fdo=getSelfmFillForm&jsonpCallback=JSON_CALLBACK&stFormId="+$scope.formImgId+"&nmType="+$scope.fillFormType)
            .success(function(dataJsonp){
                $scope.formImgUrl =$.getConfigMsg.preUrl+dataJsonp.blSmallFileImageUrl;
                $scope.formExplain = dataJsonp.stFormInfo;
                $scope.formExplain = $sce.trustAsHtml($scope.formExplain);
                $scope.getIdCardInfo = dataJsonp.nmNeedIdCard;//是否需要刷卡 0不需要 1需要
                $scope.pasteIdCard = dataJsonp.nmNeedIdCardPaste;//是否需要贴身份证 0不需要 1需要
                data.getIdCardInfo = $scope.getIdCardInfo;
                data.pasteIdCard = $scope.pasteIdCard;
                data.htmlContent = dataJsonp.clText;
                data.FormModelType = dataJsonp.nmType;
                data.wordUrl = dataJsonp.stFormName +".doc";
            })
    };
    $scope.getFormImgUrl();
    $scope.beginFillForm = function(){
        if($scope.getIdCardInfo){
            $location.path("/idCard");
        }else if(!$scope.getIdCardInfo){
            if($scope.pasteIdCard){
                $location.path("/tphoto");
            }else if(!$scope.pasteIdCard){
                $location.path("/fillform");
            }
        }
    }
});
app.controller("idCardController", function($scope, $route, $location, $http, data,$timeout) {
    $scope.noteId = data.formImgId;
    $scope.noteType = data.fillFormType;
    //获取身份证信息
    $scope.readIdCard = function() {
        $.device.idCardOpen(function(value) {
            var list = eval('(' + value + ')');
            data.idCardNumber = list.Number;
            data.userName = list.Name;
            if(!data.idCardNumber){
                alert("Uncaught useful info");
            }else{
                //是否需要贴身份证
                if(data.pasteIdCard){
                    $timeout(function(){$location.path("/tphoto")},100);
                }else if(!data.pasteIdCard){
                    $timeout(function(){$location.path("/fillform")},100);
                }
            }
        });
    };
    $scope.readIdCard();
});
app.controller("tphotoController", function($scope,$route,$location,data) {
    //显示高拍仪
    angular.element(document).ready(function(){
        $.device.cmCaptureShow(430, 275, 385, 370);
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
            $.device.cmCaptureShow(430, 275, 385, 370);
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
            $.device.cmCaptureShow(430, 275, 385, 370);
            $scope.saveStatusReverse = false;
        }
        $scope.next = function(){
            $location.path("/fillform");
        };
    }
});
app.controller("fillformController", function($scope, $route, $location, $http,$sce, data,$timeout) {
    //根据样表类型获取数据
    if(data.getIdCardInfo == 1){
        $scope.idCardNumber = data.idCardNumber;
        $scope.userName = data.userName;
    }
    if(data.pasteIdCard == 1){
        $scope.frontImgUrl = data.frontImgUrl;
        $scope.reverseImgUrl = data.reverseImgUrl;
    }
    $scope.getForm = function(){
        //html表格类型
        if( data.FormModelType == "0"){
            var index = layer.load(0, {
                shade: [0.7,'white'] //0.7透明度的黑色背景
            });
            $scope.htmlType = true;
            $scope.wordType = false;
            $scope.formContent = data.htmlContent;
            $scope.formContent = $sce.trustAsHtml($scope.formContent);
            $timeout(function(){
                layer.close(index);
                $("#userName").html($scope.userName);
                $("#userNum").html($scope.idCardNumber);
                var IdCardImg = "<img src='"+data.frontImgUrl+"' style='width: 85.6mm;height: 54mm;border:1px solid #000;margin-right:20px'/><img src='"+data.reverseImgUrl+"' style='width: 85.6mm;height: 54mm;'/>"
                $("#userIdCard").html(IdCardImg);
            }, 2000);
        }
        if(data.FormModelType == "1"){
            var index2 = layer.load(0, {
                shade: [0.5,'white'] //0.7透明度的黑色背景
            });
            //word表格类型
            $scope.htmlType = false;
            $scope.wordType = true;
            $.device.officeOpenRelative(data.wordUrl);
            $timeout(function(){
                layer.close(index2);
                $.device.officeShow(800, 860, 80, 120);
            }, 4000);
            $timeout(function(){
                $.device.officeSetStringValue('idCardNo',data.idCardNumber);
                $.device.officeSetStringValue('idCardName',data.userName);
                $.device.officeSetJpgValue('frontImg',data.frontImgUrl);
                $.device.officeSetJpgValue('reverseImg',data.reverseImgUrl);
            },1000);
        }
    };
    $scope.getForm();
    $scope.printForm = function(){
        if($scope.htmlType){
            var options = {
                settings:{
                    paperName:'a4',
                    orientation:1,
                    topMargin:0,
                    leftMargin:0,
                    bottomMargin:0,
                    rightMargin:0
                },
                pagePrefix: "htmlType"
            };
            $.jatools.init();
            $.jatools.print(options);
            $timeout(function(){ $location.path("/pwait")},1000);
        }
        if($scope.wordType){
            $.device.officePrint();
            $.device.officeClose();
            $timeout(function(){ $location.path("/pwait")},1000);
        }

    }
    $scope.backMainHtml = function(){
        $.device.officeClose();
        $location.path("/main");
    }
});
app.controller("pwaitController", function($scope,$timeout) {
    //设置打印状态为：打印中
    $scope.printStating = "geginprint";
    $scope.beginPrint = true;
    $scope.endPrint = false;
    //打印完毕后跳转到打印完毕的页面，再返回首页
    $timeout(function(){
        $scope.beginPrint = false;
        $scope.endPrint = true;
        $scope.printStated = "img_print";
    },10000);
    $timeout(function(){window.location.href = "../index.html"},15000);
});

