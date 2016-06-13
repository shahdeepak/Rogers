/**
 * @ngdoc  object
 * @name rogersWeb.controller:checkoutCtrl
 * @requires $scope
 * @requires $location
 * @requires registrationService
 * @description Controller for checked out product.
 */
rogersWeb.controller('reviewCtrl', function($scope, $http, $location, $controller, registrationService) {
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
    $scope.sumTotal = 0;
    $scope.totalCart = 0;
    /**
     * @ngdoc method
     * @name rogersWeb.controllers:checkoutCtrl#getProductCount
     * @methodOf rogersWeb.controllers:checkoutCtrl
     * @description getProductCount from database
     * @description return sumtotal price of cart items.
     */
    $scope.getProductListDetails = function() {
        registrationService.getProductCount(sessionStorage.getItem('loggedInUser'), function(data) {
            if (data.length > 0) {
                $scope.disable = false;
                for (var i = 0; i < data.length; i++) {
                    $scope.cartItemList = data;
                    $scope.sumTotal += (data[i].productDetails.Quantity * data[i].productDetails.price);
                    $scope.totalCart += data[i].productDetails.Quantity;
                }
            } else {
                $scope.cartItemList = [];
            }
        }, function(error) {
            $scope.errorMessage = "error message" + error;
        });
    };
    if ($scope.isLoggedIn()) {
        $scope.getProductListDetails();
    };
    /**
     * @ngdoc method
     * @name rogersWeb.controllers:checkoutCtrl#confirmOrder
     * @methodOf rogersWeb.controllers:checkoutCtrl
     * @description Invoked on final submit of user
     */
    $scope.submitOrder = function() {
        $http(PAY_PAL_CONFIG).then(function(response) {
            sessionStorage.setItem("access_token", response.data.access_token);
            sessionStorage.setItem("token_type", response.data.token_type);
        }, function() {
            $scope.errorMessage = "error";
        });
        $location.path('/payment');
    };
    $scope.BackToShipping=function(){
        $location.path('/shipping');
    };
    /**
     * @ngdoc method
     * @name rogersWeb.controllers:checkoutCtrl#emit
     * @methodOf rogersWeb.controllers:checkoutCtrl
     * @param {object} event  - event
     * @param {object} arg  - arg
     * @description send message to other controller communication between controller This function is a sender function
     */
    $scope.$emit("showHide", {
        "pagelink": "Profile"
    });
    $scope.$emit("quantity");
});