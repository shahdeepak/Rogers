/*Created by Kumar Ankur on 14-04-2016. */
/**
 * @ngdoc  object
 * @name rogers.controller:registerCtrl
 * @requires $scope
 * @description Controller for registration screen.
 */
rogers.controller('registerCtrl', function($scope, registrationService, $location) {
    "use strict";
    var regUser;
    /**
     * @ngdoc method
     * @name rogers.controllers:registerCtrl#register
     * @methodOf rogers.controllers:registerCtrl
     * @param {object} newUser  - newUser
     * @description Insert/save user(new user) details into local storage.
     */
    $scope.register = function(newUser) {
        regUser = newUser;
        registrationService.getLoginDetails(newUser.email, function(result) {
            if (result) {
                $scope.message = 'User alredy exist!!!';
            } else {
                sessionStorage.setItem('loggedInUser', newUser.email);
                registrationService.saveRegistrationDetails(newUser, success, error);
            }
        }, function(result) {});
    };
    /**
     * @ngdoc method
     * @name rogers.controllers:registerCtrl#success
     * @methodOf rogers.controllers:registerCtrl
     * @description callback function:Success
     */
    function success() {
        sessionStorage.setItem('loggedInUser', regUser.email);
        $location.path('/home');
        return;
    };
    /**
     * @ngdoc method
     * @name rogers.controllers:registerCtrl#error
     * @methodOf rogers.controllers:registerCtrl
     * @description callback function:Error
     */
    function error() {}
});