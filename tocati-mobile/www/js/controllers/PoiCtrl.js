angular.module('tocati.controllers.poi', [])

.controller('PoiCtrl', function ($scope, $state, $stateParams, $filter, Utils, Config, StorageSrv, UserSrv, DataSrv) {
	$scope.pointId = $stateParams.pointId;
	$scope.poi = $stateParams.poi;

	$scope.poiValues = {
		points: $scope.poi.points,
		when: []
	};

	angular.forEach($scope.poi.when, function (when) {
		var ds = $filter('date')(when.date, Config.DATE_FORMAT_M) + ' ';
		angular.forEach(when.slots, function (slot, index) {
			if (!!slot.from) {
				ds += (index > 0) ? ', ' : '';
				ds += slot.from;
				ds += (!!slot.to) ? ('-' + slot.to) : '';
			}
		});
		$scope.poiValues.when.push(ds);
	});

	if (Utils.isUrlValid($scope.poi.imageUrl)) {
		$scope.poiCoverStyle = {
			'background-image': 'url(' + $scope.poi.imageUrl + ')'
		};
	}

	$scope.checkinAvailable = function () {
		// TODO return true if distance is less than the configured value and you are in the time slots
		return false;
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
