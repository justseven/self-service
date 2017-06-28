app.config(function($routeProvider) {
	$routeProvider
		.when('/main', {
			templateUrl: 'views/main.html',
			controller: 'mainController'
		})
		.when('/list', {
			templateUrl: 'views/list.html',
			controller: 'listController'
		})
		.when('/detail/:detailID', {
			templateUrl: 'views/detail.html',
			controller: 'detailController'
		})
		.when('/hint', {
			templateUrl: 'views/hint.html',
			controller: 'hintController'
		})
		.otherwise({
			redirectTo: '/main'
		})
});