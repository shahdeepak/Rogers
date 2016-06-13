/**
 * @ngdoc  object
 * @name rogersWeb.controller:checkoutCtrl
 * @requires $scope
 * @requires $location
 * @requires registrationService
 * @description Controller for checked out product.
 */
rogersWeb.controller('checkoutCtrl', function($scope, $rootScope, $http, $location, $controller, registrationService) {
    "use strict";
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
                $scope.disable = true;
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
     * @name rogersWeb.controllers:checkoutCtrl#removeItem
     * @methodOf rogersWeb.controllers:checkoutCtrl
     * @description remove Item from database
     */
    $scope.removeItem = function(data) {
        var obj = {
            "id": data.productDetails.id + sessionStorage.getItem('loggedInUser')
        };
        registrationService.removeItem(obj, function() {
            $scope.sumTotal = 0;
            $scope.totalCart = 0;
            $scope.getProductListDetails();
            $scope.getProductCount();
        }, function(data) {
            $scope.errorMessage = "error message" + data;
        });
    };
    /**
     * @ngdoc method
     * @name rogersWeb.controllers:checkoutCtrl#addCart
     * @methodOf rogersWeb.controllers:checkoutCtrl
     * @param {object} arg  - arg
     * @description invoke addProductToCart method from another controller using  $controller service
     * @creating new child scope using $scope.$new()
     */
    $scope.addCart = function(data) {
        var productData = {
            'email': sessionStorage.getItem('loggedInUser'),
            'productDetails': {
                "id": data.productDetails.id,
                "productName": data.productDetails.productName,
                "price": data.productDetails.price,
                "Quantity": 1
            }
        };
        addProductToCart(productData);
    };

    function addProductToCart(productData) {
        registrationService.addProductToCart(productData, function(data) {
            if (data.code) {
                data = {
                    id: data.op._id
                };
                updateProductToCart();
            } else {
                $scope.getProductCount();
            }
        }, function(error) {
            $scope.errorMessage = "error message" + error;
        });
    };

    function updateProductToCart() {
        registrationService.updateProductToCart(data, function() {
            $scope.getProductCount();
            $scope.totalCart = 0;
            $scope.getProductListDetails();
        }, function(error) {
            $scope.errorMessage = "error message" + error;
        });
    };
    /**
     * @ngdoc method
     * @name rogersWeb.controllers:checkoutCtrl#confirmOrder
     * @methodOf rogersWeb.controllers:checkoutCtrl
     * @description Invoked on final submit of user
     */
    $scope.confirmOrder = function() {
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