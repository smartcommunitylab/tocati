angular.module('tocati.services.geolocalization', [])

.factory('GeoSrv', function ($q, $rootScope) {
	var geoService = {};

	if (typeof (Number.prototype.toRad) === 'undefined') {
		Number.prototype.toRad = function () {
			return this * Math.PI / 180;
		}
	}

	var localization = undefined;
	var myPosition = null;

	geoService.initLocalization = function () {
		if (typeof localization == 'undefined') {
			localization = $q.defer();

			if (ionic.Platform.isWebView()) {
				document.addEventListener('deviceready', function () {
					$rootScope.locationWatchID = navigator.geolocation.watchPosition(function (position) {
						r = [position.coords.latitude, position.coords.longitude];
						$rootScope.myPosition = r;
						$rootScope.myPositionAccuracy = position.coords.accuracy;
						//console.log('geolocated (cordova)');
						localization.resolve(r);
					}, function (error) {
						console.log('Geolocalization unavailable (Cordova issues)');
						localization.reject('Geolocalization unavailable (Cordova issues)');
					}, {
						//frequency: (20 * 60 * 1000), // 20 minutes
						maximumAge: (10 * 60 * 1000), // 10 minutes
						timeout: 10 * 1000, // 10 seconds
						enableHighAccuracy: (device.version.indexOf('2.') == 0) // true for Android 2.x
					});
				}, false);
			} else {
				$rootScope.locationWatchID = navigator.geolocation.watchPosition(function (position) {
					r = [position.coords.latitude, position.coords.longitude];
					$rootScope.myPosition = r;
					$rootScope.myPositionAccuracy = position.coords.accuracy;
					//console.log('geolocated (web)');
					localization.resolve(r);
				}, function (error) {
					console.log('Geolocalization unavailable (web issues)');
					localization.reject('Geolocalization unavailable (web issues)');
				}, {
					maximumAge: (10 * 60 * 1000), // 10 minuntes
					timeout: 10 * 1000, // 10 seconds
					enableHighAccuracy: false
				});
			}
		}

		return localization.promise;
	};


	geoService.reset = function () {
		localization = undefined;
	};

	geoService.locate = function () {
		//console.log('geolocalizing...');
		return geoService.initLocalization().then(function (firstGeoLocation) {
			return $rootScope.myPosition;
		});
	};

	geoService.getAccuracy = function () {
		return $rootScope.myPositionAccuracy;
	};

	geoService.distance = function (coords1, coords2) {
		// distance beetween 2 points in Km
		var unit = 'K';
		var lat1 = coords1[1];
		var lon1 = coords1[0];
		var lat2 = coords2[1];
		var lon2 = coords2[0];

		var radlat1 = Math.PI * lat1 / 180;
		var radlat2 = Math.PI * lat2 / 180;
		var theta = lon1 - lon2;
		var radtheta = Math.PI * theta / 180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		dist = Math.acos(dist);
		dist = dist * 180 / Math.PI;
		dist = dist * 60 * 1.1515;

		if (unit == 'K') {
			dist = dist * 1.609344;
		}
		if (unit == 'N') {
			dist = dist * 0.8684;
		}

		return dist;
	};

	geoService.distanceTo = function (gotoPosition) {
		var GL = this;
		return localization.promise.then(function (myPosition) {
			//console.log('myPosition: ' + JSON.stringify(myPosition));
			//console.log('gotoPosition: ' + JSON.stringify(gotoPosition));
			return GL.distance(myPosition, gotoPosition);
		});
	};

	return geoService;
});
