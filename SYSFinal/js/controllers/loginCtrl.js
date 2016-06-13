/*Created by Hemant Motwani on 14-04-2016. */
/**
 * @ngdoc  object
 * @name rogers.controller:loginCtrl
 * @requires $scope
 * @requires registrationService
 * @requires $location
 * @requires $rootScope
 * @description Controller for login screen.
 */
rogers.controller('loginCtrl', function($scope, $location, $rootScope, registrationService) {
    "use strict";
    /**
     * @ngdoc method
     * @name rogers.controllers:loginCtrl#login
     * @methodOf rogers.controllers:loginCtrl
     * @param {object} loginCred  - loginCred
     * @description Invokes login method of parent by passing user credentials.
     */
    $scope.login = function(loginCred) {
        //@description Get login details from localStorage
        registrationService.getLoginDetails(loginCred.username,
            function(loginData) {
                if (loginData) {
                    if (loginCred.username === loginData.email && loginCred.password === loginData.password) {
                        $scope.username = loginCred.username;
                        sessionStorage.setItem('loggedInUser', loginCred.username);
                        $location.path('/home');
                        $rootScope.isLoggedIn = true;
                    } else {
                        $scope.message = 'Invalid Username/Password';
                    }
                } else {
                    $scope.message = 'User does not exist.Please register';
                }
            },
            function(data) {});
    };
    /**
     * @ngdoc method
     * @name rogers.controllers:loginCtrl#redirectToRegPage
     * @methodOf rogers.controllers:loginCtrl
     * @description Redirect to registration page.
     */
    $scope.redirectToRegPage = function() {
        $location.path('/registration');
    };
});