angular.module('tocati.services.map', [])

.factory('MapSrv', function ($rootScope, $q, $http, $ionicPlatform, $filter, $timeout, $interval, Config, GeoSrv, GraphicSrv, leafletData) {
	// GeoSrv
	var mapService = {};
	var cachedMap = {};
	var myPosition = {};

	mapService.getMap = function (mapId) {
		var deferred = $q.defer();

		if (cachedMap[mapId] == null) {
			mapService.initMap(mapId).then(function () {
				deferred.resolve(cachedMap[mapId]);
			});
		} else {
			deferred.resolve(cachedMap[mapId]);
		}

		return deferred.promise;
	}

	mapService.setMyPosition = function (myNewPosition) {
		myPosition = myNewPosition
	};

	mapService.getMyPosition = function () {
		return myPosition;
	};

	// init map with tile server provider and show my position
	mapService.initMap = function (mapId) {
		var deferred = $q.defer();

		leafletData.getMap(mapId).then(
			function (map) {
				cachedMap[mapId] = map;

				L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.{ext}', {
					type: 'map',
					ext: 'png',
					attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
					subdomains: 'abc',
					maxZoom: 18
				}).addTo(map);

				$ionicPlatform.ready(function () {
					mapService.moveMe(mapId);
					$interval(function () {
						mapService.moveMe(mapId);
					}, Config.TIMER_MOVE_ME);
				});

				deferred.resolve(map);
			},
			function (error) {
				console.log('Error creating "' + mapId + '" map!');
				deferred.reject(error);
			});

		return deferred.promise;
	};

	mapService.moveMe = function (mapId) {
		GeoSrv.locate().then(function (position) {
			var me = L.latLng(position[0], position[1]);
			mapService.setMyPosition(me);
			if (!!cachedMap[mapId].me) {
				cachedMap[mapId].me.setLatLng(me);
			} else {
				var meMarker = L.marker(me, {
					icon: L.icon(GraphicSrv.getMyPositionMarkerIcon())
				}).addTo(cachedMap[mapId]);
				cachedMap[mapId].me = meMarker;
			}

			if (!!cachedMap[mapId].precision) {
				cachedMap[mapId].precision.setLatLng(me);
				cachedMap[mapId].precision.setRadius($rootScope.myPositionAccuracy / 2);
			} else {
				var mePrecision = L.circleMarker(me, {
					radius: ($rootScope.myPositionAccuracy / 2)
				}).addTo(cachedMap[mapId]);
				cachedMap[mapId].precision = mePrecision;
			}
		});
	};

	mapService.centerOnMe = function (mapId, zoom) {
		leafletData.getMap(mapId).then(function (map) {
			GeoSrv.locate().then(function (position) {
				var me = L.latLng(position[0], position[1]);
				mapService.setMyPosition(me);
				$timeout(function () {
					map.setView(me, (!!zoom ? zoom : Config.MAP_DEFAULT_ZOOM));
				});
			});
		});
	};

	mapService.refresh = function (mapId) {
		this.getMap(mapId).then(function (map) {
			map.invalidateSize();
		})
	};

	mapService.resizeElementHeight = function (element, mapId) {
		var height = 0;
		var body = window.document.body;

		if (window.innerHeight) {
			height = window.innerHeight;
		} else if (body.parentElement.clientHeight) {
			height = body.parentElement.clientHeight;
		} else if (body && body.clientHeight) {
			height = body.clientHeight;
		}

		element.style.height = (((height - element.offsetTop) / 2) + "px");
		this.getMap(mapId).then(function (map) {
			map.invalidateSize();
		})
	};

	mapService.decodePolyline = function (str, precision) {
		var index = 0,
			lat = 0,
			lng = 0,
			coordinates = [],
			shift = 0,
			result = 0,
			byte = null,
			latitude_change,
			longitude_change,
			factor = Math.pow(10, precision || 5);

		// Coordinates have variable length when encoded, so just keep
		// track of whether we've hit the end of the string. In each
		// loop iteration, a single coordinate is decoded.
		while (index < str.length) {

			// Reset shift, result, and byte
			byte = null;
			shift = 0;
			result = 0;

			do {
				byte = str.charCodeAt(index++) - 63;
				result |= (byte & 0x1f) << shift;
				shift += 5;
			} while (byte >= 0x20);

			latitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

			shift = result = 0;

			do {
				byte = str.charCodeAt(index++) - 63;
				result |= (byte & 0x1f) << shift;
				shift += 5;
			} while (byte >= 0x20);

			longitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

			lat += latitude_change;
			lng += longitude_change;

			coordinates.push([lat / factor, lng / factor]);
		}

		return coordinates;
	};

	return mapService;
})
