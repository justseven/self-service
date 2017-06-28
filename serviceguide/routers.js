app.config(['$routeProvider',function($routeProvider){
    $routeProvider
        .when('/main',{templateUrl:'views/main.html', controller:'mainController'})
        .when('/list/:listId',{templateUrl:'views/list.html', controller:'listController'})
        .when('/content/:contentId',{templateUrl:'views/content.html', controller:'contentController'})
        .otherwise({redirectTo:'/main'})
}]);