angular.module('tocati.controllers.home', [])

.controller('AppCtrl', function ($scope, $state, $ionicHistory, BackendSrv, StorageSrv) {
	$scope.goTo = function (state, params, root) {
		if (!!root) {
			$ionicHistory.nextViewOptions({
				historyRoot: true
			});
		}

		$state.go(state, params);
	};

	$scope.login = function () {
		BackendSrv.userLogin('oskarnrk', 'Oscar', 'Zambotti', 'OskarNRK').then(
			function (userData) {
				StorageSrv.saveUser(userData);
				BackendSrv.setUser(userData);
			}
		);
	};

	// FIXME dev only user
	var user = StorageSrv.getUser();
	if (!!user) {
		BackendSrv.setUser(user);
	}
})

.controller('TutorialCtrl', function ($scope, $ionicSideMenuDelegate) {
	// disable sidemenu
	$ionicSideMenuDelegate.canDragContent(false);
	// ion-slides options
	$scope.options = {};
})

.controller('HomeCtrl', function ($scope, $ionicSideMenuDelegate, $ionicModal) {
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

.controller('HomeMapCtrl', function ($scope, Config, MapSrv) {
	angular.extend($scope, {
		center: Config.MAP_DEFAULT_CENTER,
		markers: [],
		events: {}
	});

	$scope.initMap = function () {
		MapSrv.initMap('home-map').then(function (map) {
			// FIXME on development only
			MapSrv.centerOnMe('home-map');
		});
	};
})

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
