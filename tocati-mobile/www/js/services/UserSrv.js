angular.module('tocati.services.user', [])

.factory('UserSrv', function ($rootScope, $http, $q, Config) {
	var userService = {};

	userService.getUser = function () {
		return $rootScope.user;
	};

	userService.setUser = function (userData) {
		$rootScope.user = userData;
        if (userData != null) {
          $rootScope.user.checkinMap = {};
          $rootScope.user.checkinList.forEach(function(c){
            $rootScope.user.checkinMap[c.poi.objectId] = true;
          });
        }
	};

	/* get user profile */
	userService.getUserProfile = function (userId) {
		var deferred = $q.defer();

		$http.get(Config.SERVER_URL + '/api/users/' + Config.OWNER_ID + '/' + userId, Config.HTTP_CONFIG)

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
	userService.userLogin = function (userId, name, surname, displayName) {
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

	return userService;
});
