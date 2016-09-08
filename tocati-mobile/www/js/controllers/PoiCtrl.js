angular.module('tocati.controllers.poi', [])

.controller('PoiCtrl', function ($scope, $rootScope, $state, $stateParams, $filter, Utils, Config, StorageSrv, UserSrv, DataSrv, GeoSrv) {
	$scope.pointId = $stateParams.pointId;
	$scope.poi = $stateParams.poi;

//    $scope.poi.coordinates = [11.151702, 46.067872];
//    $scope.poi.when.forEach(function(w){
//      w.date = new Date().getTime();
//      w.slots = [{from: '13:00', to: '13:30'}];
//    });

	$scope.poiValues = {
		points: $scope.poi.points,
		when: []
	};

	/* check if the user checked in here before */
	$scope.alreadyCheckedIn = false;

	var verifyPreviousCheckin = function () {
      if (DataSrv.isCheckedIn($scope.poi.objectId)) {
        $scope.alreadyCheckedIn = true;

      }
	};

	verifyPreviousCheckin();

	/* build datetime strings */
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

	/* verify image url validity */
	if (Utils.isUrlValid($scope.poi.imageUrl)) {
		$scope.poiCoverStyle = {
			'background-image': 'url(' + $scope.poi.imageUrl + ')'
		};
	}

	/* verify if checkin has to be available */
	$scope.checkinAvailable = false;

	if (Config.VERIFY_SPACETIME) {
		$scope.$watch('myPosition', function (newPos, oldPos) {
            if (newPos == null) return;

			var distance = GeoSrv.distance([newPos[1], newPos[0]], $scope.poi.coordinates);
            var threshold = Config.DELTA_DISTANCE;

			if (!Config.VERIFY_SPACE) {
		      distance = 0;
//			} else if ($rootScope.myPositionAccuracy != null) {
//              threshold += $rootScope.myPositionAccuracy / 1000;
            }

			//geo check
			if (distance <= threshold) {
				// time check
				var inSlot = false;

				if (!Config.VERIFY_TIME) {
					inSlot = true;
				} else {
					for (var i = 0; i < $scope.poi.when.length; i++) {
						var when = $scope.poi.when[i];
						if (moment().isSame(moment(when.date), 'day')) {
							// is today!
							i = $scope.poi.when.length;

							for (var j = 0; j < when.slots.length; j++) {
								var slot = when.slots[j];
                                var n = moment();
                                var f = moment(slot.from, 'HH:mm').subtract(Config.DELTA_TIME, 'minutes');
                                var t = moment(slot.to, 'HH:mm').add(Config.DELTA_TIME, 'minutes');
								if (n.isBetween(f, t)) {
									inSlot = true;
									j = when.slots.length;
								}
							}
						}
					}
				}
				$scope.checkinAvailable = inSlot ? true : false;
			} else {
				$scope.checkinAvailable = false;
			}
		});
	} else {
		$scope.checkinAvailable = true;
	}

	/* check in! */
	$scope.checkin = function () {
		if (!$scope.alreadyCheckedIn) {
			DataSrv.userCheckin($scope.pointId, $scope.poi.objectId).then(
				function (userData) {
					StorageSrv.saveUser(userData);
					UserSrv.setUser(userData);
					verifyPreviousCheckin();
				}
			);
		}
	};
});
