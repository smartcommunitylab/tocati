angular.module('tocati.services.data', [])

.factory('DataSrv', function ($rootScope, $http, $q, Config, UserSrv) {
	var dataService = {};

    /* ChargingPoint search */
	dataService.getChargingPoints = function (params) {
		var deferred = $q.defer();

		var httpConfWithParams = angular.copy(Config.HTTP_CONFIG);
		httpConfWithParams.params = {};

		// params: lat/lng, radius

		if (angular.isNumber(params.lat) && angular.isNumber(params.lng)) {
			httpConfWithParams.params['position'] = params.lng + ',' + params.lat;
		}

		if (angular.isNumber(params.radius)) {
			httpConfWithParams.params['radius'] = params.radius;
		}

		$http.get(Config.SERVER_URL + '/api/chargingPoints/' + Config.OWNER_ID, httpConfWithParams)

		.then(
			function (response) {
				// ChargingPoints list
				deferred.resolve(response.data);
			},
			function (reason) {
				deferred.reject(reason.data ? reason.data.errorMessage : reason);
			}
		);

		return deferred.promise;
	};

	/* get POIs by ChargingPoint */
	dataService.getPOIsByChargingPoint = function (pointId) {
		var deferred = $q.defer();

		$http.get(Config.SERVER_URL + '/api/chargingPoints/' + Config.OWNER_ID + '/' + pointId + '/pois', Config.HTTP_CONFIG)

		.then(
			function (response) {
				// POIs list
				deferred.resolve(response.data);
			},
			function (reason) {
				deferred.reject(reason.data ? reason.data.errorMessage : reason);
			}
		);

		return deferred.promise;
	};

	/* user checkin */
	dataService.userCheckin = function (pointId, poiId) {
		var deferred = $q.defer();

		$http.get(Config.SERVER_URL + '/api/chargingPoints/' + Config.OWNER_ID + '/' + UserSrv.getUser()['userId'] + '/' + pointId + '/pois/' + poiId + '/checkin', Config.HTTP_CONFIG)

		.then(
			function (response) {
                // update ranking
                dataService.getRanking();
                // update checkins
                $rootScope.user.checkinMap[poiId] = true;
				// UserData
				deferred.resolve(response.data);
			},
			function (reason) {
				deferred.reject(reason.data ? reason.data.errorMessage : reason);
			}
		);

		return deferred.promise;
	};

	/* getRanking */
	dataService.getRanking = function (start, count) {
		var deferred = $q.defer();

        var url = Config.SERVER_URL + '/api/classification/' + Config.OWNER_ID + '/' + UserSrv.getUser()['userId']+'?';
        if (start > 0) url += 'start='+start;
        if (count > 0) url += '&count='+count;

		$http.get(url, Config.HTTP_CONFIG)

		.then(
			function (response) {
				// MyRanking
                $rootScope.ranking = response.data;
				deferred.resolve(response.data);
			},
			function (reason) {
				deferred.reject(reason.data ? reason.data.errorMessage : reason);
			}
		);

		return deferred.promise;
	};

    dataService.isCheckedIn = function(poiId) {
      return $rootScope.user.checkinMap[poiId];
    }

	return dataService;
});
