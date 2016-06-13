/*Created by Deepak.Shah on 18-03-2016. */
/**
 * @ngdoc  object
 * @name rogersWeb.controller:registerCtrl
 * @requires $scope
 * @description Controller for registration screen.
 */
rogersWeb.controller('registerCtrl', function($scope, registrationService, $location) {
    "use strict";
    $scope.email='';$scope.password='';
    $scope.dateOfBirth='';$scope.password='';$scope.confirmpassword='';
    /**
     * @ngdoc method
     * @name rogersWeb.controllers:registerCtrl#register
     * @methodOf rogersWeb.controllers:registerCtrl
     * @param {object} newUser  - newUser
     * @description Insert/save user(new user) details into local storage.
     */
    $scope.register = function() {
        registrationService.getLoginDetails($scope.email, function(result) {
            if (result.password !== undefined && result.password.length > 1) {
                $scope.message = 'User already exist';
            } else {
                sessionStorage.setItem('loggedInUser', $scope.email);
                var userRegDetails = {
                    "email": $scope.email,
                    "password": $scope.password,
                    "dateOfBirth": $scope.dateOfBirth,
                    "contact": $scope.contact
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
        $location.path('/home');
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
    };
    $scope.dt = new Date();
    $scope.logingin = function() {
        $location.path('/login');
    };
    $scope.matchPassword=function(){
        if($scope.password !== $scope.confirmpassword){
             $scope.message = "Password field not matched with confirm password";
        }
    };
});