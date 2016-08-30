angular.module('tocati.controllers.login', [])

.controller('LoginCtrl', function ($scope, $state, $ionicPopup, $filter, StorageSrv, UserSrv, DataSrv, LoginSrv, Utils) {

  $scope.user = {language: Utils.getLang()};

  $scope.login = function() {
    Utils.loading();
    LoginSrv.loginEVWay($scope.user).then(function(userData){
      Utils.loaded();
      StorageSrv.saveUser(userData);
      UserSrv.setUser(userData);
      StorageSrv.setTutorialDone();
      $scope.goTo('app.home', {}, true);
    }, function(err) {
      Utils.loaded();
      console.log('Login failure ' + err);
      $ionicPopup.alert({
        title: $filter('translate')('error_popup_title'),
        template: $filter('translate')('error_signin'),
        okType: 'button-energized'
      });
    });
  };

  $scope.register = function() {
    $state.go('app.register');
  }

})

.controller('RegisterCtrl', function ($scope, $state, $ionicPopup, $filter, StorageSrv, UserSrv, DataSrv, LoginSrv, Utils) {

  $scope.user = {language: Utils.getLang()};

  $scope.register = function() {
    if (!checkParams()) return;

    Utils.loading();
    LoginSrv.registerEVWay($scope.user).then(function(userData){
      Utils.loaded();
      StorageSrv.saveUser(userData);
      UserSrv.setUser(userData);
      StorageSrv.setTutorialDone();
      $scope.goTo('app.home', {}, true);
    }, function(err) {
      Utils.loaded();
      console.log('Register failure ' + err);
      $ionicPopup.alert({
        title: $filter('translate')('error_popup_title'),
        template: $filter('translate')('error_generic'),
        okType: 'button-energized'
      });
    });
  };

  function checkParams() {
        if (!$scope.user.name) {
            Utils.toast($filter('translate')('registration_empty_name'), "short", "bottom");
            return false;
        }
        if (!$scope.user.surname) {
            Utils.toast($filter('translate')('registration_empty_surname'), "short", "bottom");
            return false;
        }
        if (!$scope.user.email) {
            Utils.toast($filter('translate')('registration_empty_mail'), "short", "bottom");
            return false;
        }
        if (!$scope.user.password || $scope.user.password.length < 6) {
            Utils.toast($filter('translate')('error_password_short'), "short", "bottom");
            return false;
        }
        return true;
        console.log(JSON.stringify($scope.user));
    }
})
