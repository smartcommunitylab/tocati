angular.module('tocati.controllers.main', [])

/*
 * App generic controller
 */
.controller('AppCtrl', function ($scope, $rootScope, $state, $ionicHistory, $filter, $timeout, $ionicPopup, LoginSrv, UserSrv, StorageSrv, GeoSrv) {
//	$rootScope.user = null;

	$scope.goTo = function (state, params, root) {
		if (!!root) {
			$ionicHistory.nextViewOptions({
				historyRoot: true
			});
		}

		$state.go(state, params);
	};

	var user = StorageSrv.getUser();
	if (!!user) {
		UserSrv.setUser(user);
	}

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

	$scope.login = function () {
		// FIXME
//		LoginSrv.login('google').then(function (data) {
//			UserSrv.userLogin(data.userId, data.name, data.surname, data.name + ' ' + data.surname).then(
//				function (userData) {
//					StorageSrv.saveUser(userData);
//					UserSrv.setUser(userData);
//					StorageSrv.setTutorialDone();
//					$scope.goTo('app.home', {}, true);
//				}
//			);
//		});
      $state.go('app.login');
	};

	$scope.logout = function () {
        $timeout(function(){
          LoginSrv.logout().then(
              function () {
                  StorageSrv.deleteUser();
                  UserSrv.setUser(null);
                  StorageSrv.setTutorialDone(false);
                  StorageSrv.setChargingPoint(null);
                  $scope.goTo('app.tutorial', {}, true);
              },
              function (reason) {
                  console.log(!!reason ? reason : 'Logout error');
              }
          );
        }, 100);
	};
})

/*
 * Tutorial controller
 */
.controller('TutorialCtrl', function ($scope, $ionicSideMenuDelegate, StorageSrv) {
    $scope.showTutorial = false;

    if (StorageSrv.isTutorialDone()) {
		$scope.goTo('app.home', {}, true);
    } else {
      $scope.showTutorial = true;
    }

	// disable sidemenu
	$ionicSideMenuDelegate.canDragContent(false);
	// ion-slides options
	$scope.options = {};

	$scope.endTutorial = function () {
		//StorageSrv.setTutorialDone();
		$scope.goTo('app.home', {}, true);
	};
});
