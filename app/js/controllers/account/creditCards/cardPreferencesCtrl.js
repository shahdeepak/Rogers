/**
 * cardPreferences controller
 * Saves the card preferences details of the user
 * @author: Neeharika Reddy
 * Refactored by: Peter Rajcani, 4/2/2014
 */

'use strict';

rbi.controller("cardPreferencesCtrl", function ($http, $q, $scope, $location, $routeParams, customerService, creditcardService, rbiCommonService) {

    Omniture.pageName = "";

    //Omniture
    $scope.isFreeTrial = false;
    $scope.isAdd = ($routeParams.cardAction == "add");
    $scope.isModify = ($routeParams.cardAction == "modify");
    $scope.isAlreadyPreferred = false;
    $scope.currentIndex = 0;
    if (rbiCommonService.isSharedItemExist("isPreferedSelected")) {
        $scope.isPreferedSelected = rbiCommonService.getSharedItem("isPreferedSelected");
    }
    else {
        $scope.isPreferedSelected = false;
    }
    $scope.isAlreadyPreferred = $scope.isPreferedSelected;

    $scope.isSubscriptionSelected = false;
    if (rbiCommonService.getSharedItem("isSubscriptionSelected") != null) {
        $scope.isSubscriptionSelected = rbiCommonService.getSharedItem("isSubscriptionSelected");
        rbiCommonService.removeSharedItem("isSubscriptionSelected");
    }

    $scope.isFirstCard = false;
    $scope.isSubscriptionCard = false;
    $scope.isServerError = false;

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

    // Omniture data collection for creating a new account
    $scope.omnitureReady = false;
    // Omniture end

    if (isDefined($routeParams.isFirstCard) && $routeParams.isFirstCard == "true") {
        $scope.isFirstCard = true;
    }


    var isFirstCard = rbiCommonService.getSharedItem("isFirstCard");
    var subscriptionReferenceNo = rbiCommonService.getSharedItem("subscriptionReferenceNo");
    $scope.isFirstCard = (isDefined(isFirstCard)) ? isFirstCard : false;
    $scope.subscriptionReferenceNo = (isDefined(subscriptionReferenceNo)) ? subscriptionReferenceNo : "";

    var LEVEL_LIST = 3;

    var eventHandler = new cardPreferencesEventHandler($scope, $location, $routeParams ,rbiCommonService);
    sharedScopeWithMenu($scope, $location);
    $scope.CurrentLevelIndex = 3;
    $scope.eventHandler = eventHandler;
    $scope.levelMap = [];

    $scope.levelMap[LEVEL_LIST] = {
        CurrentIndex: 0,
        CanHandleRightKey: false,
        CanHandleLeftKey: false,
        FirstElement: 1
    };

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

    // Omniture data collection for creating a new account
    // with or without subscription
    if ($scope.isSignupFlow) {
        $scope.omnitureReady = true;
    }
    // Omniture end

    if ($scope.isPreferedSelected == true && $scope.isSubscriptionSelected == false) {
        $scope.levelMap[$scope.CurrentLevelIndex].CurrentIndex = 1;
    }
    $scope.creditcard = helper.getAddCardDetails("addCardDetails");
    if ($scope.isModify) {
        $scope.accountNumber = $routeParams.accountNo;
        if ($scope.accountNumber == $scope.subscriptionReferenceNo) {
            $scope.isSubscriptionCard = true;
            $scope.isSubscriptionSelected = true;
        }
    }

    if ($scope.isSubscriptionSelected) {
        $scope.isSubscriptionCard = true;
    }
    $scope.SaveCard = function () {
        var isValidForm = false;
        $scope.addUpdateCCNext();
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

    //Tracking Omniture details for the credit card preferences page
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
                Omniture.pageName = RBI.PlatformConfig.OmnitureTargetDevice + "|create account|trial cc usage options";
                Omniture.Variables.prop1 = RBI.PlatformConfig.OmnitureTargetDevice + "|create account";
                Omniture.Variables.prop2 = Omniture.pageName;
                Omniture.Variables.prop3 = Omniture.pageName;
            }
            else {
                // add card tags
                Omniture.pageName = RBI.PlatformConfig.OmnitureTargetDevice + "|account|credit cards|add card3";
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
            }
            Omniture.InvokeOmniture(Omniture.InvokeType.load);
        }
    };

    if (!RBI.PlatformConfig.OmnitureEnabled) {
        unbindOmniture();
    }
    if (rbiCommonService.isSharedItemExist(NO_SUBSCRIPTION)) {
    	$scope.noSubscription=rbiCommonService.getSharedItem(NO_SUBSCRIPTION);
	    }
       if (rbiCommonService.isSharedItemExist(IS_SUBSCRIPTION)) {
    	   $scope.isSubscriptionCard=rbiCommonService.getSharedItem(IS_SUBSCRIPTION);
  	    }
       if (rbiCommonService.isSharedItemExist(IS_ALREADY_PREFERRED)) {
    	   $scope.isAlreadyPreferred=rbiCommonService.getSharedItem(IS_ALREADY_PREFERRED);
  	    }
});

