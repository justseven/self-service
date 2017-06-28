app.config(function($routeProvider) {
    $routeProvider
        .when('/main', {
            templateUrl: 'views/main.html',
            controller: 'mainController'
        })
        .when('/upload/:code', {
            templateUrl: 'views/upload.html',
            controller: 'uploadController'
        })
        .when('/photo', {
            templateUrl: 'views/photo.html',
            controller: 'photoController'
        })
        .when('/hint', {
            templateUrl: 'views/hint.html',
            controller: 'hintController'
        })
        .otherwise({
            redirectTo: '/main'
        })
});
