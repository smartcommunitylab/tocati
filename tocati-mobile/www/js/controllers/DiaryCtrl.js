angular.module('tocati.controllers.diary', [])

.controller('DiaryCtrl', function ($scope) {})

.controller('DiaryPointsCtrl', function ($scope) {})

.controller('DiaryRankingCtrl', function ($scope, $ionicScrollDelegate, BackendSrv) {
	var me = BackendSrv.getUser();
	$scope.displayName = me['displayName'];
	$scope.myposition = null;
	$scope.mypoints = null;

	$scope.ranking = [];
	/* Resize ion-scroll */
	$scope.rankingStyle = {};

	var generateRankingStyle = function () {
		// header 44, tabs 49, listheader 44, my ranking 48
		$scope.rankingStyle = {
			'height': window.innerHeight - (44 + 49 + 44 + 48) + 'px'
		};
		$ionicScrollDelegate.$getByHandle('rankingScroll').resize();
	};

	generateRankingStyle();

	/* Populate ranking */
	BackendSrv.getRanking(me['userId']).then(
		function (myranking) {
			$scope.myposition = myranking.position;
			$scope.mypoints = myranking.points;
			$scope.ranking = myranking.ranking;
		}
	);
});
