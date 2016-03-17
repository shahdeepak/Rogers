/**
 * billingInfo controller
 * Saves the billing Info details of the user
 * @author: Neeharika Reddy
 * Refactored by: Peter Rajcani, 4/2/2014
 */

'use strict';

rbi.controller("billingInfoCtrl", function ($http, $q, $scope, $location, $routeParams, customerService, creditcardService, rbiCommonService) {

    //Omniture
    Omniture.pageName = "";
    //Omniture

    $scope.isAdd = ($routeParams.cardAction == "add");
    $scope.isModify = ($routeParams.cardAction == "modify");
    $scope.isSubscriptionCard = false;

    if (rbiCommonService.isSharedItemExist("isPreferedSelected")) {
        $scope.isPreferedSelected = rbiCommonService.getSharedItem("isPreferedSelected");
    }
    else {
        $scope.isPreferedSelected = false;
    }

    if (rbiCommonService.getSharedItem("isSubscriptionSelected") != null) {
        $scope.isSubscriptionSelected = rbiCommonService.getSharedItem("isSubscriptionSelected");
    }

    $scope.isAlreadyPreferred = false;
    $scope.isFreeTrial = false;


    // Omniture start
    $scope.omnitureReady = false;
    // Omniture end

    // use customer service instead

    if (isDefined($routeParams.isFirstCard) && $routeParams.isFirstCard == "true") {
        $scope.isFirstCard = true;
    }
    var isFirstCard = rbiCommonService.getSharedItem("isFirstCard");
    var subscriptionReferenceNo = rbiCommonService.getSharedItem("subscriptionReferenceNo");
    $scope.isFirstCard = (isDefined(isFirstCard)) ? isFirstCard : false;
    $scope.subscriptionReferenceNo = (isDefined(subscriptionReferenceNo)) ? subscriptionReferenceNo : "";

    if (rbiCommonService.isSharedItemExist(SUBSCRIPTION_TYPE)) {
        $scope.subscriptionType = rbiCommonService.getSharedItem(SUBSCRIPTION_TYPE);
        $scope.isSignupFlow = true;
        $scope.noSubscription = false;
        $scope.isFreeTrial = ($scope.subscriptionType == FREE_TRIAL) ? true : false;
        
    }
    else {
        $scope.isSignupFlow = false;
        $scope.noSubscription = helper.checkSubscription(rbiCommonService);
    }

    var LEVEL_LIST = 2;

    var eventHandler = new billingInfoEventHandler($scope, $location, $routeParams);
    sharedScopeWithMenu($scope, $location);
    $scope.CurrentLevelIndex = 2;
    $scope.eventHandler = eventHandler;
    $scope.levelMap = [];

    $scope.levelMap[LEVEL_LIST] = {
        CurrentIndex: 0,
        CanHandleRightKey: false,
        CanHandleLeftKey: false,
        FirstElement: 1
    };

    $scope.states = [
        "AL",
        "AK",
        "AZ",
        "AR",
        "CA",
        "CO",
        "CT",
        "DE",
        "DC",
        "FL",
        "GA",
        "HI",
        "ID",
        "IL",
        "IN",
        "IA",
        "KS",
        "KY",
        "LA",
        "ME",
        "MD",
        "MA",
        "MI",
        "MN",
        "MS",
        "MO",
        "MT",
        "NE",
        "NV",
        "NH",
        "NJ",
        "NM",
        "NY",
        "NC",
        "ND",
        "OH",
        "OK",
        "OR",
        "PA",
        "RI",
        "SC",
        "SD",
        "TN",
        "TX",
        "UT",
        "VT",
        "VA",
        "WA",
        "WV",
        "WI",
        "WY"
    ];

    $scope.creditcard = {
        name: "",
        nickname: "",
        cardnumber: "",
        cvv: "",
        expMonth: "",
        expYear: "",
        StreetAddressLine1: "",
        StreetAddressLine2: "",
        CityName: "",
        StateCd: "",
        ZipPostalCode: "",
        firstName: '',
        lastName: '',
        isPreferred: false
    };

    $scope.creditcard = helper.getAddCardDetails("addCardDetails");
    if ($scope.isModify) {
        $scope.accountNumber = $routeParams.accountNo;
        if ($scope.accountNumber == $scope.subscriptionReferenceNo) {
            $scope.isSubscriptionCard = true;
            $scope.isSubscriptionSelected = true;
        }
    }
    if($scope.isSubscriptionSelected){
        $scope.isSubscriptionCard = true;
    }
    // Omniture data collection for creating a new account
    // with or without subscription
    if ($scope.isSignupFlow) {
        $scope.omnitureReady = true;
    }
    // Omniture end

    $scope.SaveCard = function () {
        var isValidForm = false;
        isValidForm = $scope.validateBillingForm($scope.creditcard);
        helper.SaveAddCardDetails($scope.creditcard, "addCardDetails");
        // remove all cards stored in RBI common service
        helper.DeleteCards(rbiCommonService);  // delete all cards stored in memory

        if (isValidForm == false) {
            if ($scope.isFirstCard == true) {
                $scope.isPreferedSelected = true;
            }
            if (($scope.isFirstCard) || ($scope.isPreferedSelected && $scope.isSubscriptionCard) || ($scope.isPreferedSelected && $scope.noSubscription)) {
                // Clean up shared items b/c we are exiting subscription screen
                if (rbiCommonService.isSharedItemExist("isPreferedSelected")) {
                    rbiCommonService.removeSharedItem("isPreferedSelected");
                }
                if (rbiCommonService.isSharedItemExist("isSubscriptionSelected")) {
                    rbiCommonService.removeSharedItem("isSubscriptionSelected");
                }

                // show spinner
                disableHttpSpinner = true;
                helper.showSpinner(config.SPINNER_FADEOUT_MS, config.spinnerPosition);
                $scope.addUpdateCCNext();
            }
            else if ($scope.isModify) {
                $location.path("/account/creditCards/cardPreferences/modify/" + $scope.accountNumber);
            }
            else {
                $location.path('/account/creditCards/cardPreferences/add');
            }
        }
    };

    $scope.addUpdateCCNext = function () {
        $scope.state = "CC_AA_FORM_2";
        $scope.creditcard.firstName = $scope.creditcard.name.substr(0, $scope.creditcard.name.indexOf(' '));
        $scope.creditcard.lastName = $scope.creditcard.name.substr($scope.creditcard.name.indexOf(' ') + 1);
        $scope.creditcard.isPreferred = $scope.isPreferedSelected;
        var password = rbiCommonService.getSharedItem("PWD");
        var username = rbiCommonService.getSharedItem("UID");

        creditcardService.AddUpdateCreditCard(username, password, $scope.creditcard, $scope.accountNumber,  addUpdateCreditCardSuccess, addUpdateCreditCardError)
    };

    function  addUpdateCreditCardSuccess (accountNo) {
        accountHelper.addUpdateCreditCardSuccess($scope, $location, accountNo, rbiCommonService, customerService);
    }

    function addUpdateCreditCardError (errorObject) {
        // hide spinner
        disableHttpSpinner = false;
        helper.hideSpinner();
        helper.showErrorMessage(errorObject, $scope);
        return;
    }


    $scope.onPrefClick = function () {
        $scope.isPreferedSelected = !$scope.isPreferedSelected;
    };

    $scope.onSubscriptionClick = function () {
        $scope.isSubscriptionSelected = !$scope.isSubscriptionSelected;
    };

    $scope.validateBillingForm = function (model) {
        var errorOccurred = false;
        var appendMandatoryMessage = " required to be filled.";
        var errorMessageMandatoryFields = "";
        var invalidChar = false;
        var errorCode = false;

        if (!isDefined(model.StreetAddressLine1)) {
            errorOccurred = true;
            errorCode = true;
            if (isDefined(errorMessageMandatoryFields)) {
                errorMessageMandatoryFields = " Billing Address";
            }
            else {

                errorMessageMandatoryFields = " Billing Address";
            }

        }
        if (!isDefined(model.CityName)) {
            errorOccurred = true;
            errorCode = true;
            if (isDefined(errorMessageMandatoryFields)) {
                errorMessageMandatoryFields = errorMessageMandatoryFields + "," + " City Name";
            }
            else {
                errorMessageMandatoryFields = "City Name";
            }

        }
        if (!isDefined(model.StateCd)) {

            errorOccurred = true;
            errorCode = true;
            if (isDefined(errorMessageMandatoryFields)) {
                errorMessageMandatoryFields = errorMessageMandatoryFields + "," + " State";
            }
            else {
                errorMessageMandatoryFields = "State";
            }

        }


        if (!isDefined(model.ZipPostalCode)) {
            errorOccurred = true;
            errorCode = true;
            if (isDefined(errorMessageMandatoryFields)) {
                errorMessageMandatoryFields = errorMessageMandatoryFields + "," + " Zip Code";
            }
            else {
                errorMessageMandatoryFields = "Zip Code";
            }

        }

        if (model.StreetAddressLine1 != "" && (model.StreetAddressLine1).length > 30) {
            errorOccurred = true;
            invalidChar = true;
            errorMessageMandatoryFields = "Please enter less than 30 characters for billing address 1" + "<br/>" + errorMessageMandatoryFields;

        }
        if (model.StreetAddressLine2 != "" && (model.StreetAddressLine2).length > 30) {
            errorOccurred = true;
            invalidChar = true;
            errorMessageMandatoryFields = "Please enter less than 30 characters for billing address 2" + "<br/>" + errorMessageMandatoryFields;

        }
        if (model.CityName != "" && !/^[A-Za-z\- ']{0,20}$/.test(model.CityName)) {

            $.trim(model.CityName);
            errorOccurred = true;
            invalidChar = true;
            errorMessageMandatoryFields = hashObj["CUST-CITY"].app_error_message + "<br/>" + errorMessageMandatoryFields;

        }
        if (model.StateCd != "") {

            $scope.verify = function (myArray, myValue) {
                var yesno = eval(myArray).indexOf(myValue) >= 0;
                if (yesno == false) {
                    errorOccurred = true;
                    invalidChar = true;
                    errorMessageMandatoryFields = "Please enter a valid state (e.g. CA).<br/>" + errorMessageMandatoryFields;
                }

            };
            $scope.verify($scope.states, model.StateCd.toUpperCase());
        }


        if (model.ZipPostalCode != "" && !/^$|^\d{5}$|^\d{5}-\d{4}|^\d{9}$/.test(model.ZipPostalCode)) {
            errorOccurred = true;
            invalidChar = true;
            errorMessageMandatoryFields = hashObj["CUST-ZIP"].app_error_message + "<br/>" + errorMessageMandatoryFields;
        }


        if (errorOccurred) {
            if (errorCode == true) {

                errorMessageMandatoryFields = errorMessageMandatoryFields + appendMandatoryMessage;
            }

            var popUpKey = 'Popup_VALIDATION_FAIL';

            popupObj_Meta[popUpKey] = {};
            popupObj_Meta[popUpKey].title_text = "Hang On There...";
            popupObj_Meta[popUpKey].msg_text = errorMessageMandatoryFields;
            popupObj_Meta[popUpKey].button_1_text = "";
            popupObj_Meta[popUpKey].button_2_text = "OK";
            popupObj_Meta[popUpKey].seperator = true;
            popupObj_Meta[popUpKey].button_1_click = function () {

            },
                popupObj_Meta[popUpKey].button_2_click = function () {
                    helper.HidePopupBox();
                };


            PopupBox.Show(popUpKey, $scope);
        }
        return errorOccurred;
    };


    //Tracking Omniture details for the credit card billing info page
    // Omniture  start
    var unbindOmniture = $scope.$watch("omnitureReady", function () {
        if ($scope.omnitureReady) {
            $scope.omnitureCollectOnLoad();
            $scope.omnitureReady = false;   // reset for a new page load
        }
    });
    $scope.omnitureCollectOnLoad = function () {
        Omniture.Clear();

        if (internetConnected) {
            // Omniture only fires on signup flow
            // TODO - add tagging for other cases (add/modify card) - ZOE-30147
            if ($scope.subscriptionType == FREE_TRIAL) {
                Omniture.pageName = RBI.PlatformConfig.OmnitureTargetDevice + "|create account|trial billing2";
                Omniture.Variables.prop1 = RBI.PlatformConfig.OmnitureTargetDevice + "|create account";
                Omniture.Variables.prop2 = Omniture.pageName;
                Omniture.Variables.prop3 = Omniture.pageName;
                Omniture.Variables.events.push("event11");
            }
            else {
                // add card tags
                Omniture.pageName = RBI.PlatformConfig.OmnitureTargetDevice + "|account|credit cards|add card2";
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
});