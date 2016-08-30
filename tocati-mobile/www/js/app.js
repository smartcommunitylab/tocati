angular.module('tocati', [
	'ionic',
	'ngCordova',
	'ngSanitize',
	'leaflet-directive',
	'tocati.services.utils',
	'tocati.services.config',
	'tocati.services.graphic',
	'tocati.services.data',
	'tocati.services.storage',
	'tocati.services.login',
	'tocati.services.user',
	'tocati.services.geolocalization',
	'tocati.services.map',
	'pascalprecht.translate',
	'tocati.controllers.main',
	'tocati.controllers.home',
	'tocati.controllers.poi',
	'tocati.controllers.diary',
	'tocati.controllers.login'
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

.config(function ($ionicConfigProvider, $translateProvider) {
	//$translateProvider.translations('it', {});
	$translateProvider.preferredLanguage('it');
	$translateProvider.useStaticFilesLoader({
		prefix: 'languages/',
		suffix: '.json'
	});
	//$translateProvider.useSanitizeValueStrategy('sanitize');
	//$translateProvider.useSanitizeValueStrategy('sanitizeParameters');
	$translateProvider.useSanitizeValueStrategy('escapeParameters');

	$ionicConfigProvider.tabs.position('top');
	$ionicConfigProvider.tabs.style('striped');
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
        cache: false,
		url: '/tutorial',
		views: {
			'menuContent': {
				templateUrl: 'templates/tutorial.html',
				controller: 'TutorialCtrl'
			}
		}
	})

	.state('app.home', {
		url: '/home',
		views: {
			'menuContent': {
				templateUrl: 'templates/home.html',
				controller: 'HomeCtrl'
			}
		}
	})
	.state('app.login', {
		url: '/login',
        cache: false,
		views: {
			'menuContent': {
				templateUrl: 'templates/login.html',
				controller: 'LoginCtrl'
			}
		}
	})
	.state('app.register', {
		url: '/register',
        cache: false,
		views: {
			'menuContent': {
				templateUrl: 'templates/register.html',
				controller: 'RegisterCtrl'
			}
		}
	})

	.state('app.poi', {
		url: '/home/poi/{id}',
		params: {
			pointId: null,
			poi: null
		},
		views: {
			'menuContent': {
				templateUrl: 'templates/poi.html',
				controller: 'PoiCtrl'
			}
		}
	})

	.state('app.diary', {
		url: '/diary',
		views: {
			'menuContent': {
				templateUrl: 'templates/diary.html',
				controller: 'DiaryCtrl'
			}
		}
	})

	.state('app.rules', {
		url: '/rules',
		views: {
			'menuContent': {
				templateUrl: 'templates/rules.html'
			}
		}
	})

	.state('app.credits', {
		url: '/credits',
		views: {
			'menuContent': {
				templateUrl: 'templates/credits.html'
			}
		}
	});

	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/app/tutorial');
});
