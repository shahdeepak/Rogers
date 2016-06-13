/*Created by Sangeeta Bose on 15-04-2016. */
/**
 * @ngdoc  object
 * @name  rogers.service:submitService.
 * @requires backendFactory.
 * @description service for submit the ad Service.
 */
rogers.service('submitService', function(backendFactory) {
    'use strict';
    return {
        /**
         * @ngdoc method
         * @name rogers.service:submitService#store details of a new ad into the database
         * @methodOf rogers.service:submitService
         * @description Insert details of a new ad of a registered user in the database
         */
        saveAddDetails: function(newUser, successCallback, cacheUpdateService) {
            var promise = backendFactory.postHttpCall(ADD_HOBBY, newUser, CONFIG).then(function(obj) {
                successCallback(obj);
            }, function(obj) {
                errorCallback(obj);
            });
        },
        /**
         * @ngdoc method
         * @name rogers.service:submitService#store details of a new ad into the database
         * @methodOf rogers.service:submitService
         * @description fetch details of the registered user from the database
         */
        getLoginDetails: function(email, successCallback, errorCallback) {
            var promise = backendFactory.getHttpCall(GET_SINGLE_USER + email).then(function(obj) {
                successCallback(obj.data);
            }, function(obj) {
                errorCallback(obj);
            });
        }
    };
});