app.config(['$routeProvider',function($routeProvider){
    $routeProvider
        .when('/main',{templateUrl:'views/main.html', controller:'mainController'})
        .when('/list/:listId',{templateUrl:'views/list.html', controller:'listController'})
        .when('/date',{templateUrl:'views/date.html', controller:'dateController'})
        .when('/input',{templateUrl:'views/input.html', controller:'inputController'})
        .when('/hint',{templateUrl:'views/hint.html', controller:'hintController'})
        .otherwise({redirectTo:'/main'})
}]);