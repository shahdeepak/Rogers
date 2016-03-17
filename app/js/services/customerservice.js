
'use strict';
rbi.service("customerService", function ($http, $q) {

    // Initialize product service
    var RBICustomerService = new RBI.CustomerService();
    RBICustomerService.init(new RBI.CustomerServiceConfig());

    var RBIReservationService = new RBI.ReservationService();
    RBIReservationService.init(new RBI.ReservationServiceProxyConfig());

    var RBIPersistenceManager = new RBI.PersistenceManager();

    // Set http transport for Angular
    RBICustomerService.setAngularHttp($http);
    RBIReservationService.setAngularHttp($http);

    function findPreferredCard (data) {
        var preferredCard = null;
        if (data != undefined && data.length > 0) {
            var length = data.length;
            preferredCard = data[0];
            for (var index = 1; index < length; index++) {
                if (data[index].isPreferred()) {
                    preferredCard = data[index];
                    break;
                }
            }
        }
        return preferredCard;
    };

    return {
        getCustomerService: function () {
            return RBICustomerService;
        },

        getCards: function (rbiCommonService, successCallBack, errorCallBack) {
            var cards = helper.GetCards(rbiCommonService);

            if (cards == null) {
                // If there are no cards, send a new GetCards request to the server
                var cardsRequest = new RBI.GetCardsRequest();
                RBICustomerService.getCards(cardsRequest,
                    function (data) {
                        helper.debugLog(data);
                        if (data.length > 0) {
                            helper.SetCards(rbiCommonService, data);
                        }
                        successCallBack(data);
                    },
                    function (data) {
                        errorCallBack(data);
                    });
            }
            else {
                // Reuse existing cards
                successCallBack(cards);
            }
        },

        getPreferredCard: function (data) {
            return findPreferredCard(data);
        },

        // If user has a subscription card, select the subscription card, otherwise use the preferred card
        // Priority:
        // 1. Subscription card
        // 2. Primary card if user has one and there is no subscription card
        // 3. first card if there is no primary card
        // 4. null if user has no cards.
        getSubscriptionCard: function (data) {
            //find subscription card
            var subscriptionCard = null;
            if (data != undefined && data.length > 0) {
                var length = data.length;
                for (var index = 0; index < length; index++) {
                    if (data[index].getIsSubscriptionPrimary()) {
                        subscriptionCard = data[index];
                        break;
                    }
                }
            }

            // If subscription card is not found return the preferred card
            if (subscriptionCard == null) {
                subscriptionCard = findPreferredCard(data);
            }
            return subscriptionCard;
        },

        getSubscriptionPricing: function (customerData, successCallBack, failurCallBack) {
            var subscriptionRequest = new RBI.SubscriptionPricingRequest(customerData.accountNumber, customerData.creditOptionId,
                customerData.packageId, customerData.salesChannel);
            subscriptionRequest.setCreationPlatform( RBI.PlatformConfig.deviceType);
            subscriptionRequest.setDeviceManufacturer(RBI.PlatformConfig.deviceManufacturer);
            subscriptionRequest.setSaleChannel(RBI.PlatformConfig.saleChannel);
            RBIReservationService.getSubscriptionPricing(subscriptionRequest, function (data) {
                successCallBack(data);
            }, function (data) {
                failurCallBack(data);
            });
        },

        /***
         * Subscribe customer
         * Since this is an asynchronous call on OL side, we need to implement the following logic to validate
         * subscription:
         *
         * 1. Subscribe customer.
         * 2. Call get customer and check subscription.
         * 3. If user object contains expected subscription - return success.
         * 4. Repeat steps 2 and 3 for 7 times with delay 3 seconds between iterations.
         * 5. If after 7 retries user object still does not contain expected subscription - asusme subscription failed, return failure.
         *
         * @param customerData
         * @param successCallBack
         * @param failureCallBack
         */
        subscribeCustomer: function (customerData, successCallBack, failureCallBack) {
            var subscriptionCustomerRequest = new RBI.SubscribeCustomerRequest();
            
            subscriptionCustomerRequest.setAccountNumber(customerData.accountNumber);
            subscriptionCustomerRequest.setConfirmationNumber(customerData.confirmationNumber);
            subscriptionCustomerRequest.setCreditOptionID(customerData.creditOptionId);
            subscriptionCustomerRequest.setPackageID(customerData.packageId);

            var validateCustomerTimer = null;
            var subscribeCustomerData;
            var numAttempts = 0;
            var MAX_NUM_ATTEMPTS_SUBSCRIBE_CUSTOMER = 7; // number of GetCustomer calls
            var SUBSCRIBE_CUSTOMER_TIMER = 5000;         // repeat every 3 seconds

            RBIReservationService.subscribeCustomer(subscriptionCustomerRequest, function (data) {
                subscribeCustomerData = data;   // save the customer data returned from subscribeCustomer request
                // validation error function - clear the timer and call failure callback
                var validateSubscriptionError = function(data) {
                    if (validateCustomerTimer != null) {
                        clearInterval(validateCustomerTimer);
                        validateCustomerTimer = null;
                    }

                    var errorObj = {
                        ResultInfo: { ResultCode: '19900015' }     // generic subscription error
                    };

                    failureCallBack(errorObj);
                };

                // Validate subscription by repeatedly calling GetCustomer every 3 seconds
                // until we get a valid subscription (max 7 attempts)
                var validateSubscription = function (data) {
                    var subscriptionID = data.getSubscriptionID();
                    if (subscriptionID != null) {
                        if (validateCustomerTimer != null) {
                            clearInterval(validateCustomerTimer);
                            validateCustomerTimer = null;
                        }
                        helper.debugLog("subscribeCustomer: GetCustomer contains a valid subscriptionID:" + subscriptionID);
                        successCallBack(subscribeCustomerData);
						//checking if we will be getting FreeTrial flag true or not from subscribe customer api.
                        if (!helper.isFreeTrialUsed())
                         platformStorage.setItem("IsFreeTrialUsed", data.value.FreeTrialUsed.toString());
                    }
                    else {
                        if (numAttempts < MAX_NUM_ATTEMPTS_SUBSCRIBE_CUSTOMER) {
                            numAttempts++;
                            helper.debugLog("subscribeCustomer: GetCustomer attempt " + numAttempts + " failed");
                        }
                        else {
                            validateSubscriptionError (data);
                        }
                    }
                };

                validateCustomerTimer = setInterval(function () {
                    var getCustomerRequest = new RBI.GetCustomerRequest();
                    getCustomerRequest.setEvictCache(true);
                    RBICustomerService.getCustomer(getCustomerRequest, validateSubscription, validateSubscriptionError);
                }, SUBSCRIBE_CUSTOMER_TIMER);

            }, function (data) {
            	failureCallBack(data);
            });
        },

        //BL to get CreditBalance
        getCreditBalance: function (successCallBack, failureCallBack) {
            var creditBalanceRequest = new RBI.GetCreditBalanceRequest();
            
            RBICustomerService.getCreditBalance(creditBalanceRequest, function (data) {
                successCallBack(data);
            }, function (data) {
                failureCallBack(data);
            });
        },

        // BL to add new customer
        createCustomer: function (customerData, successCallBack, failureCallBack) {
            //creating and populating createAccount request
            var createCustomerRequest = new RBI.CreateCustomerRequest();
            createCustomerRequest.setFirstName(customerData.firstName);
            createCustomerRequest.setLastName(customerData.lastName);
            createCustomerRequest.setLoginEmail(customerData.loginEmail);
            createCustomerRequest.setZipCode(customerData.zipCode);
            createCustomerRequest.setPassword(customerData.password);
            createCustomerRequest.setToken(customerData.token);

            //Calling createCustomer service
            RBICustomerService.createCustomer(createCustomerRequest, function (data) {
                successCallBack(data);
            }, function (data) {
                failureCallBack(data);
            });
        },

        //BL to get CustomerToken
        createCustomerToken: function (successCallBack, failureCallBack) {
            //creating request for Customer token
            var createCustomerTokenRequest = new RBI.CreateCustomerTokenRequest();

            //calling service
            RBICustomerService.createCustomerToken(createCustomerTokenRequest, function (data) {
                successCallBack(data);
            }, function (data) {
                failureCallBack(data);
            });
        },

        //Update existing customer
        updateCustomer: function (customerData, successCallBack, failureCallBack) {

            //creating request for update customer
            var updateCustomerRequest = new RBI.UpdateCustomerRequest();
            updateCustomerRequest.setFirstName(customerData.firstName);
            updateCustomerRequest.setLastName(customerData.lastName);           
            updateCustomerRequest.setZipCode(customerData.zipCode);
            if (isDefined(customerData.notifyOfSubscriptionFail)) {
               updateCustomerRequest.setNotifyOfSubscriptionFail(customerData.notifyOfSubscriptionFail);
            }


            //calling service to update customer
            RBICustomerService.updateCustomer(updateCustomerRequest, function (data) {
                successCallBack(data);
            }, function (data) {
                failureCallBack(data);
            });
        },


        //Returns the current customer details
        getCustomer: function (successCallBack, failureCallBack) {
            var emptyRequest = new RBI.GetCustomerSimpleRequest();

            //calling service
            RBICustomerService.getCustomer(emptyRequest, function (data) {
                successCallBack(data);
            }, function (data) {
                failureCallBack(data);
            });
        },

        checkAccountPassword: function (password, successCallback, failureCallback) {
            var passwordRequest = new RBI.CheckParentalControlPWRequest(password);

            RBICustomerService.init(new RBI.CustomerServiceConfig());

            RBICustomerService.checkParentalControlPW(passwordRequest,
                function (parentalControls) {
                    successCallback(parentalControls);
                }, function (response) {
                    failureCallback(response);
                });
        },

        getParentalControlOptions: function (successCallBack, failureCallBack) {
            var emptyRequest = new RBI.GetCustomerSimpleRequest();

            //calling service
            RBICustomerService.getParentalControlOptions(emptyRequest, function (data) {
                successCallBack(data);
            }, function (data) {
                failureCallBack(data);
            });
        },

        getSubscriptions: function (successCallBack, failureCallBack) {
            var subscriptionRequest = new RBI.SubscriptionsRequest();

            RBIReservationService.getSubscriptions(subscriptionRequest, function (data) {
                successCallBack(data);
            }, function (data) {
                failureCallBack(data);
            });
        },

        isInFreeTrial: function() {
            return RBIPersistenceManager.isCurrentlyInFreeTrial();
        },

        isSubscribed: function() {
            return RBIPersistenceManager.isSubscribed();
        },

        updateSubscriptionCard: function (accountNumber, successCallback, failureCallback) {
            var updateSubscriptionCardRequest = new RBI.UpdateSubscriptionCardRequest(accountNumber);
            RBIReservationService.updateSubscriptionCard(updateSubscriptionCardRequest, successCallback, failureCallback);
        }
    }
});

