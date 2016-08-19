angular.module('tocati.controllers.main', [])

/*
 * App generic controller
 */
.controller('AppCtrl', function ($scope, $state, $ionicHistory, $filter, $ionicPopup, UserSrv, StorageSrv, GeoSrv) {
	/* Check if geolocalization is up & running */
	GeoSrv.initLocalization().then(
		function () {},
		function () {
			$scope.showAlert = function () {
				var alertPopup = $ionicPopup.alert({
					scope: $scope,
					title: $filter('translate')('warning'),
					template: $filter('translate')('geolocation_error'),
					okText: $filter('translate')('ok'),
					okType: 'button-clear button-assertive',
				});

				alertPopup.then(function (res) {});
			};

			$scope.showAlert();
		}
	);

	$scope.goTo = function (state, params, root) {
		if (!!root) {
			$ionicHistory.nextViewOptions({
				historyRoot: true
			});
		}

		$state.go(state, params);
	};

	$scope.login = function () {
		// FIXME dev only!
		UserSrv.userLogin('oscar', 'oscar', 'oscar', 'oscar').then(
			function (userData) {
				StorageSrv.saveUser(userData);
				UserSrv.setUser(userData);
			}
		);
	};

	// FIXME dev only user
	var user = StorageSrv.getUser();
	if (!!user) {
		UserSrv.setUser(user);
	}

	if (!StorageSrv.isTutorialDone()) {
		$scope.goTo('app.tutorial', {}, true);
	}
})

/*
 * Tutorial controller
 */
.controller('TutorialCtrl', function ($scope, $ionicSideMenuDelegate, StorageSrv) {
	// disable sidemenu
	$ionicSideMenuDelegate.canDragContent(false);
	// ion-slides options
	$scope.options = {};

	$scope.endTutorial = function () {
		StorageSrv.setTutorialDone();
		$scope.goTo('app.home', {}, true);
	};
});
