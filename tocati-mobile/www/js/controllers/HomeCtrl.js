angular.module('tocati.controllers.home', [])

/*
 * App generic controller
 */
.controller('AppCtrl', function ($scope, $state, $ionicHistory, UserSrv, StorageSrv) {
	$scope.goTo = function (state, params, root) {
		if (!!root) {
			$ionicHistory.nextViewOptions({
				historyRoot: true
			});
		}

		$state.go(state, params);
	};

	$scope.login = function () {
		// FIXME dev only!
		UserSrv.userLogin('oscar', 'oscar', 'oscar', 'oscar').then(
			function (userData) {
				StorageSrv.saveUser(userData);
				UserSrv.setUser(userData);
			}
		);
	};

	// FIXME dev only user
	var user = StorageSrv.getUser();
	if (!!user) {
		UserSrv.setUser(user);
	}

	if (!StorageSrv.isTutorialDone()) {
		$scope.goTo('app.tutorial', {}, true);
	}
})

/*
 * Tutorial controller
 */
.controller('TutorialCtrl', function ($scope, $ionicSideMenuDelegate, StorageSrv) {
	// disable sidemenu
	$ionicSideMenuDelegate.canDragContent(false);
	// ion-slides options
	$scope.options = {};

	$scope.endTutorial = function () {
		StorageSrv.setTutorialDone();
		$scope.goTo('app.home', {}, true);
	};
})

/*
 * Home generic controller
 */
.controller('HomeCtrl', function ($scope, $ionicSideMenuDelegate, $ionicModal) {
	$scope.chargingPoints = {};

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

	$ionicModal.fromTemplateUrl('templates/typesModal.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function (modal) {
		$scope.typesModal = modal;
	});
})

/*
 * Home Map controller
 */
.controller('HomeMapCtrl', function ($scope, $timeout, Config, GraphicSrv, MapSrv, DataSrv) {
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
				markersCache.chargingPoints = {};

				angular.forEach(cpList, function (cp) {
					$scope.chargingPoints[cp.objectId] = cp;

					markersCache.chargingPoints[cp.objectId] = {
						lat: cp.coordinates[1],
						lng: cp.coordinates[0],
						name: cp.name,
						icon: GraphicSrv.getChargingPointMarkerIcon(),
						focus: false,
						draggable: false
					};

					$scope.markers = angular.copy(markersCache.chargingPoints);
				});
			},
			function (error) {
				// TODO handle errors
			}
		);
	};

	$scope.$on('leafletDirectiveMarker.homemap.click', function (event, args) {
		DataSrv.getPOIsByChargingPoint(args.modelName).then(
			function (pois) {
				markersCache[args.modelName] = {};

				angular.forEach(pois, function (poi) {
					markersCache[args.modelName][poi.objectId] = {
						lat: poi.coordinates[1],
						lng: poi.coordinates[0],
						name: poi.name,
						icon: GraphicSrv.getPoiMarkerIcon(poi.category),
						focus: false,
						draggable: false
					};

					$scope.markers = angular.copy(markersCache[args.modelName]);
					$scope.markers[args.modelName] = args.model;
				});
			}
		);
	});

	$scope.$on('leafletDirectiveMap.homemap.zoomstart', function (event, args) {
		if (args.leafletObject._animateToZoom < args.leafletObject._zoom) {
			zoomOut = true;
			//$scope.markers = angular.copy(markersCache.chargingPoints);
		}
	});

	$scope.$on('leafletDirectiveMap.homemap.zoomend', function (event, args) {
		if (!!zoomOut) {
			$scope.markers = angular.copy(markersCache.chargingPoints);
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
