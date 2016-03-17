/**
 * Login service functions
 * Calls Core API functions
 *
 * Author: Peter Rajcani
 */

'use strict';

rbi.service('loginService', function ($http, $q) {

    var securityService = new RBI.SecurityService();
    securityService.init(new RBI.SecurityServiceConfig(), new RBI.AngularTransport());
    securityService.setAngularHttp($http);

    var RBIDeviceService = new RBI.DeviceService();
    RBIDeviceService.init(new RBI.DeviceServiceConfig());
    RBIDeviceService.setAngularHttp($http);

    var rbiPersistenceMgr = new RBI.PersistenceManager;


    function activateDevice(successCB, failureCB) {
        var deviceName = platformInfo.modelName;
        var deviceType = platformInfo.deviceModelType;
        var request = new RBI.ActivateDeviceRequest();
        request.setDeviceID(platformInfo.getDeviceID());
        request.setName(deviceName);
        request.setType(deviceType);
        request.setDownloadActive(false);
        RBIDeviceService.activateDevice(request,
            function (data) {
                var resultInfo = data.getResultInfo();
                helper.debugLog("ActivateDevice reponse: " + JSON.stringify(resultInfo));
                if (resultInfo.ResultCode == 0) {
                    helper.debugLog("Device activated!");
                    platformStorage.setItem(DEVICE_ACTIVE, true);
                    successCB();
                }
                else {
                    showActivateDeviceError(data);
                    failureCB();
                }
            },
            function (data) {
                showActivateDeviceError(data);
                failureCB();
            });
    }

    function showActivateDeviceError(data) {
        // Show an error message
        platformStorage.setItem(DEVICE_ACTIVE, false);
        helper.showErrorMessage(data);
        helper.debugLog("Device activation error");
    }


    return {

        Login: function (username, password, isPIIAccepted, successCallback, failureCallback) {
            var lr = new RBI.LoginRequest(username, password);
            lr.setPIIAcceptance(isPIIAccepted);

            var loginToProxy = function (loginRequest, successCB, failureCB) {

                var createSessionRequestSuccessCallback = function (data) {
                    helper.debugLog(data);
                    successCB(data);
                };
                if(isDefined(RBI.PlatformConfig.userReLogin)){
                    helper.SetUserId(username);
                    helper.SetUserPwd(password);
                }
                
                var createSessionRequestFailureCallback = function (data) {
                    helper.debugLog(data);
                    failureCB(data.getResultCode());
                };

                var samlRequestSuccessCallback = function (event) {
                    var sessionRequest = new RBI.CreateSessionRequest(event.AuthResponse);
                    sessionRequest.setLoadCustomer(true);
                    sessionRequest.setDeviceType(RBI.PlatformConfig.deviceType);
                    sessionRequest.setTransactionAccessPoint(RBI.PlatformConfig.transactionAccessPointOL);
                    sessionRequest.setLoadCustomerTAP(RBI.PlatformConfig.transactionAccessPoint);

                    securityService.createSession(sessionRequest).then(
                        createSessionRequestSuccessCallback,
                        createSessionRequestFailureCallback);
                };
                var samlRequestFailureCallback = function (response) {
                    helper.debugLog(response);

                   // var json = JSON.parse(event.responseText);
                    //securityService.getSAMLErrorResponse(json.AuthResponse, failureCB, failureCB);

                    // Get the server response and check if PII needs to be accepted
                    var responseText = response.data.AuthResponse;
                    if (responseText && responseText.indexOf(RBI.Config.PII_IDM_ErrorCode) != -1) {
                        //PII need to be accepted
                        failureCB(RBI.Config.PIIAcceptanceRequired);
                    }
                    else {
                    	var errorCode = responseText.substring(responseText.indexOf("<Code>") + 6, responseText.indexOf("</Code>"));
                    	//var errorCode = {value : response.data.ResultInfo};  // TODO: check if this is valid with new CommonJS code
                        if (isDefined(responseText) && responseText.indexOf("An error occurred when verifying security for the message") > 0) {
                            //create the error object for the not login approach
                            errorCode = '108';
                        }
                        failureCB(errorCode);
                    }
                };

                securityService.getSAMLToken(loginRequest, samlRequestSuccessCallback, samlRequestFailureCallback);
            };

            loginToProxy(lr,
                function (data) {
                    addVodListeners();
                    if (!helper.isUserLoggedIn()) {
                        platformStorage.setItem("is_Helpoverlayeopen", true);
                    }

                    platformStorage.setItem("isLoggedIn", true);
                    // Setting this flag is needed for CommonJS in cookie storage
                    rbiPersistenceMgr.setLoggedIn(true);
                    var customerInfo = data.content;
                    if (customerInfo.FreeTrialUsed != null && customerInfo.FreeTrialUsed != undefined) {
                        platformStorage.setItem("IsFreeTrialUsed", customerInfo.FreeTrialUsed);
                    }
                    else {
                        platformStorage.setItem("IsFreeTrialUsed", "false");
                    }
                    platformStorage.setItem("user_zipcode", customerInfo.Addresses.HOME.zipCode);
                    platformStorage.setItem("PCN", customerInfo.PartnerCustomerNumber);
                    // need to set user ID upon login so that parental controls and other customer data
                    // can be retrieved from local storage - ZOE 34811
                    helper.SetUserId(customerInfo.EmailAddresses.PERSONALEMAIL);

                    //Add two flags for checking subscription of the user
                    platformStorage.setItem(SUBSCRIBED, isDefined(customerInfo.subscribed) ? customerInfo.subscribed : false);
                    platformStorage.setItem(SUBSCRIPTION_CANCELLED, isDefined(customerInfo.SubscriptionCancelled) ? customerInfo.SubscriptionCancelled : false);
                    platformStorage.setItem(USER_START_DATE, helper.formatDate(customerInfo.AnniversaryDate));

                    // ZOE-32100 Surrogate customer ID for Conviva
                    platformStorage.setItem(SURROGATE_CUSTOMER_ID, customerInfo.SurrogateCustomerID);

                    successCallback(data);
                },
                function (errorCode) {
                    addVodListeners();
                    if (errorCode == RBI.Config.PIIAcceptanceRequired) {
                        failureCallback(errorCode);
                    }
                    else {
                        var errorObj = {
                            ResultInfo: { ResultCode: errorCode }
                        };
                        helper.debugLog("Login failed, error code: " + errorCode);
                        failureCallback(errorObj);
                    }
                });
        },

        Logout: function (successCallback, failureCallback) {
            securityService.logout(
                function (data) {
                    addVodListeners();
                    // Reset CommonJS flag in cookie storage
                    rbiPersistenceMgr.setLoggedIn(false);
                    if (RBI.PlatformConfig.activateDevice) {
                        // Set the DEVICE_ACTIVE flag to false on logout
                        platformStorage.setItem(DEVICE_ACTIVE, false);
                    }

                    // for Omniture
                    if (isDefined(platformStorage.getItem(OMNITURE_KIOSK_SEARCH_VISITED))) {
                       platformStorage.removeItem(OMNITURE_KIOSK_SEARCH_VISITED);
                    }
                    // clear the platform storage data
                    platformStorage.removeItem(SURROGATE_CUSTOMER_ID);
                    platformStorage.removeItem(SUBSCRIBED);
                    platformStorage.removeItem(SUBSCRIPTION_CANCELLED);
                    platformStorage.removeItem(USER_START_DATE);
                    successCallback(data);
                },
                function (data) {
                    addVodListeners();
                    failureCallback(data);
                });
        },

        // ZOE-29733: CommonHTML: Remove check and prompt for all missing customer profile information on Mobile and TV clients
        /*
        UpdateProfileNeeded: function (data) {
            var needUpdate = false;
            var customerInfo = data.content;
            if (!customerInfo.EmailAddresses || !customerInfo.EmailAddresses.PERSONALEMAIL ||
                customerInfo.EmailAddresses.PERSONALEMAIL == '' || customerInfo.EmailAddresses.PERSONALEMAIL.toUpperCase() == "NULL") {
                needUpdate = true;
            } else if (!customerInfo.FirstName || customerInfo.FirstName == '' || customerInfo.FirstName.toUpperCase() == "NULL") {
                needUpdate = true;
            } else if (!customerInfo.LastName || customerInfo.LastName == "" || customerInfo.LastName.toUpperCase() == "NULL") {
                needUpdate = true;
            } else if (!customerInfo.Addresses || !customerInfo.Addresses.HOME ||
                ((!customerInfo.Addresses.HOME.Zip || customerInfo.Addresses.HOME.Zip == '' || customerInfo.Addresses.HOME.Zip.toUpperCase() == 'NULL') &&
                    (!customerInfo.Addresses.HOME.zipCode || customerInfo.Addresses.HOME.zipCode == '' || customerInfo.Addresses.HOME.Zip.toUpperCase() == 'NULL'))) {
                needUpdate = true;
            }

            return needUpdate;
        },  */

        // Needed for LG and Samsung
        ProcessDeviceActivation: function () {
            // Get a list of active devices for the current user
            // If the device is not activated, activate it
            var deviceActivated = false;
            var successCB = function () {};
            var errorCB = function () {};
            this.GetActiveDevices(
                function (data) {
                    var deviceID = platformInfo.getDeviceID();
                    for (var i = 0; i < data.length && !deviceActivated; i++) {
                        if (data[i].getDeviceId() == deviceID) {
                            deviceActivated = true;
                            platformStorage.setItem(DEVICE_ACTIVE, true);
                            helper.debugLog("Device already activated for this user");
                        }
                    }
                    if (!deviceActivated) {
                        helper.debugLog("Calling activate device for device ID: " + deviceID);
                        activateDevice(successCB, errorCB);
                    }
                },
                function () {
                    activateDevice(successCB, errorCB);
                });
        },

        ActivateDevice: function (successCB, failureCB) {
            activateDevice(successCB, failureCB);
        },

        // Get a list of all active devices for the current user
        GetActiveDevices: function (successCallback, errorCallback) {
            var request = new RBI.GetActiveDevicesRequest();
            helper.debugLog("sending GetActiveDevices request:");
            RBIDeviceService.getActiveDevices(request,
                function (data) {
                    helper.debugLog("GetActiveDevices reponse: " + JSON.stringify(data));
                    successCallback(data);
                },
                function (data) {
                    helper.debugLog("GetActiveDevices error: ");
                    helper.debugLog(data);
                    errorCallback(data);
                });
        },


        CheckVersion: function (appVersion, successCallback, errorCallback) {
            helper.debugLog("CheckVersion request - appVersion: " + appVersion + ", deviceSpec: " + RBI.PlatformConfig.deviceSpec);
            var request = new RBI.CheckVersionRequest(appVersion, RBI.PlatformConfig.deviceSpec);
            RBIDeviceService.checkVersion(request,
                function (data) {
                    helper.debugLog("CheckVersion success: " + JSON.stringify(data));
                    successCallback(data);
                },
                function (data) {
                    helper.debugLog("CheckVersion error: " + JSON.stringify(data));
                    errorCallback(data);
                })
        }
    }

});







