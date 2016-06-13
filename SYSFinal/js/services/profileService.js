/*Created by Kumar Ankur on 14-04-2016. */
/**
 * @ngdoc  object
 * @name  rogers.service:profileService.
 * @requires backendFactory.
 * @description service for profileService.
 */
rogers.service('profileService', function(backendFactory) {
    'use strict';
    return {
        /**
         * @ngdoc method
         * @name rogers.service:profileService#set user details into database.
         * @methodOf rogers.service:profileService
         * @description set user data to database.
         */
        setUpdateAddDetails: function(newUserDetail, successCallback, errorCallback) {
            var promise = backendFactory.postHttpCall(UPDATE_HOBBY, newUserDetail, CONFIG).then(function(obj) {
                successCallback(obj.data);
            }, function(obj) {
                errorCallback(obj);
            });
        },
        /**
         * @ngdoc method
         * @name rogers.service:profileService#get user details from database.
         * @methodOf rogers.service:profileService
         * @description get user data from database.
         */
        getUserHobby: function(email, successCallback, errorCallback) {
            var promise = backendFactory.getHttpCall(GET_SERVICE + email).then(function(obj) {
                successCallback(obj.data);
            }, function(obj) {
                errorCallback(obj);
            });
        },
        /**
         * @ngdoc method
         * @name rogers.service:profileService#remove user details from database.
         * @methodOf rogers.service:profileService
         * @description Remove data from database.
         */
        removeUserDetails: function(data, successCallback, errorCallback) {
            var promise = backendFactory.postHttpCall(REMOVE_HOBBY, data, CONFIG).then(function(obj) {
                successCallback(obj);
            }, function(obj) {
                errorCallback(obj);
            });
        },
    };
});