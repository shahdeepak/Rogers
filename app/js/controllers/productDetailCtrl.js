/*Created by Priti.Mondol on 27-04-2016. */
/**
 * @ngdoc  object
 * @name rogersWeb.controller:productDetailCtrl
 * @requires $scope
 * @description Controller for product details page.
 */
rogersWeb.controller('productDetailCtrl', function($scope, $http, registrationService, $location) {
    "use strict";
    var email = sessionStorage.getItem('loggedInUser');
    $scope.imgs = [];
    $scope.features = [];
    $scope.flag = false;
    $scope.detail = "";
    $scope.product = JSON.parse(sessionStorage.product);
    $scope.imgs = $scope.product.imgs;
    $scope.imagesrc = $scope.imgs[0].url;
    $scope.features = $scope.product.features;
    $scope.imgIcon = true;
    $scope.imagesource = "./images/plus.png";
    $scope.showImage = function(path) {
        $scope.imagesrc = path;
    };
    $scope.showDiv = function(ind) {
        $scope.name = $scope.features[ind].name;
        $scope.detail = $scope.features[ind].details;
        $scope.flag = true;
    };
    /**
     * @ngdoc method
     * @name rogersWeb.controllers:cartCtrl#addProductToCart
     * @methodOf rogersWeb.controllers:cartCtrl
     * @param {int} id  - id of product
     * @param {string} nameOfProduct  - product name
     * @param {float} price  - price of product
     * @description Add product to cart(basket).
     */
    $scope.addProductToCart = function(product) {
        var productData = {
            'email': email,
            'productDetails': {
                "id": product.id,
                "productName": product.productName,
                "price": product.productPrice,
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
                }, function(error) {
                    $scope.errorMessage = "error message" + error;
                });
            } else {
                $scope.getProductCount();
            }
        }, function(error) {
            $scope.errorMessage = "error message" + error;
        });
        $location.path('/shipping');
    };
    /*show imageIcon in icon bar*/
    $scope.showBar = function() {
        $scope.imgIcon = !$scope.imgIcon;
        if ($scope.imgIcon)
            $scope.imagesource = "./images/plus.png";
        else
            $scope.imagesource = "./images/minus.png";
    };
   $scope.rate = 7;
  $scope.max = 10;
  $scope.isReadonly = false;

  $scope.hoveringOver = function(value) {
    $scope.overStar = value;
    $scope.percent = 100 * (value / $scope.max);
  };

  $scope.ratingStates = [
    {stateOn: './images/high_rating.png', stateOff: './images/Low_rating.png'}    
  ];
});