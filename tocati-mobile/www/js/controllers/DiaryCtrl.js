angular.module('tocati.controllers.diary', [])

.controller('DiaryCtrl', function ($scope, UserSrv, DataSrv) {
	$scope.myUserId = UserSrv.getUser()['userId'];
	$scope.myDisplayName = UserSrv.getUser()['displayName'];
	$scope.me = {
		position: null,
		points: 0
	};

	$scope.ranking = [];

	/* Populate ranking */
	DataSrv.getRanking().then(
		function (myranking) {
			$scope.me.position = myranking.position;
			$scope.me.points = myranking.points;
			$scope.ranking = myranking.ranking;

			angular.forEach($scope.ranking, function (rankingUser) {
				if (rankingUser.data.userId == $scope.myUserId) {
					$scope.me.data = rankingUser.data;
				}
			});
		}
	);
})

.controller('DiaryPointsCtrl', function ($scope, $ionicScrollDelegate, GraphicSrv) {
	/* Resize ion-scroll */
	$scope.pointsStyle = {};

	var generatePointsStyle = function () {
		// header 44, tabs 49, listheader 44, my ranking 48
		$scope.pointsStyle = {
			'height': window.innerHeight - (44 + 49 + 44) + 'px'
		};
		$ionicScrollDelegate.$getByHandle('pointsScroll').resize();
	};

	generatePointsStyle();

	$scope.getPoiStyle = function (poi) {
		return {
			'background-color': GraphicSrv.getPoiColor(poi.category),
			'background-image': 'url(' + GraphicSrv.getPoiIconW(poi.category) + ')'
		};
	};
})

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
