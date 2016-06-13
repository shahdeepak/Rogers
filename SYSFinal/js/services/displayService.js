/*Created by Kumar Ankur and Hemant Motwani on 14-04-2016. */
/**
 * @ngdoc factory
 * @name  rogers.service:displayService
 * @requires backendFactory 
 * @description This servcie is used to display item in the cart.
 */
rogers.service('displayService', function(backendFactory) {
    'use strict';
    return {
        /**
         * @ngdoc method
         * @name rogers.service:displayService#store cart detail to database
         * @methodOf rogers.service:displayService
         * @description Insert data into data base
         */
        saveCartDetails: function(addToCartData, successCallback, errorCallback) {
            var promise = backendFactory.postHttpCall(ADD_TO_CART, addToCartData, CONFIG).then(function(obj) {
                successCallback(obj);
            }, function(obj) {
                errorCallback(obj);
            });
        },
        /**
         * @ngdoc method
         * @name rogers.service:displayService#remove cart detail from database
         * @methodOf rogers.service:displayService
         * @description Remove data from data base
         */
        removeCartDetails: function(data, successCallback, errorCallback) {
            var promise = backendFactory.postHttpCall(REMOVE_FROM_CART, data, CONFIG).then(function(obj) {
                successCallback(obj);
            }, function(obj) {
                errorCallback(obj);
            });
        },
        /**
         * @ngdoc method
         * @name rogers.service:displayService#getCartDetails
         * @methodOf rogers.service:displayService
         * @description get data from data base
         */
        getCartDetails: function(email, successCallback, errorCallback) {
            var promise = backendFactory.getHttpCall(GET_CART + email).then(function(obj) {
                successCallback(obj);
            }, function(obj) {
                errorCallback(obj);
            });
        },
         /**
         * @ngdoc method
         * @name rogers.service:displayService#store cart detail to database
         * @methodOf rogers.service:displayService
         * @description Insert data into data base
         */
        setChat: function(chatData, successCallback, errorCallback) {
            var promise = backendFactory.postHttpCall(ADD_TO_CHAT, chatData, CONFIG).then(function(obj) {
                successCallback(obj);
            }, function(obj) {
                errorCallback(obj);
            });
        },
    };
});