/*Created by Hemant motwani on 15-04-2016. */
/**
 * @ngdoc  object
 * @name  rogers.service:thankyouService.
 * @requires backendFactory.
 * @description delete items from cart after successful transcation.
 */
rogers.service('thankyouService', function(backendFactory) {
    'use strict';
    return {
        /**
         * @ngdoc method
         * @name rogers.service:thankyouService#delete cart detail from database
         * @methodOf rogers.service:thankyouService
         * @description Delete cart details from database.
         */
        deleteCart: function(data, successCallback, errorCallback) {
            var promise = backendFactory.postHttpCall(DELETE_CART, data, CONFIG).then(function(obj) {
                successCallback(obj);
            }, function(obj) {
                errorCallback(obj);
            });
        },
    };
});