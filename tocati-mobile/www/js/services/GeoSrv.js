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

	geoService.distance = function (pt1, pt2) {
		var d = false;
		if (pt1 && pt1[0] && pt1[1] && pt2 && pt2[0] && pt2[1]) {
			var lat1 = Number(pt1[0]);
			var lon1 = Number(pt1[1]);
			var lat2 = Number(pt2[0]);
			var lon2 = Number(pt2[1]);

			var R = 6371; // km
			//var R = 3958.76; // miles
			var dLat = (lat2 - lat1).toRad();
			var dLon = (lon2 - lon1).toRad();
			var lat1 = lat1.toRad();
			var lat2 = lat2.toRad();
			var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
				Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
			var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
			d = R * c;
		} else {
			console.log('Cannot calculate distance!');
		}
		return d;
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
