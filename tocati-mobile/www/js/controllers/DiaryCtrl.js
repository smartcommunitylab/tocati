angular.module('tocati.controllers.diary', [])

.controller('DiaryCtrl', function ($scope, UserSrv, DataSrv) {
	$scope.myDisplayName = UserSrv.getUser()['displayName'];
	$scope.myPosition = null;
	$scope.myPoints = 0;

	$scope.ranking = [];

	/* Populate ranking */
	DataSrv.getRanking().then(
		function (myranking) {
			$scope.myPosition = myranking.position;
			$scope.myPoints = myranking.points;
			$scope.ranking = myranking.ranking;
		}
	);
})

.controller('DiaryPointsCtrl', function ($scope) {})

.controller('DiaryRankingCtrl', function ($scope, $ionicScrollDelegate) {
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
});
