app.config(['$routeProvider',function($routeProvider){
    $routeProvider
        .when('/main',{templateUrl:'views/main.html', controller:'mainController'})
        .when('/infoList',{templateUrl:'views/infoList.html', controller:'infoListController'})
        .when('/pwait',{templateUrl:'views/pwait.html', controller:'pwaitController'})
        .otherwise({redirectTo:'/main'})
}]);