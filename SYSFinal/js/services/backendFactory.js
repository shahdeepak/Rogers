/*Created by Kumar Ankur and Hemant Motwani on 14-04-2016. */
/**
 * @ngdoc factory
 * @name  rogers.service:backendService
 * @requires $http  - $http injected service for the data injected service for the data
 * @description This factory is used to get data from backend
 */
rogers.factory("backendFactory", function($http) {
    'use strict';
    var backendObject = {};
    /**
     * @ngdoc method
     * @name rogers.service:backendService#getHttpCall
     * @methodOf rogers.service:backendService
     * @param {Object} urlRoot - urlRoot
     * @description http get call from backend
     */
    backendObject.getHttpCall = function(urlRoot) {
        return $http.get(urlRoot);
    };
    /**
     * @ngdoc method
     * @name rogers.service:backendService#postHttpCall
     * @methodOf rogers.service:backendService
     * @param {Object} data - data
     * @description http post call from backend
     */
    backendObject.postHttpCall = function(url, commandData, config) {
        return $http.post(url, commandData, config);
    };
    /**
     * @ngdoc method
     * @name rogers.service:backendService#postHttpCall
     * @methodOf rogers.service:backendService
     * @param {Object} data - data
     * @description http post call from backend
     */
    backendObject.postHttp = function() {
        return $http(PAY_PAL_CONFIG);
    };
    /**
     * @ngdoc method
     * @name rogers.service:backendService#postHttpCall
     * @methodOf rogers.service:backendService
     * @param {Object} data - data
     * @description http post call from backend
     */
    backendObject.postHttpPaymentCall = function(settings) {
        return $http(settings);
    };
    //@description Insert data into localstorage 
    backendObject.saveLocalStorageCall = function(user, newUserDetail) {
        //Push user details into array
        user.push(newUserDetail);
        // Put the object into storage
        localStorage.setItem('userRegDetails', JSON.stringify(user));
        return {
            'Message': 'User successfully registered!!!'
        };
    };
    //@description Get data from localstorage without param
    backendObject.getLocalStorageCall = function() {
        return localStorage.getItem('userRegDetails');
    };
    //@description Update data into localstorage
    backendObject.updateLocalStorageCall = function(userDetail) {
        var getUserProfileDetails = JSON.parse(localStorage.getItem('userRegDetails'));
        for (var i = 0; i < getUserProfileDetails.length; i++) {
            if (userDetail.email === getUserProfileDetails[i].email) { //look for match with email
                getUserProfileDetails[i] = userDetail; // save updated value
                break; //exit loop since  found the details of user
            }
        }
        localStorage.setItem("userRegDetails", JSON.stringify(getUserProfileDetails));
        return {
            'Message': 'Profile updated successfully!!!'
        };
    };
    //@description Get data from localstorage with param
    backendObject.getDataWithParam = function(email) {
        var getUserProfileDetails = JSON.parse(localStorage.getItem('userRegDetails'));
        for (var i = 0; i < getUserProfileDetails.length; i++) {
            if (email === getUserProfileDetails[i].email) { //look for match with email
                return getUserProfileDetails[i];
            }
        }
    }
    return backendObject;
});