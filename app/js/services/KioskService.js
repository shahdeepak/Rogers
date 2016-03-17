'use strict';
rbi.service("kioskService", function ($http, $q, loginService) {

    //Initialize kiosk service
    var RBIKioskService = new RBI.KioskService();
    RBIKioskService.init(new RBI.KioskServiceConfig(), new RBI.AngularTransport());
   
    //set http transport for angular
    RBIKioskService.setAngularHttp($http);
    return {
        kioskSearch: function (searchTerm,maxKiosks, successCallback, errorCallback) {
            var sr = new RBI.KioskSearchRequest();
            sr.setSearchTerm(searchTerm);
            sr.setMaxKiosk(maxKiosks);
            RBIKioskService.kioskSearch(sr, function (data) {
                successCallback(data);
            }, function (data) {
                errorCallback(data);
            });
        },

        GetRecentKiosks: function (successCallback, errorCallback) {
            var sr = new RBI.GetRecentKiosksRequest();
            RBIKioskService.getRecentKiosks(sr, function (data) {
                successCallback(data);
            }, function (data) {
                errorCallback(data);
            });
        },
        
        GetKiosksByProductID: function (productID, searchTerm, successCallback, errorCallback) {
            var sr = new RBI.GetKiosksByProductIDRequest();
            sr.setProductID(productID);
            sr.setMaxKiosks(20);
            sr.setSearchTerm(searchTerm);

            RBIKioskService.getKiosksByProductID(sr, function (data) {
                successCallback(data);

            }, function (data) {
                errorCallback(data);
            });
        },

        GetKioskByKioskId: function (kioskID, successCallback, errorCallback) {
            var sr = new RBI.GetKioskByKioskIdRequest();
            sr.setKioskIDs(kioskID);
            RBIKioskService.getKioskByKioskId(sr, function (data) {
                successCallback(data);
            }, function (data) {
                errorCallback(data);
            });
        }
    };


});
