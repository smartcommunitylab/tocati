angular.module('tocati.controllers.poi', [])

.controller('PoiCtrl', function ($scope, $state, $stateParams, Utils, StorageSrv, UserSrv, DataSrv) {
	$scope.pointId = $stateParams.pointId;
	$scope.poi = $stateParams.poi;

	$scope.poiValues = {
		points: $scope.poi.points
	};

	$scope.poiCoverStyle = {
		'background-image': Utils.isUrlValid($scope.poi.imageUrl) ? 'url(' + $scope.poi.imageUrl + ')' : 'url(http://placekitten.com/500/300)'
	};

	$scope.checkin = function () {
		DataSrv.userCheckin($scope.pointId, $scope.poi.objectId).then(
			function (userData) {
				StorageSrv.saveUser(userData);
				UserSrv.setUser(userData);
			}
		);
	};
});
