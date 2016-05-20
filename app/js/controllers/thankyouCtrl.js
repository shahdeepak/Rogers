/**
 * @ngdoc  object
 * @name rogersWeb.controller:thankyouCtrl
 * @requires $scope
 * @requires $location
 * @requires randomString
 * @requires registrationService
 * @description Controller.
 */
rogersWeb.controller('thankyouCtrl', function($scope, $location, randomString, registrationService) {
    "use strict";
    $scope.referenceNumber = randomString.randomString(10);
    $scope.message = "If you request assistance and would like a response from us , please include your name and email address.";
    $scope.sumTotal = 0;
    $scope.totalCart = 0;
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("token_type");
    /**
     * @ngdoc method
     * @name rogersWeb.controllers:thankyouCtrl#getProductCount
     * @methodOf rogersWeb.controllers:thankyouCtrl
     * @description getProductCount from database
     * @description return sumtotal price of cart items.
     */
    $scope.getProductListDetails = function() {
        registrationService.getProductCount(sessionStorage.getItem('loggedInUser'), function(data) {
            for (var i = 0; i < data.length; i++) {
                $scope.cartItemList = data;
                $scope.sumTotal += (data[i].productDetails.Quantity * data[i].productDetails.price);
                $scope.totalCart += data[i].productDetails.Quantity;
            }
            var data = {
                email: sessionStorage.getItem('loggedInUser')
            };
            registrationService.deleteCartDetail(data, function(result) {
                $scope.getProductCount();
            }, function(error) {
                $scope.errorMessage = "error message" + error;
            });
        }, function(error) {
            $scope.errorMessage = "error message" + error;
        });
    };
    $scope.getProductListDetails();

   /* For Disabling the back button*/
    $scope.$on('$locationChangeStart', function(event, toState, toParams, fromState, fromParams){   
    // Here you can take the control and call your own functions:
    // Prevent the browser default action (Going back):
       console.log('hello');        
       if ($location.path().indexOf("payment") != -1) {
                   event.preventDefault();
                }
        });    
});