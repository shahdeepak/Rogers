/*Created by Kumar Ankur on 14-04-2016. */
/**
 * @ngdoc  object
 * @name  rogers.service:homeService.
 * @description service for homeService.
 * @requires backendFactory
 */
rogers.service('homeService', function(backendFactory) {
    'use strict';
    return {
        /**
         * @ngdoc method
         * @name rogers.service:homeService#store user details into database.
         * @methodOf rogers.service:homeService
         * @description Insert data into data base
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
         * @name rogers.service:homeService#get user details from database.
         * @methodOf rogers.service:homeService
         * @description Get hobby data from database.
         */
        gethobbyDetails: function(name, successCallback, errorCallback) {
            var promise = backendFactory.getHttpCall(GET_HOBBY + name).then(function(obj) {
                successCallback(obj);
            }, function(obj) {
                errorCallback(obj);
            });
        },
        /**
         * @ngdoc method
         * @name rogers.service:homeService#get user history details from database.
         * @methodOf rogers.service:homeService
         * @description get data from data base
         */
        getHistoryDetails: function(email, successCallback, errorCallback) {
            var promise = backendFactory.getHttpCall(GET_HISTORY + email).then(function(obj) {
                successCallback(obj);
            }, function(obj) {
                errorCallback(obj);
            });
        },
        /**
         * @ngdoc method
         * @name rogers.service:homeService#get login details from database.
         * @methodOf rogers.service:homeService
         * @description get login data from data base
         */
        getLoginDetails: function(email, successCallback, errorCallback) {
            var promise = backendFactory.getHttpCall(GET_SINGLE_USER + email).then(function(obj) {
                successCallback(obj.data);
            }, function(obj) {
                errorCallback(obj);
            });
        },
        /**
         * @ngdoc method
         * @name rogers.service:homeService#get user hobby details from database.
         * @methodOf rogers.service:homeService
         * @description Get userHobbydetails from data base
         */
        getUserHobbyDetails: function(loggedEmail, successCallback, errorCallback) {
            var promise = backendFactory.getHttpCall(GET_SERVICE + loggedEmail).then(function(obj) {
                successCallback(obj);
            }, function(obj) {
                errorCallback(obj);
            });
        },
        /**
         * @ngdoc method
         * @name rogers.service:homeService#get user hobby details from database.
         * @methodOf rogers.service:homeService
         * @description Get userHobbydetails from data base
         */
        getChat: function(loggedEmail, successCallback, errorCallback) {
            var promise = backendFactory.getHttpCall(GET_TO_CHAT + loggedEmail).then(function(obj) {
                successCallback(obj);
            }, function(obj) {
                errorCallback(obj);
            });
        }
    };
});