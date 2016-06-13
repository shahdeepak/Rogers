/*Created by Kumar Ankur on 19-04-2016. */
/**
 * @ngdoc  object
 * @name rogers.controller:personalCtrl
 * @requires $scope
 * @description Controller for personal information screen.
 */
rogers.controller('personalCtrl', function($scope, registrationService, personalService, $window, $location) {
    "use strict";
    var regUser;
    $scope.condition = true;
    /**
     * @ngdoc method
     * @name rogers.controllers:personalCtrl#register
     * @methodOf rogers.controllers:personalCtrl
     * @param {object} newUser  - newUser
     * @description Insert/save user(new user) details into data base.
     */
    $scope.register = function(newUser) {
        var email = sessionStorage.getItem('loggedInUser');
        registrationService.getLoginDetails(email, function(result) {
            if (result) {
                $scope.userDetails = result;
               // console.log(result);
               // $scope.submitCartEvent(event);
            } else {}
        }, function(result) {});
    };
    $scope.register();
    
    /**
     * @ngdoc method
     * @name rogers.controllers:personalCtrl#update
     * @methodOf rogers.controllers:personalCtrl
     * @description update data of service address.
     */
    $scope.update = function(userDetails) {
        registrationService.setUserDetails(userDetails, function(result) {
            if (result) {
                $scope.userDetails = result;
                $scope.submitCartEvent(event);
                $scope.paypal();
            } else {}
        }, function(result) {});
    };
    /**
     * @ngdoc method
     * @name rogers.controllers:personalCtrl#paypal
     * @methodOf rogers.controllers:personalCtrl
     * @description Function to save access token and token type into session storage during paypal.
     */
    
     $scope.submitCartEvent=function(event)
    {
        console.log($scope.userDetails.config.data);
        ga('send', 'event','click',{'eventValue' : "Name: "+$scope.userDetails.config.data.firstName+", "+
                                   "Email: "+$scope.userDetails.config.data.email+", "+
                                   "Contact Number: "+$scope.userDetails.config.data.contact+", "+
                                   "Address: "+$scope.userDetails.config.data.Address});        
    };
    
    
    $scope.paypal = function() {
        personalService.savePayPalDetails(function(result) {
            if (result) {
                console.log(result.data.access_token);
                $scope.accessDetails = result;
                sessionStorage.setItem("access_token", result.data.access_token);
                sessionStorage.setItem("token_type", result.data.token_type);
            } else {
                console.log("access token not found");
            }
        }, function(result) {});
        $location.path('/card');
    };
    /**
     * @ngdoc method
     * @name rogers.controllers:personalCtrl#editable
     * @methodOf rogers.controllers:personalCtrl
     * @description Function used to edit data of login user.
     */
    $scope.editable = function() {
        $scope.condition = false;
    }
});