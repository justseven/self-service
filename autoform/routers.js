app.config(function($routeProvider) {
    $routeProvider
        .when('/main', {
            templateUrl: 'views/main.html',
            controller: 'mainController'
        })
        .when('/note/:id/:type', {
            templateUrl: 'views/note.html',
            controller: 'noteController'
        })
        .when('/idCard', {
            templateUrl: 'views/idCard.html',
            controller: 'idCardController'
        })
        .when('/tphoto', {
            templateUrl: 'views/tphoto.html',
            controller: 'tphotoController'
        })
        .when('/fillform', {
            templateUrl: 'views/fillform.html',
            controller: 'fillformController'
        })
        .when('/pwait', {
            templateUrl: 'views/pwait.html',
            controller: 'pwaitController'
        })
        .otherwise({
            redirectTo: '/main'
        })
});
