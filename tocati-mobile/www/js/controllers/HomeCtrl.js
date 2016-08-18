angular.module('tocati.controllers.home', [])

/*
 * Home generic controller
 */
.controller('HomeCtrl', function ($scope, $ionicSideMenuDelegate, $ionicModal) {
	$scope.chargingPoints = {};
	$scope.pois = {};

	$scope.types = [
		{
			name: 'Giochi',
			checked: false
		},
		{
			name: 'Eventi',
			checked: false
		},
		{
			name: 'Suoni',
			checked: false
		},
		{
			name: 'Sapori',
			checked: false
		},
		{
			name: 'Incontri',
			checked: false
		},
		{
			name: 'Progetti collaterali',
			checked: false
		}
	];

	$ionicModal.fromTemplateUrl('templates/modal_types.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function (modal) {
		$scope.typesModal = modal;
	});
})

/*
 * Home Map controller
 */
.controller('HomeMapCtrl', function ($scope, $state, $timeout, $filter, $ionicPopup, Utils, Config, GraphicSrv, MapSrv, DataSrv) {
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
			MapSrv.centerOnMe('homemap');

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

				angular.forEach(cpList, function (cp) {
					$scope.chargingPoints[cp.objectId] = cp;

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

	$scope.openChargingPointPopup = function (cp) {
		$scope.popupValues = {};
		$scope.selectedChargingPoint = cp;

		var myPos = MapSrv.getMyPosition();
		var distance = Utils.getDistanceP2P([myPos.lng, myPos.lat], cp.coordinates);

		if (distance > Config.YOU_ARE_HERE_DISTANCE) {
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

							markersCache[cp.objectId][poi.objectId] = {
								parentId: cp.objectId,
								lat: poi.coordinates[1],
								lng: poi.coordinates[0],
								name: poi.objectId,
								icon: GraphicSrv.getPoiMarkerIcon(poi.category),
								focus: false,
								draggable: false
							};
						});

						$scope.markers = angular.copy(markersCache[cp.objectId]);
						$scope.markers[cp.objectId] = markersCache._chargingPoints[cp.objectId];
						boundsArray.push([$scope.chargingPoints[cp.objectId].coordinates[1], $scope.chargingPoints[cp.objectId].coordinates[0]]);
						// fit map
						homeMap.fitBounds(boundsArray);
					}
				);
			} else {
				cpPopup.close();
			}
		});
	};

	$scope.openPoiPopup = function (pointId, poi) {
		$scope.popupValues = {};
		$scope.chargingPointId = pointId;
		$scope.selectedPoi = poi;
		$scope.categoryImage = GraphicSrv.getPoiIconC(poi.category);

		var myPos = MapSrv.getMyPosition();
		var distance = Utils.getDistanceP2P([myPos.lng, myPos.lat], poi.coordinates);

		if (distance > Config.YOU_ARE_HERE_DISTANCE) {
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
				// TODO view details
				$state.go('app.poi', {
					pointId: $scope.chargingPointId,
					id: poi.objectId,
					poi: poi
				});
			} else {
				poiPopup.close();
			}
		});
	};

	$scope.$on('leafletDirectiveMap.homemap.zoomstart', function (event, args) {
		if (args.leafletObject._animateToZoom < args.leafletObject._zoom) {
			zoomOut = true;
		}
	});

	$scope.$on('leafletDirectiveMap.homemap.zoomend', function (event, args) {
		if (!!zoomOut) {
			$scope.markers = angular.copy(markersCache._chargingPoints);
			zoomOut = false;
		}
	});
})

/*
 * Home POI list controller
 */
.controller('HomeListCtrl', function ($scope, $state) {
	$scope.entries = [
		{
			id: '1',
			title: 'Say my name',
			image: 'http://placekitten.com/500/300',
			typeImage: 'http://placekitten.com/100/110'
		},
		{
			id: '2',
			title: 'I am the danger',
			image: 'http://placehold.it/500x300',
			typeImage: 'http://placehold.it/100x110'
		}
	];

	$scope.openEntry = function (entry) {
		$state.go('app.entry', {
			id: entry.id,
			entry: entry
		});
	};
});
