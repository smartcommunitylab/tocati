angular.module('tocati.controllers.main', [])

/*
 * App generic controller
 */
.controller('AppCtrl', function ($scope, $state, $ionicHistory, UserSrv, StorageSrv) {
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
