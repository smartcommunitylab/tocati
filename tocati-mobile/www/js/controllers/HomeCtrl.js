angular.module('tocati.controllers.home', [])

/*
 * HOME CONTROLLER
 */
.controller('HomeCtrl', function ($scope, $state, $interval, $timeout, $filter, $ionicPopup, $ionicSideMenuDelegate, $ionicModal, Utils, Config, GraphicSrv, GeoSrv, MapSrv, DataSrv) {
	$scope.chargingPoints = {};
	$scope.pois = {};

	$scope.selectedChargingPoint = null;

	$scope.categories = {
		'cat1': {
			name: 'Categoria 1',
			checked: true
		},
		'giochi': {
			name: 'Giochi',
			checked: true
		},
		'AVVENIMENTI': {
			name: 'Eventi',
			checked: true
		},
		'suoni': {
			name: 'Suoni',
			checked: true
		},
		'sapori': {
			name: 'Sapori',
			checked: true
		},
		'incontri': {
			name: 'Incontri',
			checked: true
		},
		'PROGETTI COLLATERALI': {
			name: 'Progetti collaterali',
			checked: true
		}
	};

	$ionicModal.fromTemplateUrl('templates/modal_categories.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function (modal) {
		$scope.categoriesModal = modal;
	});

	/*
	 * MAP STUFF
	 */
	angular.extend($scope, {
		center: Config.MAP_DEFAULT_CENTER,
		markers: {},
		events: {
			map: {
				enable: ['click', 'zoomstart', 'zoomend'],
				logic: 'emit'
			}
		}
	});

	var homeMap;
	var zoomOut = false;
	var markersCache = {};

	$scope.initMap = function () {
		MapSrv.initMap('homemap').then(function (map) {
			homeMap = map;

			// FIXME on development only
			//MapSrv.centerOnMe('homemap');

			$scope.refreshChargingPoints();
		});
	};

	$scope.refreshChargingPoints = function () {
		var myPos = MapSrv.getMyPosition();
		var params = {
			lat: myPos.lat,
			lng: myPos.lng,
			radius: 5
		};

		DataSrv.getChargingPoints(params).then(
			function (cpList) {
				//var cpMarkers = [];
				$scope.chargingPoints = {};
				markersCache._chargingPoints = {};
				var boundsArray = [];

				angular.forEach(cpList, function (cp) {
					$scope.chargingPoints[cp.objectId] = cp;
					boundsArray.push([cp.coordinates[1], cp.coordinates[0]]);

					markersCache._chargingPoints[cp.objectId] = {
						lat: cp.coordinates[1],
						lng: cp.coordinates[0],
						name: cp.name,
						icon: GraphicSrv.getChargingPointMarkerIcon(),
						focus: false,
						draggable: false
					};

					$scope.markers = angular.copy(markersCache._chargingPoints);
				});

				if (!!homeMap.me && !!homeMap.me.lat && !!homeMap.me.lon) {
					boundsArray.push([homeMap.me.lat, homeMap.me.lon]);
				}

				homeMap.fitBounds(boundsArray);
			},
			function (error) {
				// TODO handle errors
			}
		);
	};

	$scope.$on('leafletDirectiveMarker.homemap.click', function (event, args) {
		if (!!args.model.parentId) {
			// POI
			$scope.openPoiPopup(args.model.parentId, $scope.pois[args.modelName]);
		} else {
			// ChargingPoint
			$scope.openChargingPointPopup($scope.chargingPoints[args.modelName]);
		}
	});

	/* Refreshes POIs markers using the category filter selections */
	var refreshPoiMarkers = function (cp) {
		var updatedMarkers = {};
		angular.forEach($scope.categories, function (category, categoryId) {
			if (category.checked) {
				angular.extend(updatedMarkers, markersCache[cp.objectId][categoryId]);
			}
		});

		$scope.markers = updatedMarkers;
		// add chargingPoint
		$scope.markers[cp.objectId] = markersCache._chargingPoints[cp.objectId];
	};

	$scope.openChargingPointPopup = function (cp) {
		$scope.popupValues = {};
		$scope.selectedChargingPoint = cp;

		var myPos = MapSrv.getMyPosition();
		var distance = GeoSrv.distance([myPos.lng, myPos.lat], cp.coordinates);

		if (distance > Config.DELTA_DISTANCE) {
			$scope.popupValues['distance'] = Utils.roundDecimalPlaces(distance);
		} else {
			$scope.popupValues['distance'] = 0;
		}

		var cpPopup = $ionicPopup.confirm({
			scope: $scope,
			templateUrl: 'templates/popup_chargingpoint.html',
			cancelText: $filter('translate')('close'),
			cancelType: 'button-clear button-stable',
			okText: $filter('translate')('go'),
			okType: 'button-clear button-assertive',
			cssClass: 'popup-home'
		});

		cpPopup.then(function (go) {
			if (go) {
				DataSrv.getPOIsByChargingPoint(cp.objectId).then(
					function (pois) {
						$scope.pois = {};
						markersCache[cp.objectId] = {};
						var boundsArray = [];

						angular.forEach(pois, function (poi) {
							$scope.pois[poi.objectId] = poi;
							boundsArray.push([poi.coordinates[1], poi.coordinates[0]]);

							if (!markersCache[cp.objectId][poi.category]) {
								markersCache[cp.objectId][poi.category] = {};
							}

							markersCache[cp.objectId][poi.category][poi.objectId] = {
								parentId: cp.objectId,
								lat: poi.coordinates[1],
								lng: poi.coordinates[0],
								name: poi.objectId,
								icon: GraphicSrv.getPoiMarkerIcon(poi.category),
								focus: false,
								draggable: false
							};
						});

						refreshPoiMarkers(cp);
						// fit map
						boundsArray.push([$scope.chargingPoints[cp.objectId].coordinates[1], $scope.chargingPoints[cp.objectId].coordinates[0]]);
						homeMap.fitBounds(boundsArray);
					}
				);
			} else {
				cpPopup.close();
			}
		});
	};

	$scope.openPoi = function (poi) {
		$state.go('app.poi', {
			pointId: $scope.selectedChargingPoint.objectId,
			id: poi.objectId,
			poi: poi
		});
	};

	$scope.openPoiPopup = function (pointId, poi) {
		$scope.popupValues = {};
		$scope.chargingPointId = pointId;
		$scope.selectedPoi = poi;
		$scope.categoryImage = GraphicSrv.getPoiIconC(poi.category);

		var myPos = MapSrv.getMyPosition();
		var distance = GeoSrv.distance([myPos.lng, myPos.lat], poi.coordinates);

		if (distance > Config.DELTA_DISTANCE) {
			$scope.popupValues['distance'] = Utils.roundDecimalPlaces(distance);
		} else {
			$scope.popupValues['distance'] = 0;
		}

		$scope.popupValues['points'] = poi.points;

		var poiPopup = $ionicPopup.confirm({
			scope: $scope,
			templateUrl: 'templates/popup_poi.html',
			cancelText: $filter('translate')('close'),
			cancelType: 'button-clear button-stable',
			okText: $filter('translate')('details'),
			okType: 'button-clear button-assertive',
			cssClass: 'popup-home'
		});

		poiPopup.then(function (go) {
			if (go) {
				$scope.openPoi(poi);
			} else {
				poiPopup.close();
			}
		});
	};

	//$scope.categories
	$scope.$watch('categories', function (newCats, oldCats) {
		if (!!$scope.selectedChargingPoint) {
			refreshPoiMarkers($scope.selectedChargingPoint);
		}
	}, true);

	$scope.$on('leafletDirectiveMap.homemap.zoomstart', function (event, args) {
		if (args.leafletObject._animateToZoom < args.leafletObject._zoom) {
			zoomOut = true;
		}
	});

	$scope.$on('leafletDirectiveMap.homemap.zoomend', function (event, args) {
		if (!!zoomOut) {
			$scope.markers = angular.copy(markersCache._chargingPoints);
			$scope.pois = {};
			$scope.selectedChargingPoint = null;
			zoomOut = false;
		}
	});

	/*
	 * LIST STUFF
	 */
	$scope.getPoiStyle = function (poi) {
		return {
			'background-color': GraphicSrv.getPoiColor(poi.category),
			'background-image': 'url(' + GraphicSrv.getPoiIconW(poi.category) + ')'
		};
	};

	$scope.getDistance = function (poi) {
		var myPos = MapSrv.getMyPosition();
		var distance = GeoSrv.distance([myPos.lng, myPos.lat], poi.coordinates);

		if (distance > Config.DELTA_DISTANCE) {
			return Utils.roundDecimalPlaces(distance);
		}

		return 0;
	};
});
