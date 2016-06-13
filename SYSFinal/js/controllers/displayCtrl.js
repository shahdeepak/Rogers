/*Created by Hemant Motwani on 18-04-2016. */
/**
 * @ngdoc  object
 * @name rogers.controller:displayCtrl
 * @requires $scope
 * @requires $location
 * @description Controller for search screen.
 */
rogers.controller('displayCtrl', function($scope, $rootScope, $location, displayService) {
    "use strict";
    $scope.count = 0;
    $scope.totalBuy = [];
    $scope.productDetails = {};
    $scope.totalCost = 0;
    /**
     * @ngdoc method
     * @name rogers.controllers:displayCtrl#addCart
     * @methodOf rogers.controllers:displayCtrl
     * @description Function to add items to cart
     */
    $scope.addCart = function(email, charge, description, availableDays, index) {
        $scope.item = 0;
        if ($scope.count === 0) {
            $scope.productDetails = {
                "email": email,
                "charge": charge,
                "description": description,
                "availableDays": availableDays
            };
            $scope.totalBuy.push($scope.productDetails);
        }
        if ($scope.count >= 1) {
            for (var i = 0; i < $scope.totalBuy.length; i++) {
                if ($scope.totalBuy[i].email === email) {
                    $scope.totalBuy[i].Quantity = $scope.totalBuy[i].Quantity + 1;
                    $scope.item = 1;
                    break;
                }
            }
            if ($scope.item === 0) {
                $scope.productDetails = {
                    "email": email,
                    "charge": charge,
                    "description": description,
                    "availableDays": availableDays
                };
                $scope.totalBuy.push($scope.productDetails);
            }
        }
        $scope.count++;
        var addToCartData = {
            "loggedEmail": sessionStorage.getItem("loggedInUser"),
            "totalBuy": {
                "email": email,
                "charge": charge,
                "description": description,
                "availableDays": availableDays
            }
        };
        if ($scope.count > 1) {
            if ($rootScope.cartData) {
                for (var j = 0; j < $rootScope.cartData.length; j++) {
                    $scope.totalCost = $scope.totalCost + $rootScope.cartData[j].totalBuy.charge;
                }
            }
        }
        sessionStorage.setItem("cartItem", JSON.stringify($scope.totalBuy));
        $scope.callService(addToCartData);
        $scope.disable(index);
    };
    /**
     * @ngdoc  object
     * @name rogers.controller:displayCtrl
     * @requires $scope
     * @requires $location
     * @description call function to the displayService.
     */
    $scope.removeItemfromCart = function(serviceEmail) {
        var data = {
            id: (sessionStorage.getItem("loggedInUser")) + serviceEmail
        };
        displayService.removeCartDetails(data, function(result) {
            if (result) {
                $rootScope.displayCart();
            } else {}
        }, function(result) {});
    };
    /**
     * @ngdoc  object
     * @name rogers.controller:displayCtrl
     * @requires $scope
     * @requires $location
     * @description For locking the button.
     */
    $scope.condition = [];
    $scope.disable = function(index) {
        $scope.condition[index] = true;
    };
    /**
     * @ngdoc  object
     * @name rogers.controller:displayCtrl
     * @requires $scope
     * @requires $location
     * @description call function to the displayService.
     */
    $scope.callService = function(addToCartData) {
        displayService.saveCartDetails(addToCartData, function(result) {
            if (result) {} else {}
        }, function(result) {});
    };
    
    $scope.submitEvent = function(event) {
        for(var i=0; i< $rootScope.cartData.length; i++)   //send data to google analytics fetched from DB.
       ga('send', 'event','click',{'eventValue' : "Email: "+$rootScope.cartData[i].totalBuy.email+", Charge: "+$rootScope.cartData[i].totalBuy.charge+", Description: "+ $rootScope.cartData[i].totalBuy.description+ ", AvailableDays: "+ $rootScope.cartData[i].totalBuy.availableDays});        
    };
    /**
     * @ngdoc method
     * @name rogersWeb.controllers:displayCtrl#success
     * @methodOf rogersWeb.controllers:displayCtrl
     * @description callback function:Success
     */
    $scope.setChat = function(email){
        var chatData = {
        loggedEmail:sessionStorage.getItem("loggedInUser"),
        serviceUser:email
        };
        displayService.setChat(chatData, function(result) {
            if (result) {} else {}
        }, function(result) {});
};
    /**
     * @ngdoc method
     * @name rogersWeb.controllers:displayCtrl#success
     * @methodOf rogersWeb.controllers:displayCtrl
     * @description callback function:Success
     */
    function success() {
        return;
    };
    /**
     * @ngdoc method
     * @name rogersWeb.controllers:displayCtrl#error
     * @methodOf rogersWeb.controllers:displayCtrl
     * @description callback function:Error
     */
    function error() {}
});