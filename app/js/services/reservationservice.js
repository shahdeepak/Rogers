'use strict';

rbi.service("reservationService",function ($http, $q) {
		
	 //Initialized the reservation service.
	var RBIReservationService  = new RBI.ReservationService();
	RBIReservationService.init(new RBI.ReservationServiceProxyConfig(), new RBI.AngularTransport());

    // Set http transport for Angular
	RBIReservationService.setAngularHttp($http);
	return{
		getOnDemandCartPricing: function(accountNumber,purchaseOptionID,successCallback,errorCallback){
			var onDemandCartPricingRequest = new RBI.OnDemandCartPricingRequest();
			onDemandCartPricingRequest.setAccountNumber(accountNumber);
			onDemandCartPricingRequest.setPurchaseOptionID(purchaseOptionID);

            onDemandCartPricingRequest.setCreationPlatform( RBI.PlatformConfig.deviceType);
            onDemandCartPricingRequest.setDeviceManufacturer(RBI.PlatformConfig.deviceManufacturer);
            onDemandCartPricingRequest.setSaleChannel(RBI.PlatformConfig.saleChannel);
            //onDemandCartPricingRequest.setWirelessCarrier(null);
            //onDemandCartPricingRequest.setPlatformOS(null);

            RBIReservationService.getOnDemandCartPricing(onDemandCartPricingRequest, function (data) {
                 // success callback
                 successCallback(data);
             },
             function (data) {
                 // error callback
                 errorCallback(data);
             });
		},
		performOnDemandPurchase: function(confirmationId,successCallback,errorCallback){
			var performOnDemandPurchaseRequest = new RBI.PerformOnDemandPurchaseRequest();
			performOnDemandPurchaseRequest.setConfirmationID(confirmationId);
			RBIReservationService.performOnDemandPurchase(performOnDemandPurchaseRequest, function (data) {
				// success callback
                successCallback(data);
            },
            function (data) {
                // error callback
                errorCallback(data);
            });		
		}
	
	};
 }
);
