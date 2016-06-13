/*Created by Deepak.Shah on 18-03-2016. */
/**
 * @ngdoc  object
 * @name rogersWeb.controller:homeCtrl
 * @requires $scope
 * @requires $rootScope
 * @description Controller for home landing screen.
 */
rogersWeb.controller('homeCtrl', function($scope, $http, $location, homeService, registrationService) {
    "use strict";
    var email = sessionStorage.getItem('loggedInUser');
    /**
     * @ngdoc method
     * @name rogersWeb.controllers:homeCtrl#emit
     * @methodOf rogersWeb.controllers:homeCtrl
     * @param {object} event  - event
     * @param {object} arg  - arg
     * @description send message to other controller communication between controller This function is a sender function
     */
    $scope.$emit("showHide", {
        "pagelink": "Profile"
    });
    $scope.RPath = function() {
        if ($scope.isLoggedIn()) {
            $location.path('/cart');
        };
    };
    /**
     * @ngdoc method
     * @name rogersWeb.controllers:homeCtrl#getProductCount
     * @methodOf rogersWeb.controllers:homeCtrl
     * @description getProductCount from database
     */
    $scope.getProductCount = function() {
        registrationService.getProductCount(email, function(data) {
            $scope.qty = 0;
            for (var i = 0; i < data.length; i++) {
                $scope.qty += data[i].productDetails.Quantity;
            }
            $scope.$emit("quantity");
        }, function(error) {
            $scope.errorMessage = "error message" + error;
        });
    };
    if ($scope.isLoggedIn()) {
        $scope.getProductCount();
    }
    $scope.redirectToDetail = function(product) {
        sessionStorage.setItem('product', JSON.stringify(product));
        $location.path('/productDetails');
    };
    /**
     * @ngdoc method
     * @name rogersWeb.controllers:cartCtrl
     * @service registrationService
     * @description get product list from database.
     */
    $scope.getProducts = function() {
        registrationService.getProduct(successFun, failureFun);

        function successFun(result) {
            $scope.products = result;
        };

        function failureFun() {
            $scope.message = "Error";
        };
    };
    $scope.getProducts();
    /**
     * @ngdoc method
     * @name rogersWeb.controllers:cartCtrl#addProductToCart
     * @methodOf rogersWeb.controllers:cartCtrl
     * @param {int} id  - id of product
     * @param {string} nameOfProduct  - product name
     * @param {float} price  - price of product
     * @description Add product to cart(basket).
     */
    $scope.addProductToCart = function(value) {
        $scope.$emit("spinner", {
            "flag": true
        });
        var productData = {
            'email': email,
            'productDetails': {
                "id": value.id,
                "productName": value.productName,
                "price": value.productPrice,
                "Quantity": 1
            }
        };
        registrationService.addProductToCart(productData, function(data) {
            if (data.code) {
                data = {
                    id: data.op._id
                };
                registrationService.updateProductToCart(data, function() {
                    $scope.getProductCount();
                    $scope.$emit("spinner", {
                        "flag": false
                    });
                }, function(error) {
                    $scope.errorMessage = "error message" + error;
                    $scope.$emit("spinner", {
                        "flag": false
                    });
                });
            } else {
                $scope.getProductCount();
                $scope.$emit("spinner", {
                    "flag": false
                });
            }
        }, function(error) {
            $scope.errorMessage = "error message" + error;
            $scope.$emit("spinner", {
                "flag": false
            });
        });
    };
    /*   click function for aboutus */
    $scope.aboutUsClicked = function() {
        $location.path('/aboutUs');
    };
    /**
     * @ngdoc method
     * @name rogersWeb.controllers:cartCtrl#setCurrentSlideIndex, isCurrentSlideIndex, prevSlide, nextSlide
     * @methodOf rogersWeb.controllers:cartCtrl
     * @description used for swiping image on mobile view.
     */
    $scope.direction = 'left';
    $scope.currentIndex = 0;
    $scope.setCurrentSlideIndex = function(index) {
        $scope.direction = (index > $scope.currentIndex) ? 'left' : 'right';
        $scope.currentIndex = index;
    };
    $scope.isCurrentSlideIndex = function(index) {
        return $scope.currentIndex === index;
    };
    $scope.prevSlide = function() {
        $scope.direction = 'left';
        $scope.currentIndex = ($scope.currentIndex < $scope.products.length - 1) ? ++$scope.currentIndex : 0;
    };
    $scope.nextSlide = function() {
        $scope.direction = 'right';
        $scope.currentIndex = ($scope.currentIndex > 0) ? --$scope.currentIndex : $scope.products.length - 1;
    };
});