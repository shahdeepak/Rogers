/*Created by Deepak.Shah on 18-03-2016. */
/**
 * @ngdoc  object
 * @name rogersWeb.controller:shippingCtrl
 * @requires $scope
 * @requires $location
 * @description Controller for Shipping address screen.
 */
rogersWeb.controller('shippingCtrl', function($scope, $location, registrationService) {
    "use strict";
    $scope.email = sessionStorage.getItem('loggedInUser');
    /**
     * @ngdoc method
     * @name rogersWeb.controllers:shippingCtrl#getShippingDetails
     * @methodOf rogersWeb.controllers:shippingCtrl
     * @description Bringing logged in user data from server by taking user valid email address.
     */
    function getShippingDetails() {
        registrationService.getShippingDetails($scope.email, function(result) {
            $scope.result = result.data;
            $scope.userDetails = result.data[0];
        }, function() {
            $scope.message = "Error";
        });
    }
    getShippingDetails();
    /**
     * @ngdoc method
     * @name rogersWeb.controllers:shippingCtrl#shippingDetails
     * @methodOf rogersWeb.controllers:shippingCtrl
     * @param {object} shippingDetails  - arg
     * @description submit shipping details of user to database
     */
    $scope.submitShippingDetails = function(userDetails) {
        var details = {
            "email": $scope.email,
            "address": userDetails.address,
            "country": userDetails.country,
            "state": userDetails.state,
            "contact": userDetails.contact,
            "city": userDetails.city
        };
        postShippingDetails(details);
    };
    function postShippingDetails(details) {
        if ($scope.result.length > 0) {
            registrationService.updateShippingDetails(details, success, error);
        } else {
            if ($scope.result.length === 0) {
                registrationService.saveShippingDetails(details, function(){
                    $location.path('/review');
                }, function(data){
                    $scope.errorMessage = "error message" + data;
                });
            }
        }
    };

    function success() {
        $location.path('/review');
    };

    function error(data) {
        $scope.errorMessage = "error message" + data;
    };
    /**
     * @ngdoc method
     * @name rogersWeb.controllers:shippingCtrl#emit
     * @methodOf rogersWeb.controllers:shippingCtrl
     * @param {object} event  - event
     * @param {object} arg  - arg
     * @description send message to other controller communication between controller This function is a sender function
     */
    $scope.$emit("showHide", {
        "pagelink": "Profile"
    });
    $scope.$emit("quantity");
});