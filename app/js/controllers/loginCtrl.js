/*Created by Deepak.Shah on 18-03-2016. */
/**
 * @ngdoc  object
 * @name rogersWeb.controller:loginCtrl
 * @requires $scope
 * @requires loginService
 * @requires $location
 * @requires isLoggedIn
 * @description Controller for login screen.
 */
rogersWeb.controller('loginCtrl', function($scope, $location, registrationService) {
    "use strict";
    /**
     * @ngdoc method
     * @name rogersWeb.controllers:loginCtrl#login
     * @methodOf rogersWeb.controllers:loginCtrl
     * @param {object} loginCred  - loginCred
     * @description Invokes login method of parent by passing user credentials.
     */
    $scope.login = function(loginCred) {
        //@description Get login details from localStorage
        registrationService.getLoginDetails(loginCred.username,
            function(loginData) {
                if (loginData) {
                    if (loginCred.password === loginData.password) {
                        $scope.username = loginCred.username;
                        sessionStorage.setItem('loggedInUser', loginCred.username);
                        $scope.loggedIn();
                        $location.path('/home');
                    } else {
                        $scope.message = 'Invalid Username/Password or Not a register user';
                    }
                } else {
                    $scope.message = 'User does not exist.Please register';
                }
            },
            function(error) {
                $scope.errorMessage = "error message" + error;
            });
    };
    /**
     * @ngdoc method
     * @name rogersWeb.controllers:loginCtrl#redirectToRegPage
     * @methodOf rogersWeb.controllers:loginCtrl
     * @description Redirect to registration page.
     */
    $scope.redirectToRegPage = function() {
        $location.path('/registration');
    };
});