angular.module('tocati.services.storage', [])

.factory('StorageSrv', function ($rootScope, $http, $q) {
	var storageService = {};

	storageService.saveUser = function(userData) {
		localStorage.setItem('user', JSON.stringify(userData));
	};

	storageService.getUser = function() {
		var userDataJSON = localStorage.getItem('user');

		if (!!userDataJSON) {
			return JSON.parse(userDataJSON);
		}

		return null;
	};

	return storageService;
});
