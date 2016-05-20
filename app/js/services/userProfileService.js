/**
 * @ngdoc service
 * @name  rogersWeb.service:userProfileService
 */
rogersWeb.service('userProfileService', function(backendFactory) {
    'use strict';
    return {
        /**
         * @ngdoc method
         * @name rogersWeb.service:userProfileService#get user details from local storage
         * @methodOf rogersWeb.service:userProfileService
         * @description update user data into localstorage
         */
        updateProfileDetails: function(email, userDetail, successCallback, errorCallback) {
            userDetail.email = email;
            var promise = backendFactory.postHttpCall(UPDATE_USER, userDetail, CONFIG).then(function(obj) {
                successCallback(obj);
            }, function(obj) {
                errorCallback(obj);
            });
        },
        //@description Get data from localstorage with param
        getProfileWithParamDetails: function(email, successCallback, errorCallback) {
            var promise = backendFactory.getHttpCall(GET_SINGLE_USER + email).then(function(obj) {
                successCallback(obj);
            }, function(obj) {
                errorCallback(obj);
            });
        }
    };
});