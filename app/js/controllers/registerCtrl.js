/*Created by Deepak.Shah on 18-03-2016. */
/**
 * @ngdoc  object
 * @name rogersWeb.controller:registerCtrl
 * @requires $scope
 * @description Controller for registration screen.
 */
rogersWeb.controller('registerCtrl', function($scope, registrationService, $location, encryption) {
    "use strict";
    /**
     * @ngdoc method
     * @name rogersWeb.controllers:registerCtrl#register
     * @methodOf rogersWeb.controllers:registerCtrl
     * @param {object} newUser  - newUser
     * @description Insert/save user(new user) details into local storage.
     */
    $scope.register = function(newUser) {
        registrationService.getLoginDetails(newUser.email, function(result) {
            if (result) {
                $scope.message = 'User already exist';
            } else {
                sessionStorage.setItem('loggedInUser', newUser.email);
                var userRegDetails = {
                    "email": newUser.email,
                    "password":encryption.toEncodeString(newUser.password),
                    "dateOfBirth":newUser.dateOfBirth,
                    "contact":newUser.contact
                };
                registrationService.saveRegistrationDetails(userRegDetails, success, error);
            }
        }, function(error) {
            $scope.errorMessage = "error message" + error;
        });
    };
    /**
     * @ngdoc method
     * @name rogersWeb.controllers:registerCtrl#success
     * @methodOf rogersWeb.controllers:registerCtrl
     * @description callback function:Success
     */
    function success() {
        $location.path('/login');
        return;
    };
    /**
     * @ngdoc method
     * @name rogersWeb.controllers:registerCtrl#error
     * @methodOf rogersWeb.controllers:registerCtrl
     * @description callback function:Error
     */
    function error() {
        $scope.errorMessage = "error in function";
    }
    $scope.dt = new Date();
    
    $scope.logingin=function(){
        $location.path('/login');
    }
        
});