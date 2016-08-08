angular.module('tocati.services.data', [])

.factory('DataSrv', function ($rootScope, $http, $q, Config, UserSrv) {
	var dataService = {};

	var user = {};

	dataService.getUser = function () {
		return user;
	};

	dataService.setUser = function (userData) {
		user = userData;
	};

	/* get user profile */
	dataService.getUserProfile = function () {
		var deferred = $q.defer();

		$http.get(Config.SERVER_URL + '/api/users/' + Config.OWNER_ID + '/' + UserSrv.getUser()['userId'], Config.HTTP_CONFIG)

		.then(
			function (response) {
				// UserData
				deferred.resolve(response.data);
			},
			function (reason) {
				deferred.reject(reason.data ? reason.data.errorMessage : reason);
			}
		);

		return deferred.promise;
	};

	/* user login */
	dataService.userLogin = function (userId, name, surname, displayName) {
		var deferred = $q.defer();

		var body = {
			'name': name,
			'surname': surname,
			'displayName': displayName
		};

		$http.post(Config.SERVER_URL + '/api/users/' + Config.OWNER_ID + '/' + userId + '/login', body, Config.HTTP_CONFIG)

		.then(
			function (response) {
				// UserData
				deferred.resolve(response.data);
			},
			function (reason) {
				deferred.reject(reason.data ? reason.data.errorMessage : reason);
			}
		);

		return deferred.promise;
	};

	/* ChargingPoint search */
	dataService.getChargingPoints = function (params) {
		var deferred = $q.defer();

		var httpConfWithParams = angular.copy(Config.HTTP_CONFIG);
		httpConfWithParams.params = {};

		if (angular.isNumber(params.lat) && angular.isNumber(params.lng)) {
			httpConfWithParams.params['position'] = params.lng + ',' + params.lat;
		}

		if (angular.isNumber(params.radius)) {
			httpConfWithParams.params['radius'] = radius;
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
	dataService.getPOIsByChargingPoints = function (pointId) {
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
	dataService.getRanking = function () {
		var deferred = $q.defer();

		$http.get(Config.SERVER_URL + '/api/classification/' + Config.OWNER_ID + '/' + UserSrv.getUser()['userId'], Config.HTTP_CONFIG)

		.then(
			function (response) {
				// MyRanking
				deferred.resolve(response.data);
			},
			function (reason) {
				deferred.reject(reason.data ? reason.data.errorMessage : reason);
			}
		);

		return deferred.promise;
	};

	return dataService;
});