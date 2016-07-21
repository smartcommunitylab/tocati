angular.module('tocati.controllers.home', [])

.controller('AppCtrl', function ($scope, $state, $ionicHistory) {
	$scope.goTo = function (state, params, root) {
		if (!!root) {
			$ionicHistory.nextViewOptions({
				historyRoot: true
			});
		}

		$state.go(state, params);
	};
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

	$ionicModal.fromTemplateUrl('templates/home/typesModal.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function (modal) {
		$scope.typesModal = modal;
	});
})

.controller('HomeMapCtrl', function ($scope) {})

.controller('HomeListCtrl', function ($scope) {});
