angular.module('tocati.controllers.poi', [])

.controller('PoiCtrl', function ($scope, $state, $stateParams, Utils) {
	$scope.poi = $stateParams.poi;

	$scope.poiValues = {
		points: $scope.poi.points
	};

	$scope.poiCoverStyle = {
		'background-image': Utils.isUrlValid($scope.poi.imageUrl) ? 'url(' + $scope.poi.imageUrl + ')' : 'url(http://placekitten.com/500/300)'
	};
});
