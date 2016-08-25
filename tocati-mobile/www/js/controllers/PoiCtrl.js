angular.module('tocati.controllers.poi', [])

.controller('PoiCtrl', function ($scope, $state, $stateParams, $filter, Utils, Config, StorageSrv, UserSrv, DataSrv, GeoSrv) {
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

	$scope.checkinAvailable = false;

	$scope.$watch('myPosition', function (newPos, oldPos) {
		var distance = GeoSrv.distance([newPos[1], newPos[0]], $scope.poi.coordinates);

		//geo check
		if (distance <= Config.DELTA_DISTANCE) {
			// time check
			var inSlot = false;

			for (var i = 0; i < $scope.poi.when.length; i++) {
				var when = $scope.poi.when[i];
				if (moment().isSame(moment(when.date), 'day')) {
					// is today!
					i = $scope.poi.when.length;

					for (var j = 0; j < when.slots.length; j++) {
						var slot = when.slots[j];
						if (moment().isBetween(moment(slot.from).subtract(Config.DELTA_TIME, 'minutes'), moment(slot.to))) {
							inSlot = true;
							j = when.slots.length;
						}
					}
				}
			}
			$scope.checkinAvailable = inSlot ? true : false;
		} else {
			$scope.checkinAvailable = false;
		}
	});

	$scope.checkin = function () {
		DataSrv.userCheckin($scope.pointId, $scope.poi.objectId).then(
			function (userData) {
				StorageSrv.saveUser(userData);
				UserSrv.setUser(userData);
			}
		);
	};
});
