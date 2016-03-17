/**
 * cardDetails controller
 * Saves the credit card details of the user
 * @author: Neeharika reddy
 */

'use strict';

rbi.controller("cardDetailsCtrl", function ($scope, $location, $routeParams, customerService, rbiCommonService) {


    //Omniture
    Omniture.pageName = "";
    //Omniture

    //hideMainMenu();

    $scope.isAdd = ($routeParams.cardAction == "add");
    $scope.isModify = ($routeParams.cardAction == "modify");
    $scope.isPreferedSelected = false;
    $scope.isSubscriptionSelected = false;
    $scope.isFreeTrial = false;
    $scope.isAlreadyPreferred = false;
    $scope.isFirstCard = false;
    $scope.isSubscriptionCard = false;
    $scope.isServerError = false;

    // Omniture start
    $scope.omnitureReady = false;
    // Omniture end

    if (isDefined($routeParams.isFirstCard) && $routeParams.isFirstCard == "true") {
        $scope.isFirstCard = true;
    }
    var isFirstCard = rbiCommonService.getSharedItem("isFirstCard");
    var subscriptionReferenceNo = rbiCommonService.getSharedItem("subscriptionReferenceNo");
    $scope.isFirstCard = (isDefined(isFirstCard)) ? isFirstCard : false;
    $scope.subscriptionReferenceNo = (isDefined(subscriptionReferenceNo)) ? subscriptionReferenceNo : "";
    helper.debugLog("isFirstCard: " + $scope.isFirstCard);
    helper.debugLog("subscriptionReferenceNo: " + $scope.subscriptionReferenceNo);
    $scope.isAlreadyPreferred = $routeParams.subscriptionReferenceNo;

    if ($scope.isModify) {
        $scope.accountNumber = $routeParams.accountNo;
    }

    if (rbiCommonService.isSharedItemExist(SUBSCRIPTION_TYPE)) {
        $scope.subscriptionType = rbiCommonService.getSharedItem(SUBSCRIPTION_TYPE);
        $scope.isFreeTrial = ($scope.subscriptionType == FREE_TRIAL) ? true : false;
        
        $scope.isSignupFlow = true;
        // Initialize back paths for signup flow if needed
        if (backPathsSign.length == 0) {
           intializeBackPathSignup('/home'); // ZOE-35551 - User needs to be taken back to home page
        }
    }
    else {
        $scope.isSignupFlow = false;
    }

    var LEVEL_LIST = 1;

    var eventHandler = new cardDetailsEventHandler($scope, $location, rbiCommonService);
    sharedScopeWithMenu($scope, $location);
    hideMainMenu();
    $scope.CurrentLevelIndex = 1;
    $scope.eventHandler = eventHandler;
    $scope.levelMap = [];

    $scope.levelMap[LEVEL_LIST] = {
        CurrentIndex: 0,
        CanHandleRightKey: false,
        CanHandleLeftKey: false,
        FirstElement: 1
    };

    var currentYear = parseInt(new Date().getFullYear());
    var endYear = currentYear + 15;
    $scope.years = [];
    for (var i = currentYear; i <= endYear; i++) {
        $scope.years.push(i);
    }

    $scope.creditcard = {
        "name": "",
        "nickname": "",
        "cardnumber": "",
        "cvv": "",
        "expMonth": "",
        "expYear": "",
        "StreetAddressLine1": "",
        "StreetAddressLine2": "",
        "CityName": "",
        "StateCd": "",
        "ZipPostalCode": "",
        isSubscription: false,
        canModifyName: true
    };

    $scope.pwpopupTitle1 = HEADER_TEXT;
    $scope.pwpopupTitle2 = BODY_TEXT;
    $scope.getUser = platformStorage.getItem("CURRENT_LOGGEDIN_USER");
    helper.debugLog("pwpopupTitle1: " + $scope.pwpopupTitle1);
    helper.debugLog("pwpopupTitle2: " + $scope.pwpopupTitle2);

    $scope.userPassword = '';

    if (isDefined(sessionStorage.getItem("backtoCardDet"))) {
        $scope.creditcard = JSON.parse(sessionStorage.getItem("addCardDetails"));
        $scope.passwordPopUpVisible = false;
        $scope.uiPWPopup = false;
        sessionStorage.removeItem("backtoCardDet");
        setDefaultFocus();
    }
    else {
        $scope.passwordPopUpVisible = true;
        $scope.uiPWPopup = true;
    }
    $scope.isErrorOccurred = false;



    // Verify password popup
    $scope.verifyPassword = function () {
        customerService.checkAccountPassword($scope.userPassword,
            // success callback
            function (data) {
                pwPopupHelper.hidePWPopup($scope);
                $scope.username = helper.GetUserId();
                helper.debugLog("Add CC username: " + $scope.username);
                helper.debugLog("Add CC password: " + $scope.userPassword);
                rbiCommonService.setSharedItem("PWD", $scope.userPassword);
                rbiCommonService.setSharedItem("UID", $scope.username);
                loadCard();

                // Omniture start
                if ($scope.isSignupFlow) {
                    $scope.omnitureReady = true;
                }
                // Omniture end

            }, function (data) {
                pwPopupHelper.showPWError($scope);
            });
    };


    function loadCard() {

        if ($scope.isAdd) {
            var elemId = $scope.CurrentLevelIndex + "_" + $scope.levelMap[$scope.CurrentLevelIndex].CurrentIndex;
            helper.debugLog("Current selected element - " + elemId);
            helper.SetFocus(elemId);
        }
        if ($scope.isModify) {

            // Use new getCards function that re-uses card data stored in memory
            customerService.getCards(rbiCommonService,
                function (data) {
                    var accountNumberFound = false;
                    var account = data[data.map(function (e) {
                        return e.value["AccountNumber"]
                    }).indexOf($scope.accountNumber)].value;
                    if (account !== undefined) {
                        $scope.creditcard.canModifyName = false;
                        accountNumberFound = true;
                        var firstName = account['FirstName'];
                        var lastName = account['LastName'];
                        var separator = ' ';
                        if (!isDefined(firstName) || firstName == 'NULL') {
                            $scope.creditcard.canModifyName = true;
                            firstName = '';
                        }

                        if (!isDefined(lastName) || lastName == 'NULL') {
                            $scope.creditcard.canModifyName = true;
                            lastName = '';
                        }

                        if (firstName == '' || lastName == '') {
                            separator = '';
                        }
                        $scope.creditcard.name = firstName + separator + lastName;

                        var nickname = account['AccountAlias'];
                        $scope.creditcard.nickname = (isDefined(nickname) && nickname != 'NULL')? nickname:"";
                        $scope.creditcard.cardnumber = account['LastFour'];

                        if (helper.isDefined(account.IsPreferred)) {
                            $scope.isPreferedSelected = (account.IsPreferred.toLowerCase() == "true") ? true : false;
                        }
                        else {
                            $scope.isPreferedSelected = false;
                        }
                        rbiCommonService.setSharedItem("isPreferedSelected", $scope.isPreferedSelected);

                        if (helper.isDefined(account.IsSubscriptionPrimary)) {
                            if (account.IsSubscriptionPrimary.toLowerCase() == "true") {
                                $scope.creditcard.isSubscription = true;
                                $scope.isSubscriptionSelected = true;
                            }
                            else {
                                $scope.creditcard.isSubscription = false;
                                $scope.isSubscriptionSelected = false;
                            }
                        }
                        else {
                            $scope.creditcard.isSubscription = false;
                            $scope.isSubscriptionSelected = false;
                        }

                        if ($scope.accountNumber == $scope.subscriptionReferenceNo) {
                            $scope.creditcard.isSubscription = true;
                            $scope.isSubscriptionCard = true;
                            $scope.isSubscriptionSelected = true;
                        }

                        // ZOE 30155 - Only pre-fill the card expiration date if it is not expired
                        var cardAccount = new RBI.Account(account);
                        //ZOE-31080 month is come in two digits but parseInt method change into one integer no
                        var expMonth = account['ExpirationMonth'];
                        var expYear = parseInt('20' + account['ExpirationYear']);
                        if (!isCardExpired(cardAccount)) {
                            $scope.creditcard.expMonth = expMonth;
                            $scope.creditcard.expYear = expYear;
                        }
                        else {
                            $scope.creditcard.expMonth = "";
                            $scope.creditcard.expYear = "";
                        }
                        rbiCommonService.setSharedItem("isSubscriptionSelected", $scope.isSubscriptionSelected);
                        helper.debugLog("Card details - preferred selected: " + $scope.isPreferedSelected + ", subscription selected: " + $scope.isSubscriptionSelected);
                        if (account['AccountBillingAddress'] != null) {
                            var address = account['AccountBillingAddress'];
                            $scope.creditcard.StreetAddressLine1 = address['StreetAddressLine1'] != null ? address['StreetAddressLine1'] : '';
                            $scope.creditcard.StreetAddressLine2 = address['StreetAddressLine2'] != null ? address['StreetAddressLine2'] : '';
                            $scope.creditcard.CityName = address['CityName'] != null ? address['CityName'] : '';
                            $scope.creditcard.StateCd = address['StateCd'] != null ? address['StateCd'] : '';
                            $scope.creditcard.ZipPostalCode = address['ZipPostalCode'] != null ? address['ZipPostalCode'] : '';
                        }
                        setDefaultFocus();
                    }
                    if (!accountNumberFound) {
                        //TODO: Show pop-up or something indicating the card is not found.
                    }
                },
                function (data) {
                    // helper.debugLog("Error occurred with GetCards");
                });
        }
    }

    function setDefaultFocus() {
        $scope.focusIndex = ($scope.creditcard.canModifyName)? 0:1;  // default focus
        var elemId = "1_" + $scope.focusIndex;
        helper.debugLog("Current selected element - " + elemId);

        // Adding delay so that the field does not loose focus.
        setTimeout(function(){
            $('#' + elemId).focus();
        },200);
    }

    function isCardExpired (card) {
        var isExpired;
        if ($scope.creditcard.isSubscription)  {
            if (rbiCommonService.isSharedItemExist(SUBSCRIPTION_CARD_EXPIRED)) {
                isExpired = rbiCommonService.getSharedItem(SUBSCRIPTION_CARD_EXPIRED);
                rbiCommonService.removeSharedItem(SUBSCRIPTION_CARD_EXPIRED);
            }
            else {
                isExpired = card.isExpired();
            }
        }
        else  {
            isExpired = card.isExpired();
        }
        return  isExpired;
    }

    $scope.SaveCard = function () {
        var isValidForm = $scope.validateCardData($scope.creditcard);
        if (!isValidForm) {
            helper.SaveAddCardDetails($scope.creditcard, "addCardDetails");
            if ($scope.isAdd) {
                $location.path('/account/creditCards/billingInfo/add');
            }
            else {
                $location.path('/account/creditCards/billingInfo/modify/' + $scope.accountNumber);
            }
        }
    };


    //validation on the card for the client side

    /**
     * @return {boolean}
     */
    function VerifyCreditCard(ccNumb) {
        var valid = "0123456789";
        var len = ccNumb.length;
        var bNum = true;
        var iCCN = ccNumb;
        var sCCN = ccNumb.toString();
        var iCCN;
        var iTotal = 0;
        var bResult = false;
        var digit;
        var temp;
        iCCN = sCCN.replace(/^\s+|\s+$/g, '');
        for (var j = 0; j < len; j++) {
            temp = "" + iCCN.substring(j, j + 1);
            if (valid.indexOf(temp) == "-1") bNum = false;
        }
        if (!bNum) {//alert("Not a Number");
        }
        iCCN = parseInt(iCCN);

        if (len == 0) { /* nothing, field is blank */
            bResult = true;
        } else {
            if (len >= 15) {		//15 or 16 for Amex or V/MC
                for (var i = len; i > 0; i--) {
                    digit = "digit" + i;

                    var calc = parseInt(iCCN) % 10; //right most digit
                    calc = parseInt(calc);
                    iTotal += calc; 	//parseInt(cardnum.charAt(count))i:\t" + calc.toString() + " x 2 = " + (calc *2) +" : " + calc2 + "\n";
                    // commented out below which wrote NONALTERED digit to page for demo only.
                    //document.form1.textfield.value += "" + i + ":\t" + calc.toString() + " x 1 = " + calc + "\n";

                    i--;
                    digit = "digit" + i;

                    iCCN = iCCN / 10; 	// subtracts right most digit from ccNum
                    calc = parseInt(iCCN) % 10; // step 1 double every other digit
                    var calc2 = calc * 2;

                    switch (calc2) {
                        case 10:
                            calc2 = 1;
                            break; //5*2=10 & 1+0 = 1
                        case 12:
                            calc2 = 3;
                            break; //6*2=12 & 1+2 = 3
                        case 14:
                            calc2 = 5;
                            break; //7*2=14 & 1+4 = 5
                        case 16:
                            calc2 = 7;
                            break; //8*2=16 & 1+6 = 7
                        case 18:
                            calc2 = 9;
                            break; //9*2=18 & 1+8 = 9
                        default:
                            calc2 = calc2; 		//4*2= 8 &   8 = 8  -same for all lower numbers
                    }
                    iCCN = iCCN / 10; 	// subtracts right most digit from ccNum
                    iTotal += calc2;
                    // commented out below which wrote MULTIPLIED digit to page for demo only
                    //document.form1.textfield.value += "" + i +":\t" + calc.toString() + " x 2 = " + (calc *2) +" : " + calc2 + "\n";
                }
                // commeneted out SUM below for demo only
                //document.form1.textfield.value += "\t\tSum: " + iTotal + "\n";
                if ((iTotal % 10) == 0) {
                    //document.calculator.results.value = "Yes";
                    bResult = true;
                } else {
                    //document.calculator.results.value = "No";
                    bResult = false;
                }
            }
        }
        //	change alert to on-page display or other indication if needed.
        if (!bResult) {
            //alert("This is NOT a valid Credit Card Number!");
        }
        return bResult;

    }


    $scope.validateCardData = function (model) {
        var errorOccurred = false;
        var appendMandatoryMessage = " required to be filled.";
        var errorMessageMandatoryFields = "";
        var invalidChar = false;
        var errorCode = false;

        if ($scope.creditcard.canModifyName && !isDefined(model.name)) {
            errorOccurred = true;
            errorCode = true;
            if (isDefined(errorMessageMandatoryFields)) {
                errorMessageMandatoryFields = errorMessageMandatoryFields + "," + " Name";
            }
            else {
                errorMessageMandatoryFields = "Name";
            }
        }
        if (!isDefined(model.cardnumber)) {

            errorOccurred = true;
            errorCode = true;
            if (isDefined(errorMessageMandatoryFields)) {
                errorMessageMandatoryFields = errorMessageMandatoryFields + "," + " Card Number";
            }
            else {
                errorMessageMandatoryFields = "Card Number";
            }
        }
        if (!isDefined(model.cvv)) {
            errorOccurred = true;
            errorCode = true;
            if (isDefined(errorMessageMandatoryFields)) {
                errorMessageMandatoryFields = errorMessageMandatoryFields + "," + " CVV";
            }
            else {
                errorMessageMandatoryFields = "CVV";
            }
        }
        if (!isDefined(model.expMonth)) {
            errorOccurred = true;
            errorCode = true;
            if (isDefined(errorMessageMandatoryFields)) {
                errorMessageMandatoryFields = errorMessageMandatoryFields + "," + " Expiry Month";
            }
            else {
                errorMessageMandatoryFields = "Expiry Month";
            }
        }
        if (!isDefined(model.expYear)) {
            errorOccurred = true;
            errorCode = true;
            if (isDefined(errorMessageMandatoryFields)) {
                errorMessageMandatoryFields = errorMessageMandatoryFields + "," + " Expiry Year";
            }
            else {
                errorMessageMandatoryFields = "Expiry Year";
            }
        }

        //validating the required fields
        var CVV = model.cvv;
        var month = model.expMonth;
        var year = model.expYear;
        var ccNumber = model.cardnumber;

        if ($scope.creditcard.canModifyName)  {
            var name = model.name;
            if (name != "" && name != undefined) {
                if ((name).indexOf(' ') <= 0) {
                    errorOccurred = true;
                    invalidChar = true;
                    errorMessageMandatoryFields = "Please enter your last name by adding a space after first name (e.g. John Smith).<br/>" + errorMessageMandatoryFields;
                }
                else {
                	var fname = name.substr(0, name.indexOf(' ')).trim();
                	var lname = name.substr(name.indexOf(' ') + 1).trim();
                    if (!/^[a-zA-Z][a-zA-Z '-]*$/.test(fname) || fname.length > 50) {
                        errorOccurred = true;
                        invalidChar = true;
                        errorMessageMandatoryFields = hashObj["CUST-FNAME"].app_error_message + "<br/>" + errorMessageMandatoryFields;
                    }
                    if (!/^[a-zA-Z][a-zA-Z '-]*$/.test(lname) || lname.length > 50) {
                        errorOccurred = true;
                        invalidChar = true;
                        errorMessageMandatoryFields = "Last Name can have Maximum 50 characters: Letters, ' or - and spaces." + "<br/>" + errorMessageMandatoryFields;
                    }
                }
            }
        }

        if ($scope.isAdd)  {
            if (ccNumber != "" && ccNumber != undefined) {
                var isCardNumberNumeric = $.isNumeric(ccNumber);

                var evalCC = VerifyCreditCard(ccNumber);
                if (!isCardNumberNumeric) {
                    errorOccurred = true;
                    invalidChar = true;
                    errorMessageMandatoryFields = hashObj['RBXAPI-ACCT-002'].app_error_message + "<br/>" + errorMessageMandatoryFields;
                }
                else {
                    if (evalCC == false) {
                        invalidChar = true;
                        errorOccurred = true;
                        errorMessageMandatoryFields = hashObj['RBXAPI-ACCT-002'].app_error_message + "<br/>" + errorMessageMandatoryFields;
                    }

                }
            }
        }

        if (CVV != undefined && CVV != "") {
            var CardInitial = ccNumber.substring(0, 2);
            if ($scope.isModify) {
                if (!((/^[0-9]{3}$/.test(CVV)) || (/^[0-9]{4}$/.test(CVV)))) {
                    errorOccurred = true;
                    invalidChar = true;
                    errorMessageMandatoryFields = hashObj["CUST-CVV-AMEX"].app_error_message + "<br/>" + errorMessageMandatoryFields;
                }

            } else if ((CardInitial == 34 || CardInitial == 37) && !/^\d[0-9]{3}$/.test(CVV)) {
                errorOccurred = true;
                invalidChar = true;
                errorMessageMandatoryFields = hashObj["CUST-CVV-AMEX"].app_error_message + "<br/>" + errorMessageMandatoryFields;
            } else if (CardInitial != 34 && CardInitial != 37 && !/^\d[0-9]{2}$/.test(CVV)) {
                errorOccurred = true;
                invalidChar = true;
                errorMessageMandatoryFields = hashObj["CUST-CVV"].app_error_message + "<br/>" + errorMessageMandatoryFields;
                //errorMessageMandatoryFields = "The CVV field should contain a 3 digit number." + "<br/>" + errorMessageMandatoryFields;
            }

        }
        if (month != "") {
            if (!/^(0[1-9]|1[0-2])$/.test(month)) {
                errorOccurred = true;
                invalidChar = true;
                errorMessageMandatoryFields = "Please enter a valid month in mm format (e.g. 02 or 11 etc).<br/>" + errorMessageMandatoryFields;
            }
        }
        if (year != "") {
            if (!/^([2-9]\d[1-9]\d|[1-9]\d)$/.test(year) || year > 2099) {
                errorOccurred = true;
                invalidChar = true;
                errorMessageMandatoryFields = "Please enter a valid year in yyyy format (" + currentYear + " to 2099).<br/>" + errorMessageMandatoryFields;
            }
        }
        if (month != "" && year != "") {
            var expYear = parseInt(year);
            var expMonth = parseInt(month,10);
            if (expYear < currentYear) {
                errorOccurred = true;
                invalidChar = true;
                errorMessageMandatoryFields = hashObj["CLV-INVALID-CARD-EXPIRY-DATE"].app_error_message + "<br/>" + errorMessageMandatoryFields;
            }

            var currentMonth = new Date().getMonth() + 1;   // Javascript getDate sifts the month by 1
            if (expYear == currentYear && expMonth < currentMonth) {
                errorOccurred = true;
                invalidChar = true;
                errorMessageMandatoryFields = hashObj["CLV-INVALID-CARD-EXPIRY-DATE"].app_error_message + "<br/>" + errorMessageMandatoryFields;
            }
        }
        if (model.nickname != "" && model.nickname != undefined) {
            var maxDigits = 11,
                len = model.nickname.length,
                numDigits = 0,
                newLen;


            if (len > maxDigits) {
                newLen = model.nickname.replace(/[0-9]/g, '').length;
                numDigits = len - newLen;
            }
            if (numDigits > maxDigits) {
                errorOccurred = true;
                invalidChar = true;
                errorMessageMandatoryFields = "For your security, please use a different nickname for your payment card.<br/>" + errorMessageMandatoryFields;
            }

        }

        if (errorOccurred) {

            if (errorCode == true) {
                errorMessageMandatoryFields = errorMessageMandatoryFields + appendMandatoryMessage;
            }

            if (invalidChar == true) {
                errorMessageMandatoryFields = errorMessageMandatoryFields;
            }
            var popUpKey = 'Popup_VALIDATION_FAIL';

            popupObj_Meta[popUpKey] = {};
            popupObj_Meta[popUpKey].title_text = "Hang On There...";
            popupObj_Meta[popUpKey].msg_text = errorMessageMandatoryFields;
            popupObj_Meta[popUpKey].button_1_text = "";
            popupObj_Meta[popUpKey].button_2_text = "OK";
            popupObj_Meta[popUpKey].seperator = true;

            popupObj_Meta[popUpKey].button_2_click = function () {
                helper.HidePopupBox();
            };


            PopupBox.Show(popUpKey, $scope);
        }
        $scope.isErrorOccurred = errorOccurred;
        return errorOccurred;

    };


// Omniture  start
    var unbindOmniture = $scope.$watch("omnitureReady", function () {
        if ($scope.omnitureReady) {
            $scope.omnitureCollectOnLoad();
            $scope.omnitureReady = false;   // reset for a new page load
        }
    });

    $scope.omnitureCollectOnLoad = function () {
        Omniture.Clear();

        // Omniture only fires on signup flow
        // TODO - add tagging for other cases (add/modify card) - ZOE-30147
        if (internetConnected) {
            if ($scope.subscriptionType == FREE_TRIAL) {
                Omniture.pageName = RBI.PlatformConfig.OmnitureTargetDevice + "|create account|trial billing1";
                Omniture.Variables.prop1 = RBI.PlatformConfig.OmnitureTargetDevice + "|create account";
                Omniture.Variables.prop2 = Omniture.pageName;
                Omniture.Variables.prop3 = Omniture.pageName;
            }
            else {
                // add card tags
                Omniture.pageName = RBI.PlatformConfig.OmnitureTargetDevice + "|account|credit cards|add card1";
                Omniture.Variables.prop1 = RBI.PlatformConfig.OmnitureTargetDevice + "|account";
                Omniture.Variables.prop2 = Omniture.Variables.prop1 + "|credit cards";
                Omniture.Variables.prop3 = Omniture.Variables.prop2 + "|add card";
            }
            Omniture.Variables.prop23 = Omniture.previousPageName;
            Omniture.Variables.eVar54 = "+1";

            if (config.debug) {
                helper.debugLog("omnitureOnLoad:");
                helper.debugLog("pageName: " + Omniture.pageName);
                helper.debugLog("prop1: " + Omniture.Variables.prop1);
                helper.debugLog("prop2: " + Omniture.Variables.prop2);
                helper.debugLog("prop3: " + Omniture.Variables.prop3);
                helper.debugLog("prop23: " + Omniture.Variables.prop23);
                helper.debugLog("eVar54: " + Omniture.Variables.eVar54);
                var events = "events: ";
                for (var i = 0; i < Omniture.Variables.events.length; i++) {
                    events += Omniture.Variables.events[i] + " ";
                }
                helper.debugLog(events);
            }
            Omniture.InvokeOmniture(Omniture.InvokeType.load);
        }
    };

    if (!RBI.PlatformConfig.OmnitureEnabled) {
        unbindOmniture();
    }

})
;