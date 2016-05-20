/**
 * @author Deepak shah
 * @since 18-03-2016
 * @ngdoc factory
 * @name  rogersWeb.service:backendService
 * @requires $http  - $http injected service for the data injected service for the data
 * @description This factory is used to get data from backend
 */
rogersWeb.factory("backendFactory", function($http) {
    'use strict';
    var backendObject = {};
    /**
     * @ngdoc method
     * @name rogersWeb.service:backendService#getHttpCall
     * @methodOf rogersWeb.service:backendService
     * @param {Object} urlRoot - urlRoot
     * @description http get call from bcakend
     */
    backendObject.getHttpCall = function(urlRoot) {
        return $http.get(urlRoot);
    };
    /**
     * @ngdoc method
     * @name rogersWeb.service:backendService#postHttpCall
     * @methodOf rogersWeb.service:backendService
     * @param {Object} data - data
     * @description http post call from bcakend
     */
    backendObject.postHttpCall = function(url, commandData, config) {
        return $http.post(url, commandData, config);
    };
    /**
     * @ngdoc method
     * @name rogersWeb.service:backendService#postHttp
     * @methodOf rogersWeb.service:backendService
     * @param {Object} data - data
     * @description http post call from bcakend
     */
    backendObject.postHttp = function(url, config) {
        return $http.post(url, config);
    };
    return backendObject;
});