angular.module('tocati.controllers.entry', [])

.controller('EntryCtrl', function ($scope, $state, $stateParams) {
	$scope.entry = $stateParams.entry;

	$scope.entryCoverStyle = {
		'background-image': 'url(' + $scope.entry.image + ')'
	};
});
