angular.module('tocati', [
	'ionic',
	'ngCordova',
    'ngSanitize',
    'pascalprecht.translate',
	'tocati.controllers.home',
	'tocati.controllers.diary'
])

.run(function ($ionicPlatform) {
	$ionicPlatform.ready(function () {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if (window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			cordova.plugins.Keyboard.disableScroll(true);

		}
		if (window.StatusBar) {
			// org.apache.cordova.statusbar required
			StatusBar.styleDefault();
		}
	});
})

.config(function ($translateProvider) {
	//$translateProvider.translations('it', {});
	$translateProvider.preferredLanguage('it');
	$translateProvider.useStaticFilesLoader({
		prefix: 'languages/',
		suffix: '.json'
	});
	//$translateProvider.useSanitizeValueStrategy('sanitize');
	//$translateProvider.useSanitizeValueStrategy('sanitizeParameters');
	$translateProvider.useSanitizeValueStrategy('escapeParameters');
})

.config(function ($ionicConfigProvider) {
	//$ionicConfigProvider.backButton.previousTitleText(false).text('');
})

.config(function ($stateProvider, $urlRouterProvider) {
	$stateProvider.state('app', {
		url: '/app',
		abstract: true,
		templateUrl: 'templates/menu.html',
		controller: 'AppCtrl'
	})

	.state('app.tutorial', {
		url: '/tutorial',
		views: {
			'menuContent': {
				templateUrl: 'templates/tutorial.html',
				controller: 'TutorialCtrl'
			}
		}
	})

	.state('app.home', {
		cache: false,
		url: '/home',
		views: {
			'menuContent': {
				templateUrl: 'templates/home/home.html',
				controller: 'HomeCtrl'
			}
		}
	})

	.state('app.home.map', {
		url: '/map',
		views: {
			'tab-map': {
				templateUrl: 'templates/home/map.html',
				controller: 'HomeMapCtrl'
			}
		}
	})

	.state('app.home.list', {
		url: '/list',
		views: {
			'tab-list': {
				templateUrl: 'templates/home/list.html',
				controller: 'HomeListCtrl'
			}
		}
	})

	.state('app.diary', {
		cache: false,
		url: '/diary',
		views: {
			'menuContent': {
				templateUrl: 'templates/diary/diary.html',
				controller: 'DiaryCtrl'
			}
		}
	})

	.state('app.diary.points', {
		url: '/points',
		views: {
			'tab-points': {
				templateUrl: 'templates/diary/points.html',
				controller: 'DiaryPointsCtrl'
			}
		}
	})

	.state('app.diary.ranking', {
		url: '/ranking',
		views: {
			'tab-ranking': {
				templateUrl: 'templates/diary/ranking.html',
				controller: 'DiaryRankingCtrl'
			}
		}
	});

	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/app/home');
});
