app.controller("mainController", function($scope, $route, $location, $http,$timeout,data) {
    $scope.itemName = "设立艺术品经营单位的备案";
    $scope.stSmallItemName = "设立艺术品经营单位的备案";
    // $scope.togetherCode = "151534617000051";
    // data.togetherCode = $scope.togetherCode;
    $scope.stItemId = "431d31c0-0cb6-408e-84be-938508750d62";
    $scope.getCode = function(){
        $http.jsonp("http://10.1.44.105:8080/oeform/declaration/getStBusinessNo.do?jsonpCallback=JSON_CALLBACK&stItemName="+$scope.itemName)
        .then(function successCallback(response) {
            $scope.togetherCode = response.data;
            console.log(response);
            data.togetherCode = $scope.togetherCode;

        }, function errorCallback(response) {
            // 请求失败执行代码
        });
    };
    $scope.getCode();
    //个人 法人 显示与隐藏切换
    $scope.showPerson = true;
    $scope.showLPerson = false;
    $scope.hover_p = "tab-hover-2";
    $scope.hover_l = "tab-hover-1";
    $scope.change_tab = function(tab){
        if(tab == 0){
            $scope.showPerson = true;
            $scope.showLPerson = false;
            $scope.hover_p = "tab-hover-2";
            $scope.hover_l = "tab-hover-1";
        }
        if(tab == 1){
            $scope.showPerson = false;
            $scope.showLPerson = true;
            $scope.hover_p = "tab-hover-1";
            $scope.hover_l = "tab-hover-2";
        }
    };
    //证件类型数据
    $scope.ID_type_p = [
        {id:1, name: "==证件类型=="},
        {id:2, name: "身份证"},
        {id:3, name: "护照"},
        {id:4, name: "军官证"},
        {id:5, name: "警官证"}
    ];
    $scope.ID_type_l = [
        {id:6, name: "==证件类型=="},
        {id:7, name: "组织机构代码证"},
        {id:8, name: "统一社会信用代码"}
    ];
    //初始化姓名,手机号码，证件号码
    $scope.mobile_p = "";
    $scope.ID_num_p = "";
    $scope.name_p = "";
    //申请人证件类型
    $scope.type_p = "==证件类型==";
    $scope.type_l = "==证件类型==";
    //联系人证件类型
    $scope.type_con_p = "==证件类型==";
    $scope.type_con_l = "==证件类型==";

//    个人申报提交函数
    $scope.submit_p = function(){
        $scope.name_p = "1";
        $scope.type_p = "0";
        $scope.ID_num_p = "1";
        $scope.mobile_p = "1";
        $http.jsonp("http://10.1.44.105:8080/oeform/declaration/saveObfFormInfo.do?jsonpCallback=JSON_CALLBACK&stItemName="+$scope.itemName+"&stSmallItemName="+$scope.stSmallItemName+"&stItemId="+$scope.stItemId+"&applyUserName="+$scope.name_p+"&stIdenTityNo="+$scope.ID_num_p+"&nmIdenTityType="+$scope.type_p+"&contactUserName="+$scope.name_con_p+"&contactIdenTityNo="+$scope.ID_num_con_p+"&contactIdenTityType="+$scope.type_con_p+"&mobile="+$scope.mobile_p+"&fixMobile="+$scope.telephone_p+"&email="+$scope.email_p+"&contentAddress="+$scope.contentAddress+"&fax="+$scope.fax_num_p +"&applyContent="+$scope.applyContent_p+"&companyAddress=&nmTargetType=0&stBusinessNo="+$scope.togetherCode+"&stApplyId=")
            .success(function(dataJsonp){
                console.log(dataJsonp);
                data.list = dataJsonp;
                data.applyName = $scope.name_p;
                $location.path("/upload/"+data.togetherCode);
            });
        // if($scope.name_p){
        //     if($scope.type_p!="==证件类型=="){
        //         if($scope.ID_num_p){
        //             if($scope.checkIdnum($scope.ID_num_p,0)){
        //                 if($scope.mobile_p){
        //                     if($scope.checkPhone($scope.mobile_p)){
        //                         $scope.type_p = "0";
        //                         $scope.type_con_p = "0";
        //                         $http.jsonp("http://10.1.44.105:8080/oeform/declaration/saveObfFormInfo.do?jsonpCallback=JSON_CALLBACK&stItemName="+$scope.itemName+"&stSmallItemName="+$scope.stSmallItemName+"&stItemId="+$scope.stItemId+"&applyUserName="+$scope.name_p+"&stIdenTityNo="+$scope.ID_num_p+"&nmIdenTityType="+$scope.type_p+"&contactUserName="+$scope.name_con_p+"&contactIdenTityNo="+$scope.ID_num_con_p+"&contactIdenTityType="+$scope.type_con_p+"&mobile="+$scope.mobile_p+"&fixMobile="+$scope.telephone_p+"&email="+$scope.email_p+"&contentAddress="+$scope.contentAddress+"&fax="+$scope.fax_num_p +"&applyContent="+$scope.applyContent_p+"&companyAddress=&nmTargetType=0&stBusinessNo="+$scope.togetherCode+"&stApplyId=")
        //                             .success(function(dataJsonp){
        //                                 console.log(dataJsonp);
        //                                 data.list = dataJsonp;
        //                                 data.applyName = $scope.name_p;
        //                                 $location.path("/upload");
        //                             })
        //                             .error(function(){
        //                                 console.log("error");
        //                             });
        //
        //                     }else{
        //                         layer.tips('手机号码格式不正确', '.person .phone', {
        //                             tips: [1, '#3595CC'],
        //                             time: 4000
        //                         });
        //                     }
        //                 }else{
        //                     layer.tips('手机号码不能为空', '.person .phone', {
        //                         tips: [1, '#3595CC'],
        //                         time: 4000
        //                     });
        //                 }
        //             }else{
        //                 layer.tips('证件号格式不正确', '.person .idnum', {
        //                     tips: [1, '#3595CC'],
        //                     time: 4000
        //                 });
        //             }
        //         }else{
        //             layer.tips('证件号码不能为空', '.person .idnum', {
        //                 tips: [1, '#3595CC'],
        //                 time: 4000
        //             });
        //         }
        //     }else{
        //         layer.tips('证件类型不能为空', '.person .nmIdenTityType', {
        //             tips: [1, '#3595CC'],
        //             time: 4000
        //         });
        //     }
        // }else{
        //     layer.tips('姓名不能为空', '.person .applyUserName', {
        //         tips: [1, '#3595CC'],
        //         time: 4000
        //     });
        // }

    };
    //法人申报提交函数
    $scope.submit_l = function(){
        if($scope.name_l){
            if($scope.type_l!="==证件类型=="){
                if($scope.ID_num_l){
                    if($scope.checkIdnum($scope.ID_num_l,0)){
                        if($scope.mobile_l){
                            if($scope.checkPhone($scope.mobile_l)){
                                $http.jsonp("http://10.1.44.105:8080/oeform/declaration/saveObfFormInfo.do?jsonpCallback=JSON_CALLBACK&stItemName="+$scope.itemName+"&stSmallItemName="+$scope.stSmallItemName+"&stItemId="+$scope.stItemId+"&applyUserName="+$scope.name_l+"&stIdenTityNo="+$scope.ID_num_l+"&nmIdenTityType="+$scope.type_l+"&contactUserName="+$scope.name_con_l+"&contactIdenTityNo="+$scope.ID_num_con_l+"&contactIdenTityType="+$scope.type_con_l+"&mobile="+$scope.mobile_l+"&fixMobile="+$scope.telephone_l+"&email="+$scope.email_l+"&contentAddress=&fax="+$scope.fax_num_l+"&applyContent="+$scope.applyContent_l+"&companyAddress="+$scope.companyAddress+"&nmTargetType=1&stBusinessNo="+$scope.togetherCode+"&stApplyId=")
                                    .success(function(dataJsonp){
                                        console.log(dataJsonp);
                                        dataJsonp.list = dataJsonp;
                                        data.applyItemName = $scope.name_l;
                                        $location.path("/upload/"+data.togetherCode);
                                    })
                                    .error(function(){
                                        console.log("error");
                                    });
                            }else{
                                layer.tips('手机号码格式不正确', '.legal-person .phone', {
                                    tips: [1, '#3595CC'],
                                    time: 4000
                                });
                            }
                        }else{
                            layer.tips('手机号码不能为空', '.legal-person .phone', {
                                tips: [1, '#3595CC'],
                                time: 4000
                            });
                        }
                    }else{
                        layer.tips('证件号格式不正确', '.legal-person .idnum', {
                            tips: [1, '#3595CC'],
                            time: 4000
                        });
                    }
                }else{
                    layer.tips('证件号码不能为空', '.legal-person .idnum', {
                        tips: [1, '#3595CC'],
                        time: 4000
                    });
                }
            }else{
                layer.tips('证件类型不能为空', '.legal-person .nmIdenTityType', {
                    tips: [1, '#3595CC'],
                    time: 4000
                });
            }
        }else{
            layer.tips('单位名称不能为空', '.legal-person .applyUserName', {
                tips: [1, '#3595CC'],
                time: 4000
            });
        }

    };
    //手机号码验证函数
    $scope.checkPhone = function(phone){
        if(phone.length!=11)
        {
            return false;
        }
        if(!(/^1[34578]\d{9}$/.test(phone))){
            return false;
        }else{
            return true;
        }
    };
    //证件号码验证函数
    $scope.checkIdnum = function(idnum,idtype){
        $scope.isIDCard1=/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
        if(idtype == "0"){
            if(idnum.length!=15 && idnum.length!= 18)
            {
                return false;
            }
            if(!( $scope.isIDCard1.test(idnum))){
                return false;
            }else{
                return true;
            }
        }

    }

});
app.controller("uploadController", function($scope, $route, $location, $http,$timeout,data) {
    $scope.normalStatus = true;
    $scope.popPhoto = false;
    //上传列表
    $scope.materialList = data.list;
    $scope.listNums = $scope.materialList.length;
    $scope.initNumber = 0;
    //上传文件按钮 隐藏 取消按钮显示 弹出框显示
    $scope.uploadFileShow = function(id){
        $("#"+id+" .cancelBtn").show();
        $("#"+id+"> .popUpload").show();
        $("#"+id+" .uploadBtn").hide();
    };
    //上传文件按钮显示 取消按钮隐藏 弹出框隐藏
    $scope.uploadFileHide = function(id){
        //样式变化
        $("#"+id+" .uploadBtn").show();
        $("#"+id+" .cancelBtn").hide();
        $("#"+id+"> .popUpload").hide();
    };
    //将JSON对象转换成字符串类型
    $scope.changeString = function(jsonData){
        var jsonStr = "{ ";
        for(var i in jsonData){
            jsonStr += "'"+i+"':'"+jsonData[i]+"',";
        }
        jsonStr += " }";
        return jsonStr;
    };
    // 拍照上传文件
    $scope.uploadByPhoto= function(stStuffId){
        data.stStuffId = stStuffId;
        $scope.normalStatus = false;
        $scope.popPhoto = true;
    };
    $.device.cmCaptureShow(430, 275, 385, 330);
    $scope.photo = function(){
        $.device.cmCaptureHide();
        //获取图片地址
        $scope.savedPhoto = $.device.cmCaptureCaptureUrl();
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
    $scope.photoUpload = function(){
        $scope.normalStatus = true;
        $scope.popPhoto = false;
        $scope.jsonData = $scope.changeString({
            "stStuffId":data.stStuffId,
            "stFileName":"1",
            "stBusinessNo":data.togetherCode,
            "nmOrder":"3"
        });
        $scope.jsonData_WT = $scope.changeString({
            "stStuffId":data.stStuffId
        });
        $.device.httpUpload("http://10.1.44.105:8080/oeform/declaration/saveObfAttach1.do","file",$scope.savedPhoto,
            $scope.jsonData,function(result){
                layer.msg("上传成功");
                $scope.initNumber += 1;
                $scope.result = true;
                $scope.changeWay($scope.result,data.stStuffId);
            },function(webexception){
                layer.msg("上传失败");
                $scope.result = false;
                $scope.changeWay($scope.result,data.stStuffId);
            });
        $.device.httpUpload("http://10.1.41.53/spHall/standard/selfmachine/upload.do","file",$scope.savedPhoto,
            $scope.jsonData_WT,function(result){

            },function(webexception){

            });
    }
    //调用U盘上传文件
    $scope.uploadByUpan= function(stStuffId){
        $.device.fileOpen(function(value){
            $scope.jsonData = $scope.changeString({
                "stStuffId":stStuffId,
                "stFileName":"1",
                "stBusinessNo":data.togetherCode,
                "nmOrder":"3"
            });
            $scope.jsonData_WT = $scope.changeString({"stStuffId":stStuffId});
            $.device.httpUpload("http://10.1.44.105:8080/oeform/declaration/saveObfAttach1.do","file",value,
                $scope.jsonData,function(result){
                    layer.msg("上传成功");
                    $scope.initNumber += 1;
                    $scope.result = true;
                    $scope.changeWay($scope.result,stStuffId);
                    $.device.fileClose();
                },function(webexception){
                    layer.msg("上传失败");
                    $scope.result = false;
                    $scope.changeWay($scope.result,stStuffId);
                });
            $.device.httpUpload("http://10.1.41.53/spHall/standard/selfmachine/upload.do","file",value,
                $scope.jsonData_WT,function(result){
                    if(result){

                    }
                },function(webexception){});
        },function(value){
            layer.alert("请插入一个U盘（仅一个），否则无法正常读取文件");
        });
    };
    //按钮切换方法1
    $scope.changeWay = function(result,stStuffId){
        if(result) {
            $("#"+stStuffId+" .alterBtn").show();
            $("#"+stStuffId+" .cancelBtn").hide();
            $("#"+stStuffId+"> .popUpload").hide();
            $("#"+stStuffId+" .uploadBtn").hide();
        }else{
            $("#" + stStuffId + " .alterBtn").hide();
            $("#" + stStuffId + " .cancelBtn").hide();
            $("#" + stStuffId + "> .popUpload").hide();
            $("#" + stStuffId + " .uploadBtn").show();
        }
    }
    //按钮切换方法2
    $scope.changeWay2 = function(result,stStuffId){
        if(result) {
            layer.msg("修改成功");
            $("#"+stStuffId+" .alterBtn").hide();
            $("#"+stStuffId+" .uploadBtn").show();
        }else{
            layer.msg("修改失败");
            $("#"+stStuffId+" .alterBtn").show();
            $("#"+stStuffId+" .uploadBtn").hide();
        }
    }
    //删除文件方法
    $scope.alterFile = function(id){
        $http.jsonp("http://10.1.44.105:8080/oeform/declaration/deleteObfAttachById.do?jsonpCallback=JSON_CALLBACK&stStuffId="+id)
            .success(function(dataJsonp){
                $scope.alterResult = true;
                $scope.initNumber -= 1;
                $scope.changeWay2($scope.alterResult,id);
            })
            .error(function(){
                $scope.alterResult = false;
                $scope.changeWay2($scope.alterResult,id);
            })
    };
    //提交材料方法
    $scope.submitAll = function(){
        $scope.submitResult = false;
        if($scope.initNumber == $scope.listNums){
            $scope.submitResult = true;
        }else{
            layer.alert("必须将文件全部提交。");
        }
        if($scope.submitResult){
            $location.path("/hint");
        }
    }
});
app.controller("photoController",function($scope,$route,$location,$http,$timeout,data){
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
    $scope.photoUpload = function(){
        data.photoType = "1";
        $location.path("/upload/"+data.togetherCode);
    }
});
app.controller("hintController",function($scope,$route,$location,$http,data){
    $scope.togetherCode = data.togetherCode;
    if(data.applyName){
        $scope.applyName = data.applyName;
    };
    if(data.applyItemName){
        $scope.applyName = data.applyItemName;
    };
});