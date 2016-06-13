/*Created by Kumar Ankur on 14-04-2016. */
/**
 * @ngdoc  object
 * @name  rogers.service:personalService
 * @requires backendFactory.
 * @description service for personalService.
 */
rogers.service('personalService', function(backendFactory) {
    'use strict';
    return {
        /**
         * @ngdoc method
         * @name rogers.service:personalService#store paypal details into database.
         * @methodOf rogers.service:personalService
         * @description Insert paypal details into data base
         */
        savePayPalDetails: function(successCallback, errorCallback) {
            var promise = backendFactory.postHttp().then(function(obj) {
                successCallback(obj);
            }, function(obj) {
                errorCallback(obj);
            });
        },
        /**
         * @ngdoc method
         * @name rogers.service:personalService#store paypal payments into database.
         * @methodOf rogers.service:personalService
         * @description Insert paypal payments into data base
         */
        savePayPalPayments: function(settings, successCallback, errorCallback) {
            var promise = backendFactory.postHttpPaymentCall(settings).then(function(obj) {
                successCallback(obj);
            }, function(obj) {
                errorCallback(obj);
            });
        }
    };
});