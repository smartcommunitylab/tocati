angular.module('tocati.services.login', [])

.factory('LoginSrv', function ($rootScope, $q, $http, $window, Config, UserSrv, StorageSrv) {
	var loginService = {};

	var authWindow = null;

	loginService.userIsLogged = function () {
		return (StorageSrv.getUserId() != null && StorageSrv.getUser() != null);
	};

	loginService.login = function (provider) {
		var deferred = $q.defer();
        authWindow = null;

		if (provider != 'google') {
			provider = '';
		}

		// log into the system and set userId
		var authapi = {
			authorize: function (token) {
				var deferred = $q.defer();

				var processThat = false;

				// Build the OAuth consent page URL
				var authUrl = Config.SERVER_URL + '/userlogin' + (!!provider ? '/' + provider : '');

				//Open the OAuth consent page in the InAppBrowser
				if (!authWindow) {
					authWindow = $window.open(authUrl, '_blank', 'location=no,toolbar=no');
					processThat = !!authWindow;
				}

				var processURL = function (url, deferred, w) {
					var success = /userloginsuccess\?profile=(.+)$/.exec(url);
					var error = /userloginerror\?error=(.+)$/.exec(url);
					if (w && (success || error)) {
						//Always close the browser when match is found
						w.close();
						authWindow = null;
					}

					if (success) {
						var str = success[1];
						if (str.indexOf('#') != -1) {
							str = str.substring(0, str.indexOf('#'));
						}
						console.log('success:' + decodeURIComponent(str));
						deferred.resolve(JSON.parse(decodeURIComponent(str)));
					} else if (error) {
						//The user denied access to the app
						deferred.reject({
							error: error[1]
						});
					}
				};

				if (ionic.Platform.isWebView()) {
					if (processThat) {
						authWindow.addEventListener('loadstart', function (e) {
							//console.log(e);
							var url = e.url;
							processURL(url, deferred, authWindow);
						});
					}
				} else {
					angular.element($window).bind('message', function (event) {
						$rootScope.$apply(function () {
							processURL(event.data, deferred);
						});
					});
				}

				return deferred.promise;
			}
		};

		authapi.authorize().then(
			function (data) {
				/*
				StorageSrv.saveUser(data).then(function () {
					UserSrv.getUser().then(function () {
						deferred.resolve(data);
					}, function (reason) {
						StorageSrv.saveUserId(null).then(function () {
							deferred.reject(reason);
						});
					});
				});
				*/
				deferred.resolve(data);
			},
			function (reason) {
				//reset data
				/*
				StorageSrv.saveUser(null).then(function () {
					deferred.reject(reason);
				});
				*/
				deferred.reject(reason);
			}
		);

		return deferred.promise;
	};

	loginService.logout = function () {
		var deferred = $q.defer();

		try {
			cookieMaster.clear(
				function () {
					console.log('Cookies have been cleared');
					deferred.resolve();
				},
				function () {
					console.log('Cookies could not be cleared');
					deferred.reject();
				});
		} catch (e) {
			deferred.resolve(e);
		}

		return deferred.promise;
	};

  	loginService.loginEVWay = function (user) {
		var deferred = $q.defer();
		$http.get(Config.SERVER_URL + '/'+Config.OWNER_ID+'/userloginevway?email=' + user.email + '&password=' + user.password+'&language='+user.language, Config.HTTP_CONFIG)
			.then(
				function (res) {
                    deferred.resolve(res);
				},
				function (reason) {
					StorageSrv.saveUser(null);
                    deferred.reject(reason);
				}
			);

		return deferred.promise;
	};

  	loginService.registerEVWay = function (user) {
		var deferred = $q.defer();
		$http.get(Config.SERVER_URL + '/'+Config.OWNER_ID+'/userregisterevway?'+
                  'email=' + user.email +
                  '&password=' + user.password +
                  '&language='+user.language +
                  '&name='+user.name +
                  '&surname='+user.surname
                  , Config.HTTP_CONFIG)
			.then(
				function (res) {
                    deferred.resolve(res);
				},
				function (reason) {
					StorageSrv.saveUser(null);
                    deferred.reject(reason);
				}
			);

		return deferred.promise;
	};
  	loginService.resetEVWay = function (email) {
		var deferred = $q.defer();
		$http.get(Config.SERVER_URL + '/'+Config.OWNER_ID+'/resetpwdevway?'+
                  'email=' + email
                  , Config.HTTP_CONFIG)
			.then(
				function (res) {
                    deferred.resolve(res);
				},
				function (reason) {
					StorageSrv.saveUser(null);
                    deferred.reject(reason);
				}
			);

		return deferred.promise;
	};
	/*
	loginService.signin = function (user) {
		var deferred = $q.defer();
		$http.get(Config.SERVER_URL + '/userlogininternal?email=' + user.email + '&password=' + user.password, {
				headers: {
					'Accept': 'application/json',
				}
			})
			.then(
				function (res) {
					var data = res.data;
					StorageSrv.saveUser(data).then(function () {
						UserSrv.getUser().then(function () {
							deferred.resolve(data);
						}, function (reason) {
							StorageSrv.saveUserId(null).then(function () {
								deferred.reject(reason);
							});
						});
					});
				},
				function (reason) {
					StorageSrv.saveUser(null).then(function () {
						deferred.reject(reason);
					});
				}
			);

		return deferred.promise;
	};
	*/

	/*
	loginService.register = function (user) {
		var deferred = $q.defer();
		$http.post(Config.SERVER_URL + '/register', user, {
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				}
			})
			.then(
				function (response) {
					deferred.resolve();
				},
				function (responseError) {
					deferred.reject(responseError.status);
				}
			);

		return deferred.promise;
	};
	*/

	return loginService;
});
