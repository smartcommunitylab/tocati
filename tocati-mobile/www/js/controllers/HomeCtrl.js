angular.module('tocati.controllers.home', [])

.controller('AppCtrl', function ($scope, $state) {
	$scope.goTo = function (state) {
		$state.go(state);
	};
})

.controller('HomeCtrl', function ($scope) {});
