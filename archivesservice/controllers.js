app.controller("mainController", function($scope, $route,$http,$location,data,$timeout){
});
//刷身份证控制器
app.controller("idcardController", function($scope, $route,$http,$location,data,$timeout) {
    //获取身份证信息
    $scope.readIdCard = function() {
        $.device.idCardOpen(function(value) {
            var list = eval('(' + value + ')');
            data.idCardNumber = list.Number;
            data.userName = list.Name;
            if(!!data.idCardNumber){
                $timeout(function(){$location.path("/base")},100);
            }else{
                layer.alert('请重新刷卡', {
                    skin: 'layui-layer-lan'
                    ,closeBtn: 0
                    ,anim: 4 //动画类型
                });
            }
        });
    };
    $scope.readIdCard();
});
//基本控制器
app.controller("baseController", function($scope, $route,$http, $location,data,$timeout) {
    $scope.configUrl = $.getConfigMsg.preUrl;
    //获取全部证照数据
    $scope.getPersonalData = function(){
        $http.jsonp($scope.configUrl + "/aci/autoterminal/forward.do?fmd=aci-archives&fdo=getLicenseStuffList&jsonpCallback=JSON_CALLBACK&stName="+data.userName+"&stIdNo="+data.idCardNumber+"&type=0")
            .success(function(dataJsonp) {
                if(dataJsonp === undefined){
                    dataJsonp == "0";
                }
                $scope.personalData = $scope.filterWay(dataJsonp);
                if(!$scope.personalData){
                    $scope.personalData = [];
                }
                $scope.personalData.sort(function(a,b){return a.stShareCode> b.stShareCode?-1: a.stShareCode< b.stShareCode?1:0});
                $scope.btnPrint = !$scope.personalData.length ? false : true ;
                if($scope.btnPrint){$(".btn-upload-base").css("left","0px")}
                data.personalDataLen = $scope.personalData.length;
            });
    };
    $scope.getPersonalData();
    //获取身份证照 （过滤其余材料方法）
    $scope.filterWay = function(array){
        for(var i=0,flag=true,len=array.length;i<len; flag ? i++ : 0){
            if(!array[i].stShareCode){
                array.splice(i,1);
                len--;
                flag = false;
            }else{
                flag = true;
            }
        }
        return array;
    };
    //隐藏删除按钮
    $scope.btnDeleted = false;
    //选中证照,样式操作
    $scope.checkedIt = function(imgId){
        //选中出现红色边框的样式
        $(".baseImgBox img").css("border","3px solid #fff");
        $("#"+imgId+" > img").css("border","3px solid #e4393c");
        //选中出现 删除按钮
        $scope.btnDeleted = true;
        data.imgId = imgId;
    };
    //删除证照
    $scope.deletedPhoto = function(){
        layer.open({
            content: '您确定要删除此材料吗？'
            ,btn: ['删除', '不要']
            ,yes: function(index){
                $http.jsonp($.getConfigMsg.preUrl + "/aci/autoterminal/forward.do?fmd=aci-archives&fdo=delWorkLicenseStuffById&jsonpCallback=JSON_CALLBACK&stPersonalDocument="+data.imgId)
                    .success(function(dataJsonp) {
                        if(dataJsonp == 1){
                            layer.msg("删除成功",{time:300});
                            $("#"+data.imgId).hide();
                            data.personalDataLen-=1;
                        }else{
                            layer.msg("删除失败",{time:300});
                            $("#"+data.imgId).show();
                        }
                    });
                $scope.btnDeleted = false;
                $route.reload();
                layer.close(index);
            }
            ,no: function(index){
                layer.close(index);
            }
        });
    };
    //上传证照
    $scope.uploadNewPhoto = function(){
        //判断是否已有证照
        if(!data.personalDataLen){
            data.uploadType = 0;
            $timeout(function(){$location.path("/tphoto")},1);
        }else{
            layer.msg("请删除原有证照",{time:300});
            $scope.getPersonalData();
        }
    }
    //打印证照
    $scope.printBasePhoto = function(){
        var options = {
            settings:{
                paperName:'a4',
                orientation:1,
                topMargin:0,
                leftMargin:0,
                bottomMargin:0,
                rightMargin:0
            },
            importedStyle:['css/print.css']
        };
        $.jatools.init();
        $.jatools.print(options);
        $timeout(function(){ $location.path("/pwait")},200);
    }
});
//扩展控制器
app.controller("extController",function($scope, $route,$http, $location,data,$timeout){
    $scope.configUrl = $.getConfigMsg.preUrl;
    $scope.curPage = 1;
    $scope.sliceData = [];
    //隐藏删除按钮
    $scope.btnDeleted = false;
    //下一页
    $scope.nextPage = function(){
        if($scope.curPage<$scope.totPages){
            $scope.curPage++;
        };
    };
    //上一页
    $scope.prevPage = function(){
        if($scope.curPage>1){
            $scope.curPage--;
        }
    };
    //获取个人全部数据
    $scope.getPersonalData = function(){
        $http.jsonp($.getConfigMsg.preUrl + "/aci/autoterminal/forward.do?fmd=aci-archives&fdo=getLicenseStuffList&jsonpCallback=JSON_CALLBACK&stName="+data.userName+"&stIdNo="+data.idCardNumber+"&type=0")
            .success(function(dataJsonp) {
                if(dataJsonp === undefined){
                    dataJsonp == "0";
                }
                $scope.personalData = $scope.filterWay(dataJsonp);
                $scope.sliceData = [];
                $scope.curPage = 1;
                $scope.totPages =  Math.ceil($scope.personalData.length/2);
                if($scope.totPages == "1"){
                    $scope.curData = $scope.personalData;
                    $scope.pagingDisplay = false;
                }else if($scope.totPages>1){
                    $scope.pagingDisplay = true;
                    for(var i=0;i<$scope.totPages;i++){
                        $scope.sliceData[i] =  $scope.personalData.slice(i*2,i*2+2);
                    }
                    $scope.$watch("curPage",function(){
                        $scope.curData = $scope.sliceData[$scope.curPage-1];
                    });
                }
            })
    };
    $scope.getPersonalData();
    //获取材料 （过滤身份证照方法）
    $scope.filterWay = function(array){
        for(var i=0,flag=true,len=array.length;i<len; flag ? i++ : 0){
            if(array[i].stShareCode){
                array.splice(i,1);
                len--;
                flag = false;
            }else{
                flag = true;
            }
        }
        return array;
    };
    //选中某份材料并获取其ID
    $scope.checkedIt = function(imgId){
        //选中出现红色边框的样式
        $(".extImgBox img").css("border","3px solid #fff");
        $("#"+imgId+"").css("border","3px solid #e4393c");
        //选中出现 删除按钮
        $scope.btnDeleted = true;
        data.materialId = imgId;
        $(".btn-upload-ext").css("left","0px");
    };
    //删除材料
    $scope.deletedPhoto = function(){
        layer.open({
            content: '您确定要删除此材料吗？'
            ,btn: ['删除', '不要']
            ,yes: function(index){
                $http.jsonp($.getConfigMsg.preUrl + "/aci/autoterminal/forward.do?fmd=aci-archives&fdo=delWorkLicenseStuffById&jsonpCallback=JSON_CALLBACK&stPersonalDocument="+data.materialId)
                    .success(function(dataJsonp) {
                        if(dataJsonp == 1){
                            layer.msg("删除成功",{time:300});
                            $("#"+data.materialId).hide();
                            data.personalDataLen-=1;
                        }else{
                            layer.msg("删除失败",{time:300});
                            $("#"+data.materialId).show();
                        }
                    });
                $scope.btnDeleted = false;
                $route.reload();
                layer.close(index);
            }
            ,no: function(index){
                layer.close(index);
            }
        });
    };
    //上传材料
    $scope.uploadNewPhoto = function(){
        data.uploadType = 1;
        $timeout(function(){$location.path("/tphoto")},1);
    };
    //打印材料
    $scope.printBasePhoto = function(){
        var options = {
            settings:{
                paperName:'a4',
                orientation:2,
                topMargin:0,
                leftMargin:0,
                bottomMargin:0,
                rightMargin:0
            },
            pagePrefix: data.materialId,
            importedStyle:['css/print.css']
        };
        $.jatools.init();
        $.jatools.print(options);
        $timeout(function(){ $location.path("/pwait")},200);
    }
});
//拍照控制器
app.controller("tphotoController",function($scope,$route,$http,$location,data,$timeout){
    $scope.sfzorcl = "";
    //显示高拍仪
    angular.element(document).ready(function(){
        $.device.cmCaptureShow(430, 275, 385, 330);
    });
    $scope.reloadRoute = function(){
        $route.reload();
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
    //拍身份证情况
    if(data.uploadType == 0){
        $.device.cmCaptureSelectRect(60, 640, 730, 460);
        $scope.sfzorcl = "card";
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
        $scope.materialSide = false;
        $scope.defaultDisplay = true;
        $scope.defaultHidden = false;
        $scope.saveStatusFront = false;
        $scope.saveStatusReverse = false;
        $scope.savedFront = function(){
            $scope.hint = "请预览下方照片，您是否确认上传";
            $scope.defaultDisplay = false;
            $scope.defaultHidden = true;
            if(!$scope.saveStatusFront){
                $scope.photoFront();
                $scope.saveStatusFront = true;
            };
            $scope.prev = function(){
                $scope.reloadRoute();
            };
            $scope.next = function(){
                var index = layer.load(1,{
                    shade: [0.7,'black'] //0.7透明度的黑色背景
                });
                var jsonData ={
                    type:"0",
                    stLicenseName:"身份证正面",
                    stShareCode:"BASE_IDCARD_P",
                    stName:data.userName,
                    stIdNo:data.idCardNumber
                };
                jsonData = $scope.changeString(jsonData);
                $.device.httpUpload($.getConfigMsg.preUrl + "/aci/autoterminal/archives/saveLicenseStuff.do","FileData",data.frontImgUrl,
                    jsonData,function(result){
                        var index2 = layer.msg('上传成功');
                        layer.close(index);
                        $timeout(function(){
                            layer.close(index2);
                            $.device.cmCaptureShow(430, 275, 385, 370);
                            $scope.hint = "请将身份证反面对准屏幕下方高拍仪";
                            $scope.defaultDisplay = true;
                            $scope.defaultHidden = false;
                            $scope.reverseSide = true;
                            $scope.frontSide = false;
                        },1)
                    },function(webexception){
                        layer.msg("上传失败");
                    })
            };
        };
        $scope.savedReverse = function(){
            $scope.hint = "请预览下方照片，您是否确认上传";
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
                var index = layer.load(1,{
                    shade: [0.7,'black'] //0.7透明度的黑色背景
                });
                var jsonData ={
                    type:"0",
                    stLicenseName:"身份证反面",
                    stShareCode:"BASE_IDCARD_N",
                    stName:data.userName,
                    stIdNo:data.idCardNumber
                };
                jsonData = $scope.changeString(jsonData);
                $.device.httpUpload($.getConfigMsg.preUrl + "/aci/autoterminal/archives/saveLicenseStuff.do","FileData",data.reverseImgUrl,
                    jsonData,function(result){
                        var index2 = layer.msg('上传成功');
                        layer.close(index);
                        $timeout(function(){
                            layer.close(index2);
                            $location.path("/base")
                        },1);
                    })

            };
        }
    }
    //拍扩展材料情况
    if(data.uploadType == 1){
        $.device.cmCaptureSelectRect(30,60, 2517, 1780);
        $scope.sfzorcl = "cl";
        $scope.frontSide = false;
        $scope.reverseSide = false;
        $scope.materialSide = true;
        $scope.hint = "请将您的材料对准屏幕下方高拍仪";
        $scope.defaultDisplay = true;
        $scope.defaultHidden = false;
        $scope.savePhoto = false;
        $scope.photoMaterial = function(){
            $.device.cmCaptureHide();
            //获取图片地址
            $scope.savedPhoto = $.device.cmCaptureCaptureUrl();
            data.materialImg = $scope.savedPhoto;
        };
        $scope.saveMaterial = function(){
            $scope.hint = "请预览下方照片，您是否确认上传";
            $scope.defaultDisplay = false;
            $scope.defaultHidden = true;
            if(!$scope.savePhoto){
                $scope.photoMaterial();
                $scope.savePhoto = true;
            }
            $scope.prev = function(){
                    $scope.reloadRoute();
            };
            $scope.next = function(){
                layer.prompt({title: '填写材料名称', formType: 0}, function(licenceName, index){
                    layer.close(index);
                    var materialData ={
                        type:"0",
                        stLicenseName:licenceName,
                        stName:data.userName,
                        stIdNo:data.idCardNumber
                    };
                    materialData = $scope.changeString(materialData);
                    $.device.httpUpload($.getConfigMsg.preUrl + "/aci/autoterminal/archives/saveLicenseStuff.do","FileData",data.materialImg,
                        materialData,function(result){
                            layer.msg('上传成功：'+licenceName,{time:500});
                            $timeout(function(){$location.path("/ext")},1)
                        },function(){
                            layer.msg("上传失败",{time:500});
                        }
                    );
                });

            };

        };
    }
    //拍证照库
    if(data.uploadType == 2){
        $.device.cmCaptureSelectRect(30,60, 2517, 1780);
        $scope.sfzorcl = "cl";
        $scope.frontSide = false;
        $scope.reverseSide = false;
        $scope.materialSide = true;
        $scope.hint = "请将您的材料对准屏幕下方高拍仪";
        $scope.defaultDisplay = true;
        $scope.defaultHidden = false;
        $scope.savePhoto = false;
        $scope.photoMaterial = function(){
            $.device.cmCaptureHide();
            //获取图片地址
            $scope.savedPhoto = $.device.cmCaptureCaptureUrl();
            data.licenseImg = $scope.savedPhoto;
        };
        $scope.saveMaterial = function(){
            $scope.hint = "请预览下方照片，您是否确认上传";
            $scope.defaultDisplay = false;
            $scope.defaultHidden = true;
            if(!$scope.savePhoto){
                $scope.photoMaterial();
                $scope.savePhoto = true;
            }
            $scope.prev = function(){
                $scope.reloadRoute();
            };
            $scope.next = function(){
                layer.prompt({title: '填写材料名称', formType: 0}, function(licenceName, index){
                    layer.close(index);
                    var materialData ={
                        type:"1",
                        stLicenseName:licenceName,
                        stName:data.companyName,
                        stIdNo:data.keyword,
                        stIdnoCode:0
                    };
                    materialData = $scope.changeString(materialData);
                    $.device.httpUpload($.getConfigMsg.preUrl + "/aci/autoterminal/archives/saveLicenseStuff.do","FileData",data.licenseImg,
                        materialData,function(result){
                            layer.msg('上传成功：'+licenceName,{time:500});
                            $timeout(function(){$location.path("/space")},1)
                        },function(){
                            layer.msg("上传失败",{time:500});
                        }
                    );
                });

            };

        };
    }

});
//打印控制器
app.controller("pwaitController",function($scope,$route,data,$timeout){
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
//法人
app.controller("keyController", function($scope, $route,$http,$location,$timeout,data) {
    var type=1;
    var companyName = "";
    var stIdNo="1111111";
    $scope.validate = function(){
      if($("#passWord").val()){
          /* Change the path and password below */
          strpripath="com1";
          strcertpath="com1";
          strcertchainpath="com1";

          // 密码
          strpassword=$("#passWord").val();
          // 请输入证书验证参数
          ConfigurationNum=parseInt("1");
          // 请输入USB设备参数
          DevNumber=parseInt("10");
          //初始化函数
          SafeEngineCtl.SEH_InitialSession(DevNumber,strpripath, strpassword, 0, DevNumber,strpripath, "");
          if(SafeEngineCtl.ErrorCode!=0)
          {
              layer.alert('验证不通过，请重新输入验证密码或者插入key', {
                  skin: 'layui-layer-lan'
                  ,closeBtn: 0
                  ,anim: 4 //动画类型
              });
              return;
          }

          //配置参数
          SafeEngineCtl.SEH_SetConfiguration(ConfigurationNum);
          if(SafeEngineCtl.ErrorCode!=0)
          {
              layer.alert('验证不通过，请重新输入验证密码或者插入key', {
                  skin: 'layui-layer-lan'
                  ,closeBtn: 0
                  ,anim: 4 //动画类型
              });
              SafeEngineCtl.SEH_ClearSession();
              return;
          }

          //获取证书内容
          strCert = SafeEngineCtl.SEH_GetSelfCertificate(DevNumber, strcertpath, "");
          if(SafeEngineCtl.ErrorCode!=0)
          {
              layer.alert('验证不通过，请重新输入验证密码或者插入key', {
                  skin: 'layui-layer-lan'
                  ,closeBtn: 0
                  ,anim: 4 //动画类型
              });
              return;
          }
          //获取证书细目	14
          companyName= SafeEngineCtl.SEH_GetCertDetail(strCert, 14);
          keyword = SafeEngineCtl.SEH_GetCertInfoByOID(strCert,"1.2.156.10260.4.1.4");
          data.companyName = companyName;
          data.keyword = keyword;
          if(SafeEngineCtl.ErrorCode!=0)
          {
              layer.alert('验证不通过，请重新输入验证密码或者插入key', {
                  skin: 'layui-layer-lan'
                  ,closeBtn: 0
                  ,anim: 4 //动画类型
              });
              SafeEngineCtl.SEH_ClearSession();
              return;
          }
          SafeEngineCtl.SEH_ClearSession();
          if(companyName){
              $location.path("/space");
          }else{
              layer.alert('没有获取密钥', {
                  skin: 'layui-layer-lan'
                  ,closeBtn: 0
                  ,anim: 4 //动画类型
              });
          }
          function GetErrCode(errcode)
          {
              var result = '';
              switch (errcode)
              {
                  case -2113667072 :
                      result = "装载动态库错误(-2113667072)";
                      break;
                  case -2113667071 :
                      result = "内存分配错误(-2113667071)";
                      break;
                  case -2113667070 :
                      result = "读私钥设备错误(-2113667070)";
                      break;
                  case -2113667069 :
                      result = "私钥密码错误(-2113667069)";
                      break;
                  case -2113667068 :
                      result = "读证书链设备错误(-2113667068)";
                      break;
                  case -2113667067 :
                      result = "证书链密码错误(-2113667067)";
                      break;
                  case -2113667066 :
                      result = "读证书设备错误(-2113667066)";
                      break;
                  case -2113667065 :
                      result = "证书密码错误(-2113667065)";
                      break;
                  case -2113667064 :
                      result = "私钥超时(-2113667064)";
                      break;
                  case -2113667063 :
                      result = "缓冲区太小(-2113667063)";
                      break;
                  case -2113667062 :
                      result = "初始化环境错误(-2113667062)";
                      break;
                  case -2113667061 :
                      result = "清除环境错误(-2113667061)";
                      break;
                  case -2113667060 :
                      result = "数字签名错误(-2113667060)";
                      break;
                  case -2113667059 :
                      result = "验证签名错误(-2113667059)";
                      break;
                  case -2113667058 :
                      result = "摘要错误(-2113667058)";
                      break;
                  case -2113667057 :
                      result = "证书格式错误(-2113667057)";
                      break;
                  case -2113667056 :
                      result = "数字信封错误(-2113667056)";
                      break;
                  case -2113667055 :
                      result = "从LDAP获取证书错误(-2113667055)";
                      break;
                  case -2113667054 :
                      result = "证书已过期(-2113667054)";
                      break;
                  case -2113667053 :
                      result = "获取证书链错误(-2113667053)";
                      break;
                  case -2113667052 :
                      result = "证书链格式错误(-2113667052)";
                      break;
                  case -2113667051 :
                      result = "验证证书链错误(-2113667051)";
                      break;
                  case -2113667050 :
                      result = "证书已废除(-2113667050)";
                      break;
                  case -2113667049 :
                      result = "CRL格式错误(-2113667049)";
                      break;
                  case -2113667048 :
                      result = "连接OCSP服务器错误(-2113667048)";
                      break;
                  case -2113667047 :
                      result = "OCSP请求编码错误(-2113667047)";
                      break;
                  case -2113667046 :
                      result = "OCSP回包错误(-2113667046)";
                      break;
                  case -2113667045 :
                      result = "OCSP回包格式错误(-2113667045)";
                      break;
                  case -2113667044 :
                      result = "OCSP回包过期(-2113667044)";
                      break;
                  case -2113667043 :
                      result = "OCSP回包验证签名错误(-2113667043)";
                      break;
                  case -2113667042 :
                      result = "证书状态未知(-2113667042)";
                      break;
                  case -2113667041 :
                      result = "对称加解密错误(-2113667041)";
                      break;
                  case -2113667040 :
                      result = "获取证书信息错误(-2113667040)";
                      break;
                  case -2113667039 :
                      result = "获取证书细目错误(-2113667039)";
                      break;
                  case -2113667038 :
                      result = "获取证书唯一标识错误(-2113667038)";
                      break;
                  case -2113667037 :
                      result = "获取证书扩展项错误(-2113667037)";
                      break;
                  case -2113667036 :
                      result = "PEM编码错误(-2113667036)";
                      break;
                  case -2113667035 :
                      result = "PEM解码错误(-2113667035)";
                      break;
                  case -2113667034 :
                      result = "产生随机数错误(-2113667034)";
                      break;
                  case -2113667033 :
                      result = "PKCS12参数错误(-2113667033)";
                      break;
                  case -2113667032 :
                      result = "私钥格式错误(-2113667032)";
                      break;
                  case -2113667031 :
                      result = "公私钥不匹配(-2113667031)";
                      break;
                  case -2113667030 :
                      result = "PKCS12编码错误(-2113667030)";
                      break;
                  case -2113667029 :
                      result = "PKCS12格式错误(-2113667029)";
                      break;
                  case -2113667028 :
                      result = "PKCS12解码错误(-2113667028)";
                      break;
                  case -2113667027 :
                      result = "非对称加解密错误(-2113667027)";
                      break;
                  case -2113667026 :
                      result = "OID格式错误(-2113667026)";
                      break;
                  case -2113667025 :
                      result = "LDAP地址格式错误(-2113667025)";
                      break;
                  case -2113667024 :
                      result = "LDAP地址错误(-2113667024)";
                      break;
                  case -2113667023 :
                      result = "连接LDAP服务器错误(-2113667023)";
                      break;
                  case -2113667022 :
                      result = "LDAP绑定错误(-2113667022)";
                      break;
                  case -2113667021 :
                      result = "没有OID对应的扩展项(-2113667021)";
                      break;
                  case -2113667020 :
                      result = "获取证书级别错误(-2113667020)";
                      break;
                  case -2113667019 :
                      result = "读取配置文件错误(-2113667019)";
                      break;
                  case -2113667018 :
                      result = "私钥未载入(-2113667018)";
                      break;
                  // 以下错误用于登录
                  case -2113666824 :
                      result = "无效的登录凭证(-2113666824)";
                      break;
                  case -2113666823 :
                      result = "参数错误(-2113666823)";
                      break;
                  case -2113666822 :
                      result = "不是服务器证书(-2113666822)";
                      break;
                  case -2113666821 :
                      result = "登录错误(-2113666821)";
                      break;
                  case -2113666820 :
                      result = "证书验证方式错误(-2113666820)";
                      break;
                  case -2113666819 :
                      result = "随机数验证错误(-2113666819)";
                      break;
                  case -2113666818 :
                      result = "与单点登录客户端代理通信(-2113666818)";
                      break;
              }
              return result;
          }
      }else{
          layer.alert('请输入私钥密码', {
              skin: 'layui-layer-lan'
              ,closeBtn: 0
              ,anim: 4 //动画类型
          });
      }
  }

});
app.controller("spaceController", function($rootScope,$scope, $route,$http,$location,$timeout,data) {
    $scope.companyName = data.companyName;
    $scope.keyword = data.keyword;
    $(".form_title").css({
        "background":"url('images/qyun.png') no-repeat",
        "left":"594px"
    });
    //默认第一个标签被选中
    $scope.selected = 1;
    $scope.selectedList = 1;
    $scope.currentPage = 1;
    $scope.listParam = 1;
    $scope.totalPages = '';
    $scope.configUrl = $.getConfigMsg.preUrl;
    $scope.conimgUrl = "http://31.1.114.24/fryzt/";
    $scope.tabsItem = [
        {
            name:"登记信息",
            id:1
        },
        {
            name:"资质信息",
            id:2
        },
        {
            name:"处罚信息",
            id:3
        },
        {
            name:"信用信息",
            id:4
        },
        {
            name:"审批信息",
            id:6
        },
        {
            name:"证照库",
            id:8
        }];
    $scope.changeTabs = function(index){
        $scope.selected = index;
        $scope.selectedList = index;
        $scope.currentPage = 1;
        switch($scope.selectedList){
            case 1:
                $scope.getFirstListMsg();
                break;
            case 2:
                $scope.getSecondListMsg();
                break;
            case 3:
                $scope.getThirdListMsg();
                break;
            case 4:
                $scope.getFourthListMsg();
                break;
            case 6:
                $scope.getSixthListMsg();
                break;
            case 8:
                $scope.getEightListMsg();
                break;
        }
    };
    $scope.getFirstListMsg = function(){
        $scope.listParam = 1;
        $http.jsonp($scope.conimgUrl + "/aci/fryzt/getCorpInfoToXingzheng.do?&jsonpCallback=JSON_CALLBACK&keyWord="+ data.keyword)
            .success(function(dataJsonp) {
                if(dataJsonp.errorMsg){
                    dataJsonp = "";
                };
                $scope.fInfos = dataJsonp;
                $scope.firstInfos = [
                    {   "key":"法人名称","val":$scope.fInfos.corp_name},
                    {   "key":"组织机构代码","val":$scope.fInfos.organ_code},
                    {    "key":"法人类型","val":$scope.fInfos.corp_type},
                    {   "key":"法定代表人","val":$scope.fInfos.person_name},
                    {   "key":"经营场所","val":$scope.fInfos.address},
                    {   "key":"法人状态","val":$scope.fInfos.corp_status},
                    {    "key":"邮编","val":$scope.fInfos.zip},
                    {   "key":"联系电话","val":$scope.fInfos.telephone},
                    {   "key":"统一社会信用代码","val":$scope.fInfos.uni_sc_id},
                    {   "key":"成立日期","val":$scope.fInfos.establish_date},
                    {    "key":"币种","val":$scope.fInfos.currency},
                    {   "key":"开办资金(万)","val":$scope.fInfos.reg_capital},
                    {   "key":"业务范围","val":$scope.fInfos.business_scope},
                    {   "key":"行业类别","val":$scope.fInfos.industry_code},
                    {    "key":"业务主管单位	","val":$scope.fInfos.organizers},
                    {   "key":"经费来源","val":$scope.fInfos.funding_src},
                    {   "key":"营业执照注册号","val":$scope.fInfos.reg_no},
                    {    "key":"法人注销原因","val":$scope.fInfos.repeal_reason},
                    {   "key":"法人变更登记事项","val":$scope.fInfos.change_item},
                    {   "key":"法人注销日期","val":$scope.fInfos.repeal_date},
                    {   "key":"法人变更日期","val":$scope.fInfos.change_date},
                    {   "key":"分支机构数（社会组织）","val":$scope.fInfos.branch_num},
                    {    "key":"代表机构数（社会组织）","val":$scope.fInfos.represent_num},
                    {   "key":"登记类业务发布时间","val":$scope.fInfos.reg_upd_date},
                    {   "key":"纳税人识别号","val":$scope.fInfos.taxpayers_code},
                    {   "key":"组合位置编码","val":$scope.fInfos.tax_code},
                    {   "key":"税务登记日期","val":$scope.fInfos.tax_reg_date},
                    {    "key":"税务变更内容","val":$scope.fInfos.tax_chge_content},
                    {   "key":"税务变更日期","val":$scope.fInfos.tax_chge_date},
                    {   "key":"税务注销日期","val":$scope.fInfos.tax_repeal_date},
                    {   "key":"实际经营地址","val":$scope.fInfos.business_address},
                    {    "key":"税务注销机关","val":$scope.fInfos.tax_repeal_organ},
                    {   "key":"是否工商联","val":$scope.fInfos.tax_repeal_organ},
                    {   "key":"税务类业务发布时间","val":$scope.fInfos.tax_upd_date},
                    {   "key":"组织机构代码赋码日期","val":$scope.fInfos.organcode_date},
                    {   "key":"组织机构代码变更日期","val":$scope.fInfos.orgcode_chgdate},
                    {    "key":"组织机构代码注销日期","val":$scope.fInfos.orgcode_repealdate},
                    {   "key":"质监类业务发布时间","val":$scope.fInfos.qs_upd_date},
                ];
                $scope.totalPages = Math.ceil($scope.firstInfos.length/10);
                //分割数组
                $scope.sliceArr=function(arr,n){
                    for(var i=0;i<$scope.totalPages;i++){
                        $scope.firstInfos[i]=arr.slice(i*n,i*n+n);
                    }
                    return  $scope.firstInfos;
                };
                $scope.sliceArr($scope.firstInfos,10);
                $scope.firstInfo = $scope.firstInfos[0];
            });
    };
    $scope.getFirstListMsg();
    $scope.getSecondListMsg = function(){
        $scope.listParam = 2;
        $scope.totalPages = 0;
        $http.jsonp($scope.conimgUrl + "/aci/fryzt/getCorpLicenseToXingzheng.do?&jsonpCallback=JSON_CALLBACK&keyWord="+ data.keyword)
            .success(function(dataJsonp){
                if(dataJsonp.errorMsg){
                    dataJsonp = "";
                };
                $scope.secondInfos = dataJsonp.data;
                $scope.totalPages = Math.ceil($scope.secondInfos.length/10);
                //分割数组
                $scope.sliceArr=function(arr,n){
                    for(var i=0;i<$scope.totalPages;i++){
                        $scope.secondInfos[i]=arr.slice(i*n,i*n+n);
                    }
                    return  $scope.secondInfos;
                };
                $scope.sliceArr($scope.secondInfos,10);
                $scope.secondInfo = $scope.secondInfos[0];
            })

    };
    $scope.getThirdListMsg = function(){
        $scope.listParam = 3;
        $scope.totalPages = 0;
        $http.jsonp($scope.conimgUrl + "/aci/fryzt/getCorpCfToXingzheng.do?&jsonpCallback=JSON_CALLBACK&keyWord="+ data.keyword)
            .success(function(dataJsonp){
                if(dataJsonp.errorMsg){
                    dataJsonp = "";
                };
                $scope.thirdInfos = dataJsonp.data;
                $scope.totalPages = Math.ceil($scope.thirdInfos.length/10);
                //分割数组
                $scope.sliceArr=function(arr,n){
                    for(var i=0;i<$scope.totalPages;i++){
                        $scope.thirdInfos[i]=arr.slice(i*n,i*n+n);
                    }
                    return  $scope.thirdInfos;
                };
                $scope.sliceArr($scope.thirdInfos,10);
                $scope.thirdInfo = $scope.thirdInfos[0];
            });

    };
    $scope.getFourthListMsg = function(){
        $scope.listParam = 4;
        $scope.totalPages = 0;
        $http.jsonp($scope.conimgUrl + "/aci/fryzt/getXyxxToXingzheng.do?&jsonpCallback=JSON_CALLBACK&keyWord="+ data.keyword)
            .success(function(dataJsonp){
                if(dataJsonp.errorMsg){
                    dataJsonp = "";
                }
                $scope.fourthInfos = dataJsonp.data;
                $scope.totalPages = Math.ceil($scope.fourthInfos.length/10);
                //分割数组
                $scope.sliceArr=function(arr,n){
                    for(var i=0;i<$scope.totalPages;i++){
                        $scope.fourthInfos[i]=arr.slice(i*n,i*n+n);
                    }
                    return  $scope.fourthInfos;
                };
                $scope.sliceArr($scope.fourthInfos,10);
                $scope.fourthInfo = $scope.fourthInfos[0];
            });
    };
    $scope.getSixthListMsg = function(){
        $scope.listParam = 6;
        $scope.totalPages = 0;
        $http.jsonp($scope.conimgUrl + "/aci/fryzt/getWangtingToXingzheng.do?&jsonpCallback=JSON_CALLBACK&keyWord="+ data.keyword)
            .success(function(dataJsonp){
                if(dataJsonp.errorMsg){
                    dataJsonp = "";
                }
                $scope.sixthInfos = dataJsonp.data;
                $scope.totalPages = Math.ceil($scope.sixthInfos.length/10);
                //分割数组
                $scope.sliceArr=function(arr,n){
                    for(var i=0;i<$scope.totalPages;i++){
                        $scope.sixthInfos[i]=arr.slice(i*n,i*n+n);
                    }
                    return  $scope.sixthInfos;
                };
                $scope.sliceArr($scope.sixthInfos,10);
                $scope.sixthInfo = $scope.sixthInfos[0];
            });
    };
    $scope.getEightListMsg = function(){
        $scope.listParam = 8;
        $scope.btnDeleted = false;
        $http.jsonp($.getConfigMsg.preUrl + "/aci/autoterminal/forward.do?fmd=aci-archives&fdo=getLicenseStuffList&jsonpCallback=JSON_CALLBACK&stName="+$scope.companyName+"&stIdNo="+$scope.keyword+"&type=1")
            .success(function(dataJsonp) {
                if(dataJsonp === undefined){
                    dataJsonp == "0";
                }
                $scope.frLicenceData = dataJsonp;
                $scope.totalPages =  Math.ceil($scope.frLicenceData.length);
                //分割数组
                $scope.sliceArr=function(arr,n){
                    for(var i=0;i<$scope.totalPages;i++){
                        $scope.frLicenceData[i]=arr.slice(i*n,i*n+n);
                    }
                    return  $scope.frLicenceData;
                };
                $scope.sliceArr($scope.frLicenceData,1);
                $scope.frLicData = $scope.frLicenceData[0];
            });
        //上传证照
        $scope.uploadNewPhoto = function(){
            data.uploadType = 2;
            $timeout(function(){$location.path("/tphoto")},1);
        };
        //选中某份材料并获取其ID
        $scope.checkedIt = function(imgId){
            //选中出现红色边框的样式
            $(".licenseBox img").css("border","3px solid #fff");
            $("#"+imgId+"").css("border","3px solid #e4393c");
            //选中出现 删除按钮
            $scope.btnDeleted = true;
            data.licenseId = imgId;
            $(".btn-upload-ext").css("left","0px");
        };
        //删除材料
        $scope.deletedPhoto = function(){
            layer.open({
                content: '您确定要删除此材料吗？'
                ,btn: ['删除', '不要']
                ,yes: function(index){
                    $http.jsonp($.getConfigMsg.preUrl + "/aci/autoterminal/forward.do?fmd=aci-archives&fdo=delWorkLicenseStuffById&jsonpCallback=JSON_CALLBACK&stPersonalDocument="+data.licenseId)
                        .success(function(dataJsonp) {
                            layer.close(index);
                            if(dataJsonp == 1){
                                layer.msg("删除成功",{time:1000});
                                $("#"+data.licenseId).hide();
                            }else{
                                alert(dataJsonp);
                                layer.msg("删除失败",{time:1000});
                                $("#"+data.licenseId).show();
                            }
                        }).error(function(){
                        });
                    $scope.btnDeleted = false;
                    $route.reload();
                    layer.close(index);
                }
            });

        };
    };
    $scope.printPhoto = function(){
        var options = {
            settings:{
                paperName:'a4',
                orientation:1,
                topMargin:0,
                leftMargin:0,
                bottomMargin:0,
                rightMargin:0
            },
            pagePrefix: data.licenseId,
            importedStyle:['css/print.css']
        };
        $.jatools.init();
        $.jatools.printPreview(options);
        $timeout(function(){ $location.path("/pwait")},200);
    };
    $scope.prevPage = function(){
        if($scope.currentPage>1){
            $scope.currentPage--;
        }
    };
    $scope.nextPage = function(){
        if($scope.currentPage<$scope.totalPages){
            $scope.currentPage++;
        }
    };
    $scope.$watch("currentPage",function(){
        if($scope.listParam == 1){
            $scope.firstInfo = $scope.firstInfos[$scope.currentPage-1];
        }
        if($scope.listParam == 2){
            $scope.secondInfo = $scope.secondInfos[$scope.currentPage-1];
        }
        if($scope.listParam == 3){
            $scope.thirdInfo = $scope.thirdInfos[$scope.currentPage-1];
        }
        if($scope.listParam == 4){
            $scope.fourthInfo = $scope.fourthInfos[$scope.currentPage-1];
        }
        if($scope.listParam == 6){
            $scope.sixthInfo = $scope.sixthInfos[$scope.currentPage-1];
        }
        if($scope.listParam == 8){
            $scope.frLicData = $scope.frLicenceData[$scope.currentPage-1];
        }
    });
});