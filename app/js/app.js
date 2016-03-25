
var rogersWeb = angular.module('rogersWeb', ['ngRoute']);
rogersWeb.config(['$routeProvider',function($routeProvider) {
    $routeProvider.
      when('/phones', {
        templateUrl: './views/phone-list.html',
        controller: 'homeCtrl'
      }).
      when('/phones/:phoneId', {
        templateUrl: './views/phone-detail.html',
        controller: 'PhoneDetailCtrl'
      }).
      otherwise({
        redirectTo: '/phones'
      });
  }]);
