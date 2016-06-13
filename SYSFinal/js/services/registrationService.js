/*Created by Kumar Ankur on 14-04-2016. */
/**
 * @ngdoc  object
 * @name  rogers.service:registrationService.
 * @requires backendFactory
 * @description service for registration Service.
 */
rogers.service('registrationService', function(backendFactory) {
    'use strict';
    return {
        /**
         * @ngdoc method
         * @name rogers.service:registrationService#store user details into database.
         * @methodOf rogers.service:registrationService
         * @description Insert data into data base
         */
        saveRegistrationDetails: function(newUserDetail, successCallback, cacheUpdateService) {
            var promise = backendFactory.postHttpCall(ADD_USER, newUserDetail, CONFIG).then(function(obj) {
                successCallback(obj);
            }, function(obj) {
                errorCallback(obj);
            });
        },
        /**
         * @ngdoc method
         * @name rogers.service:registrationService#set user details into database.
         * @methodOf rogers.service:registrationService
         * @description set user data to database.
         */
        setUserDetails: function(newUserDetail, successCallback, errorCallback) {
            var promise = backendFactory.postHttpCall(UPDATE_USER, newUserDetail, CONFIG).then(function(obj) {
                successCallback(obj);
            }, function(obj) {
                errorCallback(obj);
            });
        },
        /**
         * @ngdoc method
         * @name rogers.service:registrationService#Get login details from database.
         * @methodOf rogers.service:registrationService
         * @description get data from data base
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