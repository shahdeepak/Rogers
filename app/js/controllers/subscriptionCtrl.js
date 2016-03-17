'use strict';
/**
 * Create Account Ctrl to facilitate account creation.
 *
 * @param $scope
 * @param $location
 * @param $routeParams
 * @param customerService
 */

rbi.controller("subscriptionCtrl", function ($scope, $location, $routeParams, customerService, rbiCommonService, $dialog) {
    var eventHandler = new subscriptionEventHandler($scope, $location, $routeParams, $dialog, rbiCommonService);
    $scope.eventHandler = eventHandler;

    //Omniture
    Omniture.pageName = "";
    //Omniture

    // Get the next billing date by adding 30 extra days to current date
    var billingDate = new Date((new Date().getTime()) + (30 * 24 * 60 * 60 * 1000));
    $scope.billingCardVisble = false;
    $scope.subscriptionChangeCardCurrentIndex = 0;
    $scope.isSubscriptionBillingOpen = false;
    $scope.canAddCards = true;
    $scope.addNewCard = false;
    $scope.isExpired = false;
    $scope.isInvalid = false;
    $scope.isFreeTrialUsed = false;
    $scope.cancelSubscriptionDate = formatDate(billingDate);
    $scope.subscriptionBillingAgreement = false;
    $scope.isSubscriptionInProgress = false;
    $scope.isFreeTrial = false;



    if (rbiCommonService.isSharedItemExist(SUBSCRIPTION_TYPE)) {
        $scope.subscriptionType =  rbiCommonService.getSharedItem(SUBSCRIPTION_TYPE);
    }
    else {
        // If no subscription type is specified assume free trial
        $scope.subscriptionType = FREE_TRIAL;
    }

    switch ($scope.subscriptionType) {
        case FREE_TRIAL:
            $scope.isFreeTrial = true;
            $scope.packageDetails = "$8 monthly (1-month FREE)";
            $scope.creditDescription = "4 DVD credits and ";
            break;

        case DVD_SUBSCRIPTION:
            $scope.isFreeTrial = false;
            $scope.packageDetails = "$8 monthly";
            $scope.creditDescription = "4 DVD credits and ";
            break;

        case  BLURAY_SUBSCRIPTION:
            $scope.isFreeTrial = false;
            $scope.packageDetails = "$9 monthly";
            $scope.creditDescription = "4 Blu-Ray credits and ";
            break;

        case STREAMING_ONLY:
            $scope.isFreeTrial = false;
            $scope.packageDetails = "$6 monthly";
            $scope.creditDescription = "";
            break;
    }

    if ($scope.isFreeTrial)  {
        $scope.effectiveDate = " after the conclusion of the one-month free trial";
    }
    else {
        $scope.effectiveDate = "";
    }

    sharedScopeWithMenu($scope, $location);

    // Initialize back path stack for signup flow (if needed)
    if (backPathsSign.length == 0) {
        intializeBackPathSignup('/home'); // ZOE-35551 - User needs to be taken back to home page
    }
    addToBackPathsSign($location.path());
    // Omniture start
    $scope.omnitureReady = false;
    // Omniture end

    $scope.eventHandler = eventHandler;
    
    hideMainMenu();
    init();
    
    var customerData = {
        packageId: "",
        salesChannel: "",
        accountNumber: "",
        creditOptionId: "",
        confirmationNumber: ""
    };


    /**
     * select card account for menu list
     */
    $scope.setSelectedCardAccount = function (card) {
        $scope.addNewCard = false;
        $scope.selectedCard = card;
        customerData.accountNumber = $scope.selectedCard.getAccountNumber();
        resetCardValidity();
        if (isValidCard($scope.selectedCard))
            getSubscriptionPricing();
    };

    /**
     * open billing card for change account or add card
     */
    $scope.toggleCardVisble = function () {
        $scope.billingCardVisble = $scope.billingCardVisble == false ? true : false;
		 if ($scope.billingCardVisble)
            $("#subscriptiont_changecard_0").addClass("popupdropdown");
    };

    /**
     * this function sent to next screen
     */
    $scope.proceedToNextScreen = function () {
            if(!$scope.isExpired && !$scope.isInvalid && !$scope.isFreeTrialUsed && !$scope.addNewCard){
                if ($scope.subscriptionBillingAgreement != true) {
                    var message = "Please select Subscription Billing Agreement.";
                    showInvalidPopup(message);
                    return false;
                }else {
                    subscribeCustomer();
                }
            }
            else {
                rbiCommonService.setSharedItem("isFirstCard", $scope.cards.length == 0);
                if ($scope.isFreeTrialUsed || $scope.addNewCard) {
                    $location.path('/account/creditCards/cardDetails/add');
                } else if ($scope.isExpired || $scope.isInvalid) {
                    rbiCommonService.setSharedItem(SUBSCRIPTION_CARD_EXPIRED, $scope.isExpired);
                    $location.path("/account/creditCards/cardDetails/modify/" + customerData.accountNumber);
                }
            }
    };

    /**
     * Get the Customer credit details
     */
    function getCustomerCreditDetail() {
        customerService.getSubscriptions(function (data) {
            customerData.packageId = data.packages[0].value.PackageID;
            customerData.salesChannel = config.SaleChannel;
            var creditOptionID = "";
            // Add DVD or Blu-Ray credits
            // Credit option ID is empty for streaming only option
            if ($scope.subscriptionType == BLURAY_SUBSCRIPTION)  {
                creditOptionID = data.creditOptions[1].value.CreditOptionID;
            } else if ($scope.subscriptionType == DVD_SUBSCRIPTION ||
                       $scope.subscriptionType == FREE_TRIAL) {
                creditOptionID = data.creditOptions[0].value.CreditOptionID;
            }
            customerData.creditOptionId = creditOptionID;
            getCardsForCurrentCustomer();
            helper.debugLog(data);
        }, function (data) {
            subscriptionError(data);
        });
    }

    /**
     * Get Cards for the current customer
     */
    function getCardsForCurrentCustomer() {
        customerService.getCards(rbiCommonService, function (data) {
            helper.debugLog(data);

            $scope.cards = data;
            if ($scope.cards.length >= 10) {
                $scope.canAddCards = false;
            } else if ($scope.cards.length == 0) {
                $scope.addNewCard = true;
                return false;
            }

            // If user has a subscription card, select the subscription card, otherwise use the primary card
            // This logic is now wrapped into getSubscriptionCard call
            $scope.selectedCard = customerService.getSubscriptionCard($scope.cards);
            customerData.accountNumber = $scope.selectedCard.getAccountNumber();

            resetCardValidity();
            if (isValidCard($scope.selectedCard))
                getSubscriptionPricing();

        }, function (data) {
            subscriptionError(data);
        });
    }

    /**
     * Call getSubscriptionPricing and handle its success and error Callback.
     */
    function getSubscriptionPricing() {
        customerService.getSubscriptionPricing(customerData, function (data) {
            helper.debugLog(data);
            customerData.confirmationNumber = data.getConfirmationId();

            // Omniture start - screen fully loaded
            $scope.omnitureReady = true;
            // Omniture end
        }, function (data) {
            subscriptionError(data);
        });
    }

    /**
     * Call Subscribe customer with customer data
     *
     * @param customerData
     */
    function subscribeCustomer() {
        if (!$scope.isSubscriptionInProgress) {
            // ZOE-35873: Since the subscribeCustomer call includes multiple API calls
            // we need to show a single spinner and disable the Subscribe button so
            // that user cannot click it again
            disableHttpSpinner = true;
            $scope.isSubscriptionInProgress = true;
            helper.showSpinner(config.SPINNER_FADEOUT_MS, config.spinnerPosition);
            // remove focus from Subscribe button
            $('#confirmId').removeClass("button-divHighlight");

            customerService.subscribeCustomer(customerData, function (data) {
                helper.hideSpinner();
                disableHttpSpinner = false;
                $scope.isSubscriptionInProgress = false;
                helper.DeleteCards(rbiCommonService);
                $location.path("confirmSubscription/Movie");
                helper.debugLog(data);
                platformStorage.setItem("IsFreeTrialUsed", (data.value.content.CustomerInfo.FreeTrialUsed).toString());
            },
            function (data) {
                helper.hideSpinner();
                disableHttpSpinner = false;
                $scope.isSubscriptionInProgress = false;
                // put focus back on Subscribe button
                $('#confirmId').addClass("button-divHighlight");
                subscriptionError(data);
            });
        }
    }

    /**
     *	Checks the selected credit card if its Expired / FreeTrialUsed or card
     *  is having incomplete info.
     */
    function isValidCard(card) {
        // ZOE 31160 - check card expiration vs current date not next billing date
        if (card.isExpired()) $scope.isExpired = true;
        else if (!card.getAVSChecked() || !card.getCVVChecked() || !card.isValid()) $scope.isInvalid = true;
        else if (card.getFreeTrialUsed().toString() == "true") $scope.isFreeTrialUsed = true;
        return (!$scope.isExpired && !$scope.isInvalid && !$scope.isFreeTrialUsed);
    }

    /**
     * Resets the card validity values ( Expired/FreeTrialUsed/missing Data )
     * card values.
     */
    function resetCardValidity() {
        $scope.isExpired = false;
        $scope.isInvalid = false;
        $scope.isFreeTrialUsed = false;
    }

    function subscriptionError(data) {
        helper.debugLog(data);
        // remove shared items if these exist
        //TODO: Should we persist these and remove them only when user presses back key??
        if (rbiCommonService.isSharedItemExist(PLAYBACK_TITLE_URL)) {
            rbiCommonService.removeSharedItem(PLAYBACK_TITLE_URL);
        }
        if (rbiCommonService.isSharedItemExist("HD_ASSET")) {
            rbiCommonService.removeSharedItem("HD_ASSET");
        }
        if (rbiCommonService.isSharedItemExist(RATING)) {
            rbiCommonService.removeSharedItem(RATING);
        }
        helper.showErrorMessage(data, $scope);
    }

    /**
     * Error pop up for subscription Billing Agreement Checkbox.
     *
     * @param message
     */
    function showInvalidPopup(message) {
        var popupKey = "Popup_CREATE_ACCOUNT_FAIL";
        
        popupObj_Meta[popupKey].title_text = "Sorry";
        popupObj_Meta[popupKey].msg_text = message;
        popupObj_Meta[popupKey].button_2_click = function () {
            $scope.isErrorPopupOpen = false;
            helper.HidePopupBox();
        };
        $scope.isErrorPopupOpen = true;
        helper.ShowPopupBox(popupKey, $scope);
    }

    /**
     *  Format a date in mm/dd/yy format
     */
    function formatDate(date) {
        return ((date.getMonth() + 1) + "/" + date.getDate() + "/" + (date.getYear() - 100));
    }
    
    /**
     * Initializes subscription controller
     */
    function init() {
        getCustomerCreditDetail();
        
    };

    // Omniture  start
    var unbindOmniture = $scope.$watch("omnitureReady", function () {
        if ($scope.omnitureReady) {
            if ($scope.subscriptionType == FREE_TRIAL) {   // only collect data for a free trial //TODO: How to handle re-subscription??
                $scope.omnitureCollectOnLoad();
            }
            $scope.omnitureReady = false; // reset for a new page load
        }
    });

    $scope.omnitureCollectOnLoad = function () {
        Omniture.Clear();
        if(internetConnected) {
            Omniture.pageName = RBI.PlatformConfig.OmnitureTargetDevice + "|create account|trial confirm";
            Omniture.Variables.prop1 = RBI.PlatformConfig.OmnitureTargetDevice + "|create account";
            Omniture.Variables.prop2 = Omniture.pageName;
            Omniture.Variables.prop3 = Omniture.pageName;
            Omniture.Variables.eVar54 = "+1";
            Omniture.Variables.events.push("event20");
            if (config.debug) {
                helper.debugLog("omnitureOnLoad:");
                helper.debugLog("pageName: " + Omniture.pageName);
                helper.debugLog("prop1: " + Omniture.Variables.prop1);
                helper.debugLog("prop2: " + Omniture.Variables.prop2);
                helper.debugLog("prop3: " + Omniture.Variables.prop3);
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

    // Need not be tracked
    //    $scope.omnitureCollectOnClick = function () {
    //        Omniture.Clear();
    //        Omniture.Variables.events.push("event13");
    //        Omniture.InvokeOmniture(Omniture.InvokeType.click);
    //        helper.debugLog("omnitureCollectOnClick:");
    //        helper.debugLog("event: " + Omniture.Variables.events[0]);
    //    };
    // Omniture end
});