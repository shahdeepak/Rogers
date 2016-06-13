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
    /**
     *@description QR declaration.
     *Start
     */
    $scope.qrcodeString = '';
    $scope.size = 100;
    $scope.correctionLevel = '';
    $scope.typeNumber = 0;
    $scope.inputMode = '';
    $scope.image = true;
    /*End*/
    $scope.referenceNumber = sessionStorage.getItem('refrenceNumber');
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
        registrationService.getProductData($scope.referenceNumber, function(data) {
            for (var i = 0; i < data.length; i++) {
                $scope.cartItemList = data;
                $scope.sumTotal += (data[i].productDetails.Quantity * data[i].productDetails.price);
                $scope.totalCart += data[i].productDetails.Quantity;
            }
            $scope.qrcodeString = "\nYour reference No.is" + " " + $scope.referenceNumber + '\n' +
                "Your total price:" + " " + $scope.sumTotal + "\n" +
                "Your total cart:" + " " + $scope.totalCart;
        }, function(error) {
            $scope.errorMessage = "error message" + error;
        });
    };
    $scope.getProductListDetails();
    /**
     * @ngdoc method
     * @name rogersWeb.controllers:thankyouCtrl#on
     * @methodOf rogersWeb.controllers:thankyouCtrl
     * @param {object} event  - event
     * @param {object} arg  - arg
     * @description For Disabling the back button
     */
    $scope.$on('$locationChangeStart', function(event) {
        // Here you can take the control and call your own functions:
        // Prevent the browser default action (Going back):
        if ($location.path().indexOf("payment") !== -1) {
            event.preventDefault();
        }
    });
});