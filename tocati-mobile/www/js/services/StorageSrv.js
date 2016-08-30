angular.module('tocati.services.storage', [])

.factory('StorageSrv', function ($rootScope, $http, $q) {
	var storageService = {};

	storageService.setTutorialDone = function (done) {
		if (!done) {
			localStorage.setItem('tutorialDone', false);
		} else {
			localStorage.setItem('tutorialDone', true);
		}
	};

	storageService.isTutorialDone = function () {
		var tutorialDone = localStorage.getItem('tutorialDone');

		if (!!tutorialDone && tutorialDone != 'false') {
			return true;
		}

		return false;
	};

	storageService.saveUser = function(userData) {
		localStorage.setItem('user', JSON.stringify(userData));
	};

	storageService.deleteUser = function () {
		localStorage.removeItem('user');
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
