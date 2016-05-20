var uniqueItems = function (data, key) {
    var result = [];
    
    for (var i = 0; i < data.length; i++) {
        var value = data[i][key];
 
        if (result.indexOf(value) == -1) {
            result.push(value);
        }
    
    }
    return result;
};

/**
 * @ngdoc  object
 * @name rogersWeb.controller:cartCtrl
 * @requires $scope
 * @requires $location
 * @description Controller for add product to cart.
 */
rogersWeb.controller('cartCtrl', function($scope, $location, registrationService,filterFilter,$http) {
    "use strict";
    $scope.useprice = {};
    $scope.useCatagory = {};
    $scope.useSize = {};
    $scope.cart=[];
    $scope.range=[];
    var email = sessionStorage.getItem('loggedInUser');
    
    /**
     * @ngdoc method
     * @name rogersWeb.controllers:cartCtrl
     * @service $http
     * @description get product list from database.
     */
    registrationService.getProduct(successFun, failureFun);
    function successFun(result) {
        $scope.cart = result;
    };
    
    function failureFun() {
        $scope.message = "Error";
    };
     // Watch the price that are selected
    $scope.$watch(function () {
        return {
            cart: $scope.cart,
            usePrice: $scope.useprice,
            useCatagory: $scope.useCatagory,
            useSize: $scope.useSize
        }
    }, function (value) {
        var selected;
        
        $scope.count = function (prop, value) {
            return function (el) {
                return el[prop] == value;
            };
        };
        
        $scope.priceGroup = uniqueItems($scope.cart, 'productPrice');
        var filterAfterprice = [];        
        selected = false;
        for (var j in $scope.cart) {
            var p = $scope.cart[j];
            for (var i in $scope.useprice) {
                if ($scope.useprice[i]) {
                    selected = true;
                    if ((p.productPrice >= $scope.range[i].minValue)
                        &&($scope.range[i].maxValue >= p.productPrice)) {
                        filterAfterprice.push(p);
                        break;
                    }
                }
            }        
        }
        if (!selected) {
            filterAfterprice = $scope.cart;
        }
        $scope.filteredcart = filterAfterprice; 
        }, true);
    
        $scope.$watch('filtered', function (newValue) {
        if (angular.isArray(newValue)) {
            console.log(newValue.length);
        }
    }, true); 
    
$http.get('json/range.json').success(function(data) {
        $scope.range = data;
    });
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
        var productData = {
            'email': email,
            'productDetails': {
                "id": value.id,
                "productName": value.productName,
                "price": value.productPrice,
                "Quantity": 1
            }
        }
        registrationService.addProductToCart(productData, function(data) {
            if (data.code) {
                data = {
                    id: data.op._id
                }
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
    };
    $scope.$emit("showHide", {
        "pagelink": "profile"
    });
    $scope.$emit("quantity");
    /*redirecting to phone Details page*/
    $scope.redirectToDetail = function() {
        $location.path('/productDetails');
    };
});

rogersWeb.filter('count', function() {
    return function(collection, key) {
      var out = "test";
      for (var i = 0; i < collection.length; i++) {
          //console.log(collection[i].price);
          //var out = myApp.filter('filter')(collection[i].price, "42", true);
      }
      return out;
    }
});


rogersWeb.filter('groupBy',
            function () {
                return function (collection, key) {
                    if (collection === null) return;
                    return uniqueItems(collection, key);
        };
    });
/*rogersWeb.filter('unique', function() {
   return function(collection, keyname) {
      var output = [], 
          keys = [];

      angular.forEach(collection, function(item) {
          var key = item[keyname];
          if(keys.indexOf(key) === -1) {
              keys.push(key);
              output.push(item);
          }
      });
      return output;
   };
});*/