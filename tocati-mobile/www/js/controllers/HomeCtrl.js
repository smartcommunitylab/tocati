angular.module('tocati.controllers.home', [])

.controller('AppCtrl', function ($scope, $state) {
	$scope.goTo = function (state) {
		$state.go(state);
	};
})

.controller('HomeCtrl', function ($scope) {})

.controller('TutorialCtrl', function ($scope, $ionicSideMenuDelegate) {
	// disable sidemenu
	$ionicSideMenuDelegate.canDragContent(false);

	// ion-slides options
	$scope.options = {};
});
