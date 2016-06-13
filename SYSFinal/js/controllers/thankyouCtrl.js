/*Created by Kumar Ankur & Hemant Motwani on 14-04-2016. */
/**
 * @ngdoc  object
 * @name rogers.controller:thankyouCtrl
 * @requires $scope
 * @requires $location
 * @requires displayService
 * @requires thankyouService
 * @description Controller for thank you screen.
 */
rogers.controller('thankyouCtrl', function($scope, $rootScope, $location, displayService, thankyouService) {
    /**
     * @ngdoc method
     * @name rogers.controllers:thankyouCtrl#thankyou
     * @methodOf rogers.controllers:thankyouCtrl
     * @description Function to show detail information after successful transaction.
     */
    $scope.thankyou = function() {
        $rootScope.thankyouid = sessionStorage.getItem("paymentId");
        var email = sessionStorage.getItem("loggedInUser");
        displayService.getCartDetails(email, function(loginData) {
            if (loginData.data && loginData.data.length > 0) {
                $rootScope.foundThankyouData = loginData.data;
                $rootScope.amount = $scope.totalPay();
            } else {
                $rootScope.message = "NO result found";
            }
        }, function() {});
    };
    /**
     * @ngdoc method
     * @name rogers.controllers:thankyouCtrl#totalPay
     * @methodOf rogers.controllers:thankyouCtrl
     * @description Function to add total amount in the cart.
     */
    $scope.totalPay = function() {
        var amount = 0;
        angular.forEach($rootScope.foundThankyouData, function(item) {
            amount += item.totalBuy.charge;
        });
        return amount;
    };
    /**
     * @ngdoc method
     * @name rogers.controllers:thankyouCtrl#deleteCart
     * @methodOf rogers.controllers:thankyouCtrl
     * @description Function to delete items from the cart
     */
    $scope.deleteCart = function() {
        var data = {
            "loggedEmail": sessionStorage.getItem("loggedInUser")
        }
        thankyouService.deleteCart(data);
    };
    $scope.thankyou();
    $scope.deleteCart();
});