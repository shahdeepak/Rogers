/**
 * @ngdoc  object
 * @name rogersWeb.controller:paymentCtrl
 * @requires $scope
 * @requires $location
 * @description Controller for payment gateway.
 */
rogersWeb.controller("paymentCtrl", function($scope, $http, $location, registrationService) {
    'use strict';
    $scope.message = "";
    /**
     * @ngdoc method
     * @name rogersWeb.controllers:paymentCtrl#submitCardDetails
     * @methodOf rogersWeb.controllers:paymentCtrl
     * @param {obj} id  - card details of user
     * @description Payment.
     */
    $scope.submitCardDetails = function(card) {
        $scope.$emit("spinner", {
            "flag": true
        });
        var cardDetails = {
            "intent": "sale",
            "payer": {
                "payment_method": "credit_card",
                "funding_instruments": [{
                    "credit_card": {
                        "type": "discover",
                        "number": card.number,
                        "expire_month": card.month.value,
                        "cvv2": card.cvv,
                        "expire_year": card.year.value,
                        "first_name": card.name,
                        "last_name": card.name
                    }
                }]
            },
            "transactions": [{
                "amount": {
                    "total": "12",
                    "currency": "USD"
                },
                "description": "creating a direct payment with credit card"
            }]
        };
        //To do payment using paypal
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://api.sandbox.paypal.com/v1/payments/payment",
            "method": "POST",
            "headers": {
                "content-type": "application/json",
                "authorization": sessionStorage.getItem("token_type") + " " + sessionStorage.getItem("access_token"),
                "cache-control": "no-cache",
                "postman-token": "6bd74f97-9a8d-0c7b-295f-c441254fd7f0"
            },
            "processData": false,
            "data": cardDetails
        };
        $http(settings).then(function() {
            var loggedEmail = {
                email: sessionStorage.getItem('loggedInUser')
            };
            registrationService.deleteCartDetail(loggedEmail, function(result) {
                sessionStorage.setItem('refrenceNumber', result.data.referenceNumber);
                $scope.getProductCount();
                $scope.$emit("spinner", {
                    "flag": false
                });
                $location.path('/thankyou');
            }, function(error) {
                $scope.errorMessage = "error message" + error;
            });
        }, function() {
            $scope.$emit("spinner", {
                "flag": false
            });
            $scope.message = "Invalid card details";
        });
    };
    /**
     * @ngdoc method
     * @name rogersWeb.controllers:paymentCtrl#monthList
     * @methodOf rogersWeb.controllers:paymentCtrl
     * @description Month list.
     */
    $http.get('json/monthList.json').success(function(data) {
        $scope.monthList = data;
    });
    /**
     * @ngdoc method
     * @name rogersWeb.controllers:paymentCtrl#monthList
     * @methodOf rogersWeb.controllers:paymentCtrl
     * @description Year list.
     */
    $http.get('json/yearList.json').success(function(data) {
        $scope.yearList = data;
    });
});