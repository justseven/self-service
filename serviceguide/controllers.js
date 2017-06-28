//主控制器
app.controller("mainController", function($scope,$route,data, $location,$http) {
    $scope.dataList = [];
    $scope.currentPage = 1;
    $scope.totalPages = 1;
    $scope.listSlice = [];
    $scope.currentArr = [];
    $scope.numParms = 12;
    //获取部门数据
    $scope.getDepartmentMsg = function(){
        $http.jsonp($.getConfigMsg.preUrl+"/aci/autoterminal/forward.do?fmd=aci-selfquery&fdo=getAllHallAndOrgan&jsonpCallback=JSON_CALLBACK")
            .success(function(dataJsonp){
                $scope.dataList =  dataJsonp.organList;
                $scope.totalPages = Math.ceil($scope.dataList.length/$scope.numParms);
                //分割数组
                $scope.Slice = function(arr,n){
                    for(var i=0;i<$scope.totalPages;i++){
                        $scope.listSlice[i]=arr.slice(i*n,i*n+n);
                    }
                    return  $scope.listSlice;
                };
                $scope.Slice($scope.dataList,$scope.numParms);
                $scope.currentArr = $scope.listSlice[0];
                $scope.showIcon();
            });
    };
    $scope.getDepartmentMsg();
    //判断分页图标是否显示
    $scope.showIcon = function(){
        if($scope.listSlice.length>1){
            $scope.icon = true;
        }else{
            $scope.icon = false;
        }
    }
    $scope.$watch("currentPage",function(){
        $scope.currentArr = $scope.listSlice[$scope.currentPage-1];
    });
    $scope.nextPage = function(){
        if($scope.currentPage<$scope.totalPages){
            $scope.currentPage++;
        }
    };
    $scope.prevPage = function(){
        if($scope.currentPage>1){
            $scope.currentPage--;
        }
    };
    $scope.saveCode = function(i){
        data.saveCode = i;
    }

});
//主列表控制器
app.controller("listController", function($scope, $route,$http,$location,data,$routeParams) {
    $scope.listId = $routeParams.listId;
    data.listId = $scope.listId;
    $scope.currentPage = 1;
    $scope.listSlice = [];
    $scope.currentArr = [];
    $scope.numParms = 14;
    //获取部门列表数据
    $scope.getListMsg = function(){
        $http.jsonp($.getConfigMsg.preUrl+"/aci/autoterminal/forward.do?fmd=aci-selfquery&fdo=getItemByOrganCode&jsonpCallback=JSON_CALLBACK&organCode="+$scope.listId+"&pageSize=25&currentPage="+$scope.currentPage)
            .success(function(dataJsonp){
                $scope.dataList =  dataJsonp.itemList;
                console.log($scope.dataList);
                $scope.totalPages = Math.ceil($scope.dataList.length/$scope.numParms);
                //分割数组
                $scope.Slice=function(arr,n){
                    for(var i=0;i<$scope.totalPages;i++){
                        $scope.listSlice[i]=arr.slice(i*n,i*n+n);
                    }
                    return  $scope.listSlice;
                };
                $scope.Slice($scope.dataList,$scope.numParms);
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
    $scope.getListMsg();
    $scope.$watch("currentPage",function(){
        $scope.currentArr = $scope.listSlice[$scope.currentPage-1];
    });
    $scope.nextPage = function(){
        if($scope.currentPage<$scope.totalPages){
            $scope.currentPage++;
        }
    };
    $scope.prevPage = function(){
        if($scope.currentPage>1){
            $scope.currentPage--;
        }
    };
    $scope.inOrderTime = function(i){
        data.params = i;
    };
});
//内容显示控制器
app.controller("contentController",function($scope,$route,$http,data,$sce){
    $scope.organCode = data.saveCode.organCode;
    //默认告知单标签隐藏
    $scope.inform = false;
    $scope.contentGuide = true;
    $scope.contentInform = false;
    //设定当前页面    事项指南为0.事项告知单为1
    $scope.currentPage = 0;
    //设置滚动条速度
    $scope.rollingSpeed = 500;
    //选中和默认的标签样式
    $scope.lightStyle = {
        "background":"url('images/bg_click.png') no-repeat"
    };
    $scope.guideStyle = $scope.lightStyle;
    $scope.guideTitle = data.params.stItemName;
    $scope.guideitemNo = data.params.stItemNo;
    $scope.getGuideDetailsMsg = function(){
        $http.jsonp("http://10.1.8.148:8081/ac-item/item/selfQuery/guide/getGuideAndNotify.do?jsonpCallback=JSON_CALLBACK&itemNo="+$scope.guideitemNo)
            .success(function(dataJsonp){
                $scope.clRange = $sce.trustAsHtml(dataJsonp.guide.clRange);
                $scope.clNameCode = $sce.trustAsHtml(dataJsonp.guide.clNameCode);
                $scope.clDealAccording = $sce.trustAsHtml(dataJsonp.guide.clDealAccording);
                $scope.clDealOrgan = $sce.trustAsHtml(dataJsonp.guide.clDealOrgan);
                $scope.clApprovalConds = $sce.trustAsHtml(dataJsonp.guide.clApprovalConds);
                $scope.clApprovalCount = $sce.trustAsHtml(dataJsonp.guide.clApprovalCount);
                $scope.clApprovalMater = $sce.trustAsHtml(dataJsonp.guide.clApprovalMater);
                $scope.clApprovalLimit = $sce.trustAsHtml(dataJsonp.guide.clApprovalLimit);
                $scope.clApprovalCert = $sce.trustAsHtml(dataJsonp.guide.clApprovalCert);
                $scope.clChargeStd = $sce.trustAsHtml(dataJsonp.guide.clChargeStd);
                $scope.clApplyRightsDuties = $sce.trustAsHtml(dataJsonp.guide.clApplyRightsDuties);
                $scope.clApplyReceive = $sce.trustAsHtml(dataJsonp.guide.clApplyReceive);
                $scope.clConsultWay = $sce.trustAsHtml(dataJsonp.guide.clConsultWay);
                $scope.clComplaintChannel = $sce.trustAsHtml(dataJsonp.guide.clComplaintChannel);
                $scope.clDealType = $sce.trustAsHtml(dataJsonp.guide.clDealType);
                $scope.clDecidedOpen = $sce.trustAsHtml(dataJsonp.guide.clDecidedOpen);
                if(dataJsonp.notify != ""){
                    $scope.inform = true;
                    $scope.informCont = dataJsonp.notify;
                }

            });
    };
    $scope.getGuideDetailsMsg();
    //标签页切换
    $scope.chooseLabel = function(i){
        if(i == 0){
            $scope.contentGuide = true;
            $scope.contentInform = false;
            $scope.guideStyle = $scope.lightStyle;
            $scope.informStyle = "";
            $scope.currentPage = 0;
        }else if(i == 1){
            $scope.contentInform = true;
            $scope.contentGuide = false;
            $scope.guideStyle = "";
            $scope.informStyle = $scope.lightStyle;
            $scope.currentPage = 1;
        }
    };
    //初始化滚动条插件
    angular.element(document).ready(function(){
        $(".content-guide").mCustomScrollbar({
            theme:"rounded-dots",
            scrollInertia:400
        });
    });
    //滚动条上移
    $scope.moveUp = function (){
        if($scope.currentPage == 0){
            $(".content-guide").mCustomScrollbar("scrollTo","+="+$scope.rollingSpeed);
        }
        if($scope.currentPage == 1){
            $(".content-inform").mCustomScrollbar("scrollTo","+="+$scope.rollingSpeed);
        }
    };
    //滚动条下移
    $scope.moveDown = function (){
        if($scope.currentPage == 0){
            $(".content-guide").mCustomScrollbar("scrollTo","-="+$scope.rollingSpeed);
        }
        if($scope.currentPage == 1){
            $(".content-inform").mCustomScrollbar("scrollTo","-="+$scope.rollingSpeed);
        }
    }
});