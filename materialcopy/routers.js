app.config(['$routeProvider',function($routeProvider){
    $routeProvider
        .when('/main',{templateUrl:'views/main.html', controller:'mainController'})
        .when('/choose',{templateUrl:'views/choose.html', controller:'chooseController'})
        .when('/pay',{templateUrl:'views/pay.html', controller:'payController'})
        .when('/pwait',{templateUrl:'views/pwait.html', controller:'pwaitController'})
        .when('/hint',{templateUrl:'views/hint.html', controller:'hintController'})
        .otherwise({redirectTo:'/main'})
}]);