app.controller("mainController", function($scope,$route, $location,$http,data) {
    //通过刷身份证获取公积金信息
    $scope.readIDcard = function() {
        $.device.idCardOpen(function(value) {
            var list = eval('(' + value + ')');
            $scope.idCardNum = list.Number;
            $scope.idCardName = list.Name;
            $http.jsonp($.getConfigMsg.preUrl+"/aci/autoterminal/forward.do?fmd=aci-providentfund&fdo=getGjjxx&jsonpCallback=JSON_CALLBACK&idCardNum="+$scope.idCardNum+"&idCardName="+$scope.idCardName,{ cache: true })
                .success(function(dataJsonp){
                    data.info = dataJsonp;
                    $location.path("/infoList");
                })
        });
    };
    angular.element(document).ready(function(){
        $scope.readIDcard();
    });

});
app.controller("infoListController",function($scope,$route,$http, $location,data,$timeout){
    //判断是否获取到数据
    $scope.info = data.info;
    if($scope.info ==null || $scope.info == "0"){
        $scope.correntView = false;
        $scope.errorView = true;
    }else{
        $scope.correntView = true;
        $scope.errorView = false;
    }
    //初始化页面
    $scope.baseTable = true;
    $scope.baseDetailTable = false;
    $scope.addDetailTable = false;
    //默认打印首页
    $scope.printTableType = "1";
    //调用数据完成表格
    $scope.userName = $scope.info.name;
    $scope.basicAccount = $scope.info.jbzh;
    $scope.addAccount = $scope.info.bczh;
    $scope.unitAccount = $scope.info.dwzh;
    $scope.unitName = $scope.info.dwmc;
    $scope.idAccount = $scope.info.sfzh;
    //基本账户
    $scope.basicMonthlyPay = $scope.info.jbYje;
    $scope.basicLastMonth = $scope.info.jbMcyje;
    $scope.basicCurrentBalance = $scope.info.jbYe;
    $scope.basicAccumulatedAmount = $scope.info.jbLjjc;
    $scope.basicCumulativeWithdrawal = $scope.info.jbLjzq;
    $scope.basicAccountOpening = $scope.info.jbKhrq;
    $scope.basicCancelDate = $scope.info.jbXhrq;
    $scope.basicAccountStatus = $scope.info.jbZhzt;
    //补充账户
    $scope.addMonthlyPay = $scope.info.bcYje;
    $scope.addLastMonth = $scope.info.bcMcyje;
    $scope.addCurrentBalance = $scope.info.bcYe;
    $scope.addAccumulatedAmount = $scope.info.bcLjjc;
    $scope.addCumulativeWithdrawal = $scope.info.bcLjzq;
    $scope.addAccountOpening = $scope.info.bcKhrq;
    $scope.addCancelDate = $scope.info.bcXhrq;
    $scope.addAccountStatus = $scope.info.bcZhzt;
    // 标签添加选中样式
    $scope.bgChangeOne = {
        "background" : "url(images/optioncurback.png) no-repeat"
    };
    // 数据少于十条隐藏分页
    $scope.moreTenDisplay = "";
    //基本信息查询
    $scope.baseInfoQuery = function(){
        //样式的显示隐藏
        $scope.baseTable = true;
        $scope.baseDetailTable = false;
        $scope.addDetailTable = false;
        $scope.bgChangeOne = {
            "background" : "url(images/optioncurback.png) no-repeat"
        };
        $scope.bgChangeTwo = "";
        $scope.bgChangeThree = "";
        $scope.printTableType = "1";
    };
    //基础公积金明细查询
    $scope.baseDetailQuery = function(){
        //样式的显示隐藏
        $scope.baseTable = false;
        $scope.baseDetailTable = true;
        $scope.addDetailTable = false;
        $scope.bgChangeOne = "";
        $scope.bgChangeTwo = {
            "background" : "url(images/optioncurback.png) no-repeat"
        };
        $scope.bgChangeThree = "";
        $scope.printTableType = "2";
        //动态添加数据
        $scope.currentPage = 1;
        $scope.totalPages = 1;
        $scope.basicAccount = $scope.basicAccount.replace(/(^\s*)|(\s*$)/g, "");

        $scope.detailUrl = $.getConfigMsg.preUrl+"/aci/autoterminal/forward.do?fmd=aci-providentfund&fdo=getZhJbdetail&jsonpCallback=JSON_CALLBACK&curPage="+$scope.currentPage+"&baseAccount="+$scope.basicAccount;
        $http.jsonp($scope.detailUrl,{ cache: true })
            .success(function(dataJsonp){
                $scope.currentData = dataJsonp;
                $scope.totalPages =  dataJsonp[0].stTotalpage;
            });
        $scope.$watch("totalPages",function(){
            if($scope.totalPages == "1"){
                $scope.moreTenDisplay = false;
            }else{
                $scope.moreTenDisplay = true;
                $scope.$watch("currentPage",function(){
                    $http.jsonp($scope.detailUrl)
                        .success(function(dataJsonp){
                            $scope.currentData = dataJsonp;
                        });
                });
            }
        })

    };
    //补充公积金明细查询
    $scope.addDetailQuery = function(){
        //样式的显示隐藏
        $scope.baseTable = false;
        $scope.baseDetailTable = false;
        $scope.addDetailTable = true;
        $scope.bgChangeOne = "";
        $scope.bgChangeTwo = "";
        $scope.bgChangeThree = {
            "background" : "url(images/optioncurback.png) no-repeat"
        };
        $scope.printTableType = "3";
        //动态添加数据
        $scope.currentPage = 1;
        $scope.totalPages = 1;
        $scope.basicAccount = $scope.basicAccount.replace(/(^\s*)|(\s*$)/g, "");
        $scope.detailUrl = $.getConfigMsg.preUrl+"/aci/autoterminal/forward.do?fmd=aci-providentfund&fdo=getZhBcdetail&jsonpCallback=JSON_CALLBACK&curPage="+$scope.currentPage+"&baseAccount="+$scope.basicAccount;
        $http.jsonp($scope.detailUrl,{ cache: true })
            .success(function(dataJsonp){
                $scope.currentData = dataJsonp;
                $scope.totalPages =  dataJsonp[0].stTotalpage;
            });
        $scope.$watch("totalPages",function(){
            if ($scope.totalPages == 1) {
                $scope.moreTenDisplay = false;
            } else {
                $scope.moreTenDisplay = true;
                $scope.$watch("currentPage", function () {
                    $http.jsonp($scope.detailUrl)
                        .success(function (dataJsonp) {
                            $scope.currentData = dataJsonp;
                        });
                });
            }
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
    //调用打印控件打印
    $scope.printTable = function(){
        //判断打印的是哪个表格
        if($scope.printTableType == "1"){
            var options = {
                settings:{
                    paperName:'a4',
                    orientation:1,
                    topMargin:0,
                    leftMargin:0,
                    bottomMargin:0,
                    rightMargin:0
                },
                importedStyle:['css/print.css'],
                pagePrefix: "baseTable"
            };
        }else if($scope.printTableType == "2"){
            var options = {
                settings:{
                    paperName:'a4',
                    orientation:1,
                    topMargin:0,
                    leftMargin:0,
                    bottomMargin:0,
                    rightMargin:0
                },
                importedStyle:['css/print.css'],
                pagePrefix: "baseDetail"
            };
        }
        else if($scope.printTableType == "3"){
            var options = {
                settings:{
                    paperName:'a4',
                    orientation:1,
                    topMargin:0,
                    leftMargin:0,
                    bottomMargin:0,
                    rightMargin:0
                },
                importedStyle:['css/print.css'],
                pagePrefix: "addDetail"
            };
        }
        $.jatools.init();
        $.jatools.print(options);
        $timeout(function(){ $location.path("/pwait");},1000);

    };
    //返回
    $scope.reFresh = function(){
        $location.path("/main");
        data.info = "";
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
    $timeout(function(){window.location.href = "../index.html"},20000);
});