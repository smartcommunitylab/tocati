angular.module('tocati', [
	'ionic',
    'ngIOS9UIWebViewPatch',
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
    moment.locale('it');

	$translateProvider.useStaticFilesLoader({
		prefix: 'languages/',
		suffix: '.json'
	});
	//$translateProvider.useSanitizeValueStrategy('sanitize');
	//$translateProvider.useSanitizeValueStrategy('sanitizeParameters');
	$translateProvider.useSanitizeValueStrategy('escapeParameters');

	$ionicConfigProvider.tabs.position('top');
	$ionicConfigProvider.tabs.style('striped');

  	$ionicConfigProvider.views.swipeBackEnabled(false);
    $ionicConfigProvider.backButton.text('');
    $ionicConfigProvider.backButton.previousTitleText('');

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
	.state('app.reset', {
		url: '/reset',
        cache: false,
		views: {
			'menuContent': {
				templateUrl: 'templates/reset.html',
				controller: 'ResetCtrl'
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

angular.module('ngIOS9UIWebViewPatch', ['ng']).config(['$provide', function ($provide) {
    'use strict';

    $provide.decorator('$browser', ['$delegate', '$window', function ($delegate, $window) {

        if (isIOS9UIWebView($window.navigator.userAgent)) {
            return applyIOS9Shim($delegate);
        }

        return $delegate;

        function isIOS9UIWebView(userAgent) {
            return /(iPhone|iPad|iPod).* OS 9_\d/.test(userAgent) && !/Version\/9\./.test(userAgent);
        }

        function applyIOS9Shim(browser) {
            var pendingLocationUrl = null;
            var originalUrlFn = browser.url;

            browser.url = function () {
                if (arguments.length) {
                    pendingLocationUrl = arguments[0];
                    return originalUrlFn.apply(browser, arguments);
                }

                return pendingLocationUrl || originalUrlFn.apply(browser, arguments);
            };

            window.addEventListener('popstate', clearPendingLocationUrl, false);
            window.addEventListener('hashchange', clearPendingLocationUrl, false);

            function clearPendingLocationUrl() {
                pendingLocationUrl = null;
            }

            return browser;
        }
  }]);
}]);
