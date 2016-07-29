angular.module('tocati.services.storage', [])

.factory('StorageSrv', function ($rootScope, $http, $q) {
	var storageService = {};

	storageService.setTutorialDone = function () {
		localStorage.setItem('tutorialDone', true);
	};

	storageService.isTutorialDone = function () {
		var tutorialDone = localStorage.getItem('tutorialDone');

		if (!!tutorialDone) {
			return true;
		}

		return false;
	};

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
