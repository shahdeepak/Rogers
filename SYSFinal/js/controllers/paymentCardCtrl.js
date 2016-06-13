/*Created by Hemant Motwani on 18-04-2016. */ 
/*
  * @ngdoc  object
  * @name rogers.controller:paymentCardCtrl
  * @requires $scope
  * @requires $location
  * @description Controller for payment gateway.
  */
 rogers.controller("paymentCardCtrl", function($scope, $rootScope, $http, $location, personalService) {
     'use strict';
     /**
      * @ngdoc method
      * @name rogers.controllers:paymentCardCtrl#submitCardDetails
      * @methodOf rogers.controllers:paymentCardCtrl
      * @param {obj} id  - card details of user
      * @description Payment.
      */
     $scope.submitCardDetails = function(card) {
         $scope.$emit("spinner", {
             "flag": true
         });
         var cardnumber = card.number.substring(0, 4) + card.number.substring(5, 9) + card.number.substring(10, 14) + card.number.substring(15, 20);
         console.log(card.number.substring(0, 4));
         console.log(card.number.substring(5, 9));
         console.log(card.number.substring(10, 14));
         console.log(card.number.substr(15));
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
         /**
          * @ngdoc method
          * @name rogers.controllers:paymentCardCtrl
          * @methodOf rogers.controllers:paymentCardCtrl
          * @description Payment using third party payment i.e Paypal.
          */
         var settings = {
             "async": true,
             "crossDomain": true,
             "url": "https://api.sandbox.paypal.com/v1/payments/payment",
             "method": "POST",
             "headers": {
                 "content-type": "application/json",
                 "authorization": sessionStorage.getItem("token_type") + " " + sessionStorage.getItem("access_token"),
                 "cache-control": "no-cache"
             },
             "processData": false,
             "data": cardDetails
         }
         console.log(settings);
         personalService.savePayPalPayments(settings, function(result) {
             if (result) {
                 console.log(result);
                 sessionStorage.setItem("paymentId", result.data.id);
                 $scope.$emit("spinner", {
                     "flag": false
                 });
                 $location.path('/thankyou');
             } else {}
         }, function(result) {
             $scope.$emit("spinner", {
                 "flag": false
             });
             $scope.$emit("cardDetail", {
                 "flag": true
             });
         });
         /**
          * @ngdoc method
          * @name rogers.controllers:paymentCardCtrl#success
          * @methodOf rogers.controllers:paymentCardCtrl
          * @description callback function:Success
          */
         function success() {
             return;
         };
         /**
          * @ngdoc method
          * @name rogers.controllers:paymentCardCtrl#error
          * @methodOf rogers.controllers:paymentCardCtrl
          * @description callback function:Error
          */
         function error() {}
     };
     /**
      * @ngdoc method
      * @name rogers.controllers:paymentCardCtrl#monthList
      * @methodOf rogers.controllers:paymentCardCtrl
      * @description Month list.
      */
     $scope.monthList = [{
         "name": "Jan",
         "value": "01"
     }, {
         "name": "Feb",
         "value": "02"
     }, {
         "name": "Mar",
         "value": "03"
     }, {
         "name": "Apr",
         "value": "04"
     }, {
         "name": "May",
         "value": "05"
     }, {
         "name": "Jun",
         "value": "06"
     }, {
         "name": "July",
         "value": "07"
     }, {
         "name": "Aug",
         "value": "08"
     }, {
         "name": "Sept",
         "value": "09"
     }, {
         "name": "Oct",
         "value": "10"
     }, {
         "name": "Nov",
         "value": "11"
     }, {
         "name": "Dec",
         "value": "12"
     }];
     /**
      * @ngdoc method
      * @name rogersWeb.controllers:paymentCardCtrl#yearList
      * @methodOf rogersWeb.controllers:paymentCardCtrl
      * @description Year list.
      */
     $scope.yearList = [{
         "value": "2016"
     }, {
         "value": "2017"
     }, {
         "value": "2018"
     }, {
         "value": "2019"
     }, {
         "value": "2020"
     }, {
         "value": "2021"
     }, {
         "value": "2022"
     }, {
         "value": "2023"
     }, {
         "value": "2024"
     }, {
         "value": "2025"
     }, {
         "value": "2026"
     }, {
         "value": "2027"
     }];
 });