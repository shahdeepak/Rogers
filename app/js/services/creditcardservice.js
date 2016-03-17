'use strict';
rbi.service("creditcardService", function ($http, $q) {

    var CreditCardService = new RBI.CreditCardService();
    CreditCardService.init(new RBI.CreditCardServiceConfig());
    CreditCardService.setAngularHttp($http);

    var securityService = new RBI.SecurityService();
    securityService.init(new RBI.SecurityServiceConfig());
    securityService.setAngularHttp($http);
    securityService.setPromiseProvider($q);

    function updateCreditCardModel (creditCardModel, accountNumber, creditcard) {

        creditCardModel.setAccountNumber(accountNumber);
        creditCardModel.setAccountAlias(creditcard.nickname);
        creditCardModel.setCvv(creditcard.cvv);
        creditCardModel.setAddress1(creditcard.StreetAddressLine1);
        creditCardModel.setAddress2(creditcard.StreetAddressLine2);
        creditCardModel.setCity(creditcard.CityName);
        creditCardModel.setState(creditcard.StateCd);
        creditCardModel.setZip(creditcard.ZipPostalCode);
        creditCardModel.setZipPostalCode(creditcard.ZipPostalCode);
        creditCardModel.setExpirationMonth(creditcard.expMonth);
        creditCardModel.setExpirationYear(creditcard.expYear.toString().substring(2));
        creditCardModel.setHolderName(creditcard.nickname);
        creditCardModel.setFirstName(creditcard.firstName);
        creditCardModel.setLastName(creditcard.lastName);
        creditCardModel.setNumber(creditcard.cardnumber);
        creditCardModel.setPreferred(creditcard.isPreferred);
        creditCardModel.setAVSChecked(true);
        creditCardModel.setCVVChecked(true);
        creditCardModel.setSaveToProfile(true);

    }

    return {
        AddUpdateCreditCard : function (username, password, creditCard, accountNumber, successCallback, failureCallback) {
            var request = new RBI.AddUpdateCreditCardRequest();
            var creditCardModel = new  RBI.CreditCard();
            var addUpdateFlag = (isDefined(accountNumber))? true:false;
            if (!addUpdateFlag) {
                accountNumber = '';
            }
            var loginRequest = new RBI.LoginRequest(username, password);

            var parseServerResponse = function (data) {
                var result = (isDefined(data.data))? data.data:data;
                var accountNo = accountNumber;

                if(result.indexOf("error") != -1 && result.toString().indexOf("Code") == -1)
                {
                    var errorResponseStart = result.indexOf("<error>") + 7;
                    var errorCodeLength = result.indexOf("</error>") - errorResponseStart;
                    var errorResponse = result.substr(errorResponseStart, errorCodeLength);
                    var errorObject;
                    errorObject = {
                        "ResultInfo" : {
                            "ResultCode" : "CC_GENERIC_ERROR"
                        }
                    };
                    failureCallback (errorObject);
                    return;
                }



                if (isDefined(data)) {
                    var xmlDoc;
                    if (window.DOMParser) { // all browsers, except IE before version 9
                        var parser = new DOMParser();
                        xmlDoc = parser.parseFromString(result, "text/xml");
                    }
                    else {  // Internet Explorer before version 9
                        xmlDoc = CreateMSXMLDocumentObject();
                        xmlDoc.loadXML(result);
                    }

                    if (isDefined(xmlDoc) && isDefined(xmlDoc.getElementsByTagName("AccountNumber"))) {
                        var accNumberTag = xmlDoc.getElementsByTagName("AccountNumber");
                        if (isDefined(accNumberTag) && isDefined(accNumberTag[0])) {
                            accountNo = xmlDoc.getElementsByTagName("AccountNumber")[0].textContent;
                        }
                    }
                    if (isDefined(xmlDoc.getElementsByTagName("Code"))) {
                        var errorCode = xmlDoc.getElementsByTagName("Code");
                        if (errorCode != null && errorCode.length > 0) {
                            var key = xmlDoc.getElementsByTagName("Code")[0].childNodes[0].nodeValue;
                            if (!isDefined(key) || !isDefined(hashObj[key])) {
                                key = 100;
                            }
                            var message = hashObj[key].app_error_message;
                            var errorObject = {
                                "ResultInfo": {
                                    "ResultCode": key,
                                    "ResultMessage": message
                                }
                            };
                            failureCallback (errorObject);
                            return false;
                        }
                    }
                }

                successCallback(accountNo);
            }

            updateCreditCardModel (creditCardModel, accountNumber, creditCard);
            securityService.getSAMLToken(loginRequest).then(
                function(loginResponse) {
                    var sessionRequest = new RBI.CreateSessionRequest(loginResponse.AuthResponse);
                    var authResponse = loginResponse.AuthResponse;
                    sessionRequest.setDeviceType(RBI.PlatformConfig.deviceType);
                    sessionRequest.setTransactionAccessPoint(RBI.PlatformConfig.transactionAccessPointOL);
                    securityService.createSession(sessionRequest).then(
                        function(loginResponse) {
                            var pcn = loginResponse.AuthToken.PartnerCustomerNumber;
                            var oauthTokenRequest = new RBI.OAuthTokenRequest(authResponse);
                            oauthTokenRequest.setPCN(pcn);
                            oauthTokenRequest.transactionAccessPoint = RBI.PlatformConfig.transactionAccessPointOL;
                            securityService.getOpenAPIToken(oauthTokenRequest).then(
                                function(oAuthResponse) {
                                    var token="";
                                    try {
                                        token = JSON.parse(oAuthResponse.Token);
                                    } catch (ex) {
                                        token = oAuthResponse;
                                    }
                                    helper.debugLog ("access token: " + token.access_token);
                                    helper.debugLog("customer number: " + token.customer_number);
                                    request.setCreditCardModel(creditCardModel);		// update
                                    request.setAccessToken(token.access_token);
                                    request.setCustomerNumber(token.customer_number);

                                    CreditCardService.addUpdateCreditCard(request, addUpdateFlag, parseServerResponse, parseServerResponse) ;
                                },
                                parseServerResponse
                            );
                        },
                        function (data) {
                            failureCallback(data);
                            helper.debugLog("Error occurred while create session API call");

                        }
                    );
                },
                parseServerResponse
            );
        }
    }
});
