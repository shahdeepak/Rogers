'use strict';
rbi.service("promotionService", function ($http, $q) {

    // Initialize product service
    var RBIProductService = new RBI.ProductService();
    RBIProductService.init(new RBI.ProductServiceConfig(), new RBI.AngularTransport());

    // Set http transport for Angular
    RBIProductService.setAngularHttp($http);

    return {
        GetPromotions: function (clientType, promotionTypes, successCallback, errorCallback) {
            var promotionsRequest = new RBI.PromotionRequest();
            promotionsRequest.setDeviceType(clientType);
            promotionsRequest.setPromotionTypes(promotionTypes);
            promotionsRequest.setLocalTime(helper.getLocalDateTimeFormatForPromotions());
            RBIProductService.getPromotions(promotionsRequest, function (data) {
                    // success callback
                    successCallback(data);
                },
                function (data) {
                    // error callback
                    errorCallback(data);
                });
        }
    };
});

