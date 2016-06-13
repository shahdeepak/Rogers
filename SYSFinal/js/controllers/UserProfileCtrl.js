/*Created by Kumar Ankur on 19-04-2016. */
/**
 * @ngdoc  object
 * @name rogers.controller:UserProfileCtrl
 * @requires $scope
 * @requires profileService
 * @description Controller for personal information screen.
 */
rogers.controller('UserProfileCtrl', function($scope, profileService) {
    "use strict";
    var regUser;
    /**
     * @ngdoc method
     * @name rogers.controllers:UserProfileCtrl#register
     * @methodOf roger.controllers:UserProfileCtrl
     * @param {object} newUser  - newUser
     * @description Insert/save user(new user) details into data base.
     */
    $scope.register = function(newUser) {
        var email = sessionStorage.getItem('loggedInUser');
        profileService.getUserHobby(email, function(result) {
            if (result) {
                $scope.user = result;
            } else {}
        }, function(result) {});
    };
    $scope.register();
    /**
     * @ngdoc method
     * @name rogers.controllers:UserProfileCtrl#update
     * @methodOf rogers.controllers:UserProfileCtrl
     * @description functiom to update user detail into the database.
     */
    $scope.update = function(user) {
        profileService.setUpdateAddDetails(user, function(result) {
            if (result) {
                $scope.user = result;
            } else {}
        }, function(result) {});
    };
});