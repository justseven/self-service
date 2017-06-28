//主控制器
app.controller("mainController", function($scope,$route, $location,$http) {
    //获取部门数据
    $scope.getDepartmentMsg = function(){
        $http.jsonp($.getConfigMsg.preUrl+"/aci/autoterminal/forward.do?fmd=aci-reservation&fdo=getOrgans&jsonpCallback=JSON_CALLBACK&dept=")
            .success(function(dataJsonp){
                $scope.dataList =  angular.copy(dataJsonp);

            });
    };
    angular.element(document).ready(function(){
         $scope.getDepartmentMsg();
    });
});
//主列表控制器
app.controller("listController", function($scope, $route,$http,$location,data,$routeParams) {
    $scope.listId = $routeParams.listId;
    data.listId = $scope.listId;
    $scope.currentPage = 1;
    $scope.listSlice = [];
    $scope.currentArr = [];
    //获取部门列表数据
    $scope.getListMsg = function(){
        $http.jsonp($.getConfigMsg.preUrl+"/aci/autoterminal/forward.do?fmd=aci-reservation&fdo=getAllItemsByOrganId&jsonpCallback=JSON_CALLBACK&organId="+$scope.listId+"&pageSize=500&currentPage="+$scope.currentPage)
            .success(function(dataJsonp){
                $scope.dataList =  angular.copy(dataJsonp);
                $scope.dataList.sort($scope.FirstWordSort);
                $scope.totalPages = Math.ceil($scope.dataList.length/15);
                //分割数组
                $scope.Slice=function(arr,n){
                    for(var i=0;i<$scope.totalPages;i++){
                        $scope.listSlice[i]=arr.slice(i*n,i*n+n);
                    }
                    return  $scope.listSlice;
                };
                $scope.Slice($scope.dataList,15);
                $scope.currentArr = $scope.listSlice[0];
            })
            .error(function(){
                layer.alert('对不起没有找到数据，请返回首页', {
                    skin: 'layui-layer-lan'
                    ,closeBtn: 0
                    ,anim: 4 //动画类型
                });
            })
    }
    angular.element(document).ready(function(){
        $scope.getListMsg();
    });
    $scope.$watch("currentPage",function(){
        $scope.currentArr = $scope.listSlice[$scope.currentPage-1];
    });
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
    $scope.inOrderTime = function(i){
        data.params = i;
        $location.path('/date');
    };
    //按首字母排序函数
    $scope.FirstWordSort = function (v1,v2){
        v1 = v1.stItemName;
        v2 = v2.stItemName;
        return v1.localeCompare(v2);
    }
});
//选择预约时间控制器
app.controller("dateController", function($scope, $route, $location,$http,data) {
    $scope.listId = data.listId;
    $scope.stItemNo=data.params.stItemNo;
    $scope.stPlaceId=data.params.stPlaceId;
    $scope.stItemName=data.params.stItemName;
    $scope.checkedDate = "";
    //获取可以预约的日期
    $scope.getOrderDate = function(){
        $http.jsonp($.getConfigMsg.preUrl+"/aci/autoterminal/reservation/getReservationAllDay.do?jsonpCallback=JSON_CALLBACK&placeId="+$scope.stPlaceId+"&itemNo="+$scope.stItemNo)
            .success(function(dataJsonp){
                $scope.dataList =  angular.copy(dataJsonp);
                WdatePicker({
                    eCont: 'datePicker',
                    doubleCalendar: true,
                    dateFmt: 'yyyy-MM-dd',minDate:'%y-%M-{%d+1}',
                    opposite: true,
                    disabledDates: $scope.dataList,
                    onpicked: function (dp) {
                        checkedDate=dp.cal.getDateStr();
                        $scope.orderTimes(checkedDate);
                    }
                });
            });
    };
    angular.element(document).ready(function(){
        $scope.getOrderDate();
    });
    $scope.sliceData = [];
    //获取当天可预约的时间段
    $scope.orderTimes = function(checkedDate){
        $http.jsonp($.getConfigMsg.preUrl+"/aci/autoterminal/forward.do?fmd=aci-reservation&fdo=getReservationAllTime&jsonpCallback=JSON_CALLBACK&placeId="+$scope.stPlaceId+"&itemNo="+$scope.stItemNo+"&date="+checkedDate)
            .success(function(dataJsonp){
                $scope.dataTimes =  angular.copy(dataJsonp);
                $scope.sliceData =[];
                $scope.currentPage = 1;
                $scope.moreFiveDisplay = false;
                $scope.totalPages =  Math.ceil($scope.dataTimes.length/5);
                //根据预约时间段个数判断使用哪种样式
                if($scope.totalPages == "1"){
                    $scope.currentTimes = $scope.dataTimes;
                    $scope.moreFiveDisplay = false;
                }else if($scope.totalPages>1){
                    $scope.moreFiveDisplay = true;
                    for(var i=0;i<$scope.totalPages;i++){
                        $scope.sliceData[i] =  $scope.dataTimes.slice(i*5,i*5+5);
                    }
                    $scope.$watch("currentPage",function(){
                        $scope.currentTimes = $scope.sliceData[$scope.currentPage-1];
                    });
                }
                $scope.checkedDate = checkedDate;
            });
    };
    $scope.nextPage = function(){
        if($scope.currentPage<$scope.totalPages){
            $scope.currentPage++;
        };
    };
    $scope.prevPage = function(){
        if($scope.currentPage>1){
            $scope.currentPage--;
        }
    };
    //选中预约时间段，改变状态
    $scope.checkedTimes = function (i){
        //切换当前选中时间段的状态
        $scope.checkedId = i.stDetailId;
        $scope.surplusCount = i.surplusCount;
        if($scope.surplusCount == 0){
            $("#"+$scope.checkedId).siblings().css("background","#f0ad4e");
            data.params = "";
            //弹出框
            layer.alert('此时间段预约人数已满,请选择其他时间段', {
                skin: 'layui-layer-lan'
                ,closeBtn: 0
                ,anim: 4 //动画类型
            });
        }else{
            $("#"+$scope.checkedId).css("background","#3366ff");
            $("#"+$scope.checkedId).siblings().css("background","#f0ad4e");
            //整理input需要的参数并传入
            data.params = {
                stItemNo:$scope.stItemNo,
                stPlaceId:$scope.stPlaceId,
                stItemName:$scope.stItemName,
                checkedDate:$scope.checkedDate,
                thisParam:i,
            };
        }

    };
    $scope.orderSubmit = function(){
        if(!!$scope.checkedDate){
            if(!!data.params.thisParam){
                $location.path("/input");
            }else{
                //弹出框
                layer.alert('请选择时间段', {
                    skin: 'layui-layer-lan'
                    ,closeBtn: 0
                    ,anim: 4 //动画类型
                });
            }
        }else{
            layer.alert('请选择日期', {
                skin: 'layui-layer-lan'
                ,closeBtn: 0
                ,anim: 4 //动画类型
            });
        }
    }
    //事项名称字数少于36，行高为58px
    if($scope.stItemName.length<37){
        $scope.lineHeight = {
            "line-height":"58px"
        }
    }
});
//输入身份证号跟手机号控制器
app.controller("inputController", function($scope, $route,$http, $location,data) {
    $('#phoneNumber').keyboard();
    $scope.idCardScanning = "cardbg";
    $scope.imgType = "gif";
    $scope.itemNo = data.params.stItemNo;
    $scope.stPlaceId = data.params.stPlaceId;
    $scope.stItemName = data.params.stItemName;
    $scope.stDetailId = data.params.thisParam.stDetailId;
    $scope.date = data.params.checkedDate;
    $scope.phoneNumber = "";
    $scope.idCardNumber = "";
    $scope.userName = "";
    //获取身份证信息
    $scope.readIDcard = function() {
        $.device.idCardOpen(function(value) {
            var list = eval('(' + value + ')');
            $scope.idCardNumber = list.Number;
            $scope.userName = list.Name;
            if( !! list ){
                $("#img").attr("src","images/jiance.png");
            };
        });
    };
    $scope.readIDcard();
    //检测手机号码是否符合规范
    $scope.testMobile = function(string){
        var standard = /^1[34578]\d{9}$/;
        if (standard.test(string)) {
            return true;
        }
        return false;
    };
    //提交数据并上传参数
    $scope.orderSubmit = function(){
        if(!!$scope.idCardNumber ){
            if($scope.testMobile($scope.phoneNumber)){
                $http.jsonp($.getConfigMsg.preUrl+"/aci/autoterminal/forward.do?fmd=aci-reservation&fdo=saveReservationInfo&jsonpCallback=JSON_CALLBACK&itemNo="+$scope.itemNo+"&placeId="+$scope.stPlaceId+"&detailId="+$scope.stDetailId+"&date="+$scope.date+"&certNo="+$scope.idCardNumber+"&userName="+$scope.userName+"&userId=&mobile="+$scope.phoneNumber+"&identityType=1&reservationSource=3&business=&unit=&unified=")
                    .success(function(dataJsonp){
                        $scope.dataList =  angular.copy(dataJsonp);
                        //预约号
                        data.orderNum = $scope.dataList.reservationNo;
                        data.errorCode = $scope.dataList.errorCode;
                        $location.path("/hint");
                    }).error(function(){
                        data.errorCode ="1";
                        $location.path("/hint");
                    })
            }else{
                layer.alert('请正确输入手机号', {
                    skin: 'layui-layer-lan'
                    ,closeBtn: 0
                    ,anim: 4 //动画类型
                });
            }
        }else{
            layer.alert('请刷身份证', {
                skin: 'layui-layer-lan'
                ,closeBtn: 0
                ,anim: 4 //动画类型
            });
        }
    };
    $scope.returnDate = function(){
        $location.path("/date");
        data.params.thisParam = "";
    }
});
app.controller("hintController",function($scope,$route,data,$timeout){
    $scope.dataNum = parseInt(data.errorCode);
    //tishi1预约成功    Yusb1预约失败重新预约 Yusb2预约人数已满重新预约 Yusb3已经预约过不能再预约 Yusb4已被例入黑名单
    switch($scope.dataNum){
        case 0:
            $scope.imgType ="tishi1";
            break;
        case 1:
            $scope.imgType ="Yusb1";
            break;
        case 2:
            $scope.imgType ="Yusb2";
            break;
        case 3:
            $scope.imgType ="Yusb3";
            break;
        case 4:
            $scope.imgType ="Yusb4";
            break;
    }
    $timeout(function(){window.location.href = "../index.html"},5000);
});