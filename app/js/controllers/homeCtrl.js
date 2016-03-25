/*Created by Deepak.Shah on 18-03-2016. */
/**
 * @ngdoc  object
 * @name rogersWeb.controller:landingCtrl
 * @requires $scope
 * @requires $location
 * @requires $rootScope
 * @description Controller for home landing screen.
 */

rogersWeb.controller('homeCtrl', function ($scope,homeService,$http) {
    "use strict";
       /**
     * @ngdoc method
     * @name rogersWeb.controllers:loginCtrl#login
     * @methodOf rogersWeb.controllers:loginCtrl
     * @description Invokes login method of parent by passing user credentials.
     */
    $scope.check = function () {
        
        homeService.getMobileDetal(function (data) {
         $scope.phones = data.getProduct();
            
        }, function (data) {
          
        });
    };  
    $scope.check();
});