app.config(['$routeProvider',function($routeProvider){
    $routeProvider
        .when('/main',{templateUrl:'views/main.html', controller:'mainController'})
        .when('/idcard',{templateUrl:'views/idcard.html', controller:'idcardController'})
        .when('/base',{templateUrl:'views/base.html', controller:'baseController'})
        .when('/ext',{templateUrl:'views/ext.html', controller:'extController'})
        .when('/tphoto',{templateUrl:'views/tphoto.html', controller:'tphotoController'})
        .when('/pwait',{templateUrl:'views/pwait.html', controller:'pwaitController'})
        .when('/key',{templateUrl:'views/key.html', controller:'keyController'})
        .when('/space',{templateUrl:'views/space.html', controller:'spaceController'})
        .otherwise({redirectTo:'/main'})
}]);