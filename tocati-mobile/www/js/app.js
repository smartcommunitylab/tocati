angular.module('tocati', [
	'ionic',
	'ngCordova',
	'ngSanitize',
	'leaflet-directive',
	'tocati.services.config',
	'tocati.services.graphic',
	'tocati.services.data',
	'tocati.services.storage',
	'tocati.services.user',
	'tocati.services.geolocalization',
	'tocati.services.map',
	'pascalprecht.translate',
	'tocati.controllers.home',
	'tocati.controllers.entry',
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
		url: '/home',
		views: {
			'menuContent': {
				templateUrl: 'templates/home.html',
				controller: 'HomeCtrl'
			}
		}
	})

	.state('app.entry', {
		url: '/home/entry/{id}',
		params: {
			entry: null
		},
		views: {
			'menuContent': {
				templateUrl: 'templates/entry.html',
				controller: 'EntryCtrl'
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
	});

	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/app/home');
});
